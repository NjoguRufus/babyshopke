type Props = { value: string };

const map: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  inactive: "bg-slate-100 text-slate-700 border-slate-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  delivered: "bg-sky-100 text-sky-800 border-sky-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  processing: "bg-violet-100 text-violet-800 border-violet-200",
  shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
  cancelled: "bg-slate-100 text-slate-600 border-slate-200",
  success: "bg-emerald-100 text-emerald-800 border-emerald-200",
  reversed: "bg-slate-100 text-slate-600 border-slate-200",
};

const StatusBadge = ({ value }: Props) => {
  const key = (value || "").toLowerCase();
  const cls = map[key] ?? "bg-slate-100 text-slate-700 border-slate-200";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {value || "—"}
    </span>
  );
};

export default StatusBadge;
