import { useState } from "react";
import { courseModules, type Module, type Lesson } from "@/data/courseModules";
import { CheckCircle, ChevronDown, ChevronRight, X } from "lucide-react";
import { ModuleIcon } from "@/components/NorthernIcons";
import { RadialProgress } from "@/components/RadialProgress";

const MODULE_COLORS: Record<string, { dot: string; bg: string; icon: string }> = {
  m1: { dot: "#4a7c5f", bg: "#eef5f0", icon: "#2d5a40" },
  m2: { dot: "#c97d2e", bg: "#fdf3e3", icon: "#7a4a10" },
  m3: { dot: "#6fa8c2", bg: "#e8f4f9", icon: "#2d5070" },
  m4: { dot: "#4a7c5f", bg: "#eef5f0", icon: "#1b3a2d" },
  m5: { dot: "#c97d2e", bg: "#fdf3e3", icon: "#5c3d1e" },
};

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
  const colors = MODULE_COLORS[module.id] ?? MODULE_COLORS["m1"];
  const completedCount = module.lessons.filter((l) => visitedIds.has(l.id)).length;

  return (
    <div style={{ borderRadius: 10, overflow: "hidden", marginBottom: 2 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "9px 10px",
          textAlign: "left",
          backgroundColor: isActive ? colors.bg : "transparent",
          border: "none",
          cursor: "pointer",
          borderRadius: 10,
          transition: "background-color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--cream-dark)";
        }}
        onMouseLeave={(e) => {
          if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
        }}
      >
        {/* Module icon */}
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            backgroundColor: isActive ? colors.dot : "var(--cream-dark)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background-color 0.15s ease",
          }}
        >
          <ModuleIcon moduleId={module.id} size={16} color={isActive ? "white" : "var(--bark-light)"} />
        </span>

        <span
          style={{
            flex: 1,
            fontSize: "0.78rem",
            fontWeight: isActive ? 600 : 500,
            lineHeight: 1.3,
            color: isActive ? colors.icon : "var(--bark)",
            fontFamily: "var(--font-serif)",
          }}
        >
          {module.title}
        </span>

        <span style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          {completedCount > 0 && completedCount < module.lessons.length && (
            <span style={{ fontSize: "0.6rem", color: colors.dot, fontWeight: 700 }}>
              {completedCount}/{module.lessons.length}
            </span>
          )}
          {completedCount === module.lessons.length && module.lessons.length > 0 && (
            <CheckCircle size={13} color={colors.dot} />
          )}
          <span style={{ color: "var(--bark-light)" }}>
            {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </span>
        </span>
      </button>

      {open && (
        <div style={{ paddingLeft: 40, paddingBottom: 4 }}>
          {module.lessons.map((lesson: Lesson) => {
            const isLessonActive = lesson.id === activeLessonId;
            const visited = visitedIds.has(lesson.id);
            return (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(module.id, lesson.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  padding: "6px 8px",
                  borderRadius: 8,
                  textAlign: "left",
                  backgroundColor: isLessonActive ? colors.bg : "transparent",
                  border: isLessonActive ? `1px solid ${colors.dot}22` : "1px solid transparent",
                  cursor: "pointer",
                  transition: "background-color 0.12s ease",
                  marginBottom: 1,
                }}
                onMouseEnter={(e) => {
                  if (!isLessonActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--cream-dark)";
                }}
                onMouseLeave={(e) => {
                  if (!isLessonActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                <span style={{ marginTop: 2, flexShrink: 0 }}>
                  {visited ? (
                    <CheckCircle size={12} color={colors.dot} />
                  ) : (
                    <span
                      style={{
                        display: "inline-block",
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        border: `1.5px solid ${isLessonActive ? colors.dot : "var(--border)"}`,
                        backgroundColor: isLessonActive ? `${colors.dot}22` : "transparent",
                      }}
                    />
                  )}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    lineHeight: 1.4,
                    color: isLessonActive ? colors.icon : visited ? "var(--bark-light)" : "var(--bark)",
                    fontWeight: isLessonActive ? 600 : 400,
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
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div
        style={{
          padding: "16px 14px 14px",
          borderBottom: "1px solid var(--border-light)",
          backgroundColor: "var(--parchment)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span
            className="section-label"
          >
            Trail Progress
          </span>
          <RadialProgress progress={progress} size={46} label={`Course progress: ${progress}%`} />
        </div>

        {/* Progress bar with river-flow aesthetic */}
        <div style={{ marginBottom: 6 }}>
          <div
            style={{
              height: 5,
              borderRadius: 10,
              backgroundColor: "var(--cream-dark)",
              overflow: "hidden",
              position: "relative",
            }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${visitedIds.size} of ${totalLessons} lessons complete`}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                borderRadius: 10,
                background: "linear-gradient(90deg, var(--forest-light) 0%, var(--amber) 100%)",
                transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
                position: "relative",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: "0.67rem", color: "var(--bark-light)" }}>
              {visitedIds.size} of {totalLessons} lessons
            </span>
          </div>
        </div>
      </div>

      {/* Module list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px 12px" }}>
        <p className="section-label" style={{ padding: "4px 6px 10px" }}>
          Course Chapters
        </p>
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

      {/* Northern landscape footer */}
      <div
        aria-hidden="true"
        style={{ borderTop: "1px solid var(--border-light)", padding: "8px 0 0", overflow: "hidden" }}
      >
        <svg width="100%" height="32" viewBox="0 0 288 32" fill="none" preserveAspectRatio="none">
          <path d="M0 28 Q24 16 48 22 Q72 28 96 18 Q120 8 144 20 Q168 30 192 16 Q216 4 240 18 Q264 28 288 22 L288 32 L0 32Z" fill="var(--forest)" opacity="0.12"/>
          <path d="M0 30 Q36 24 72 28 Q108 30 144 26 Q180 22 216 28 Q252 32 288 28 L288 32 L0 32Z" fill="var(--moss)" opacity="0.08"/>
        </svg>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        style={{
          display: "none",
          flexDirection: "column",
          width: 272,
          flexShrink: 0,
          borderRight: "1px solid var(--border-light)",
          height: "100%",
          overflow: "hidden",
          backgroundColor: "var(--cream)",
          position: "relative",
        }}
        className="lg-sidebar"
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 50 }}
          role="dialog"
          aria-label="Course chapters"
          aria-modal="true"
        >
          <div
            style={{ position: "absolute", inset: 0, backgroundColor: "rgba(27,58,45,0.45)" }}
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <aside
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 284,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              backgroundColor: "var(--cream)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderBottom: "1px solid var(--border-light)",
                backgroundColor: "var(--parchment)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 19.5 C4 18.1 5.1 17 6.5 17 L20 17" stroke="var(--forest)" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M6.5 2 L20 2 L20 22 L6.5 22 C5.1 22 4 20.9 4 19.5 L4 4.5 C4 3.1 5.1 2 6.5 2Z" stroke="var(--forest)" strokeWidth="1.8" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: "0.92rem", color: "var(--forest)" }}>
                  Field Guide Finance
                </span>
              </div>
              <button
                onClick={onMobileClose}
                style={{ padding: 6, borderRadius: 8, background: "none", border: "none", cursor: "pointer", color: "var(--bark-light)" }}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      <style>{`
        @media (min-width: 1024px) {
          .lg-sidebar { display: flex !important; }
        }
      `}</style>
    </>
  );
}
