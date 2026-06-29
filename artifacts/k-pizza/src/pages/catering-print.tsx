import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { useGetSettings } from "@workspace/k-pizza-client-react";
import { Printer, Clock, Truck, Users } from "lucide-react";

export default function CateringPrintPage() {
  const { data: settings } = useGetSettings();
  const phone = settings?.phone ?? "(807) 215-0101";
  const address = settings?.address ?? "5 Earl Ave, Dryden, ON";
  const shopName = settings?.shopName ?? "Konstantino Pizza & Wings";
  const packages = settings?.cateringPackages ?? [];

  const [quoteUrl, setQuoteUrl] = React.useState("");
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      setQuoteUrl(`${window.location.origin}${base}/#catering-quote`);
    }
  }, []);

  return (
    <>
      <style>{`
        @page { size: letter; margin: 0.4in; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-sheet { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-muted/30 p-6 print:p-0 print:bg-white">
        <div className="no-print max-w-4xl mx-auto mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl">Catering one-pager</h1>
            <p className="text-sm text-muted-foreground">Use your browser's Print dialog (Cmd/Ctrl + P) — choose "Save as PDF" to download.</p>
          </div>
          <button
            onClick={() => window.print()}
            className="bg-primary text-white px-5 py-3 font-sans text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90"
          >
            <Printer size={14} /> Print / Save PDF
          </button>
        </div>

        <div className="print-sheet max-w-4xl mx-auto bg-white text-foreground shadow-xl border border-border" style={{ aspectRatio: "8.5/11" }}>
          <div className="h-full w-full flex flex-col p-10">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b-4 border-primary">
              <div className="flex items-center gap-3">
                <img src="/images/real/logo.jpg" alt="" className="h-14 w-14 rounded-full object-cover" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold flex items-center gap-1.5">
                    <Users size={11} /> Feed Your Team · Catering
                  </p>
                  <p className="font-serif text-2xl leading-tight">{shopName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-foreground/50 font-bold">A block from your office</p>
                <p className="font-serif text-sm">{address}</p>
                <p className="font-serif text-sm">{phone}</p>
              </div>
            </div>

            {/* Headline */}
            <div className="pt-5 pb-4">
              <h2 className="font-serif text-3xl leading-[1.05] mb-2">
                One call feeds the crew.
              </h2>
              <p className="font-sans text-sm text-foreground/75 leading-snug max-w-2xl">
                Hand-stretched dough, wings tossed to order, fresh local produce. Pick a package, send the headcount, we deliver hot. Same quality as the counter — just enough to feed everyone at once.
              </p>
            </div>

            {/* Packages */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {packages.slice(0, 3).map((pkg, i) => (
                <div key={i} className="border-2 border-foreground/15 p-3 flex flex-col">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-primary mb-1">Package {i + 1}</p>
                  <h3 className="font-serif text-xl leading-tight">{pkg.name}</h3>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-foreground/60 mt-1">{pkg.headcount}</p>
                  <p className="font-serif text-2xl text-foreground mt-1">{pkg.price}</p>
                  <p className="font-sans text-[11px] text-foreground/75 leading-snug mt-2 flex-1">{pkg.blurb}</p>
                </div>
              ))}
            </div>

            {/* Lead time + delivery */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="border border-foreground/15 p-3 flex items-start gap-2">
                <Clock className="text-primary mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="font-serif text-base leading-tight">Order by 10am</p>
                  <p className="font-sans text-[11px] text-foreground/70 leading-snug">for same-day lunch. Bigger jobs, give us a day's notice and we'll set up around it.</p>
                </div>
              </div>
              <div className="border border-foreground/15 p-3 flex items-start gap-2">
                <Truck className="text-primary mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="font-serif text-base leading-tight">Free downtown delivery</p>
                  <p className="font-sans text-[11px] text-foreground/70 leading-snug">Inside the downtown core, we drop it off ourselves. Outside the core, we'll quote the run.</p>
                </div>
              </div>
            </div>

            {/* QR + contact footer */}
            <div className="mt-auto border-t-2 border-foreground/10 pt-4 grid grid-cols-12 gap-4 items-center">
              <div className="col-span-3 flex justify-center">
                <div className="bg-white p-2 border-2 border-foreground">
                  {quoteUrl ? (
                    <QRCodeSVG value={quoteUrl} size={120} level="M" includeMargin={false} />
                  ) : (
                    <div style={{ width: 120, height: 120 }} className="bg-muted" />
                  )}
                </div>
              </div>
              <div className="col-span-9">
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-1">Scan to request a quote</p>
                <p className="font-serif text-xl leading-tight mb-2">Tell us who, when, and how many.</p>
                <p className="font-sans text-[11px] text-foreground/70 leading-snug mb-2">
                  Lands in Jamie's inbox. Same-day reply with price and confirmation. No deposit, no platform — just food.
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm font-sans">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-foreground/50 font-bold">Last-minute? Call</p>
                    <p className="font-serif text-base">{phone}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-foreground/50 font-bold">Walk in</p>
                    <p className="font-serif text-base">{address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
