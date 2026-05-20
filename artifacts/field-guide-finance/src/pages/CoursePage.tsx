import { useState, useEffect } from "react";
import { useClerk } from "@clerk/react";
import { useLocation } from "wouter";
import { courseModules } from "@/data/courseModules";
import { CourseSidebar } from "@/components/CourseSidebar";
import { LessonView } from "@/components/LessonView";
import { markVisited, getVisitedIds, getProgress } from "@/lib/progress";
import { BookOpen, Menu, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { NeighbourhoodBadge } from "@/components/NeighbourhoodBadge";

export function CoursePage() {
  const { signOut } = useClerk();
  const [, navigate] = useLocation();

  const firstModule = courseModules[0]!;
  const firstLesson = firstModule.lessons[0]!;

  const [activeModuleId, setActiveModuleId] = useState(firstModule.id);
  const [activeLessonId, setActiveLessonId] = useState(firstLesson.id);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(getVisitedIds());
  const [mobileOpen, setMobileOpen] = useState(false);

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

  function handleSelectLesson(moduleId: string, lessonId: string) {
    setActiveModuleId(moduleId);
    setActiveLessonId(lessonId);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex flex-col h-dvh" style={{ backgroundColor: "var(--cream)" }}>
      {/* Top bar */}
      <header
        className="flex-shrink-0 border-b flex items-center justify-between px-4 h-14 z-10"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--cream)" }}
      >
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-[#F0E9DD]"
            onClick={() => setMobileOpen(true)}
            aria-label="Open chapters"
          >
            <Menu size={20} color="var(--mid-brown)" />
          </button>
          <div className="flex items-center gap-2">
            <BookOpen size={18} color="var(--accent)" />
            <span
              className="font-semibold text-sm hidden sm:block"
              style={{ fontFamily: "var(--font-serif)", color: "var(--warm-brown)" }}
            >
              Field Guide Finance
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NeighbourhoodBadge zoneId={2} />
          <span className="text-xs hidden sm:block" style={{ color: "var(--mid-brown)" }}>
            {progress}% complete
          </span>
          <div
            className="hidden sm:block w-24 h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--border)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: "var(--accent)" }}
            />
          </div>
          <button
            onClick={() => signOut().then(() => navigate("/"))}
            className="p-1.5 rounded-lg hover:bg-[#F0E9DD] transition-colors"
            title="Sign out"
          >
            <LogOut size={16} color="var(--mid-brown)" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
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

        <main className="flex-1 overflow-y-auto">
          <LessonView module={activeModule} lesson={activeLesson} />

          {/* Prev / Next navigation */}
          <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-12 flex justify-between gap-4">
            {prevLesson ? (
              <button
                onClick={() => handleSelectLesson(prevLesson.moduleId, prevLesson.lessonId)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-colors hover:border-[#C7613B]"
                style={{ borderColor: "var(--border)", color: "var(--mid-brown)" }}
              >
                <ChevronLeft size={15} />
                Previous
              </button>
            ) : (
              <div />
            )}
            {nextLesson ? (
              <button
                onClick={() => handleSelectLesson(nextLesson.moduleId, nextLesson.lessonId)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ backgroundColor: "var(--accent)", color: "white" }}
              >
                Next lesson
                <ChevronRight size={15} />
              </button>
            ) : (
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}
              >
                Course complete!
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
