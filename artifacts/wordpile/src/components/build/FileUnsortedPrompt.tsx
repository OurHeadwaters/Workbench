import type { Bucket } from "@/data/types";
import { BUCKET_LABELS } from "@/data/types";
import type { UnsortedVerdict } from "@/pages/BuildPage";

interface Props {
  verdict: UnsortedVerdict;
  onFile: (bucket: Bucket) => void;
  onDismiss: () => void;
}

const BUCKET_VERDICT_BLURB: Record<Bucket, string> = {
  load: "It held weight like Load-bearing.",
  interior: "It sat on top like Interior.",
  avoid: "It cracked like Avoid.",
  unsorted: "",
};

const FILE_OPTIONS: Bucket[] = ["load", "interior", "avoid"];

/**
 * Bottom-of-page prompt that appears after an Unsorted ("untreated lumber")
 * word lands in any prototype. The kid can one-tap it into a real bucket;
 * the action goes through the existing store so it cloud-syncs like every
 * other edit.
 */
export function FileUnsortedPrompt({ verdict, onFile, onDismiss }: Props) {
  return (
    <div
      className="build-name-test"
      role="dialog"
      aria-label="File this word"
      data-testid="panel-file-unsorted"
    >
      <div className="build-name-test-body">
        <p className="eyebrow mb-1">Name test</p>
        <p className="text-base">
          <span className="timber" data-testid="text-file-unsorted-word">
            {verdict.word}
          </span>{" "}
          was untreated.{" "}
          <span style={{ color: "var(--color-stone)" }}>
            {BUCKET_VERDICT_BLURB[verdict.suggested]} File it in the pile?
          </span>
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {FILE_OPTIONS.map((b) => (
            <button
              key={b}
              className={`btn-secondary ${b === verdict.suggested ? "is-suggested" : ""}`}
              onClick={() => onFile(b)}
              data-testid={`button-file-unsorted-${b}`}
            >
              {BUCKET_LABELS[b]}
              {b === verdict.suggested && (
                <span className="ml-1 eyebrow" style={{ opacity: 0.7 }}>
                  · suggested
                </span>
              )}
            </button>
          ))}
          <button
            className="btn-ghost"
            onClick={onDismiss}
            data-testid="button-file-unsorted-skip"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
