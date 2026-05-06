import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import manuscriptRaw from "../../../../codetry-book/manuscript.md?raw";

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripEditorialNotes(src: string): string {
  const marker = /^##\s+Editorial notes/im;
  const idx = src.search(marker);
  if (idx === -1) return src;
  return src.slice(0, idx).trimEnd();
}

interface Chapter {
  label: string;
  slug: string;
  content: string;
}

function parseManuscript(raw: string): Chapter[] {
  const cleaned = raw.replace(/^<!--[\s\S]*?-->\s*/, "");
  const parts = cleaned.split(/\n(?=# )/);
  return parts
    .filter((p) => /^# /.test(p.trim()))
    .map((content) => {
      const headingMatch = content.match(/^# (.+)/m);
      const label = headingMatch ? headingMatch[1].trim() : "";
      const slug = toSlug(label);
      return { label, slug, content: stripEditorialNotes(content) };
    });
}

const CHAPTERS = parseManuscript(manuscriptRaw);


export default function Read() {
  const [activeSlug, setActiveSlug] = useState<string>(CHAPTERS[0]?.slug ?? "");
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) setActiveSlug(hash);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSlug(id);
            history.replaceState(null, "", `#${id}`);
          }
        }
      },
      { rootMargin: "-10% 0px -80% 0px", threshold: 0 }
    );

    for (const [, el] of sectionRefs.current) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  function setRef(slug: string) {
    return (el: HTMLElement | null) => {
      if (el) sectionRefs.current.set(slug, el);
      else sectionRefs.current.delete(slug);
    };
  }

  return (
    <div className="min-h-screen bg-[hsl(40_33%_98%)]">
      <div className="max-w-6xl mx-auto px-4 py-16 flex gap-10">

        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="sticky top-16 flex flex-col gap-0.5">
            <p className="text-[10px] uppercase tracking-widest text-[hsl(160_20%_55%)] mb-3 pl-3">
              Chapters
            </p>
            {CHAPTERS.map((ch) => (
              <a
                key={ch.slug}
                href={`#${ch.slug}`}
                className={[
                  "text-xs px-3 py-1.5 rounded transition-colors leading-snug no-underline",
                  activeSlug === ch.slug
                    ? "bg-[hsl(160_20%_90%)] text-[hsl(160_40%_20%)] font-medium"
                    : "text-[hsl(160_20%_50%)] hover:text-[hsl(160_40%_20%)] hover:bg-[hsl(160_10%_94%)]",
                ].join(" ")}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(ch.slug);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    history.pushState(null, "", `#${ch.slug}`);
                    setActiveSlug(ch.slug);
                  }
                }}
              >
                {ch.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <header className="mb-14 text-center">
            <p className="text-xs uppercase tracking-widest text-[hsl(160_20%_50%)] mb-3">
              Headwaters · Codetry
            </p>
            <h1 className="text-3xl font-semibold text-[hsl(160_40%_15%)] mb-2">
              How a Community Runs Its Own Economy
            </h1>
            <p className="text-sm text-[hsl(160_20%_45%)]">
              Full manuscript · {CHAPTERS.length} chapters · for reviewer reading
            </p>
          </header>

          {/* Mobile chapter jump-links */}
          <div className="lg:hidden mb-10 flex flex-wrap gap-2">
            {CHAPTERS.map((ch) => (
              <a
                key={ch.slug}
                href={`#${ch.slug}`}
                className="text-xs px-3 py-1.5 rounded border border-[hsl(40_20%_80%)] text-[hsl(160_30%_35%)] hover:bg-[hsl(160_10%_94%)] transition-colors no-underline"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(ch.slug);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    history.pushState(null, "", `#${ch.slug}`);
                    setActiveSlug(ch.slug);
                  }
                }}
              >
                {ch.label}
              </a>
            ))}
          </div>

          {CHAPTERS.map((ch, i) => (
            <section
              key={ch.slug}
              id={ch.slug}
              ref={setRef(ch.slug)}
              className="mb-24 scroll-mt-16"
            >
              <div
                className="prose prose-stone prose-sm sm:prose-base max-w-none
                  prose-headings:font-semibold prose-headings:text-[hsl(160_40%_15%)]
                  prose-h1:text-2xl prose-h1:mb-6
                  prose-h2:text-lg prose-h2:mt-10
                  prose-p:text-[hsl(160_30%_20%)] prose-p:leading-relaxed
                  prose-strong:text-[hsl(160_40%_15%)]
                  prose-em:text-[hsl(160_30%_30%)]
                  prose-blockquote:border-l-[hsl(160_30%_60%)] prose-blockquote:text-[hsl(160_30%_35%)]
                  prose-hr:border-[hsl(40_20%_80%)]
                  prose-a:text-[hsl(160_40%_35%)]
                  prose-li:text-[hsl(160_30%_20%)]"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {ch.content}
                </ReactMarkdown>
              </div>

              {i < CHAPTERS.length - 1 && (
                <div className="mt-16 flex items-center gap-4">
                  <div className="flex-1 border-t border-[hsl(40_20%_80%)]" />
                  <span className="text-xs text-[hsl(160_20%_55%)] tracking-widest uppercase">
                    · · ·
                  </span>
                  <div className="flex-1 border-t border-[hsl(40_20%_80%)]" />
                </div>
              )}
            </section>
          ))}

          <footer className="mt-8 pt-8 border-t border-[hsl(40_20%_80%)] text-center">
            <p className="text-xs text-[hsl(160_20%_55%)]">
              End of manuscript · bobbie parr · headwaters
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
