import { BookOpen } from 'lucide-react';

export default function Reference() {
  return (
    <div className="relative z-10 w-full">
      {/* Decorative top border */}
      <div className="h-1.5 w-full bg-primary" />
      
      {/* Header */}
      <header className="pt-24 pb-16 md:pt-32 md:pb-20 px-6 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-3 mb-8 text-primary tracking-[0.2em] uppercase text-xs font-semibold">
          <div className="w-12 h-[1px] bg-primary/40"></div>
          <BookOpen className="w-4 h-4" />
          Doctrine Instrument
          <div className="w-12 h-[1px] bg-primary/40"></div>
        </div>
        
        <h1 className="font-serif text-6xl md:text-8xl font-bold mb-6 tracking-tight text-foreground">
          The Logic
        </h1>
        
        <p className="text-xl md:text-3xl text-muted-foreground font-serif italic max-w-xl font-light">
          Zone 5 Doctrine Instruments
        </p>
        
        <nav className="mt-20 flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
          <a 
            href="#reality-core" 
            className="text-sm uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-2"
          >
            RealityCore
          </a>
          <a 
            href="#fallacy-map" 
            className="text-sm uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-2"
          >
            Fallacy Map
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 pb-32">
        <div className="ornament">
          <div className="ornament-icon">
            <div className="w-2 h-2 rotate-45 bg-primary"></div>
          </div>
        </div>

        <section id="reality-core" className="scroll-mt-32 mb-24">
          <div className="flex flex-col gap-8">
            <header>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                RealityCore
              </h2>
              <div className="w-16 h-[2px] bg-primary/80"></div>
            </header>
            
            <p className="text-xl md:text-2xl leading-loose md:leading-loose text-foreground/90 drop-cap text-justify">
              RealityCore is the practitioner's tool for checking whether a claim about the bright side or the systems side is grounded in fact or is a narrative the speaker has mistaken for one. Before the Gate can pass or refuse a piece of language, the practitioner needs this prior discipline: the ability to separate what is real from what is story. A Gate operated without RealityCore is guessing.
            </p>
          </div>
        </section>

        <div className="ornament">
          <div className="ornament-icon text-muted-foreground font-serif italic text-xl">
            §
          </div>
        </div>

        <section id="fallacy-map" className="scroll-mt-32">
          <div className="flex flex-col gap-8">
            <header>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                Fallacy Map
              </h2>
              <div className="w-16 h-[2px] bg-primary/80"></div>
            </header>
            
            <p className="text-xl md:text-2xl leading-loose md:leading-loose text-foreground/90 drop-cap text-justify">
              The Fallacy Map is the named catalogue of reasoning errors practitioners catch in the field: the common moves that make a false crossing look honest, a refusal look cowardly, or a substitution look like an equivalent when it is not. Together with RealityCore, it forms the epistemological backbone the Gate rests on.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16 border-t border-border mt-12 relative z-10 bg-background/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-2 h-2 rotate-45 bg-muted mx-auto mb-6"></div>
          <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase">
            Headwaters &middot; Zone 5
          </p>
        </div>
      </footer>
    </div>
  );
}