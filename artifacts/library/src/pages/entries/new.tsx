import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  useCreateEntryFromUrl, 
  useCreateLibraryEntry,
  useListProducers,
  useListSubjects,
  useListProjectBuckets
} from "@workspace/api-client-react";
import { useUpload } from "@workspace/object-storage-web";
import { useToast } from "@/hooks/use-toast";
import { computeFileHash, errMessage } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, Link as LinkIcon, Loader2, X, File as FileIcon, Image as ImageIcon, Lock, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";

const urlFormSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  notes: z.string().optional(),
  producerSlug: z.string().optional(),
  subjectSlugs: z.array(z.string()).default([]),
  bucketSlugs: z.array(z.string()).default([]),
});

interface BatchProgress {
  current: number;
  total: number;
  failed: string[];
  done: boolean;
  singleFileProgress: number;
}

export default function NewEntry() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: producers } = useListProducers();
  const { data: subjects } = useListSubjects();
  const { data: buckets } = useListProjectBuckets();

  const createFromUrl = useCreateEntryFromUrl();
  const createLibraryEntry = useCreateLibraryEntry();

  // Refs so async upload callbacks always read the latest values
  const fileMetadataRef = useRef<{ producerSlug: string; subjectSlugs: string[]; bucketSlugs: string[] }>({
    producerSlug: "",
    subjectSlugs: [],
    bucketSlugs: [],
  });
  const batchQueueRef = useRef<File[]>([]);
  const batchProgressRef = useRef<{ current: number; total: number; failed: string[] }>({
    current: 0,
    total: 0,
    failed: [],
  });
  // Tracks which file is currently in-flight so onError can record its name
  const currentUploadFileRef = useRef<File | null>(null);

  const [batchProgress, setBatchProgress] = useState<BatchProgress | null>(null);

  const finishBatch = () => {
    const { total, failed } = batchProgressRef.current;
    const succeeded = total - failed.length;
    setBatchProgress(prev => prev ? { ...prev, done: true } : null);
    const hasFailures = failed.length > 0;
    toast({
      title: hasFailures ? `${succeeded} of ${total} uploaded` : `${total} file${total !== 1 ? "s" : ""} added`,
      description: hasFailures
        ? `${failed.length} failed: ${failed.join(", ")}`
        : "All files added to library.",
      variant: hasFailures ? "destructive" : "default",
    });
    setLocation("/entries");
  };

  const processNextInQueue = () => {
    const queue = batchQueueRef.current;
    if (queue.length === 0) {
      finishBatch();
      return;
    }
    const nextFile = queue.shift()!;
    batchQueueRef.current = queue;
    batchProgressRef.current.current += 1;
    currentUploadFileRef.current = nextFile;
    setBatchProgress(prev => prev
      ? { ...prev, current: batchProgressRef.current.current, singleFileProgress: 0 }
      : null
    );
    uploadFile(nextFile);
  };

  const { uploadFile, isUploading, progress } = useUpload({
    getHeaders: () => {
      try {
        const t = window.localStorage.getItem("library:owner-token");
        const headers: Record<string, string> = {};
        if (t) headers.authorization = `Bearer ${t}`;
        return headers;
      } catch {
        return {} as Record<string, string>;
      }
    },
    onSuccess: async (response, file) => {
      try {
        const hash = await computeFileHash(file);
        const meta = fileMetadataRef.current;
        const result = await createLibraryEntry.mutateAsync({
          data: {
            kind: "file",
            title: file.name.replace(/\.[^/.]+$/, ""),
            objectPath: response.objectPath,
            contentHash: hash,
            fileSize: file.size,
            contentType: file.type,
            originalFilename: file.name,
            producerSlug: meta.producerSlug || undefined,
            subjectSlugs: meta.subjectSlugs,
            bucketSlugs: meta.bucketSlugs,
            status: "published"
          }
        });

        if (batchProgressRef.current.total === 1) {
          setBatchProgress(null);
          toast({
            title: result.duplicate ? "Duplicate found" : "Upload complete",
            description: result.duplicate
              ? "A file with identical content already exists. We linked to the existing entry."
              : "File added to library successfully.",
          });
          setLocation(`/entries/${result.entry.id}`);
          return;
        }

        processNextInQueue();
      } catch (err) {
        const fileName = currentUploadFileRef.current?.name ?? "unknown";
        batchProgressRef.current.failed.push(fileName);
        if (batchProgressRef.current.total === 1) {
          setBatchProgress(null);
          toast({
            title: "Error creating entry",
            description: errMessage(err, "Failed to finalize upload"),
            variant: "destructive",
          });
          return;
        }
        setBatchProgress(prev => prev ? { ...prev, failed: [...batchProgressRef.current.failed] } : null);
        processNextInQueue();
      }
    },
    onError: (err) => {
      const fileName = currentUploadFileRef.current?.name ?? "unknown";
      batchProgressRef.current.failed.push(fileName);
      if (batchProgressRef.current.total === 1) {
        setBatchProgress(null);
        toast({
          title: "Upload failed",
          description: err.message || "Could not upload file to storage",
          variant: "destructive",
        });
        return;
      }
      setBatchProgress(prev => prev ? { ...prev, failed: [...batchProgressRef.current.failed] } : null);
      processNextInQueue();
    }
  });

  // Mirror the hook's coarse upload progress into the batch progress state
  useEffect(() => {
    if (batchProgress && !batchProgress.done) {
      setBatchProgress(prev => prev ? { ...prev, singleFileProgress: progress } : null);
    }
  }, [progress]);

  const urlForm = useForm<z.infer<typeof urlFormSchema>>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      url: "",
      notes: "",
      producerSlug: "",
      subjectSlugs: [],
      bucketSlugs: [],
    },
  });

  const [fileMetadata, setFileMetadata] = useState<{
    producerSlug: string;
    subjectSlugs: string[];
    bucketSlugs: string[];
  }>({
    producerSlug: "",
    subjectSlugs: [],
    bucketSlugs: []
  });

  const updateFileMetadata = (updater: (prev: typeof fileMetadata) => typeof fileMetadata) => {
    setFileMetadata(prev => {
      const next = updater(prev);
      fileMetadataRef.current = next;
      return next;
    });
  };

  const [confidentialDragActive, setConfidentialDragActive] = useState(false);
  const confidentialDragCounterRef = useRef(0);
  const [confidentialUploading, setConfidentialUploading] = useState(false);
  const confidentialFileInputRef = useRef<HTMLInputElement>(null);

  const [pendingConfidentialFile, setPendingConfidentialFile] = useState<File | null>(null);
  const [confidentialTitle, setConfidentialTitle] = useState("");
  const [confidentialNotes, setConfidentialNotes] = useState("");
  const confidentialMetaRef = useRef<{ title: string; notes: string }>({ title: "", notes: "" });

  const { uploadFile: uploadConfidentialFile, isUploading: isConfidentialUploading, progress: confidentialUploadProgress } = useUpload({
    getHeaders: () => {
      try {
        const t = window.localStorage.getItem("library:owner-token");
        const headers: Record<string, string> = {};
        if (t) headers.authorization = `Bearer ${t}`;
        return headers;
      } catch {
        return {} as Record<string, string>;
      }
    },
    onSuccess: async (response, file) => {
      try {
        setConfidentialUploading(true);
        const hash = await computeFileHash(file);
        const token = window.localStorage.getItem("library:owner-token") ?? "";
        const meta = confidentialMetaRef.current;
        const res = await fetch("/api/library/confidential/intake", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            kind: "file",
            title: meta.title || file.name.replace(/\.[^/.]+$/, ""),
            notes: meta.notes || undefined,
            objectPath: response.objectPath,
            contentHash: hash,
            fileSize: file.size,
            contentType: file.type,
            originalFilename: file.name,
            status: "needs_review",
          }),
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        toast({
          title: "File quarantined",
          description: "Dropped into the confidential queue — nothing is shared until you clear it.",
        });
        setPendingConfidentialFile(null);
        setConfidentialTitle("");
        setConfidentialNotes("");
        setLocation("/confidential/queue");
      } catch (err) {
        toast({
          title: "Error",
          description: errMessage(err, "Failed to create confidential entry"),
          variant: "destructive",
        });
      } finally {
        setConfidentialUploading(false);
      }
    },
    onError: (err) => {
      setConfidentialUploading(false);
      toast({
        title: "Upload failed",
        description: err.message || "Could not upload file to storage",
        variant: "destructive",
      });
    },
  });

  const stageConfidentialFile = (file: File) => {
    setPendingConfidentialFile(file);
    const defaultTitle = file.name.replace(/\.[^/.]+$/, "");
    setConfidentialTitle(defaultTitle);
    setConfidentialNotes("");
    confidentialMetaRef.current = { title: defaultTitle, notes: "" };
  };

  const handleConfidentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingConfidentialFile) return;
    confidentialMetaRef.current = { title: confidentialTitle.trim() || pendingConfidentialFile.name.replace(/\.[^/.]+$/, ""), notes: confidentialNotes.trim() };
    uploadConfidentialFile(pendingConfidentialFile);
  };

  const handleConfidentialDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter") {
      confidentialDragCounterRef.current++;
      setConfidentialDragActive(true);
    } else if (e.type === "dragleave") {
      confidentialDragCounterRef.current--;
      if (confidentialDragCounterRef.current === 0) setConfidentialDragActive(false);
    } else if (e.type === "dragover") {
      setConfidentialDragActive(true);
    }
  };

  const handleConfidentialDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    confidentialDragCounterRef.current = 0;
    setConfidentialDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      stageConfidentialFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfidentialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      stageConfidentialFile(e.target.files[0]);
    }
  };

  const [dragActive, setDragActive] = useState(false);
  const dragCounterRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onUrlSubmit = async (values: z.infer<typeof urlFormSchema>) => {
    try {
      const entry = await createFromUrl.mutateAsync({
        data: {
          url: values.url,
          notes: values.notes || undefined,
          producerSlug: values.producerSlug || undefined,
          subjectSlugs: values.subjectSlugs.length ? values.subjectSlugs : undefined,
          bucketSlugs: values.bucketSlugs.length ? values.bucketSlugs : undefined,
        }
      });
      
      toast({
        title: "Link added",
        description: "Successfully added web source.",
      });
      setLocation(`/entries/${entry.id}`);
    } catch (err) {
      toast({
        title: "Error",
        description: errMessage(err, "Failed to add URL"),
        variant: "destructive",
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter") {
      dragCounterRef.current++;
      setDragActive(true);
    } else if (e.type === "dragleave") {
      dragCounterRef.current--;
      if (dragCounterRef.current === 0) setDragActive(false);
    } else if (e.type === "dragover") {
      setDragActive(true);
    }
  };

  const startBatch = (files: File[]) => {
    if (files.length === 0) return;
    const [first, ...rest] = files;
    batchQueueRef.current = rest;
    batchProgressRef.current = { current: 1, total: files.length, failed: [] };
    currentUploadFileRef.current = first;
    setBatchProgress({ current: 1, total: files.length, failed: [], done: false, singleFileProgress: 0 });
    uploadFile(first);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      startBatch(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      startBatch(Array.from(e.target.files));
      // Reset input so the same files can be re-selected if needed
      e.target.value = "";
    }
  };

  const isBusy = isUploading || createLibraryEntry.isPending || (batchProgress !== null && !batchProgress.done);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 py-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Add to Library</h1>
        <p className="text-muted-foreground">Upload documents, photos, spreadsheets, or save a web link.</p>
      </div>

      <Tabs defaultValue="file" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-card border border-border shadow-sm p-1 rounded-xl">
          <TabsTrigger value="file" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <UploadCloud className="h-4 w-4 mr-2" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="url" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <LinkIcon className="h-4 w-4 mr-2" />
            Paste Link
          </TabsTrigger>
          <TabsTrigger value="confidential" className="rounded-lg data-[state=active]:bg-rose-700 data-[state=active]:text-white">
            <Lock className="h-4 w-4 mr-2" />
            Confidential
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="space-y-6">
          <Card className="bg-card border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <CardTitle className="text-lg font-serif">1. Set Metadata (Optional)</CardTitle>
              <CardDescription>Tag the files before uploading to automatically organize them.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Producer / Source</Label>
                  <Select 
                    value={fileMetadata.producerSlug} 
                    onValueChange={(v) => updateFileMetadata(prev => ({ ...prev, producerSlug: v === "none" ? "" : v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select producer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {producers?.map(p => (
                        <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select 
                    onValueChange={(v) => {
                      if (!fileMetadata.subjectSlugs.includes(v)) {
                        updateFileMetadata(prev => ({ ...prev, subjectSlugs: [...prev.subjectSlugs, v] }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Add subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects?.filter(s => !fileMetadata.subjectSlugs.includes(s.slug)).map(s => (
                        <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {fileMetadata.subjectSlugs.map(slug => {
                      const subject = subjects?.find(s => s.slug === slug);
                      return (
                        <Badge key={slug} variant="secondary" className="gap-1 pl-2 pr-1">
                          {subject?.name || slug}
                          <button 
                            className="text-muted-foreground hover:text-foreground rounded-full hover:bg-muted p-0.5"
                            onClick={() => updateFileMetadata(prev => ({ ...prev, subjectSlugs: prev.subjectSlugs.filter(s => s !== slug) }))}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Project Bucket</Label>
                  <Select 
                    onValueChange={(v) => {
                      if (!fileMetadata.bucketSlugs.includes(v)) {
                        updateFileMetadata(prev => ({ ...prev, bucketSlugs: [...prev.bucketSlugs, v] }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Add buckets" />
                    </SelectTrigger>
                    <SelectContent>
                      {buckets?.filter(b => !fileMetadata.bucketSlugs.includes(b.slug)).map(b => (
                        <SelectItem key={b.slug} value={b.slug}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {fileMetadata.bucketSlugs.map(slug => {
                      const bucket = buckets?.find(b => b.slug === slug);
                      return (
                        <Badge key={slug} variant="outline" className="gap-1 pl-2 pr-1 bg-background/50">
                          {bucket?.name || slug}
                          <button 
                            className="text-muted-foreground hover:text-foreground rounded-full hover:bg-muted p-0.5"
                            onClick={() => updateFileMetadata(prev => ({ ...prev, bucketSlugs: prev.bucketSlugs.filter(s => s !== slug) }))}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <CardTitle className="text-lg font-serif">2. Upload Files</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div 
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 bg-background/50'
                } ${isBusy ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !isBusy && fileInputRef.current?.click()}
              >
                <input 
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden" 
                  onChange={handleChange}
                  disabled={isBusy}
                />
                
                {batchProgress && !batchProgress.done ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="font-medium text-foreground text-lg">
                      {batchProgress.total === 1
                        ? isUploading
                          ? `Uploading… ${Math.round(batchProgress.singleFileProgress)}%`
                          : "Finalizing entry…"
                        : isUploading
                          ? `Uploading ${batchProgress.current} of ${batchProgress.total}… ${Math.round(batchProgress.singleFileProgress)}%`
                          : `Processing ${batchProgress.current} of ${batchProgress.total}…`
                      }
                    </p>
                    <div className="w-full max-w-xs bg-muted rounded-full h-2 mt-1">
                      {batchProgress.total === 1 ? (
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${batchProgress.singleFileProgress}%` }}
                        />
                      ) : (
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((batchProgress.current - 1) / batchProgress.total) * 100 + (batchProgress.singleFileProgress / batchProgress.total)}%` }}
                        />
                      )}
                    </div>
                    {batchProgress.total > 1 && (
                      <p className="text-sm text-muted-foreground">
                        {batchProgress.current - 1} of {batchProgress.total} complete
                        {batchProgress.failed.length > 0 && (
                          <span className="text-destructive ml-2">· {batchProgress.failed.length} failed</span>
                        )}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex justify-center gap-4 mb-4 text-muted-foreground opacity-50">
                      <FileIcon className="h-10 w-10" />
                      <ImageIcon className="h-10 w-10" />
                    </div>
                    <p className="text-lg font-serif font-medium text-foreground">Drag and drop files here</p>
                    <p className="text-sm text-muted-foreground mb-4">Drop a whole folder of photos at once, or click to browse</p>
                    <Button type="button" variant="outline">Select Files</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confidential" className="space-y-6">
          <Card className="bg-rose-50 border-rose-200 shadow-sm overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
                <div className="text-sm text-rose-800">
                  <span className="font-semibold">This drops into your private review queue — nothing is shared until you clear it.</span>
                  {" "}Files dropped here are stored privately and excluded from all library listings, share links, and public URLs.
                  Use the <Link href="/confidential/queue" className="underline font-medium">Confidential Queue</Link> to review, then clear, refuse, or route each file using the Gate&rsquo;s severity ladder.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-rose-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-rose-50 border-b border-rose-100 pb-4">
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <Lock className="h-5 w-5 text-rose-600" />
                Drop Confidential File
              </CardTitle>
              <CardDescription>
                Contracts, NDAs, legal notices, sensitive documents — drop here first, decide later.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Step 1: Drop zone — hidden once a file is staged */}
              {!pendingConfidentialFile && (
                <div
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                    confidentialDragActive
                      ? "border-rose-500 bg-rose-100/60"
                      : "border-rose-300 hover:border-rose-400 bg-rose-50/50"
                  } ${(isConfidentialUploading || confidentialUploading) ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
                  onDragEnter={handleConfidentialDrag}
                  onDragLeave={handleConfidentialDrag}
                  onDragOver={handleConfidentialDrag}
                  onDrop={handleConfidentialDrop}
                  onClick={() => !(isConfidentialUploading || confidentialUploading) && confidentialFileInputRef.current?.click()}
                >
                  <input
                    ref={confidentialFileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleConfidentialChange}
                    disabled={isConfidentialUploading || confidentialUploading}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Lock className="h-12 w-12 text-rose-400 mb-2" />
                    <p className="text-lg font-serif font-medium text-rose-800">Drag and drop your confidential file here</p>
                    <p className="text-sm text-rose-600 mb-4">or click to browse — lands in quarantine, never the main library</p>
                    <Button type="button" variant="outline" className="border-rose-300 text-rose-700 hover:bg-rose-100">
                      Select Confidential File
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Title + notes form, shown after a file is staged */}
              {pendingConfidentialFile && (
                <form onSubmit={handleConfidentialSubmit} className="space-y-5">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-rose-50 border border-rose-200">
                    <Lock className="h-5 w-5 text-rose-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-rose-800 truncate">{pendingConfidentialFile.name}</p>
                      <p className="text-xs text-rose-600">{(pendingConfidentialFile.size / 1024).toFixed(0)} KB · ready to quarantine</p>
                    </div>
                    <button
                      type="button"
                      className="ml-auto text-rose-400 hover:text-rose-700 shrink-0"
                      onClick={() => { setPendingConfidentialFile(null); setConfidentialTitle(""); setConfidentialNotes(""); }}
                      aria-label="Remove staged file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conf-title">Title</Label>
                    <Input
                      id="conf-title"
                      value={confidentialTitle}
                      onChange={(e) => setConfidentialTitle(e.target.value)}
                      placeholder="Document title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conf-notes">Notes <span className="text-muted-foreground font-normal">(optional)</span></Label>
                    <Textarea
                      id="conf-notes"
                      value={confidentialNotes}
                      onChange={(e) => setConfidentialNotes(e.target.value)}
                      placeholder="Why is this confidential? Who sent it? Any context that'll help you review it later."
                      className="min-h-[90px] resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="submit"
                      disabled={isConfidentialUploading || confidentialUploading || !confidentialTitle.trim()}
                      className="bg-rose-700 hover:bg-rose-800 text-white gap-2"
                    >
                      {(isConfidentialUploading || confidentialUploading) ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {isConfidentialUploading && confidentialUploadProgress > 0
                            ? `Uploading… ${Math.round(confidentialUploadProgress)}%`
                            : "Quarantining…"}
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" />
                          Quarantine file
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={isConfidentialUploading || confidentialUploading}
                      onClick={() => { setPendingConfidentialFile(null); setConfidentialTitle(""); setConfidentialNotes(""); }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="url">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <CardTitle className="text-lg font-serif">Save Web Source</CardTitle>
              <CardDescription>Paste a URL and we'll automatically fetch the page title and screenshot.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...urlForm}>
                <form onSubmit={urlForm.handleSubmit(onUrlSubmit)} className="space-y-6">
                  <FormField
                    control={urlForm.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/article" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={urlForm.control}
                      name="producerSlug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Producer / Source</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select producer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {producers?.map(p => (
                                <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={urlForm.control}
                      name="subjectSlugs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subjects</FormLabel>
                          <Select 
                            onValueChange={(v) => {
                              if (!field.value.includes(v)) {
                                field.onChange([...field.value, v]);
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Add subjects" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subjects?.filter(s => !field.value.includes(s.slug)).map(s => (
                                <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {field.value.map(slug => {
                              const subject = subjects?.find(s => s.slug === slug);
                              return (
                                <Badge key={slug} variant="secondary" className="gap-1 pl-2 pr-1">
                                  {subject?.name || slug}
                                  <button 
                                    type="button"
                                    className="text-muted-foreground hover:text-foreground rounded-full hover:bg-muted p-0.5"
                                    onClick={() => field.onChange(field.value.filter(s => s !== slug))}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              );
                            })}
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={urlForm.control}
                      name="bucketSlugs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Buckets</FormLabel>
                          <Select 
                            onValueChange={(v) => {
                              if (!field.value.includes(v)) {
                                field.onChange([...field.value, v]);
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Add buckets" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {buckets?.filter(b => !field.value.includes(b.slug)).map(b => (
                                <SelectItem key={b.slug} value={b.slug}>{b.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {field.value.map(slug => {
                              const bucket = buckets?.find(b => b.slug === slug);
                              return (
                                <Badge key={slug} variant="outline" className="gap-1 pl-2 pr-1 bg-background/50">
                                  {bucket?.name || slug}
                                  <button 
                                    type="button"
                                    className="text-muted-foreground hover:text-foreground rounded-full hover:bg-muted p-0.5"
                                    onClick={() => field.onChange(field.value.filter(s => s !== slug))}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              );
                            })}
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={urlForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Why is this link relevant?" 
                            className="min-h-[100px] resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={createFromUrl.isPending} className="gap-2">
                      {createFromUrl.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                      Save Link
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
