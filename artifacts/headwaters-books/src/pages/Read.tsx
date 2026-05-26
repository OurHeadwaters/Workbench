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
  chapterNum: string;
  slug: string;
  content: string;
}

interface PartGroup {
  roman: string;
  title: string;
  chapters: Chapter[];
}

const PARTS_DATA: Array<{ roman: string; title: string; chapterNums: string[] }> = [
  { roman: "P", title: "Prologue", chapterNums: ["P.0", "P.1", "P.2"] },
  { roman: "G", title: "Grounding", chapterNums: ["4.1", "4.2", "4.3", "4.4"] },
  { roman: "I", title: "The Discipline", chapterNums: ["1.0", "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7"] },
  { roman: "II", title: "The Constellation", chapterNums: ["2.0", "2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8", "2.9", "2.10"] },
  { roman: "III", title: "The Practice", chapterNums: ["3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "3.8", "3.9", "3.10", "3.11"] },
  { roman: "IV", title: "The Quiet Examples", chapterNums: ["4.1", "4.2", "4.3", "4.4", "4.5", "4.6", "4.7", "4.8", "4.9", "4.10", "4.11", "4.12", "4.13"] },
  { roman: "V", title: "Open Questions", chapterNums: ["5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "5.8", "5.9"] },
  { roman: "DD", title: "Deep Dives", chapterNums: ["DD.1", "DD.2", "DD.3", "DD.4", "DD.5", "DD.6", "DD.7", "DD.A", "DD.I", "DD.II", "DD.III", "DD.IV", "DD.V", "DD.VI"] },
  { roman: "FL", title: "Field Ledger", chapterNums: ["FL.1", "FL.2", "FL.3", "FL.4", "FL.5", "FL.6", "FL.7", "FL.8", "FL.9", "FL.10", "FL.11"] },
  { roman: "CODA", title: "Conclusion", chapterNums: ["Coda", "C"] },
];

function parseManuscript(raw: string): Chapter[] {
  const cleaned = raw.replace(/^<!--[\s\S]*?-->\s*/, "");
  const parts = cleaned.split(/\n(?=# )/);
  return parts
    .filter((p) => /^# /.test(p.trim()))
    .map((content) => {
      const headingMatch = content.match(/^# (.+)/m);
      const label = headingMatch ? headingMatch[1].trim() : "";
      // Extract chapter number from "P.1 · Title" format
      const numMatch = label.match(/^([^\s·]+)\s*·/);
      const chapterNum = numMatch ? numMatch[1].trim() : "";
      const slug = toSlug(label);
      return { label, chapterNum, slug, content: stripEditorialNotes(content) };
    });
}

function groupChaptersByPart(chapters: Chapter[]): PartGroup[] {
  // Build an ordered flat list of (partIndex, chapterNum) from PARTS_DATA
  const expected: Array<{ partIdx: number; num: string }> = [];
  PARTS_DATA.forEach((part, partIdx) => {
    part.chapterNums.forEach((num) => expected.push({ partIdx, num }));
  });

  // Walk chapters in manuscript order, matching them to parts sequentially.
  // This correctly handles G and IV both having 4.x numbers.
  const groups: PartGroup[] = PARTS_DATA.map((p) => ({
    roman: p.roman,
    title: p.title,
    chapters: [],
  }));
  const unmatched: Chapter[] = [];
  let ei = 0;

  for (const ch of chapters) {
    const startEi = ei;
    while (ei < expected.length && expected[ei].num !== ch.chapterNum) {
      ei++;
    }
    if (ei < expected.length) {
      groups[expected[ei].partIdx].chapters.push(ch);
      ei++;
    } else {
      // No match found — reset to where we were and put in unmatched
      ei = startEi;
      unmatched.push(ch);
    }
  }

  const result = groups.filter((g) => g.chapters.length > 0);

  // Append unmatched chapters as a misc group if any
  if (unmatched.length > 0) {
    result.push({ roman: "?", title: "Other", chapters: unmatched });
  }

  return result;
}

const ALL_CHAPTERS = parseManuscript(manuscriptRaw);
const GROUPED = groupChaptersByPart(ALL_CHAPTERS);

export default function Read() {
  const [activeSlug, setActiveSlug] = useState<string>(ALL_CHAPTERS[0]?.slug ?? "");
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
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="sticky top-16 flex flex-col gap-0 max-h-[calc(100vh-5rem)] overflow-y-auto pr-1">
            <p className="text-[10px] uppercase tracking-widest text-[hsl(160_20%_55%)] mb-3 pl-3">
              Contents
            </p>
            {GROUPED.map((group) => (
              <div key={group.roman} className="mb-3">
                {/* Part divider */}
                <div className="flex items-center gap-2 px-3 py-1.5 mb-0.5">
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-[hsl(160_30%_45%)] whitespace-nowrap">
                    {group.roman === "P" || group.roman === "CODA" || group.roman === "DD" || group.roman === "FL" || group.roman === "G"
                      ? group.title
                      : `Part ${group.roman} · ${group.title}`}
                  </span>
                  <div className="flex-1 border-t border-[hsl(160_15%_82%)]" />
                </div>
                {/* Chapters in this part */}
                {group.chapters.map((ch) => (
                  <a
                    key={ch.slug}
                    href={`#${ch.slug}`}
                    className={[
                      "flex items-baseline gap-1.5 text-xs px-3 py-1 rounded transition-colors leading-snug no-underline",
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
                    {ch.chapterNum && (
                      <span className="shrink-0 text-[10px] font-mono text-[hsl(160_25%_60%)] w-8 text-right">
                        {ch.chapterNum}
                      </span>
                    )}
                    <span className="truncate">
                      {ch.label.replace(/^[^\s·]+\s*·\s*/, "")}
                    </span>
                  </a>
                ))}
              </div>
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
              Full manuscript · {ALL_CHAPTERS.length} chapters · for reviewer reading
            </p>
          </header>

          {/* Mobile chapter jump-links */}
          <div className="lg:hidden mb-10 flex flex-wrap gap-2">
            {ALL_CHAPTERS.map((ch) => (
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
                {ch.chapterNum ? `${ch.chapterNum}` : ch.label}
              </a>
            ))}
          </div>

          {ALL_CHAPTERS.map((ch, i) => (
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

              {i < ALL_CHAPTERS.length - 1 && (
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
