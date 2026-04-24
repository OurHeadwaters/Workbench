import { useState, useRef } from "react";
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
import { UploadCloud, Link as LinkIcon, Loader2, X, File as FileIcon, Image as ImageIcon } from "lucide-react";

const urlFormSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  notes: z.string().optional(),
  producerSlug: z.string().optional(),
  subjectSlugs: z.array(z.string()).default([]),
  bucketSlugs: z.array(z.string()).default([]),
});

export default function NewEntry() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: producers } = useListProducers();
  const { data: subjects } = useListSubjects();
  const { data: buckets } = useListProjectBuckets();

  const createFromUrl = useCreateEntryFromUrl();
  const createLibraryEntry = useCreateLibraryEntry();
  
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
        
        const result = await createLibraryEntry.mutateAsync({
          data: {
            kind: "file",
            title: file.name.replace(/\.[^/.]+$/, ""),
            objectPath: response.objectPath,
            contentHash: hash,
            fileSize: file.size,
            contentType: file.type,
            originalFilename: file.name,
            producerSlug: fileMetadata.producerSlug || undefined,
            subjectSlugs: fileMetadata.subjectSlugs,
            bucketSlugs: fileMetadata.bucketSlugs,
            status: "published"
          }
        });

        if (result.duplicate) {
          toast({
            title: "Duplicate found",
            description: "A file with identical content already exists. We linked to the existing entry.",
            variant: "default",
          });
        } else {
          toast({
            title: "Upload complete",
            description: "File added to library successfully.",
          });
        }
        
        setLocation(`/entries/${result.entry.id}`);
      } catch (err) {
        toast({
          title: "Error creating entry",
          description: errMessage(err, "Failed to finalize upload"),
          variant: "destructive",
        });
      }
    },
    onError: (err) => {
      toast({
        title: "Upload failed",
        description: err.message || "Could not upload file to storage",
        variant: "destructive",
      });
    }
  });

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

  const [dragActive, setDragActive] = useState(false);
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
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    uploadFile(file);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 py-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Add to Library</h1>
        <p className="text-muted-foreground">Upload documents, photos, spreadsheets, or save a web link.</p>
      </div>

      <Tabs defaultValue="file" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-card border border-border shadow-sm p-1 rounded-xl">
          <TabsTrigger value="file" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <UploadCloud className="h-4 w-4 mr-2" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="url" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <LinkIcon className="h-4 w-4 mr-2" />
            Paste Link
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="space-y-6">
          <Card className="bg-card border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <CardTitle className="text-lg font-serif">1. Set Metadata (Optional)</CardTitle>
              <CardDescription>Tag the file before uploading it to automatically organize it.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Producer / Source</Label>
                  <Select 
                    value={fileMetadata.producerSlug} 
                    onValueChange={(v) => setFileMetadata(prev => ({ ...prev, producerSlug: v === "none" ? "" : v }))}
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
                        setFileMetadata(prev => ({ ...prev, subjectSlugs: [...prev.subjectSlugs, v] }));
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
                            onClick={() => setFileMetadata(prev => ({ ...prev, subjectSlugs: prev.subjectSlugs.filter(s => s !== slug) }))}
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
                        setFileMetadata(prev => ({ ...prev, bucketSlugs: [...prev.bucketSlugs, v] }));
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
                            onClick={() => setFileMetadata(prev => ({ ...prev, bucketSlugs: prev.bucketSlugs.filter(s => s !== slug) }))}
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
              <CardTitle className="text-lg font-serif">2. Upload File</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div 
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 bg-background/50'
                } ${isUploading || createLibraryEntry.isPending ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !isUploading && !createLibraryEntry.isPending && fileInputRef.current?.click()}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  onChange={handleChange}
                  disabled={isUploading || createLibraryEntry.isPending}
                />
                
                {isUploading || createLibraryEntry.isPending ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="font-medium text-foreground">
                      {isUploading ? `Uploading... ${Math.round(progress)}%` : "Finalizing entry..."}
                    </p>
                    {isUploading && (
                      <div className="w-full max-w-xs bg-muted rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex justify-center gap-4 mb-4 text-muted-foreground opacity-50">
                      <FileIcon className="h-10 w-10" />
                      <ImageIcon className="h-10 w-10" />
                    </div>
                    <p className="text-lg font-serif font-medium text-foreground">Drag and drop your file here</p>
                    <p className="text-sm text-muted-foreground mb-4">or click to browse from your computer</p>
                    <Button type="button" variant="outline">Select File</Button>
                  </div>
                )}
              </div>
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