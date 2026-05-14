import { useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { FileText, Image as ImageIcon, Globe, File, Paperclip, MoreVertical, CheckCircle2 } from "lucide-react";
import { type LibraryEntry } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { entryAssetUrl } from "@/lib/utils";

interface EntryCardProps {
  entry: LibraryEntry;
}

export function EntryCard({ entry }: EntryCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const assetUrl = entryAssetUrl(entry);
  
  let Icon = FileText;
  if (entry.kind === "web_source") Icon = Globe;
  else if (entry.fileType === "image") Icon = ImageIcon;
  else if (entry.fileType === "pdf") Icon = FileText;
  else if (entry.fileType) Icon = File;

  const showImage = assetUrl && (entry.fileType === "image" || entry.kind === "web_source") && !imgFailed;

  return (
    <Link href={`/entries/${entry.id}`}>
      <Card className="h-full flex flex-col hover-elevate cursor-pointer transition-all border-border bg-card hover:border-secondary/50 group overflow-hidden">
        {showImage ? (
          <div className="h-40 w-full overflow-hidden bg-muted relative">
            <img 
              src={assetUrl} 
              alt={entry.title} 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgFailed(true)}
            />
            {entry.status === "needs_review" && (
              <Badge variant="secondary" className="absolute top-2 right-2 bg-accent text-accent-foreground border-none">
                Needs Review
              </Badge>
            )}
          </div>
        ) : imgFailed ? (
          <div className="h-40 w-full bg-muted flex items-center justify-center">
            <Icon className="h-10 w-10 text-muted-foreground opacity-30" />
          </div>
        ) : (
          <div className="h-2 w-full bg-muted" />
        )}
        
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Icon className="h-3.5 w-3.5" />
              <span>{entry.kind === "web_source" ? "Web Source" : entry.fileType?.toUpperCase() || "File"}</span>
              <span>•</span>
              <span>{format(new Date(entry.createdAt), "MMM d, yyyy")}</span>
            </div>
            {!assetUrl && entry.status === "needs_review" && (
              <Badge variant="secondary" className="bg-accent text-accent-foreground border-none text-[10px] px-1.5 py-0 h-4">
                Review
              </Badge>
            )}
          </div>
          <h3 className="font-serif font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {entry.title}
          </h3>
          {entry.producer && (
            <p className="text-sm text-secondary truncate">{entry.producer.name}</p>
          )}
        </CardHeader>
        
        <CardContent className="p-4 pt-0 flex-1">
          {entry.summary && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {entry.summary}
            </p>
          )}
          
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {entry.subjects.slice(0, 3).map(subject => (
              <Badge key={subject.slug} variant="outline" className="bg-background/50 font-normal text-xs" style={{ borderColor: subject.color || undefined }}>
                {subject.name}
              </Badge>
            ))}
            {entry.subjects.length > 3 && (
              <Badge variant="outline" className="bg-background/50 font-normal text-xs">
                +{entry.subjects.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
