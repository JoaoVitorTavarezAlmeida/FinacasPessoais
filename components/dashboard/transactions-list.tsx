import type { Category, Transaction } from "@/types/dashboard";
import { TransactionListItem } from "@/components/dashboard/transaction-list-item";

export function TransactionsList({
  transactions,
  categories,
}: {
  transactions: Transaction[];
  categories: Category[];
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
          <TransactionListItem
            key={transaction.id}
            categories={categories}
            transaction={transaction}
          />
        ))}
      </div>
    </section>
  );
}
