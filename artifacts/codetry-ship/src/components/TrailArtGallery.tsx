import { useState } from "react";

export interface TrailArtwork {
  src: string;
  alt: string;
  title: string;
  artist: string;
  location?: string;
  nation?: string;
  xrplAddress?: string | null;
  isGenerated?: boolean;
}

interface TrailArtGalleryProps {
  artworks?: TrailArtwork[];
}

const DEFAULT_ARTWORKS: TrailArtwork[] = [
  {
    src: "/odyssey/artists/sophie-tree-watercolor.jpg",
    alt: "Looking up through the branches — watercolour by Sophie",
    title: "Looking up through the branches",
    artist: "Sophie",
    location: "Sioux Lookout, Ontario",
    nation: "Anishinaabe",
    xrplAddress: null,
    isGenerated: false,
  },
];

export function TrailArtGallery({ artworks = DEFAULT_ARTWORKS }: TrailArtGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [tipOpen, setTipOpen] = useState(false);

  if (!artworks.length) return null;

  const art = artworks[current];
  const total = artworks.length;

  return (
    <section
      className="w-full"
      style={{ borderBottom: "1px solid rgba(31,61,46,0.10)" }}
      data-testid="trail-art-gallery"
      aria-label="Community trail art"
    >
      {/* ── Eyebrow ── */}
      <div
        className="flex items-center justify-between px-6 sm:px-8 py-2"
        style={{
          background: "rgba(31,61,46,0.04)",
          borderBottom: "1px solid rgba(31,61,46,0.08)",
        }}
      >
        <span
          className="font-mono text-[11px] uppercase tracking-[0.22em]"
          style={{ color: "rgba(31,61,46,0.42)" }}
        >
          Pebbles left on the trail
        </span>
        <span
          className="font-mono text-[11px] uppercase tracking-[0.14em]"
          style={{ color: "rgba(31,61,46,0.3)" }}
        >
          {current + 1} of {total}
        </span>
      </div>

      {/* ── Image ── */}
      <div className="relative w-full overflow-hidden" style={{ maxHeight: 440 }}>
        <img
          src={art.src}
          alt={art.alt}
          className="w-full object-cover transition-opacity duration-500" loading="lazy"
          style={{ maxHeight: 440, objectPosition: "center 30%" }}
          key={art.src}
        />

        {/* attribution overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 px-6 sm:px-8 pb-5 pt-20"
          style={{
            background:
              "linear-gradient(to top, rgba(18,38,28,0.90) 0%, rgba(18,38,28,0.4) 60%, transparent 100%)",
          }}
        >
          <p
            className="font-serif text-[15px] italic mb-1 leading-snug"
            style={{ color: "#f4ede0" }}
          >
            {art.title}
          </p>
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <div>
              <span
                className="font-mono text-[12px] uppercase tracking-[0.22em]"
                style={{ color: "rgba(212,160,23,0.95)" }}
              >
                {art.artist}
                {art.location ? ` · ${art.location}` : ""}
              </span>
              {art.nation && (
                <span
                  className="block font-mono text-[11px] uppercase tracking-[0.16em] mt-0.5"
                  style={{ color: "rgba(212,160,23,0.62)" }}
                >
                  {art.nation} artist
                </span>
              )}
            </div>

            {!art.isGenerated && (
              <button
                onClick={() => setTipOpen((o) => !o)}
                className="font-mono text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-sm transition-all"
                style={{
                  background: tipOpen
                    ? "rgba(212,160,23,0.28)"
                    : "rgba(212,160,23,0.14)",
                  color: "rgba(244,237,224,0.88)",
                  border: "1px solid rgba(212,160,23,0.35)",
                }}
                aria-expanded={tipOpen}
              >
                ✦ Tip {art.artist.split(" ")[0]}
              </button>
            )}
          </div>

          {/* XRPL tip panel */}
          {tipOpen && !art.isGenerated && (
            <div
              className="mt-3 px-4 py-3 rounded-sm"
              style={{
                background: "rgba(18,38,28,0.82)",
                border: "1px solid rgba(212,160,23,0.22)",
              }}
            >
              <p
                className="font-serif text-[15px] italic mb-1"
                style={{ color: "#f4ede0" }}
              >
                XRPL community token tipping is coming with the community
                economic engine launch.
              </p>
              <p
                className="font-mono text-[11px] uppercase tracking-[0.16em]"
                style={{ color: "rgba(212,160,23,0.55)" }}
              >
                Each band issues its own token · tips flow directly to artists
              </p>
            </div>
          )}
        </div>

        {/* prev / next arrows — only show when there's more than one */}
        {total > 1 && (
          <>
            <button
              onClick={() => setCurrent((c) => (c - 1 + total) % total)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full transition-opacity hover:opacity-90"
              style={{ background: "rgba(18,38,28,0.55)", color: "#f4ede0" }}
              aria-label="Previous artwork"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrent((c) => (c + 1) % total)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full transition-opacity hover:opacity-90"
              style={{ background: "rgba(18,38,28,0.55)", color: "#f4ede0" }}
              aria-label="Next artwork"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* ── Footer ── */}
      <div
        className="flex items-center justify-between gap-3 flex-wrap px-6 sm:px-8 py-3"
        style={{ background: "rgba(31,61,46,0.03)" }}
      >
        <p
          className="font-serif text-[15px] italic"
          style={{ color: "rgba(31,61,46,0.48)" }}
        >
          Art left along the trail for the next person.
        </p>
        <a
          href="#submit-art"
          className="font-mono text-[11px] uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
          style={{ color: "#b85a3e" }}
        >
          Leave your mark →
        </a>
      </div>
    </section>
  );
}
