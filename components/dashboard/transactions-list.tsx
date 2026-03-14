import type { Transaction } from "@/types/dashboard";

export function TransactionsList({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <section className="rounded-[30px] border border-white/70 bg-white/84 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Transações
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">
            Últimos lançamentos
          </h3>
        </div>
        <button
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
          type="button"
        >
          Ver todas
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {transactions.map((transaction) => (
          <article
            key={transaction.id}
            className="flex items-center justify-between gap-4 rounded-[24px] border border-slate-100 bg-slate-50/80 p-4"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {transaction.title}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <span>{transaction.category}</span>
                <span>{transaction.date}</span>
              </div>
            </div>
            <p
              className={`shrink-0 text-sm font-semibold ${
                transaction.type === "income"
                  ? "text-emerald-600"
                  : "text-rose-600"
              }`}
            >
              {transaction.amount}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
