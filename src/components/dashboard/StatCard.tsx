import { ReactNode } from "react";

type Props = {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: "default" | "success" | "danger" | "warning";
};

const toneClasses: Record<NonNullable<Props["tone"]>, string> = {
  default: "bg-card border-border",
  success: "bg-emerald-50 border-emerald-200",
  danger: "bg-red-50 border-red-200",
  warning: "bg-amber-50 border-amber-200",
};

const StatCard = ({ label, value, icon, tone = "default" }: Props) => (
  <div className={`rounded-2xl border shadow-sm p-4 flex items-center gap-3 ${toneClasses[tone]}`}>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-muted-foreground truncate">{label}</p>
      <p className="text-xl font-bold mt-1 truncate">{value}</p>
    </div>
    {icon && <div className="h-9 w-9 rounded-full bg-background flex items-center justify-center shrink-0">{icon}</div>}
  </div>
);

export default StatCard;
