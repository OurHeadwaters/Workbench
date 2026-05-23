import { ReactNode } from "react";
import { Leaf } from "lucide-react";

export default function NurseryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#FAF6F0]">
      <header className="border-b border-[#E4D9CC] bg-[#FFFDF9] px-6 py-4 flex items-center gap-3 shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#EBF3EE]">
          <Leaf className="w-4 h-4 text-[#4A7C59]" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-[#2E2620] leading-tight">Zone 4 Nursery</h1>
          <p className="text-[11px] text-[#7A6B60] leading-tight">Producer idea workspace</p>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="border-t border-[#E4D9CC] px-6 py-3 text-[11px] text-[#A89A8E]">
        Zone 4 producer group · Codetry
      </footer>
    </div>
  );
}
