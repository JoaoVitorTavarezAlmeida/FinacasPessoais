import { redirect } from "next/navigation";

import {
  AppShell,
  TransactionFilters,
  TransactionForm,
  TransactionsList,
} from "@/components/dashboard";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";
import { hasDatabaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

type TransactionsPageProps = {
  searchParams: Promise<{
    q?: string;
    type?: string;
    category?: string;
  }>;
};

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  if (!hasDatabaseUrl()) {
    redirect("/dashboard");
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth");
  }

  const { categories, transactions } = await getDashboardData(currentUser.id);
  const filters = await searchParams;
  const search = filters.q?.trim().toLowerCase() ?? "";
  const selectedType = filters.type ?? "";
  const selectedCategory = filters.category ?? "";

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = search
      ? `${transaction.title} ${transaction.category}`
          .toLowerCase()
          .includes(search)
      : true;
    const matchesType = selectedType ? transaction.type === selectedType : true;
    const matchesCategory = selectedCategory
      ? transaction.categoryId === selectedCategory
      : true;

    return matchesSearch && matchesType && matchesCategory;
  });

  const totalIncome = filteredTransactions
    .filter((transaction) => transaction.type === "income")
    .length;
  const totalExpense = filteredTransactions
    .filter((transaction) => transaction.type === "expense")
    .length;

  return (
    <AppShell
      description="Cadastre, edite e acompanhe todas as suas movimentações em um espaço dedicado."
      eyebrow="Transações"
      title="Gestão completa de transações"
      user={currentUser}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[26px] border border-white/70 bg-white/84 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur">
          <p className="text-sm text-slate-500">Resultados filtrados</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {filteredTransactions.length}
          </p>
        </article>
        <article className="rounded-[26px] border border-white/70 bg-white/84 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur">
          <p className="text-sm text-slate-500">Entradas no filtro</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-600">
            {totalIncome}
          </p>
        </article>
        <article className="rounded-[26px] border border-white/70 bg-white/84 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur">
          <p className="text-sm text-slate-500">Saídas no filtro</p>
          <p className="mt-3 text-3xl font-semibold text-rose-600">
            {totalExpense}
          </p>
        </article>
      </section>

      <TransactionFilters
        categories={categories}
        search={filters.q}
        selectedCategory={selectedCategory}
        selectedType={selectedType}
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.95fr)]">
        <TransactionsList
          action={
            <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              {filteredTransactions.length} itens
            </span>
          }
          categories={categories}
          eyebrow="Resultado"
          title="Lançamentos encontrados"
          transactions={filteredTransactions}
        />
        <TransactionForm categories={categories} />
      </section>
    </AppShell>
  );
}
