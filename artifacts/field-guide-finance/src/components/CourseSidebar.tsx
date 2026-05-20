import { useState } from "react";
import { courseModules, type Module, type Lesson } from "@/data/courseModules";
import { CheckCircle, ChevronDown, ChevronRight, BookOpen, X } from "lucide-react";

interface CourseSidebarProps {
  activeModuleId: string;
  activeLessonId: string;
  visitedIds: Set<string>;
  totalLessons: number;
  progress: number;
  onSelectLesson: (moduleId: string, lessonId: string) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function ModuleItem({
  module,
  activeModuleId,
  activeLessonId,
  visitedIds,
  onSelectLesson,
}: {
  module: Module;
  activeModuleId: string;
  activeLessonId: string;
  visitedIds: Set<string>;
  onSelectLesson: (moduleId: string, lessonId: string) => void;
}) {
  const isActive = module.id === activeModuleId;
  const [open, setOpen] = useState(isActive);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start gap-2 px-3 py-2.5 text-left rounded-lg hover:bg-[#F0E9DD] transition-colors group"
      >
        <span className="mt-0.5 text-[#A8927A] flex-shrink-0">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        <span
          className="text-xs font-medium leading-snug"
          style={{ color: isActive ? "var(--accent)" : "var(--warm-brown)" }}
        >
          {module.title}
        </span>
      </button>

      {open && (
        <div className="ml-5 mt-0.5 mb-1 space-y-0.5">
          {module.lessons.map((lesson: Lesson) => {
            const isLessonActive = lesson.id === activeLessonId;
            const visited = visitedIds.has(lesson.id);
            return (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(module.id, lesson.id)}
                className="w-full flex items-start gap-2 px-2 py-1.5 rounded-md text-left hover:bg-[#F0E9DD] transition-colors"
                style={{
                  backgroundColor: isLessonActive ? "#F5E8E0" : undefined,
                }}
              >
                <span className="mt-0.5 flex-shrink-0">
                  {visited ? (
                    <CheckCircle size={12} color="var(--accent)" />
                  ) : (
                    <span
                      className="inline-block w-3 h-3 rounded-full border"
                      style={{
                        borderColor: isLessonActive ? "var(--accent)" : "var(--light-brown)",
                        backgroundColor: isLessonActive ? "var(--accent-light)" : "transparent",
                      }}
                    />
                  )}
                </span>
                <span
                  className="text-xs leading-snug"
                  style={{
                    color: isLessonActive
                      ? "var(--accent)"
                      : visited
                      ? "var(--mid-brown)"
                      : "var(--warm-brown)",
                    fontWeight: isLessonActive ? 500 : 400,
                  }}
                >
                  {lesson.title}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CourseSidebar({
  activeModuleId,
  activeLessonId,
  visitedIds,
  totalLessons,
  progress,
  onSelectLesson,
  mobileOpen,
  onMobileClose,
}: CourseSidebarProps) {
  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} color="var(--accent)" />
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--mid-brown)" }}>
            Course Chapters
          </span>
        </div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs" style={{ color: "var(--mid-brown)" }}>
            {visitedIds.size} of {totalLessons} lessons
          </span>
          <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>
            {progress}%
          </span>
        </div>
        <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: "var(--accent)" }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {courseModules.map((mod) => (
          <ModuleItem
            key={mod.id}
            module={mod}
            activeModuleId={activeModuleId}
            activeLessonId={activeLessonId}
            visitedIds={visitedIds}
            onSelectLesson={onSelectLesson}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-72 flex-shrink-0 border-r h-full overflow-hidden"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--cream)" }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onMobileClose}
          />
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 flex flex-col overflow-hidden"
            style={{ backgroundColor: "var(--cream)" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
              <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
                Field Guide Finance
              </span>
              <button onClick={onMobileClose} className="p-1 rounded hover:bg-[#F0E9DD]">
                <X size={18} color="var(--mid-brown)" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
