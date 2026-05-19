import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-[#E4D9CC] flex items-center justify-center mb-4">
          <Icon size={24} className="text-[#7A6B60]" />
        </div>
      )}
      <h3 className="text-lg text-[#2E2620] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#7A6B60] mb-4 max-w-xs">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
