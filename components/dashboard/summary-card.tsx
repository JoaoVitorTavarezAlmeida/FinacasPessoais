import { ArrowUpRightIcon } from "@/components/dashboard/icons";
import type { SummaryCardData, SummaryTone } from "@/types/dashboard";

const toneClasses: Record<SummaryTone, string> = {
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-rose-100 text-rose-700",
  neutral: "bg-slate-200 text-slate-700",
  accent: "bg-sky-100 text-sky-700",
};

export function SummaryCard({ card }: { card: SummaryCardData }) {
  return (
    <article className="rounded-[26px] border border-white/70 bg-white/85 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {card.value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneClasses[card.tone]}`}
        >
          <ArrowUpRightIcon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600">{card.change}</p>
    </article>
  );
}
