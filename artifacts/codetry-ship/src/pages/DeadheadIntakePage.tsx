import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  ApiError,
  fetchDeadheadIntake,
  fetchDeadheadLog,
  patchDeadheadItem,
  getStoredOwnerToken,
  setStoredOwnerToken,
  type DeadheadItem,
  type FlushLogEntry,
} from "@/lib/api";

type StatusFilter = "all" | "new" | "reviewed" | "smashed";

export function DeadheadIntakePage() {
  const [, navigate] = useLocation();
  const token = getStoredOwnerToken() ?? "";

  useEffect(() => {
    if (!token) {
      navigate("/sign-on");
    }
  }, [token, navigate]);

  const handleSignOut = () => {
    setStoredOwnerToken(null);
    navigate("/sign-on");
  };

  if (!token) return null;

  return <IntakeView token={token} onSignOut={handleSignOut} />;
}

function IntakeView({ token, onSignOut }: { token: string; onSignOut: () => void }) {
  const [, navigate] = useLocation();
  const [items, setItems] = useState<DeadheadItem[] | null>(null);
  const [log, setLog] = useState<FlushLogEntry[] | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"items" | "log">("items");

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchDeadheadIntake(token, filter === "all" ? undefined : filter),
      fetchDeadheadLog(token),
    ])
      .then(([intakeRes, logRes]) => {
        setItems(intakeRes.items);
        setLog(logRes.entries);
      })
      .catch((err) => {
        if (err instanceof ApiError) {
          if (err.status === 401) {
            setStoredOwnerToken(null);
            navigate("/sign-on");
          } else {
            setError(err.message);
          }
        } else {
          setError("Failed to load deadhead data.");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await patchDeadheadItem(token, id, status);
      setItems((prev) =>
        prev ? prev.map((i) => (i.id === id ? { ...i, status } : i)) : prev,
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed.");
    }
  };

  const statusCounts = items
    ? {
        new: items.filter((i) => i.status === "new").length,
        reviewed: items.filter((i) => i.status === "reviewed").length,
        smashed: items.filter((i) => i.status === "smashed").length,
      }
    : null;

  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-[64rem] px-6 sm:px-8 py-12 sm:py-16">
        <header
          className="flex flex-wrap items-baseline justify-between gap-4 border-b pb-6"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          <div className="space-y-1">
            <p
              className="font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: "hsl(var(--accent))" }}
            >
              headwaters · deadhead · intake
            </p>
            <h1 className="font-serif text-3xl tracking-tight">
              Deadhead intake
            </h1>
            <p
              className="font-sans text-sm"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Tasks flushed here when the working backlog exceeded 30 proposed
              items. Vet each one: mark reviewed or smash it.
            </p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
            data-testid="button-signout"
          >
            sign out
          </button>
        </header>

        {error ? (
          <p
            role="alert"
            className="mt-6 font-sans text-sm text-destructive"
            data-testid="intake-error"
          >
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex gap-4 border-b" style={{ borderColor: "hsl(var(--card-border))" }}>
          <TabButton active={tab === "items"} onClick={() => setTab("items")}>
            Items{statusCounts ? ` (${statusCounts.new} new)` : ""}
          </TabButton>
          <TabButton active={tab === "log"} onClick={() => setTab("log")}>
            Flush log{log ? ` (${log.length})` : ""}
          </TabButton>
        </div>

        {tab === "items" && (
          <>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {(["all", "new", "reviewed", "smashed"] as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilter(s)}
                  className={[
                    "px-3 py-1 rounded-sm font-mono text-[11px] uppercase tracking-[0.16em] border transition-colors",
                    filter === s
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-current opacity-50 hover:opacity-80",
                  ].join(" ")}
                  data-testid={`filter-${s}`}
                >
                  {s}
                </button>
              ))}
              {statusCounts && (
                <span
                  className="ml-auto font-mono text-[11px]"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {statusCounts.new} new · {statusCounts.reviewed} reviewed · {statusCounts.smashed} smashed
                </span>
              )}
            </div>

            {loading && items === null ? (
              <p className="mt-12 font-serif text-base" style={{ color: "hsl(var(--muted-foreground))" }} data-testid="intake-loading">
                loading…
              </p>
            ) : null}

            {items && items.length === 0 ? (
              <p
                className="mt-12 font-serif text-lg"
                style={{ color: "hsl(var(--muted-foreground))" }}
                data-testid="intake-empty"
              >
                No items in the intake queue{filter !== "all" ? ` with status "${filter}"` : ""}.
              </p>
            ) : null}

            {items && items.length > 0 ? (
              <ul
                className="mt-8 divide-y"
                style={{ borderColor: "hsl(var(--card-border))" }}
                data-testid="intake-list"
              >
                {items.map((item) => (
                  <IntakeRow
                    key={item.id}
                    item={item}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </ul>
            ) : null}
          </>
        )}

        {tab === "log" && (
          <>
            {log && log.length === 0 ? (
              <p
                className="mt-12 font-serif text-lg"
                style={{ color: "hsl(var(--muted-foreground))" }}
                data-testid="log-empty"
              >
                No flushes have been recorded yet.
              </p>
            ) : null}

            {log && log.length > 0 ? (
              <ul
                className="mt-8 divide-y"
                style={{ borderColor: "hsl(var(--card-border))" }}
                data-testid="flush-log-list"
              >
                {log.map((entry) => (
                  <li key={entry.id} className="py-4" data-testid={`log-entry-${entry.id}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-4">
                      <div className="space-y-0.5">
                        <p className="font-serif text-base">
                          {entry.count} task{entry.count === 1 ? "" : "s"} flushed
                        </p>
                        <p
                          className="font-mono text-xs"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          {entry.proposedCountBefore} proposed before flush · batch{" "}
                          {entry.flushBatchId.slice(0, 8)}
                        </p>
                      </div>
                      <p
                        className="font-mono text-[11px] uppercase tracking-[0.16em]"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        {new Date(entry.flushedAt).toISOString().replace("T", " ").slice(0, 19)} UTC
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        )}

        <footer
          className="mt-16 pt-8 border-t"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          <a
            href="./"
            className="signoff underline underline-offset-4 hover:opacity-80"
            data-testid="link-back"
          >
            ← back
          </a>
        </footer>
      </div>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "pb-3 font-mono text-[11px] uppercase tracking-[0.18em] border-b-2 transition-colors",
        active
          ? "border-primary"
          : "border-transparent opacity-50 hover:opacity-80",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function IntakeRow({
  item,
  onStatusChange,
}: {
  item: DeadheadItem;
  onStatusChange: (id: string, status: string) => void;
}) {
  const statusColor =
    item.status === "new"
      ? "hsl(var(--accent))"
      : item.status === "reviewed"
        ? "hsl(var(--primary))"
        : "hsl(var(--muted-foreground))";

  return (
    <li className="py-5" data-testid={`intake-row-${item.id}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-1">
          <p className="font-serif text-base leading-snug">{item.title}</p>
          <p
            className="font-mono text-[11px] flex flex-wrap gap-x-2"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <span
              data-testid={`source-${item.id}`}
              className="px-1.5 py-0.5 rounded-sm border"
              style={{
                borderColor: "hsl(var(--card-border))",
                color:
                  item.source && item.source !== "unknown"
                    ? "hsl(var(--accent))"
                    : "hsl(var(--muted-foreground))",
              }}
              title={item.sourceRef ?? undefined}
            >
              source: {item.source ?? "unknown"}
              {item.sourceRef ? ` · ${item.sourceRef}` : ""}
            </span>
            <span>
              created {new Date(item.originalCreatedAt).toISOString().slice(0, 10)}
              {" · "}flushed {new Date(item.flushedAt).toISOString().slice(0, 10)}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: statusColor }}
            data-testid={`status-${item.id}`}
          >
            {item.status}
          </span>
          {item.status !== "reviewed" && (
            <button
              type="button"
              onClick={() => onStatusChange(item.id, "reviewed")}
              className="px-2 py-1 rounded-sm font-mono text-[10px] uppercase tracking-[0.14em] border hover:opacity-80"
              style={{ borderColor: "hsl(var(--card-border))" }}
              data-testid={`btn-reviewed-${item.id}`}
            >
              reviewed
            </button>
          )}
          {item.status !== "smashed" && (
            <button
              type="button"
              onClick={() => onStatusChange(item.id, "smashed")}
              className="px-2 py-1 rounded-sm font-mono text-[10px] uppercase tracking-[0.14em] border hover:opacity-80"
              style={{ borderColor: "hsl(var(--destructive))", color: "hsl(var(--destructive))" }}
              data-testid={`btn-smashed-${item.id}`}
            >
              smash
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
