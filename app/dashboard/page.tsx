import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";
import { getGoalHighlight } from "@/lib/dashboard/get-goal-highlight";
import { hasDatabaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

function DashboardAccessRequired() {
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

export default async function DashboardPage() {
  if (hasDatabaseUrl()) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return <DashboardAccessRequired />;
    }

    const {
      AppShell,
      RecentTransactionsCard,
      SummaryCard,
    } = await import("@/components/dashboard");

    const { categories, goals, summaryCards, transactions } =
      await getDashboardData(currentUser.id);
    const goalHighlight = getGoalHighlight(goals);
    const completedGoals = goals.filter((goal) => goal.progress >= 100).length;
    const activeGoals = goals.filter((goal) => goal.progress < 100).length;

    return (
      <AppShell
        description="Abra rápido os módulos principais, acompanhe o essencial do período e entre em ação sem ruído visual."
        eyebrow="Painel financeiro"
        goalHighlight={goalHighlight}
        searchAction="/transactions"
        searchPlaceholder="Buscar e abrir em transações"
        title="Central de operação financeira"
        user={currentUser}
      >
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <SummaryCard key={card.id} card={card} />
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <section className="rounded-[30px] border border-white/70 bg-white/88 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Ações rápidas
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <a
                className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-5 transition hover:border-slate-300 hover:bg-white"
                href="/transactions"
              >
                <p className="text-sm font-medium text-slate-500">Fluxo diário</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">
                  Lançar transações
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Registre entradas, saídas e movimentações de metas sem sair do
                  fluxo principal.
                </p>
              </a>

              <a
                className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-5 transition hover:border-slate-300 hover:bg-white"
                href="/statistics"
              >
                <p className="text-sm font-medium text-slate-500">Análise</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">
                  Ver estatísticas
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Acesse o histórico, compare categorias e leia a evolução do
                  saldo por período.
                </p>
              </a>

              <a
                className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-5 transition hover:border-slate-300 hover:bg-white"
                href="/categories"
              >
                <p className="text-sm font-medium text-slate-500">Organização</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">
                  Ajustar categorias
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {categories.length} categorias ativas para classificar despesas
                  e orientar os filtros.
                </p>
              </a>

              <a
                className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-5 transition hover:border-slate-300 hover:bg-white"
                href="/goals"
              >
                <p className="text-sm font-medium text-slate-500">Planejamento</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">
                  Gerenciar metas
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {activeGoals} em andamento e {completedGoals} concluídas para
                  acompanhar aportes reais.
                </p>
              </a>
            </div>
          </section>

          <section className="grid gap-4">
            <article className="rounded-[30px] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(15,118,110,0.92))] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
              <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                Foco do período
              </p>
              <h3 className="mt-3 text-2xl font-semibold">
                {goalHighlight?.statusLabel ?? "Operação organizada"}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/72">
                {goalHighlight
                  ? `${goalHighlight.name}: ${goalHighlight.description}`
                  : "Sem meta em destaque. Aproveite para revisar estatísticas e abrir o próximo ciclo de planejamento."}
              </p>
              <a
                className="mt-5 inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950"
                href="/statistics"
              >
                Abrir análise detalhada
              </a>
            </article>

            <article className="rounded-[30px] border border-white/70 bg-white/88 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                Próximos passos
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Registrar movimentação do dia
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Use a área de transações como ponto central de operação.
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Revisar categorias críticas
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Ajuste limites e nomenclatura antes de ampliar o volume de
                    registros.
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Conferir leitura estatística
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Veja tendência, comportamento por categoria e janela de
                    saldo no módulo de estatísticas.
                  </p>
                </div>
              </div>
            </article>
          </section>
        </section>

        <RecentTransactionsCard transactions={transactions} />
      </AppShell>
    );
  }

  const {
    AppShell,
    RecentTransactionsCard,
    SummaryCard,
  } = await import("@/components/dashboard");

  const { categories, goals, summaryCards, transactions } =
    await getDashboardData("mock-user");
  const goalHighlight = getGoalHighlight(goals);
  const completedGoals = goals.filter((goal) => goal.progress >= 100).length;
  const activeGoals = goals.filter((goal) => goal.progress < 100).length;

  return (
    <AppShell
      description="Ambiente de demonstração com foco em acesso rápido às áreas operacionais do sistema."
      eyebrow="Painel financeiro"
      goalHighlight={goalHighlight}
      searchAction="/transactions"
      searchPlaceholder="Buscar e abrir em transações"
      title="Central de operação financeira"
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.id} card={card} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <section className="rounded-[30px] border border-white/70 bg-white/88 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Ações rápidas
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <a
              className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-5 transition hover:border-slate-300 hover:bg-white"
              href="/transactions"
            >
              <p className="text-sm font-medium text-slate-500">Fluxo diário</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">
                Lançar transações
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Registre entradas, saídas e movimentações de metas sem sair do
                fluxo principal.
              </p>
            </a>
            <a
              className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-5 transition hover:border-slate-300 hover:bg-white"
              href="/statistics"
            >
              <p className="text-sm font-medium text-slate-500">Análise</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">
                Ver estatísticas
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Acesse o histórico, compare categorias e leia a evolução do
                saldo por período.
              </p>
            </a>
            <a
              className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-5 transition hover:border-slate-300 hover:bg-white"
              href="/categories"
            >
              <p className="text-sm font-medium text-slate-500">Organização</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">
                Ajustar categorias
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {categories.length} categorias ativas para classificar despesas
                e orientar os filtros.
              </p>
            </a>
            <a
              className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-5 transition hover:border-slate-300 hover:bg-white"
              href="/goals"
            >
              <p className="text-sm font-medium text-slate-500">Planejamento</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">
                Gerenciar metas
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {activeGoals} em andamento e {completedGoals} concluídas para
                acompanhar aportes reais.
              </p>
            </a>
          </div>
        </section>

        <section className="grid gap-4">
          <article className="rounded-[30px] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(15,118,110,0.92))] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
            <p className="text-sm uppercase tracking-[0.2em] text-white/60">
              Foco do período
            </p>
            <h3 className="mt-3 text-2xl font-semibold">
              {goalHighlight?.statusLabel ?? "Operação organizada"}
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/72">
              {goalHighlight
                ? `${goalHighlight.name}: ${goalHighlight.description}`
                : "Sem meta em destaque. Aproveite para revisar estatísticas e abrir o próximo ciclo de planejamento."}
            </p>
            <a
              className="mt-5 inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950"
              href="/statistics"
            >
              Abrir análise detalhada
            </a>
          </article>

          <article className="rounded-[30px] border border-white/70 bg-white/88 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Próximos passos
            </p>
            <div className="mt-4 space-y-3">
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Registrar movimentação do dia
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Use a área de transações como ponto central de operação.
                </p>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Revisar categorias críticas
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Ajuste limites e nomenclatura antes de ampliar o volume de
                  registros.
                </p>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Conferir leitura estatística
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Veja tendência, comportamento por categoria e janela de
                  saldo no módulo de estatísticas.
                </p>
              </div>
            </div>
          </article>
        </section>
      </section>

      <RecentTransactionsCard transactions={transactions} />
    </AppShell>
  );
}
