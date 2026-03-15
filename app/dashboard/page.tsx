import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";
import { getGoalHighlight } from "@/lib/dashboard/get-goal-highlight";
import { hasDatabaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (hasDatabaseUrl()) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,116,144,0.12),_transparent_28%),linear-gradient(180deg,#f5f7f4_0%,#eef2f1_100%)] px-4 py-6">
          <div className="w-full max-w-md rounded-[32px] border border-white/70 bg-white/88 p-6 text-center shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
              Acesso necessario
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              Entre para usar a dashboard
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Crie sua conta ou faca login para registrar transacoes e categorias.
            </p>
            <a
              className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              href="/auth"
            >
              Ir para autenticacao
            </a>
          </div>
        </main>
      );
    }

    const {
      AppShell,
      HistoryChart,
      RecentTransactionsCard,
      SummaryCard,
    } = await import("@/components/dashboard");

    const { categories, goals, history, summaryCards, transactions } =
      await getDashboardData(currentUser.id);
    const goalHighlight = getGoalHighlight(goals);

    return (
      <AppShell
        description="Acompanhe rapidamente saldo, histórico recente e atalhos para as áreas principais do sistema."
        eyebrow="Painel financeiro"
        goalHighlight={goalHighlight}
        searchAction="/transactions"
        searchPlaceholder="Buscar e abrir em transações"
        title="Visão geral da sua operação"
        user={currentUser}
      >
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <SummaryCard key={card.id} card={card} />
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.95fr)]">
          <HistoryChart data={history} />
          <RecentTransactionsCard transactions={transactions} />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <a
            className="rounded-[26px] border border-white/70 bg-white/84 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur"
            href="/transactions"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Fluxo
            </p>
            <h3 className="mt-3 text-xl font-semibold text-slate-950">
              Transações
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {transactions.length} registros recentes e formulário dedicado.
            </p>
          </a>
          <a
            className="rounded-[26px] border border-white/70 bg-white/84 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur"
            href="/categories"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Organização
            </p>
            <h3 className="mt-3 text-xl font-semibold text-slate-950">
              Categorias
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {categories.length} categorias para classificar e ajustar limites.
            </p>
          </a>
          <a
            className="rounded-[26px] border border-white/70 bg-white/84 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur"
            href="/goals"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Planejamento
            </p>
            <h3 className="mt-3 text-xl font-semibold text-slate-950">
              Metas
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {goals.length} metas ativas para acompanhar progresso financeiro.
            </p>
          </a>
        </section>
      </AppShell>
    );
  }

  const {
    AppShell,
    HistoryChart,
    RecentTransactionsCard,
    SummaryCard,
  } = await import("@/components/dashboard");

  const { categories, goals, history, summaryCards, transactions } =
    await getDashboardData("mock-user");
  const goalHighlight = getGoalHighlight(goals);

  return (
    <AppShell
      description="Ambiente de demonstração com atalhos para navegar pela estrutura principal do sistema."
      eyebrow="Painel financeiro"
      goalHighlight={goalHighlight}
      searchAction="/transactions"
      searchPlaceholder="Buscar e abrir em transações"
      title="Visão geral da sua operação"
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.id} card={card} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.95fr)]">
        <HistoryChart data={history} />
        <RecentTransactionsCard transactions={transactions} />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <a
          className="rounded-[26px] border border-white/70 bg-white/84 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur"
          href="/transactions"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Fluxo
          </p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">
            Transações
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {transactions.length} registros recentes e formulário dedicado.
          </p>
        </a>
        <a
          className="rounded-[26px] border border-white/70 bg-white/84 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur"
          href="/categories"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Organização
          </p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">
            Categorias
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {categories.length} categorias para classificar e ajustar limites.
          </p>
        </a>
        <a
          className="rounded-[26px] border border-white/70 bg-white/84 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur"
          href="/goals"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Planejamento
          </p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">
            Metas
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {goals.length} metas ativas para acompanhar progresso financeiro.
          </p>
        </a>
      </section>
    </AppShell>
  );
}
