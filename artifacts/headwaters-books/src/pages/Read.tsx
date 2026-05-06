import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ch1Raw from "../../../../codetry-book/drafts/01-the-headwaters.md?raw";
import ch2Raw from "../../../../codetry-book/drafts/02-watching-the-beavers.md?raw";
import ch3Raw from "../../../../codetry-book/drafts/03-the-dam-breaks.md?raw";

function stripEditorialNotes(src: string): string {
  const marker = /^##\s+Editorial notes/im;
  const idx = src.search(marker);
  if (idx === -1) return src;
  return src.slice(0, idx).trimEnd();
}

const chapters = [
  stripEditorialNotes(ch1Raw),
  stripEditorialNotes(ch2Raw),
  stripEditorialNotes(ch3Raw),
];

export default function Read() {
  return (
    <div className="min-h-screen bg-[hsl(40_33%_98%)] py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-16 text-center">
          <p className="text-xs uppercase tracking-widest text-[hsl(160_20%_50%)] mb-3">
            Headwaters · Codetry
          </p>
          <h1 className="text-3xl font-semibold text-[hsl(160_40%_15%)] mb-2">
            How a Community Runs Its Own Economy
          </h1>
          <p className="text-sm text-[hsl(160_20%_45%)]">
            Draft manuscript · three chapters · for founder review
          </p>
        </header>

        {chapters.map((content, i) => (
          <article key={i} className="mb-24">
            <div className="prose prose-stone prose-sm sm:prose-base max-w-none
              prose-headings:font-semibold prose-headings:text-[hsl(160_40%_15%)]
              prose-h1:text-2xl prose-h1:mb-6
              prose-h2:text-lg prose-h2:mt-10
              prose-p:text-[hsl(160_30%_20%)] prose-p:leading-relaxed
              prose-strong:text-[hsl(160_40%_15%)]
              prose-em:text-[hsl(160_30%_30%)]
              prose-blockquote:border-l-[hsl(160_30%_60%)] prose-blockquote:text-[hsl(160_30%_35%)]
              prose-hr:border-[hsl(40_20%_80%)]
              prose-a:text-[hsl(160_40%_35%)]
              prose-li:text-[hsl(160_30%_20%)]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
            {i < chapters.length - 1 && (
              <div className="mt-16 flex items-center gap-4">
                <div className="flex-1 border-t border-[hsl(40_20%_80%)]" />
                <span className="text-xs text-[hsl(160_20%_55%)] tracking-widest uppercase">
                  · · ·
                </span>
                <div className="flex-1 border-t border-[hsl(40_20%_80%)]" />
              </div>
            )}
          </article>
        ))}

        <footer className="mt-8 pt-8 border-t border-[hsl(40_20%_80%)] text-center">
          <p className="text-xs text-[hsl(160_20%_55%)]">
            End of draft · bobbie parr · headwaters
          </p>
        </footer>
      </div>
    </div>
  );
}
