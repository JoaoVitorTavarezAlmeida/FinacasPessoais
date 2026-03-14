import type { Category, Transaction } from "@/types/dashboard";
import { TransactionListItem } from "@/components/dashboard/transaction-list-item";

export function TransactionsList({
  transactions,
  categories,
  title = "Últimos lançamentos",
  eyebrow = "Transações",
  action,
  emptyMessage = "Nenhuma transação encontrada para os filtros atuais.",
  footer,
}: {
  transactions: Transaction[];
  categories: Category[];
  title?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  emptyMessage?: string;
  footer?: React.ReactNode;
}) {
  return (
    <section className="rounded-[30px] border border-white/70 bg-white/84 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            {eyebrow}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">
            {title}
          </h3>
        </div>
        {action}
      </div>

      {transactions.length ? (
        <div className="mt-6 space-y-3">
          {transactions.map((transaction) => (
            <TransactionListItem
              key={transaction.id}
              categories={categories}
              transaction={transaction}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 p-6 text-sm text-slate-500">
          {emptyMessage}
        </div>
      )}

      {footer}
    </section>
  );
}
