import { MenuIcon, WalletIcon } from "@/components/dashboard/icons";

export function MobileNav() {
  return (
    <div className="flex items-center justify-between rounded-[24px] border border-white/60 bg-white/75 px-4 py-3 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-950 text-white">
          <WalletIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Fatec Finanças
          </p>
          <p className="text-sm font-semibold text-slate-900">Resumo diário</p>
        </div>
      </div>

      <button
        aria-label="Abrir menu"
        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700"
        type="button"
      >
        <MenuIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
