import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { useGetSettings } from "@workspace/k-pizza-client-react";
import { Printer } from "lucide-react";

export default function HotelQrCardPage() {
  const { data: settings } = useGetSettings();
  const phone = settings?.phone ?? "(807) 215-0101";
  const address = settings?.address ?? "5 Earl Ave, Dryden, ON";

  const [origin, setOrigin] = React.useState("");
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      setOrigin(`${window.location.origin}${base}/visiting-dryden`);
    }
  }, []);

  return (
    <>
      <style>{`
        @page { size: letter; margin: 0.5in; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .qr-card { box-shadow: none !important; border: 1px dashed #999 !important; page-break-after: always; }
        }
      `}</style>

      <div className="min-h-screen bg-muted/30 p-6 print:p-0 print:bg-white">
        <div className="no-print max-w-3xl mx-auto mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl">Printable QR card</h1>
            <p className="text-sm text-muted-foreground">One card per page. Use your browser's Print dialog (Cmd/Ctrl + P).</p>
          </div>
          <button
            onClick={() => window.print()}
            className="bg-primary text-white px-5 py-3 font-sans text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90"
          >
            <Printer size={14} /> Print
          </button>
        </div>

        <div className="max-w-3xl mx-auto qr-card bg-white text-foreground shadow-xl border border-border" style={{ aspectRatio: "8.5/11" }}>
          <div className="h-full w-full flex flex-col p-12">
            <div className="flex items-center gap-3 pb-4 border-b-4 border-primary">
              <img src="/images/real/logo.jpg" alt="" className="h-14 w-14 rounded-full object-cover" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">Visiting Dryden?</p>
                <p className="font-serif text-2xl leading-tight">Konstantino Pizza &amp; Wings</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <h2 className="font-serif text-5xl leading-[1.05] mb-4">
                Hungry?<br/>Walk a block.
              </h2>
              <p className="font-sans text-lg text-foreground/75 max-w-md mb-8 leading-relaxed">
                Hand-stretched dough, wings tossed to order, daily specials using fresh local produce. Scan for what to order on a first visit, hours, and a map.
              </p>

              <div className="bg-white p-4 border-4 border-foreground">
                {origin ? (
                  <QRCodeSVG value={origin} size={220} level="M" includeMargin={false} />
                ) : (
                  <div style={{ width: 220, height: 220 }} className="bg-muted" />
                )}
              </div>

              <p className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/60 mt-4">
                Scan with your phone camera
              </p>
            </div>

            <div className="border-t-2 border-foreground/10 pt-4 grid grid-cols-2 gap-4 text-sm font-sans">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-foreground/50 font-bold">Where</p>
                <p className="font-serif text-base">{address}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-foreground/50 font-bold">Call</p>
                <p className="font-serif text-base">{phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
