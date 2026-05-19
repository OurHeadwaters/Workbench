import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  back?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, back, action }: PageHeaderProps) {
  const [, navigate] = useLocation();
  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0] border-b border-[#E4D9CC]">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
        {back && (
          <button
            onClick={() => navigate(back)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 text-[#7A6B60] hover:text-[#2E2620] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl leading-tight text-[#2E2620] truncate">{title}</h1>
          {subtitle && (
            <p className="text-sm text-[#7A6B60] mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </header>
  );
}
