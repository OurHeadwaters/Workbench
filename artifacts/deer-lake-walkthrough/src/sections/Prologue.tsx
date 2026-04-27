const base = import.meta.env.BASE_URL;

/**
 * Prologue — full-bleed eagle, four short stanzas, no chrome interruption.
 * Same prologue that sits at the top of the operational deck and the
 * Practitioner Operating Plan; this is the phone version.
 */
export default function Prologue() {
  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: "var(--color-primary)" }}
    >
      <img
        src={`${base}eagle-prologue.png`}
        alt="A bald eagle soaring against a pale boreal sky, a quiet circular flight arc traced behind it"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center 30%" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,46,38,0.20) 0%, rgba(20,46,38,0.05) 38%, rgba(20,46,38,0.55) 64%, rgba(20,46,38,0.96) 100%)",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col justify-end px-7 pb-24 pt-20 text-[var(--color-bg)]">
        <div
          className="serif text-[19px] sm:text-[21px] leading-[1.6] space-y-4 max-w-md"
          style={{ textWrap: "balance" }}
        >
          <p>
            I was writing this plan out on my deck, watching nature. I asked
            myself a question:{" "}
            <span className="italic" style={{ color: "var(--color-accent)" }}>
              is this the right direction?
            </span>
          </p>
          <p>
            At that moment an eagle appeared above me. I said, "well hello!"
            He came down low and stayed above me.
          </p>
          <p>
            I asked again, this time to him:{" "}
            <span className="italic" style={{ color: "var(--color-accent)" }}>
              is this the right direction?
            </span>
          </p>
          <p>He flew in a slow circle. Then he flew out of sight.</p>
        </div>

        <div className="mt-7 max-w-md">
          <div
            className="h-px w-16 mb-3"
            style={{ background: "rgba(244,237,224,0.5)" }}
          />
          <div
            className="serif italic text-[16px]"
            style={{ color: "var(--color-accent)" }}
          >
            The story that sealed Headwaters' fate.
          </div>
        </div>
      </div>
    </div>
  );
}
