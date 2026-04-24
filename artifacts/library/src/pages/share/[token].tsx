import { useState, useRef } from "react";
import { useRoute } from "wouter";
import { useGetShareLinkByToken, getGetShareLinkByTokenQueryKey, useSubmitShareLinkUpload } from "@workspace/api-client-react";
import { useUpload } from "@workspace/object-storage-web";
import { useToast } from "@/hooks/use-toast";
import { computeFileHash, errMessage } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UploadCloud, Loader2, File as FileIcon, ImageIcon, CheckCircle2 } from "lucide-react";

export default function PublicShare() {
  const [, params] = useRoute("/share/:token");
  const token = params?.token || "";
  const { toast } = useToast();

  const { data: shareLink, isLoading, error } = useGetShareLinkByToken(token, {
    query: { enabled: !!token, queryKey: getGetShareLinkByTokenQueryKey(token), retry: false }
  });

  const submitUpload = useSubmitShareLinkUpload();
  
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, duplicate: boolean}[]>([]);

  const { uploadFile, isUploading, progress } = useUpload({
    getHeaders: () => ({ "x-share-token": token }),
    onSuccess: async (response, file) => {
      try {
        const hash = await computeFileHash(file);
        
        const result = await submitUpload.mutateAsync({
          token,
          data: {
            kind: "file",
            title: file.name.replace(/\.[^/.]+$/, ""),
            objectPath: response.objectPath,
            contentHash: hash,
            fileSize: file.size,
            contentType: file.type,
            originalFilename: file.name,
          }
        });

        setUploadedFiles(prev => [...prev, { name: file.name, duplicate: result.duplicate }]);
        
        toast({
          title: "File uploaded successfully",
          description: result.duplicate ? "We already had a copy of this file, but thanks!" : "Your file has been added to the library.",
        });
      } catch (err) {
        toast({
          title: "Error finalizing upload",
          description: errMessage(err, "Failed to process the uploaded file"),
          variant: "destructive",
        });
      }
    },
    onError: (err) => {
      toast({
        title: "Upload failed",
        description: err.message || "Could not upload file",
        variant: "destructive",
      });
    }
  });

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
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !shareLink) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md text-center py-8">
          <CardContent>
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="text-xl font-serif font-bold text-foreground mb-2">Invalid or Expired Link</h2>
            <p className="text-muted-foreground">This share link is no longer valid or has been revoked.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold text-primary mb-2">
            {shareLink.ownerLabel || "Northern Food Systems Research Library"}
          </h1>
          <p className="text-muted-foreground">Secure File Upload</p>
        </div>

        <Card className="bg-card border-border shadow-lg overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground p-6">
            <CardTitle className="text-xl font-serif">Welcome, {shareLink.contributorName}</CardTitle>
            <CardDescription className="text-primary-foreground/80 mt-1 text-base">
              {shareLink.label ? `Uploading files for: ${shareLink.label}` : "Please upload your files below. They will be added directly to the library."}
            </CardDescription>
            
            {(shareLink.presetSubjects?.length || 0) > 0 || (shareLink.presetBuckets?.length || 0) > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs text-primary-foreground/70 uppercase tracking-wider font-semibold mr-2 self-center">Auto-tagging:</span>
                {shareLink.presetSubjects?.map(s => (
                  <Badge key={s.slug} variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-none font-normal">
                    {s.name}
                  </Badge>
                ))}
                {shareLink.presetBuckets?.map(b => (
                  <Badge key={b.slug} variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-none font-normal">
                    {b.name}
                  </Badge>
                ))}
              </div>
            ) : null}
          </CardHeader>
          
          <CardContent className="p-8">
            <div 
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 bg-background/50'
              } ${isUploading || submitUpload.isPending ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !isUploading && !submitUpload.isPending && fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                onChange={handleChange}
                disabled={isUploading || submitUpload.isPending}
              />
              
              {isUploading || submitUpload.isPending ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <p className="font-medium text-foreground">
                    {isUploading ? `Uploading... ${Math.round(progress)}%` : "Processing file..."}
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
                    <FileIcon className="h-12 w-12" />
                    <ImageIcon className="h-12 w-12" />
                  </div>
                  <p className="text-xl font-serif font-medium text-foreground">Drag & drop a file here</p>
                  <p className="text-muted-foreground mb-6">PDFs, images, documents, and spreadsheets</p>
                  <Button type="button" size="lg" className="px-8 shadow-sm">Browse Files</Button>
                </div>
              )}
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-8 space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Uploaded in this session</h3>
                <div className="space-y-2">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-muted/50 border border-border p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-sm truncate max-w-[200px] sm:max-w-[300px]">{f.name}</span>
                      </div>
                      {f.duplicate && (
                        <Badge variant="outline" className="text-[10px] bg-background">Duplicate</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground">
          Files uploaded here are secure and only visible to the library owner.
        </p>
      </div>
    </div>
  );
}