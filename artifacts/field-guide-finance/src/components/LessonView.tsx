import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Module, Lesson } from "@/data/courseModules";

interface LessonViewProps {
  module: Module;
  lesson: Lesson;
}

function YouTubeEmbed({ url }: { url: string }) {
  const videoId = url.includes("v=")
    ? url.split("v=")[1]?.split("&")[0]
    : url.split("/").pop()?.split("?")[0];

  if (!videoId) return null;

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden mb-8 shadow-sm"
      style={{ paddingBottom: "56.25%", height: 0 }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Course video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        style={{ border: 0 }}
      />
    </div>
  );
}

export function LessonView({ module, lesson }: LessonViewProps) {
  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-16">
      <div className="mb-2">
        <span className="text-xs uppercase tracking-widest" style={{ color: "var(--light-brown)" }}>
          {module.title}
        </span>
      </div>

      <h1
        className="text-2xl sm:text-3xl mb-6 leading-snug"
        style={{ fontFamily: "var(--font-serif)", color: "var(--warm-brown)", fontWeight: 600 }}
      >
        {lesson.title}
      </h1>

      {lesson.videoUrl && <YouTubeEmbed url={lesson.videoUrl} />}

      <div className="prose-course">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table
                  className="min-w-full text-sm rounded-lg overflow-hidden"
                  style={{ borderCollapse: "collapse", border: "1px solid var(--border)" }}
                >
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th
                className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide"
                style={{
                  backgroundColor: "var(--cream-dark)",
                  borderBottom: "1px solid var(--border)",
                  color: "var(--mid-brown)",
                }}
              >
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td
                className="px-4 py-2"
                style={{
                  borderBottom: "1px solid var(--border)",
                  color: "var(--warm-brown)",
                }}
              >
                {children}
              </td>
            ),
          }}
        >
          {lesson.body}
        </ReactMarkdown>
      </div>
    </article>
  );
}
