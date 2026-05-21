import { useState, useEffect, useRef } from "react";
import { useClerk } from "@clerk/react";
import { useLocation } from "wouter";
import { courseModules } from "@/data/courseModules";
import { CourseSidebar } from "@/components/CourseSidebar";
import { LessonView } from "@/components/LessonView";
import { markVisited, getVisitedIds, getProgress } from "@/lib/progress";
import { Menu, LogOut, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { NeighbourhoodBadge } from "@workspace/zone-store";
import { ScrollTrail } from "@/components/ScrollTrail";
import { RavenInline } from "@/components/RavenCompanion";

export function CoursePage() {
  const { signOut } = useClerk();
  const [, navigate] = useLocation();

  const firstModule = courseModules[0]!;
  const firstLesson = firstModule.lessons[0]!;

  const [activeModuleId, setActiveModuleId] = useState(firstModule.id);
  const [activeLessonId, setActiveLessonId] = useState(firstLesson.id);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(getVisitedIds());
  const [mobileOpen, setMobileOpen] = useState(false);

  const mainRef = useRef<HTMLElement>(null);

  const totalLessons = courseModules.reduce((acc, m) => acc + m.lessons.length, 0);
  const progress = getProgress(totalLessons);

  const activeModule = courseModules.find((m) => m.id === activeModuleId) ?? firstModule;
  const activeLesson = activeModule.lessons.find((l) => l.id === activeLessonId) ?? firstLesson;

  useEffect(() => {
    markVisited(activeLessonId);
    setVisitedIds(getVisitedIds());
  }, [activeLessonId]);

  const allLessons = courseModules.flatMap((m) =>
    m.lessons.map((l) => ({ moduleId: m.id, lessonId: l.id })),
  );
  const currentIndex = allLessons.findIndex((x) => x.lessonId === activeLessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const isFinalLesson = !nextLesson;

  function handleSelectLesson(moduleId: string, lessonId: string) {
    setActiveModuleId(moduleId);
    setActiveLessonId(lessonId);
    setMobileOpen(false);
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        backgroundColor: "var(--cream)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* ─── Top bar ─── */}
      <header
        style={{
          flexShrink: 0,
          borderBottom: "1px solid var(--border-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          height: 52,
          zIndex: 10,
          backgroundColor: "var(--parchment)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open chapters"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 6,
              borderRadius: 8,
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "var(--bark-light)",
            }}
            className="lg-hide"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 19.5 C4 18.1 5.1 17 6.5 17 L20 17" stroke="var(--forest)" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M6.5 2 L20 2 L20 22 L6.5 22 C5.1 22 4 20.9 4 19.5 L4 4.5 C4 3.1 5.1 2 6.5 2Z" stroke="var(--forest)" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M8 7 L16 7 M8 11 L14 11" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "var(--forest)",
              }}
              className="sm-show"
            >
              Field Guide Finance
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <NeighbourhoodBadge zoneId={2} />
          <span
            style={{ fontSize: "0.75rem", color: "var(--bark-light)", fontWeight: 500 }}
            className="sm-show"
            aria-label={`Course progress: ${progress}%`}
          >
            {progress}% complete
          </span>

          {/* Inline progress bar */}
          <div
            className="sm-show"
            style={{ width: 80, height: 4, borderRadius: 4, backgroundColor: "var(--cream-dark)", overflow: "hidden" }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-hidden="true"
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                borderRadius: 4,
                background: "linear-gradient(90deg, var(--forest-light), var(--amber))",
                transition: "width 0.5s ease",
              }}
            />
          </div>

          <button
            onClick={() => signOut().then(() => navigate("/"))}
            title="Sign out"
            aria-label="Sign out"
            style={{
              padding: 6,
              borderRadius: 8,
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "var(--bark-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* ─── Main content ─── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <CourseSidebar
          activeModuleId={activeModuleId}
          activeLessonId={activeLessonId}
          visitedIds={visitedIds}
          totalLessons={totalLessons}
          progress={progress}
          onSelectLesson={handleSelectLesson}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {/* Content area with scroll trail */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {/* Vertical scroll trail */}
          <ScrollTrail containerRef={mainRef} />

          <main
            ref={mainRef}
            id="main-content"
            tabIndex={-1}
            style={{ flex: 1, height: "100%", overflowY: "auto", position: "relative", paddingLeft: 36 }}
          >
            <LessonView module={activeModule} lesson={activeLesson} />

            {/* Prev / Next navigation */}
            <div
              style={{
                maxWidth: 680,
                margin: "0 auto",
                padding: "0 20px 48px",
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
              }}
            >
              {prevLesson ? (
                <button
                  onClick={() => handleSelectLesson(prevLesson.moduleId, prevLesson.lessonId)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 16px",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--parchment)",
                    fontSize: "0.82rem",
                    color: "var(--bark)",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--amber)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-card)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                  }}
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <button
                  onClick={() => handleSelectLesson(nextLesson.moduleId, nextLesson.lessonId)}
                  className="trail-sign-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 20px",
                    fontSize: "0.86rem",
                    fontWeight: 600,
                    backgroundColor: "var(--forest)",
                    color: "var(--cream)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <RavenInline />
                  Next lesson
                  <ChevronRight size={14} />
                </button>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 18px",
                    borderRadius: 10,
                    backgroundColor: isFinalLesson ? "var(--amber-light)" : "transparent",
                    color: "var(--amber)",
                    fontSize: "0.86rem",
                    fontWeight: 600,
                    border: "1px solid var(--amber-mid)",
                  }}
                >
                  <CheckCircle size={15} />
                  Course complete!
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) { .lg-hide { display: none !important; } }
        @media (max-width: 639px)  { .sm-show { display: none !important; } }
      `}</style>
    </div>
  );
}
