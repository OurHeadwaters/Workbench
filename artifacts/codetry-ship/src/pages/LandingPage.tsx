export function LandingPage() {
  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center px-6"
      style={{ background: "hsl(145 36% 18%)", color: "hsl(38 36% 96%)" }}
      data-testid="landing-page"
    >
      <div className="text-center max-w-sm">
        <img
          src={`${import.meta.env.BASE_URL}headwaters-logo.svg`}
          alt="Headwaters — Northwestern Ontario"
          className="mx-auto mb-10 w-full max-w-[220px] opacity-90"
        />
        <h1
          className="font-serif text-3xl sm:text-4xl leading-snug tracking-tight mb-4"
          data-testid="landing-title"
        >
          Coming soon.
        </h1>
        <p
          className="font-serif text-base italic opacity-60"
          data-testid="landing-tagline"
        >
          ourheadwaters.ca
        </p>
      </div>
    </main>
  );
}
