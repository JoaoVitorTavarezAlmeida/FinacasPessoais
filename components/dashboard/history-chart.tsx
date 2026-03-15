"use client";

import { useMemo, useState } from "react";

import type {
  HistoryPeriod,
  HistoryPoint,
  HistorySeries,
} from "@/types/dashboard";

function chooseStep(maxAbs: number) {
  if (maxAbs <= 1000) {
    return 100;
  }

  const magnitude = 10 ** Math.floor(Math.log10(maxAbs));
  const normalized = maxAbs / magnitude;

  if (normalized > 5) {
    return magnitude;
  }

  if (normalized > 2) {
    return magnitude / 2;
  }

  return magnitude / 5;
}

function formatAxisAmount(amount: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: Math.abs(amount) >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(amount);
}

function formatPointLabel(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(`${date}T00:00:00`));
}

function buildScale(series: HistorySeries[]) {
  const values = series.flatMap((item) => item.points.map((point) => point.amount));
  const minValue = Math.min(...values, 0);
  const maxValue = Math.max(...values, 0);
  const maxAbs = Math.max(Math.abs(minValue), Math.abs(maxValue), 100);
  const step = chooseStep(maxAbs);
  const roundedMax = Math.ceil(maxValue / step) * step;
  const roundedMin = Math.floor(minValue / step) * step;
  const domainMax = roundedMax === 0 ? step : roundedMax;
  const domainMin = roundedMin === 0 ? (minValue < 0 ? -step : 0) : roundedMin;
  const range = domainMax - domainMin || step;
  const ticks: number[] = [];

  for (let current = domainMax; current >= domainMin; current -= step) {
    ticks.push(Number(current.toFixed(2)));
  }

  return {
    domainMax,
    domainMin,
    range,
    ticks,
  };
}

function getYPosition(value: number, domainMin: number, range: number, height: number) {
  const normalizedY = height - ((value - domainMin) / range) * height;
  return Math.min(height - 6, Math.max(6, normalizedY));
}

