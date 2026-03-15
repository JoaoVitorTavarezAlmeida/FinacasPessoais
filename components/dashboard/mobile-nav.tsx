"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  ArrowUpRightIcon,
  ChartIcon,
  GoalIcon,
  MenuIcon,
  TagIcon,
  WalletIcon,
} from "@/components/dashboard/icons";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: ChartIcon },
  { label: "Transações", href: "/transactions", icon: ArrowUpRightIcon },
  { label: "Categorias", href: "/categories", icon: TagIcon },
  { label: "Metas", href: "/goals", icon: GoalIcon },
];

function getActiveLabel(pathname: string) {
  return navigation.find((item) => item.href === pathname)?.label ?? "Dashboard";
}

export function MobileNav({
  title = "Resumo diário",
}: {
  title?: string;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const activeLabel = getActiveLabel(pathname);

  return (
    <>
      <div className="rounded-[24px] border border-white/60 bg-white/75 px-4 py-3 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-950 text-white">
              <WalletIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs uppercase tracking-[0.24em] text-slate-500">
                Fatec Finanças
              </p>
              <p className="truncate text-sm font-semibold text-slate-900">
                {title}
              </p>
              <p className="mt-1 truncate text-xs font-medium text-slate-500">
                Em foco: {activeLabel}
              </p>
            </div>
          </div>

          <button
            aria-expanded={isOpen}
            aria-label={isOpen ? "Fechar navegação" : "Abrir navegação"}
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm transition duration-200 hover:bg-slate-50 ${
              isOpen ? "scale-95 bg-slate-100" : ""
            }`}
            onClick={() => setIsOpen((current) => !current)}
            type="button"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-[2px] transition duration-200 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        } lg:hidden`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex w-[min(84vw,320px)] flex-col justify-between bg-[linear-gradient(180deg,rgba(12,43,35,0.98),rgba(8,19,22,0.99))] px-5 py-6 text-white shadow-[0_24px_80px_rgba(6,18,24,0.32)] transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <WalletIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs uppercase tracking-[0.22em] text-white/55">
                  Fatec Finanças
                </p>
                <p className="truncate text-sm font-semibold text-white">
                  Navegação
                </p>
                <p className="mt-1 text-xs text-white/55">
                  Área ativa: {activeLabel}
                </p>
              </div>
            </div>

            <button
              aria-label="Fechar menu"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              ×
            </button>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                    active
                      ? "bg-white text-slate-950 shadow-lg"
                      : "text-white/78 hover:bg-white/8 hover:text-white"
                  }`}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="truncate text-sm font-medium">{item.label}</span>
                  {active ? (
                    <span className="ml-auto rounded-full bg-slate-950/8 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                      Ativo
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-white/50">
            Acesso rápido
          </p>
          <p className="mt-2 text-sm font-semibold text-white">
            Menu retrátil para foco no conteúdo
          </p>
          <p className="mt-2 text-sm leading-6 text-white/68">
            Abra apenas quando precisar navegar entre dashboard, transações,
            categorias e metas.
          </p>
        </div>
      </aside>
    </>
  );
}
