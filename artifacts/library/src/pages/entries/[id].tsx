import { useState, useRef, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { format } from "date-fns";
import { 
  useGetLibraryEntry, 
  getGetLibraryEntryQueryKey,
  useUpdateLibraryEntry, 
  useDeleteLibraryEntry,
  useListProducers,
  useListSubjects,
  useListProjectBuckets
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { entryAssetUrl, errMessage } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { 
  FileText, Image as ImageIcon, Globe, File as FileIcon, 
  ArrowLeft, Download, ExternalLink, Calendar, MapPin, 
  Tag, FolderOpen, Edit, Save, X, Trash2
} from "lucide-react";

export default function EntryDetail() {
  const [, params] = useRoute("/entries/:id");
  const id = params?.id || "";
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entry, isLoading } = useGetLibraryEntry(id, {
    query: { enabled: !!id, queryKey: getGetLibraryEntryQueryKey(id) }
  });

  const { data: producers } = useListProducers();
  const { data: subjects } = useListSubjects();
  const { data: buckets } = useListProjectBuckets();

  const updateEntry = useUpdateLibraryEntry();
  const deleteEntry = useDeleteLibraryEntry();

  const [isEditing, setIsEditing] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [id]);
  const [editData, setEditData] = useState<{
    title: string;
    summary: string;
    notes: string;
    producerSlug: string;
    subjectSlugs: string[];
    bucketSlugs: string[];
  }>({
    title: "",
    summary: "",
    notes: "",
    producerSlug: "",
    subjectSlugs: [],
    bucketSlugs: []
  });

  const updateFnRef = useRef(updateEntry.mutateAsync);
  updateFnRef.current = updateEntry.mutateAsync;

  useEffect(() => {
    if (entry && !isEditing) {
      setEditData({
        title: entry.title || "",
        summary: entry.summary || "",
        notes: entry.notes || "",
        producerSlug: entry.producer?.slug || "",
        subjectSlugs: entry.subjects.map(s => s.slug),
        bucketSlugs: entry.buckets.map(b => b.slug)
      });
    }
  }, [entry, isEditing]);

  const handleSave = async () => {
    try {
      await updateFnRef.current({
        id,
        data: {
          title: editData.title,
          summary: editData.summary,
          notes: editData.notes,
          producerSlug: editData.producerSlug || null,
          subjectSlugs: editData.subjectSlugs,
          bucketSlugs: editData.bucketSlugs
        }
      });
      
      queryClient.invalidateQueries({ queryKey: getGetLibraryEntryQueryKey(id) });
      setIsEditing(false);
      toast({
        title: "Entry updated",
        description: "Changes have been saved successfully.",
      });
    } catch (err) {
      toast({
        title: "Error updating entry",
        description: errMessage(err, "Could not save changes."),
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEntry.mutateAsync({ id });
      toast({
        title: "Entry deleted",
        description: "The entry has been removed from the library.",
      });
      setLocation("/entries");
    } catch (err) {
      toast({
        title: "Error deleting entry",
        description: errMessage(err, "Could not delete the entry."),
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-12 w-3/4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[600px] w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-serif mb-2">Entry not found</h2>
        <Button onClick={() => setLocation("/entries")} variant="outline">
          Back to Library
        </Button>
      </div>
    );
  }

  const assetUrl = entryAssetUrl(entry);
  
  let TypeIcon = FileText;
  if (entry.kind === "web_source") TypeIcon = Globe;
  else if (entry.fileType === "image") TypeIcon = ImageIcon;
  else if (entry.fileType === "pdf") TypeIcon = FileText;
  else if (entry.fileType) TypeIcon = FileIcon;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => window.history.back()} className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the entry "{entry.title}" and remove its data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete Entry
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="outline" className="gap-1 font-normal bg-background/50">
            <TypeIcon className="h-3 w-3" />
            {entry.kind === "web_source" ? "Web Source" : entry.fileType?.toUpperCase() || "File"}
          </Badge>
          <span>Added {format(new Date(entry.createdAt), "MMMM d, yyyy")}</span>
          {entry.status === "needs_review" && (
            <Badge variant="secondary" className="bg-accent text-accent-foreground border-none">
              Needs Review
            </Badge>
          )}
        </div>
        
        {isEditing ? (
          <Input 
            value={editData.title}
            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
            className="text-3xl font-serif font-bold h-14"
          />
        ) : (
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary">
            {entry.title}
          </h1>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2 space-y-8">
          {/* Preview Area */}
          <div className="bg-muted border border-border rounded-xl overflow-hidden min-h-[400px] flex items-center justify-center relative">
            {assetUrl ? (
              entry.fileType === "image" || entry.kind === "web_source" ? (
                imgFailed ? (
                  <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground py-12">
                    <TypeIcon className="h-16 w-16 opacity-30" />
                    <p className="text-sm">Image unavailable</p>
                  </div>
                ) : (
                  <img 
                    src={assetUrl} 
                    alt={entry.title} 
                    className="max-w-full max-h-[800px] object-contain"
                    onError={() => setImgFailed(true)}
                  />
                )
              ) : entry.fileType === "pdf" ? (
                <iframe 
                  src={`${assetUrl}#toolbar=0`} 
                  className="w-full h-[800px] bg-background"
                  title={entry.title}
                />
              ) : (
                <div className="text-center p-12">
                  <FileIcon className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <p className="text-lg font-serif mb-4">Preview not available for this file type</p>
                  <Button variant="outline" className="gap-2" onClick={() => window.open(assetUrl, '_blank')}>
                    <Download className="h-4 w-4" />
                    Download File
                  </Button>
                </div>
              )
            ) : (
              <div className="text-center p-12 text-muted-foreground">
                <Globe className="h-16 w-16 mx-auto opacity-50 mb-4" />
                <p>No preview available</p>
              </div>
            )}
            
            {/* Overlay actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              {entry.sourceUrl && (
                <Button size="sm" variant="secondary" className="gap-2 shadow-sm" onClick={() => window.open(entry.sourceUrl || undefined, '_blank')}>
                  <ExternalLink className="h-4 w-4" />
                  Visit Source
                </Button>
              )}
              {assetUrl && entry.kind === "file" && (
                <Button size="sm" variant="secondary" className="gap-2 shadow-sm" onClick={() => window.open(assetUrl, '_blank')}>
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}
            </div>
          </div>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-lg font-serif">Summary & Notes</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Summary</Label>
                {isEditing ? (
                  <Textarea 
                    value={editData.summary}
                    onChange={(e) => setEditData(prev => ({ ...prev, summary: e.target.value }))}
                    className="min-h-[100px]"
                    placeholder="Brief summary of the contents..."
                  />
                ) : (
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {entry.summary || <span className="text-muted-foreground italic">No summary provided.</span>}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Notes & Context</Label>
                {isEditing ? (
                  <Textarea 
                    value={editData.notes}
                    onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                    className="min-h-[150px]"
                    placeholder="Add your research notes, quotes, or thoughts..."
                  />
                ) : (
                  <div className="text-foreground whitespace-pre-wrap prose prose-sm max-w-none">
                    {entry.notes ? (
                      <p>{entry.notes}</p>
                    ) : (
                      <span className="text-muted-foreground italic">No notes added.</span>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-lg font-serif">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold flex items-center gap-1">
                  <FolderOpen className="h-3 w-3" /> Producer / Source
                </Label>
                {isEditing ? (
                  <Select 
                    value={editData.producerSlug} 
                    onValueChange={(v) => setEditData(prev => ({ ...prev, producerSlug: v === "none" ? "" : v }))}
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
                ) : (
                  entry.producer ? (
                    <Button variant="link" className="p-0 h-auto font-medium text-secondary text-base justify-start" onClick={() => setLocation(`/producers/${entry.producer?.slug}`)}>
                      {entry.producer.name}
                    </Button>
                  ) : (
                    <p className="text-muted-foreground text-sm">Not linked to a producer</p>
                  )
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold flex items-center gap-1">
                  <Tag className="h-3 w-3" /> Subjects
                </Label>
                {isEditing ? (
                  <div className="space-y-3">
                    <Select 
                      onValueChange={(v) => {
                        if (!editData.subjectSlugs.includes(v)) {
                          setEditData(prev => ({ ...prev, subjectSlugs: [...prev.subjectSlugs, v] }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Add subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects?.filter(s => !editData.subjectSlugs.includes(s.slug)).map(s => (
                          <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2">
                      {editData.subjectSlugs.map(slug => {
                        const subject = subjects?.find(s => s.slug === slug);
                        return (
                          <Badge key={slug} variant="secondary" className="gap-1 pl-2 pr-1">
                            {subject?.name || slug}
                            <button 
                              className="text-muted-foreground hover:text-foreground rounded-full hover:bg-muted p-0.5"
                              onClick={() => setEditData(prev => ({ ...prev, subjectSlugs: prev.subjectSlugs.filter(s => s !== slug) }))}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {entry.subjects.length > 0 ? entry.subjects.map(subject => (
                      <Badge 
                        key={subject.slug} 
                        variant="outline" 
                        className="bg-background/50 font-normal cursor-pointer hover:bg-muted transition-colors"
                        style={{ borderColor: subject.color || undefined }}
                        onClick={() => setLocation(`/entries?subjectSlug=${subject.slug}`)}
                      >
                        {subject.name}
                      </Badge>
                    )) : (
                      <p className="text-muted-foreground text-sm italic">No subjects</p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold flex items-center gap-1">
                  <FolderOpen className="h-3 w-3" /> Project Buckets
                </Label>
                {isEditing ? (
                  <div className="space-y-3">
                    <Select 
                      onValueChange={(v) => {
                        if (!editData.bucketSlugs.includes(v)) {
                          setEditData(prev => ({ ...prev, bucketSlugs: [...prev.bucketSlugs, v] }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Add bucket" />
                      </SelectTrigger>
                      <SelectContent>
                        {buckets?.filter(b => !editData.bucketSlugs.includes(b.slug)).map(b => (
                          <SelectItem key={b.slug} value={b.slug}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2">
                      {editData.bucketSlugs.map(slug => {
                        const bucket = buckets?.find(b => b.slug === slug);
                        return (
                          <Badge key={slug} variant="outline" className="bg-background/50 gap-1 pl-2 pr-1">
                            {bucket?.name || slug}
                            <button 
                              className="text-muted-foreground hover:text-foreground rounded-full hover:bg-muted p-0.5"
                              onClick={() => setEditData(prev => ({ ...prev, bucketSlugs: prev.bucketSlugs.filter(b => b !== slug) }))}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {entry.buckets.length > 0 ? entry.buckets.map(bucket => (
                      <Badge 
                        key={bucket.slug} 
                        variant="outline" 
                        className="bg-background/50 font-normal cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => setLocation(`/entries?bucketSlug=${bucket.slug}`)}
                      >
                        {bucket.name}
                      </Badge>
                    )) : (
                      <p className="text-muted-foreground text-sm italic">No project buckets</p>
                    )}
                  </div>
                )}
              </div>
              
              {entry.contributor && (
                <div className="space-y-1 pt-4 border-t border-border/50">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Added By</Label>
                  <p className="text-sm font-medium">{entry.contributor.name}</p>
                  {entry.contributor.organization && (
                    <p className="text-xs text-muted-foreground">{entry.contributor.organization}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
