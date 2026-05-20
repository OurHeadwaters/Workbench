import { Lock, BookOpen } from "lucide-react";
import { courseModules } from "@/data/courseModules";

interface LockedPreviewProps {
  onSignIn: () => void;
}

export function LockedPreview({ onSignIn }: LockedPreviewProps) {
  return (
    <div className="min-h-dvh" style={{ backgroundColor: "var(--cream)" }}>
      {/* Header */}
      <header
        className="border-b px-4 py-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--cream)" }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={20} color="var(--accent)" />
            <span
              className="text-lg font-semibold"
              style={{ fontFamily: "var(--font-serif)", color: "var(--warm-brown)" }}
            >
              Field Guide Finance
            </span>
          </div>
          <button
            onClick={onSignIn}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: "var(--accent)", color: "white" }}
          >
            Sign in
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-10 max-w-2xl">
          <div
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full mb-4"
            style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}
          >
            <Lock size={11} />
            807 Benefits premium member course
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-4 leading-snug"
            style={{ fontFamily: "var(--font-serif)", color: "var(--warm-brown)" }}
          >
            Field Guide Finance
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "var(--mid-brown)" }}>
            Practical financial literacy for food entrepreneurs and co-op members in Northwestern Ontario.
            Written from the field — with Bobbie Parr's Parrs Jars story as the anchor — so every lesson
            connects to a reality you recognize.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Module list */}
          <div className="lg:col-span-2">
            <h2
              className="text-sm font-semibold uppercase tracking-wide mb-4"
              style={{ color: "var(--mid-brown)" }}
            >
              What's inside
            </h2>
            <div className="space-y-3">
              {courseModules.map((mod, i) => (
                <div
                  key={mod.id}
                  className="rounded-xl border p-4 relative overflow-hidden"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: i === 0 ? "white" : "var(--cream-dark)",
                    opacity: i > 0 ? 0.75 : 1,
                  }}
                >
                  {i > 0 && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backdropFilter: "blur(1px)" }}
                    >
                      <Lock size={16} color="var(--light-brown)" />
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
                      style={{
                        backgroundColor: i === 0 ? "var(--accent)" : "var(--border)",
                        color: i === 0 ? "white" : "var(--mid-brown)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p
                        className="font-medium text-sm mb-0.5"
                        style={{ color: "var(--warm-brown)", fontFamily: "var(--font-serif)" }}
                      >
                        {mod.title}
                      </p>
                      {i === 0 && (
                        <p className="text-xs leading-relaxed" style={{ color: "var(--mid-brown)" }}>
                          {mod.description}
                        </p>
                      )}
                      <p className="text-xs mt-1" style={{ color: "var(--light-brown)" }}>
                        {mod.lessons.length} lesson{mod.lessons.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div className="lg:col-span-1">
            <div
              className="rounded-2xl border p-6 sticky top-6"
              style={{ borderColor: "var(--border)", backgroundColor: "white" }}
            >
              {/* Video thumbnail */}
              <div
                className="relative rounded-xl overflow-hidden mb-4"
                style={{ paddingBottom: "56.25%", backgroundColor: "var(--cream-dark)" }}
              >
                <img
                  src="https://img.youtube.com/vi/XWsaayAuH-Q/hqdefault.jpg"
                  alt="807 Grows — Bobbie Parr / Parrs Jars"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                  >
                    <span className="text-white text-sm ml-0.5">▶</span>
                  </div>
                </div>
              </div>

              <p className="text-xs mb-1" style={{ color: "var(--light-brown)" }}>
                Featured in Module 1
              </p>
              <p
                className="text-sm font-medium mb-4"
                style={{ color: "var(--warm-brown)", fontFamily: "var(--font-serif)" }}
              >
                807 Grows — Bobbie Parr &amp; Parrs Jars
              </p>

              <button
                onClick={onSignIn}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-colors mb-3"
                style={{ backgroundColor: "var(--accent)", color: "white" }}
              >
                Sign in to start learning
              </button>

              <p className="text-xs text-center" style={{ color: "var(--light-brown)" }}>
                Available to Harvest and Pro tier members of 807 Benefits.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
