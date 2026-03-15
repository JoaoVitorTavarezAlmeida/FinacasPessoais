import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";
import { getGoalHighlight } from "@/lib/dashboard/get-goal-highlight";
import { hasDatabaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

type StatisticsPageProps = {
  searchParams: Promise<{
    end?: string;
    period?: "current_month" | "last_30_days" | "custom";
    start?: string;
  }>;
};

function buildCategoryInsights(
  series: Awaited<ReturnType<typeof getDashboardData>>["historySeries"],
) {
  const categories = series
    .filter((item) => !item.isPrimary)
    .map((item) => ({
      color: item.color,
      id: item.id,
      label: item.label,
      value: item.points[item.points.length - 1]?.amount ?? 0,
    }))
    .sort((left, right) => Math.abs(right.value) - Math.abs(left.value));

  return {
    strongestPositive: categories.find((item) => item.value > 0) ?? null,
    strongestNegative:
      [...categories]
        .sort((left, right) => left.value - right.value)
        .find((item) => item.value < 0) ?? null,
    topCategories: categories.slice(0, 4),
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function buildTrendSnapshot(
  history: Awaited<ReturnType<typeof getDashboardData>>["history"],
) {
  if (!history.length) {
    return {
      delta: 0,
      highest: 0,
      lowest: 0,
    };
  }

  return {
    delta: (history[history.length - 1]?.amount ?? 0) - (history[0]?.amount ?? 0),
    highest: Math.max(...history.map((point) => point.amount)),
    lowest: Math.min(...history.map((point) => point.amount)),
  };
}

function StatisticsAccessRequired() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,116,144,0.12),_transparent_28%),linear-gradient(180deg,#f5f7f4_0%,#eef2f1_100%)] px-4 py-6">
      <div className="w-full max-w-md rounded-[32px] border border-white/70 bg-white/88 p-6 text-center shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
          Acesso necessario
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">
          Entre para ver as estatísticas
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Faça login para abrir o módulo analítico e ler o desempenho do período.
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

export default async function StatisticsPage({
  searchParams,
}: StatisticsPageProps) {
  const filters = await searchParams;
  const selectedPeriod = filters.period ?? "current_month";
  const historyOptions = {
    historyEndDate: filters.end,
    historyPreset: selectedPeriod,
    historyStartDate: filters.start,
  } as const;

  if (hasDatabaseUrl()) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return <StatisticsAccessRequired />;
    }

    const {
      AppShell,
      HistoryChart,
      SummaryCard,
    } = await import("@/components/dashboard");

    const {
      goals,
      history,
      historyPeriod,
      historySeries,
      summaryCards,
    } = await getDashboardData(currentUser.id, historyOptions);
    const goalHighlight = getGoalHighlight(goals);
    const trend = buildTrendSnapshot(history);
    const insights = buildCategoryInsights(historySeries);

    return (
      <AppShell
        description="Leitura analítica do saldo acumulado, comportamento por categoria e amplitude real do período selecionado."
        eyebrow="Estatísticas"
        goalHighlight={goalHighlight}
        searchAction="/transactions"
        searchPlaceholder="Buscar e abrir em transações"
        title="Estatísticas e leitura do período"
        user={currentUser}
      >
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <SummaryCard key={card.id} card={card} />
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
          <HistoryChart
            data={history}
            period={historyPeriod}
            series={historySeries}
          />

          <section className="grid gap-4">
            <article className="rounded-[30px] border border-white/70 bg-white/88 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                Leitura rápida
              </p>
              <div className="mt-4 space-y-4">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Janela ativa
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">
                    {historyPeriod.label}
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Variação líquida
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">
                    {formatCurrency(trend.delta)}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Pico do saldo
                    </p>
                    <p className="mt-2 text-base font-semibold text-emerald-700">
                      {formatCurrency(trend.highest)}
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Piso do saldo
                    </p>
                    <p className="mt-2 text-base font-semibold text-rose-700">
                      {formatCurrency(trend.lowest)}
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-[30px] border border-white/70 bg-white/88 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                Categorias em destaque
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Melhor contribuição
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-950">
                    {insights.strongestPositive?.label ?? "Sem destaque positivo"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {insights.strongestPositive
                      ? formatCurrency(insights.strongestPositive.value)
                      : "Nenhuma categoria acumulou saldo positivo no recorte."}
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Maior pressão negativa
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-950">
                    {insights.strongestNegative?.label ?? "Sem destaque negativo"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {insights.strongestNegative
                      ? formatCurrency(insights.strongestNegative.value)
                      : "Nenhuma categoria caiu abaixo de zero no recorte."}
                  </p>
                </div>
              </div>
            </article>
          </section>
        </section>

        <section className="rounded-[30px] border border-white/70 bg-white/88 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                Ranking analítico
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">
                Categorias com maior impacto no recorte
              </h3>
            </div>
            <a
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
              href="/transactions"
            >
              Abrir transações
            </a>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {insights.topCategories.map((category) => (
              <article
                key={category.id}
                className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <p className="truncate text-sm font-semibold text-slate-950">
                    {category.label}
                  </p>
                </div>
                <p className="mt-3 text-lg font-semibold text-slate-900">
                  {formatCurrency(category.value)}
                </p>
              </article>
            ))}
          </div>
        </section>
      </AppShell>
    );
  }

  const {
    AppShell,
    HistoryChart,
    SummaryCard,
  } = await import("@/components/dashboard");

  const {
    goals,
    history,
    historyPeriod,
    historySeries,
    summaryCards,
  } = await getDashboardData("mock-user", historyOptions);
  const goalHighlight = getGoalHighlight(goals);
  const trend = buildTrendSnapshot(history);
  const insights = buildCategoryInsights(historySeries);

  return (
    <AppShell
      description="Ambiente de demonstração para leitura do saldo, categorias e comportamento do período."
      eyebrow="Estatísticas"
      goalHighlight={goalHighlight}
      searchAction="/transactions"
      searchPlaceholder="Buscar e abrir em transações"
      title="Estatísticas e leitura do período"
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.id} card={card} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
        <HistoryChart
          data={history}
          period={historyPeriod}
          series={historySeries}
        />

        <section className="grid gap-4">
          <article className="rounded-[30px] border border-white/70 bg-white/88 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Leitura rápida
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Janela ativa
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {historyPeriod.label}
                </p>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Variação líquida
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {formatCurrency(trend.delta)}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Pico do saldo
                  </p>
                  <p className="mt-2 text-base font-semibold text-emerald-700">
                    {formatCurrency(trend.highest)}
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Piso do saldo
                  </p>
                  <p className="mt-2 text-base font-semibold text-rose-700">
                    {formatCurrency(trend.lowest)}
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[30px] border border-white/70 bg-white/88 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Categorias em destaque
            </p>
            <div className="mt-4 space-y-3">
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Melhor contribuição
                </p>
                <p className="mt-2 text-base font-semibold text-slate-950">
                  {insights.strongestPositive?.label ?? "Sem destaque positivo"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {insights.strongestPositive
                    ? formatCurrency(insights.strongestPositive.value)
                    : "Nenhuma categoria acumulou saldo positivo no recorte."}
                </p>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Maior pressão negativa
                </p>
                <p className="mt-2 text-base font-semibold text-slate-950">
                  {insights.strongestNegative?.label ?? "Sem destaque negativo"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {insights.strongestNegative
                    ? formatCurrency(insights.strongestNegative.value)
                    : "Nenhuma categoria caiu abaixo de zero no recorte."}
                </p>
              </div>
            </div>
          </article>
        </section>
      </section>

      <section className="rounded-[30px] border border-white/70 bg-white/88 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Ranking analítico
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">
              Categorias com maior impacto no recorte
            </h3>
          </div>
          <a
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
            href="/transactions"
          >
            Abrir transações
          </a>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {insights.topCategories.map((category) => (
            <article
              key={category.id}
              className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <p className="truncate text-sm font-semibold text-slate-950">
                  {category.label}
                </p>
              </div>
              <p className="mt-3 text-lg font-semibold text-slate-900">
                {formatCurrency(category.value)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
