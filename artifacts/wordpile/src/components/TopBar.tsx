import { useLocation, Link } from "wouter";
import { Layers } from "lucide-react";

export function TopBar() {
  const [location] = useLocation();
  const onHome = location === "/";
  return (
    <header
      className="border-b"
      style={{ borderColor: "var(--color-rule)", backgroundColor: "var(--color-cream)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 no-underline"
          style={{ color: "var(--color-ink)" }}
          data-testid="link-home"
        >
          <Layers size={20} strokeWidth={1.6} />
          <div>
            <p className="eyebrow leading-none mb-1">Practitioner tool</p>
            <p
              className="text-xl leading-none"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 600 }}
            >
              Wordpile
            </p>
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          {!onHome && (
            <Link href="/" className="link" data-testid="link-piles">
              All piles
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