function buildChartPath(
  data: HistoryPoint[],
  width: number,
  height: number,
  domainMin: number,
  range: number,
) {
  if (!data.length) {
    return "";
  }

  if (data.length === 1) {
    const y = getYPosition(data[0].amount, domainMin, range, height);
    return `M 0 ${y.toFixed(2)} L ${width} ${y.toFixed(2)}`;
  }

  return data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = getYPosition(item.amount, domainMin, range, height);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function buildAreaPath(linePath: string, width: number, zeroY: number) {
  return `${linePath} L ${width} ${zeroY} L 0 ${zeroY} Z`;
}

function buildTrend(data: HistoryPoint[]) {
  if (!data.length) {
    return {
      label: "Sem dados no período",
      tone: "neutral" as const,
    };
  }

  const firstValue = data[0]?.amount ?? 0;
  const lastValue = data[data.length - 1]?.amount ?? 0;
  const delta = lastValue - firstValue;

  if (delta === 0) {
    return {
      label: "Saldo estável no período",
      tone: "neutral" as const,
    };
  }

  return {
    label: `${delta >= 0 ? "+" : "-"}${formatAxisAmount(Math.abs(delta))} no período`,
    tone: delta >= 0 ? ("positive" as const) : ("negative" as const),
  };
}

function buildVisibleLabels(data: HistoryPoint[]) {
  if (data.length <= 7) {
    return data;
  }

  const step = Math.ceil(data.length / 6);
  return data.filter((point, index) => index % step === 0 || index === data.length - 1);
}

export function HistoryChart({
  data,
  period,
  series,
}: {
  data: HistoryPoint[];
  period: HistoryPeriod;
  series: HistorySeries[];
}) {
  const [enabledSeries, setEnabledSeries] = useState<string[]>(
    series.filter((item) => item.isPrimary).map((item) => item.id),
  );

  const visibleSeries = useMemo(() => {
    const primarySeries = series.filter((item) => item.isPrimary);
    const optionalSeries = series.filter(
      (item) => !item.isPrimary && enabledSeries.includes(item.id),
    );

    return [...primarySeries, ...optionalSeries];
  }, [enabledSeries, series]);

  const width = 720;
  const height = 240;
  const scale = useMemo(() => buildScale(visibleSeries), [visibleSeries]);
  const zeroY = getYPosition(0, scale.domainMin, scale.range, height);
  const trend = buildTrend(data);
  const visibleLabels = buildVisibleLabels(data);
  const visibleTicks = scale.ticks.filter((_, index) => {
    const labelEvery = Math.max(1, Math.ceil(scale.ticks.length / 7));
    return index % labelEvery === 0 || index === scale.ticks.length - 1;
  });
  const trendClasses =
    trend.tone === "positive"
      ? "bg-emerald-50 text-emerald-700"
      : trend.tone === "negative"
        ? "bg-rose-50 text-rose-700"
        : "bg-slate-100 text-slate-700";

  return (
    <section className="rounded-[30px] border border-white/70 bg-white/84 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Histórico
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">
            Saldo acumulado do período
          </h3>
          <p className="mt-2 text-sm text-slate-500">{period.label}</p>
        </div>
        <div
          className={`inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-2 text-center text-sm font-medium ${trendClasses}`}
        >
          {trend.label}
        </div>
      </div>

      <form
        action="/dashboard"
        className="mt-6 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_auto]"
      >
        <label className="block min-w-0">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Período
          </span>
          <select
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900"
            defaultValue={period.preset}
            name="period"
          >
            <option value="current_month">Mês atual</option>
            <option value="last_30_days">Últimos 30 dias</option>
            <option value="custom">Personalizado</option>
          </select>
        </label>

        <label className="block min-w-0">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Início
          </span>
          <input
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900"
            defaultValue={period.startDate}
            name="start"
            type="date"
          />
        </label>

        <label className="block min-w-0">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Fim
          </span>
          <input
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900"
            defaultValue={period.endDate}
            name="end"
            type="date"
          />
        </label>

        <div className="flex min-w-0 flex-col items-stretch gap-2 md:col-span-2 sm:flex-row sm:items-end 2xl:col-span-1 2xl:justify-end">
          <button
            className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-2xl bg-slate-950 px-4 text-center text-sm font-semibold text-white sm:min-w-[120px]"
            type="submit"
          >
            Atualizar
          </button>
          <a
            className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-2xl border border-slate-200 px-4 text-center text-sm font-medium text-slate-700 sm:min-w-[120px]"
            href="/dashboard"
          >
            Resetar
          </a>
        </div>
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        {series.map((item) => {
          const isPrimary = Boolean(item.isPrimary);
          const active = isPrimary || enabledSeries.includes(item.id);

          return (
            <button
              key={item.id}
              className={`inline-flex min-w-0 max-w-full items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                active
                  ? "border-slate-300 bg-white text-slate-900"
                  : "border-slate-200 bg-slate-50 text-slate-500"
              } ${isPrimary ? "cursor-default" : ""}`}
              disabled={isPrimary}
              onClick={() =>
                setEnabledSeries((current) =>
                  current.includes(item.id)
                    ? current.filter((entry) => entry !== item.id)
                    : [...current, item.id],
                )
              }
              type="button"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="max-w-[112px] truncate sm:max-w-[160px]">
                {item.label}
              </span>
              {isPrimary ? (
                <span className="shrink-0 text-[10px] uppercase">Base</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[88px_minmax(0,1fr)]">
        <div className="hidden min-w-0 lg:flex lg:flex-col lg:justify-between">
          {visibleTicks.map((tick) => (
            <span
              key={tick}
              className="truncate text-xs font-medium text-slate-400"
            >
              {formatAxisAmount(tick)}
            </span>
          ))}
        </div>

        <div className="min-w-0">
          <div className="relative overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#f8fbfa_0%,#eef5f3_100%)] p-4 sm:p-5">
            {scale.ticks.map((tick) => {
              const y = getYPosition(tick, scale.domainMin, scale.range, height);

              return (
                <div
                  key={tick}
                  className={`pointer-events-none absolute left-0 right-0 border-t ${
                    tick === 0 ? "border-slate-300/90" : "border-slate-200/80"
                  }`}
                  style={{ top: `${y}px` }}
                />
              );
            })}

            <div className="pointer-events-none absolute inset-y-4 left-3 flex flex-col justify-between lg:hidden">
              {visibleTicks.map((tick) => (
                <span
                  key={tick}
                  className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-medium text-slate-500 backdrop-blur"
                >
                  {formatAxisAmount(tick)}
                </span>
              ))}
            </div>

            <svg
              className="relative h-[260px] w-full"
              preserveAspectRatio="none"
              viewBox={`0 0 ${width} ${height}`}
            >
              <defs>
                <linearGradient id="history-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0f766e" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0f766e" stopOpacity="0.03" />
                </linearGradient>
              </defs>

              {visibleSeries.map((item) => {
                const linePath = buildChartPath(
                  item.points,
                  width,
                  height,
                  scale.domainMin,
                  scale.range,
                );

                if (!linePath) {
                  return null;
                }

                return item.isPrimary ? (
                  <g key={item.id}>
                    <path
                      d={buildAreaPath(linePath, width, zeroY)}
                      fill="url(#history-fill)"
                    />
                    <path
                      d={linePath}
                      fill="none"
                      stroke={item.color}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                    />
                  </g>
                ) : (
                  <path
                    key={item.id}
                    d={linePath}
                    fill="none"
                    stroke={item.color}
                    strokeDasharray="8 8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                  />
                );
              })}
            </svg>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-[11px] font-medium text-slate-400 sm:text-xs">
            {visibleLabels.map((point) => (
              <span key={point.date} className="whitespace-nowrap">
                {formatPointLabel(point.date)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
