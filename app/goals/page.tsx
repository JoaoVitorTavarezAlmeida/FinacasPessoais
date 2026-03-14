import { redirect } from "next/navigation";

import { AppShell, GoalForm, GoalsPanel } from "@/components/dashboard";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";
import { hasDatabaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  if (!hasDatabaseUrl()) {
    redirect("/dashboard");
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth");
  }

  const { goals } = await getDashboardData(currentUser.id);

  return (
    <AppShell
      description="Acompanhe seus objetivos financeiros sem poluir a visão geral da dashboard."
      eyebrow="Metas"
      title="Planejamento financeiro"
      user={currentUser}
    >
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <GoalsPanel goals={goals} />
        <GoalForm />
      </section>
    </AppShell>
  );
}
