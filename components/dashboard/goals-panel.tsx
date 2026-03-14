import { GoalListItem } from "@/components/dashboard/goal-list-item";
import type { Goal } from "@/types/dashboard";

export function GoalsPanel({ goals }: { goals: Goal[] }) {
  return (
    <section className="rounded-[30px] border border-white/70 bg-white/84 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Metas
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">
            Objetivos financeiros
          </h3>
        </div>
        <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
          {goals.length} metas
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {goals.map((goal) => (
          <GoalListItem key={goal.id} goal={goal} />
        ))}
      </div>
    </section>
  );
}
