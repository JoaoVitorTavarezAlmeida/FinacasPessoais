import { redirect } from "next/navigation";

import {
  AppShell,
  GoalFilters,
  GoalForm,
  GoalsPanel,
  PaginationControls,
} from "@/components/dashboard";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";
import { hasDatabaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

type GoalsPageProps = {
  searchParams: Promise<{
    page?: string;
    progress?: string;
    q?: string;
  }>;
};

export default async function GoalsPage({ searchParams }: GoalsPageProps) {
  if (!hasDatabaseUrl()) {
    redirect("/dashboard");
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth");
  }

  const { goals } = await getDashboardData(currentUser.id);
  const filters = await searchParams;
  const search = filters.q?.trim().toLowerCase() ?? "";
  const selectedProgress = filters.progress ?? "";
  const requestedPage = Number.parseInt(filters.page ?? "1", 10);
  const filteredGoals = goals.filter((goal) =>
    [
      search ? goal.name.toLowerCase().includes(search) : true,
      selectedProgress === "attention"
        ? goal.progress < 40
        : selectedProgress === "active"
          ? goal.progress >= 40 && goal.progress < 80
          : selectedProgress === "strong"
            ? goal.progress >= 80
            : selectedProgress === "completed"
              ? goal.progress >= 100
              : true,
    ].every(Boolean),
  );
  const averageProgress = filteredGoals.length
    ? Math.round(
        filteredGoals.reduce((total, goal) => total + goal.progress, 0) /
          filteredGoals.length,
      )
    : 0;
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filteredGoals.length / pageSize));
  const currentPage = Number.isNaN(requestedPage)
    ? 1
    : Math.min(Math.max(requestedPage, 1), totalPages);
  const paginatedGoals = filteredGoals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <AppShell
      description="Acompanhe seus objetivos financeiros sem poluir a visão geral da dashboard."
      eyebrow="Metas"
      title="Planejamento financeiro"
      user={currentUser}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[26px] border border-white/70 bg-white/84 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur">
          <p className="text-sm text-slate-500">Metas filtradas</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {filteredGoals.length}
          </p>
        </article>
        <article className="rounded-[26px] border border-white/70 bg-white/84 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur">
          <p className="text-sm text-slate-500">Progresso médio</p>
          <p className="mt-3 text-3xl font-semibold text-teal-700">
            {averageProgress}%
          </p>
        </article>
        <article className="rounded-[26px] border border-white/70 bg-white/84 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur">
          <p className="text-sm text-slate-500">Metas acima de 70%</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-600">
            {filteredGoals.filter((goal) => goal.progress >= 80).length}
          </p>
        </article>
      </section>

      <GoalFilters search={filters.q} selectedProgress={selectedProgress} />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <GoalsPanel
          action={
            <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              Página {currentPage} de {totalPages}
            </span>
          }
          eyebrow="Resultado"
          footer={
            <PaginationControls
              basePath="/goals"
              currentPage={currentPage}
              pageSize={pageSize}
              searchParams={{
                progress: selectedProgress || undefined,
                q: filters.q || undefined,
              }}
              totalItems={filteredGoals.length}
              totalPages={totalPages}
            />
          }
          goals={paginatedGoals}
          title="Metas encontradas"
        />
        <GoalForm />
      </section>
    </AppShell>
  );
}
