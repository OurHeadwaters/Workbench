import { useCallback, useState } from "react";
import { ChevronDown, Camera } from "lucide-react";
import { EAGLE_PHOTOS, useEaglePhoto, type EaglePhotoId } from "@/hooks/useEaglePhoto";

interface EaglePrologueProps {
  continueId: string;
}

const base = import.meta.env.BASE_URL;

export function EaglePrologue({ continueId }: EaglePrologueProps) {
  const { photoId, setPhotoId, photo } = useEaglePhoto();
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleContinue = useCallback(() => {
    const target = document.getElementById(continueId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [continueId]);

  return (
    <section
      aria-label="Prologue — The eagle answered"
      data-testid="eagle-prologue"
      className="relative w-full min-h-screen overflow-hidden flex flex-col"
      style={{ backgroundColor: "hsl(167 48% 14%)" }}
    >
      <img
        key={photo.filename}
        src={`${base}${photo.filename}`}
        alt={photo.alt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: photo.objectPosition }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,20,50,0.35) 0%, rgba(0,20,50,0.18) 38%, rgba(0,20,50,0.62) 64%, rgba(0,20,50,0.96) 100%)",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full px-6 sm:px-10 pt-12 sm:pt-16 pb-12 sm:pb-16 text-white">
        <div className="flex items-center justify-between text-xs sm:text-sm uppercase tracking-[0.28em] opacity-85">
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: "#e9c8a8" }}
            />
            <span>Prologue · The eagle answered</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline opacity-75">Is this the right direction?</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setPickerOpen((o) => !o)}
                className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/40 rounded px-2 py-1"
                aria-label="Change cover photo"
                data-testid="eagle-photo-picker-toggle"
              >
                <Camera className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Cover photo</span>
              </button>

              {pickerOpen && (
                <div
                  className="absolute right-0 top-full mt-2 flex gap-2 p-2 rounded-xl shadow-2xl"
                  style={{ backgroundColor: "rgba(0,10,30,0.88)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)" }}
                  data-testid="eagle-photo-picker"
                >
                  {EAGLE_PHOTOS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPhotoId(p.id as EaglePhotoId);
                        setPickerOpen(false);
                      }}
                      className="flex flex-col items-center gap-1 group focus:outline-none"
                      aria-label={`Use ${p.label} photo`}
                      data-testid={`eagle-photo-option-${p.id}`}
                    >
                      <div
                        className="w-20 h-12 rounded-lg overflow-hidden transition-all"
                        style={{
                          outline: photoId === p.id ? "2px solid #e9c8a8" : "2px solid transparent",
                          outlineOffset: "2px",
                        }}
                      >
                        <img
                          src={`${base}${p.filename}`}
                          alt={p.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          style={{ objectPosition: p.objectPosition }}
                        />
                      </div>
                      <span
                        className="text-[10px] uppercase tracking-wider"
                        style={{ color: photoId === p.id ? "#e9c8a8" : "rgba(255,255,255,0.6)" }}
                      >
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-12 sm:mt-0">
          <div
            className="space-y-5 text-lg sm:text-xl md:text-2xl leading-relaxed opacity-95"
            style={{ fontFamily: "var(--app-font-serif)", textWrap: "balance" }}
          >
            <p>
              I was drafting this plan standing out on my deck, observing nature, and I asked myself:{" "}
              <span className="italic" style={{ color: "#e9c8a8" }}>
                is this the right direction?
              </span>
            </p>
            <p>
              At that moment an eagle appeared overhead. I said, "well hello!" — and he lowered with force, and slowly stayed above me.
            </p>
            <p>
              I asked again, this time to him:{" "}
              <span className="italic" style={{ color: "#e9c8a8" }}>
                is this the right direction?
              </span>
            </p>
            <p>He soared in a circle formation, then flew out of sight.</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 mt-12 sm:mt-0">
          <div
            className="h-px w-24"
            style={{ backgroundColor: "rgba(255,255,255,0.45)" }}
          />
          <div
            className="italic text-base sm:text-lg text-center"
            style={{ fontFamily: "var(--app-font-serif)", color: "#e9c8a8" }}
          >
            The story that sealed Headwaters' fate.
          </div>
          <button
            type="button"
            onClick={handleContinue}
            className="group mt-4 inline-flex flex-col items-center gap-1 text-xs uppercase tracking-[0.28em] opacity-80 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/40 rounded px-3 py-2"
            data-testid="prologue-continue"
            aria-label="Continue past the prologue"
          >
            <span>Continue</span>
            <ChevronDown className="h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
