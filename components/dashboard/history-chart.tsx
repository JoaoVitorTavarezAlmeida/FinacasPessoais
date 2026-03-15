import type { HistoryPoint } from "@/types/dashboard";

function buildChartPath(data: HistoryPoint[], width: number, height: number) {
  if (!data.length) {
    return "";
  }

  if (data.length === 1) {
    return `M 0 ${(height / 2).toFixed(2)} L ${width} ${(height / 2).toFixed(2)}`;
  }

  const max = Math.max(...data.map((item) => item.amount));
  const min = Math.min(...data.map((item) => item.amount));
  const range = max - min;

  return data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * width;
      const normalizedY =
        range === 0 ? height / 2 : height - ((item.amount - min) / range) * height;
      const y = Math.min(height - 6, Math.max(6, normalizedY));
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function buildAreaPath(linePath: string, width: number, height: number) {
  return `${linePath} L ${width} ${height} L 0 ${height} Z`;
}

function formatAxisAmount(amount: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

function buildAxisLabels(data: HistoryPoint[]) {
  if (!data.length) {
    return ["R$ 0", "R$ 0", "R$ 0"];
  }

  const max = Math.max(...data.map((item) => item.amount));
  const min = Math.min(...data.map((item) => item.amount));
  const midpoint = min + (max - min) / 2;

  return [formatAxisAmount(max), formatAxisAmount(midpoint), formatAxisAmount(min)];
}

function buildTrend(data: HistoryPoint[]) {
  if (!data.length) {
    return {
      label: "Sem dados no período",
      tone: "neutral" as const,
    };
  }

  const midpoint = Math.max(1, Math.floor(data.length / 2));
  const firstWindow = data.slice(0, midpoint);
  const secondWindow = data.slice(midpoint);
  const firstAverage =
    firstWindow.reduce((total, point) => total + point.amount, 0) /
    Math.max(firstWindow.length, 1);
  const secondAverage =
    secondWindow.reduce((total, point) => total + point.amount, 0) /
    Math.max(secondWindow.length, 1);

  if (firstAverage === 0 && secondAverage === 0) {
    return {
      label: "Sem movimentação relevante",
      tone: "neutral" as const,
    };
  }

  if (firstAverage === 0) {
    return {
      label: "Início de movimentação no período",
      tone: "positive" as const,
    };
  }

  const delta = ((secondAverage - firstAverage) / Math.abs(firstAverage)) * 100;

  if (Math.abs(delta) < 0.1) {
    return {
      label: "Estável no período",
      tone: "neutral" as const,
    };
  }

  return {
    label: `${delta >= 0 ? "+" : ""}${delta
      .toFixed(1)
      .replace(".", ",")}% vs. primeira metade`,
    tone: delta >= 0 ? ("positive" as const) : ("negative" as const),
  };
}

export function HistoryChart({ data }: { data: HistoryPoint[] }) {
  const width = 720;
  const height = 240;
  const linePath = buildChartPath(data, width, height);
  const areaPath = linePath ? buildAreaPath(linePath, width, height) : "";
  const axisLabels = buildAxisLabels(data);
  const trend = buildTrend(data);
  const trendClasses =
    trend.tone === "positive"
      ? "bg-emerald-50 text-emerald-700"
      : trend.tone === "negative"
        ? "bg-rose-50 text-rose-700"
        : "bg-slate-100 text-slate-700";

  return (
    <section className="rounded-[30px] border border-white/70 bg-white/84 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Histórico
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">
            Fluxo dos últimos 30 dias
          </h3>
        </div>
        <div className={`rounded-2xl px-4 py-2 text-sm font-medium ${trendClasses}`}>
          {trend.label}
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-4 flex justify-between text-xs font-medium text-slate-400">
          {axisLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#f8fbfa_0%,#eef5f3_100%)] p-4">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(148,163,184,0.16)_1px,transparent_1px)] bg-[length:100%_25%]" />
          <svg
            className="relative h-[260px] w-full"
            preserveAspectRatio="none"
            viewBox={`0 0 ${width} ${height}`}
          >
            <defs>
              <linearGradient id="history-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#0f766e" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#0f766e" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {linePath ? (
              <>
                <path d={areaPath} fill="url(#history-fill)" />
                <path
                  d={linePath}
                  fill="none"
                  stroke="#0f766e"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                />
              </>
            ) : null}
          </svg>
        </div>

        <div className="mt-4 grid grid-cols-6 gap-2 text-xs font-medium text-slate-400 sm:grid-cols-10 lg:grid-cols-12">
          {data.map((point, index) =>
            index % 3 === 0 ? <span key={point.day}>{point.day}</span> : null,
          )}
        </div>
      </div>
    </section>
  );
}
