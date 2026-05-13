export function LandingPage() {
  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center px-6"
      style={{ background: "hsl(145 36% 18%)", color: "hsl(38 36% 96%)" }}
      data-testid="landing-page"
    >
      <div className="text-center max-w-sm">
        <div className="mx-auto mb-10 flex items-center justify-center" style={{ width: 100, height: 100, borderRadius: "50%", border: "2px solid rgba(210,175,90,0.75)" }}>
          <img
            src={`${import.meta.env.BASE_URL}eagle-halo.png`}
            alt="Headwaters — Northwestern Ontario"
            style={{ width: 70, height: 70, objectFit: "contain" }}
          />
        </div>
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
