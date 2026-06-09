export function WatershedRibbon() {
  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

  const links = [
    { label: "Headwaters Kits", href: `${base}/headwaters/products` },
    { label: "The Handbook",    href: "/codetry-handbook/" },
    { label: "The Accounts",    href: "/headwaters-books/" },
    { label: "Research Library",href: "/library/" },
  ];

  return (
    <div
      style={{
        background: "#0a130e",
        borderTop: "1px solid rgba(212,160,23,0.18)",
      }}
      data-testid="watershed-ribbon"
    >
      <div className="mx-auto max-w-[64rem] px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <span
          className="font-mono text-[8px] uppercase tracking-[0.28em] shrink-0"
          style={{ color: "rgba(212,160,23,0.50)" }}
        >
          Watershed Kit
        </span>
        <div className="flex flex-wrap items-center gap-4">
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-mono text-[9px] uppercase tracking-[0.18em] transition-opacity hover:opacity-100"
              style={{ color: "rgba(212,160,23,0.65)" }}
            >
              {label} →
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
