import { redirect } from "next/navigation";

import {
  AppShell,
  TransactionForm,
  TransactionsList,
} from "@/components/dashboard";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";
import { hasDatabaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  if (!hasDatabaseUrl()) {
    redirect("/dashboard");
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth");
  }

  const { categories, transactions } = await getDashboardData(currentUser.id);

  return (
    <AppShell
      description="Cadastre, edite e acompanhe todas as suas movimentações em um espaço dedicado."
      eyebrow="Transações"
      title="Gestão completa de transações"
      user={currentUser}
    >
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.95fr)]">
        <TransactionsList categories={categories} transactions={transactions} />
        <TransactionForm categories={categories} />
      </section>
    </AppShell>
  );
}
