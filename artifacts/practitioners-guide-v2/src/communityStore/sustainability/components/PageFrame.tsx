import type { ReactNode } from "react";

export function PageFrame({
  eyebrow,
  title,
  italic,
  standfirst,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  italic?: ReactNode;
  standfirst?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="w-full" style={{ background: "var(--cs-bg)" }}>
      <div className="mx-auto max-w-[36rem] px-6 pt-8 pb-10 flex flex-col">
        <div
          className="mono text-[11px] uppercase tracking-[0.22em] mb-3"
          style={{ color: "var(--cs-accent-warm)" }}
        >
          {eyebrow}
        </div>
        <h1
          className="serif font-medium text-[30px] sm:text-[34px] leading-[1.1]"
          style={{ color: "var(--cs-primary)", textWrap: "balance" } as React.CSSProperties}
        >
          {title}
          {italic && (
            <span
              className="italic font-normal block mt-2"
              style={{ color: "var(--cs-accent-warm)" }}
            >
              {italic}
            </span>
          )}
        </h1>
        {standfirst && (
          <p
            className="serif text-[18px] leading-[1.55] mt-5 max-w-md"
            style={{ color: "var(--cs-text)" }}
          >
            {standfirst}
          </p>
        )}
        <div className="mt-7 space-y-3">{children}</div>
      </div>
    </section>
  );
}

export function Card({
  tag,
  head,
  body,
  children,
}: {
  tag?: ReactNode;
  head?: ReactNode;
  body?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-4 border"
      style={{ background: "var(--cs-paper)", borderColor: "var(--cs-rule)" }}
    >
      {tag && (
        <div
          className="mono text-[10.5px] uppercase tracking-[0.18em] mb-1.5"
          style={{ color: "var(--cs-accent-warm)" }}
        >
          {tag}
        </div>
      )}
      {head && (
        <div
          className="serif text-[18px] leading-[1.3] font-semibold"
          style={{ color: "var(--cs-primary)" }}
        >
          {head}
        </div>
      )}
      {body && (
        <div
          className="serif text-[15.5px] leading-[1.5] mt-1.5"
          style={{ color: "var(--cs-text)" }}
        >
          {body}
        </div>
      )}
      {children && (
        <div
          className="serif text-[15.5px] leading-[1.5] mt-2 space-y-2"
          style={{ color: "var(--cs-text)" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function HonestyNote({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        background: "rgba(184,90,62,0.06)",
        borderColor: "rgba(184,90,62,0.30)",
        borderStyle: "dashed",
      }}
    >
      <div
        className="mono text-[10.5px] uppercase tracking-[0.18em] mb-1.5"
        style={{ color: "var(--cs-accent-warm)" }}
      >
        We don&rsquo;t know this yet
      </div>
      <div
        className="serif text-[15px] leading-[1.5]"
        style={{ color: "var(--cs-text)" }}
      >
        {children}
      </div>
    </div>
  );
}
