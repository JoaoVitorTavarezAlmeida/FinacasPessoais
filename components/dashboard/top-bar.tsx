import { BellIcon, SearchIcon } from "@/components/dashboard/icons";
import { SignOutButton } from "@/components/auth/sign-out-button";

export function TopBar({
  userName,
  userEmail,
}: {
  userName?: string;
  userEmail?: string;
}) {
  return (
    <header className="flex flex-col gap-4 rounded-[28px] border border-white/65 bg-white/78 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between md:p-5">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          Painel financeiro
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
          Controle completo das suas finanças
        </h2>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 sm:min-w-[320px]">
          <SearchIcon className="h-5 w-5 shrink-0" />
          <input
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="Buscar transação, categoria ou meta"
            type="search"
          />
        </label>

        <button
          aria-label="Notificações"
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700"
          type="button"
        >
          <BellIcon className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 rounded-2xl bg-slate-950 px-3 py-2 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold">
            {(userName ?? "VA")
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="pr-1">
            <p className="text-sm font-medium">
              {userName ?? "Modo demonstracao"}
            </p>
            <p className="text-xs text-white/60">
              {userEmail ?? "Planejamento mensal"}
            </p>
          </div>
        </div>

        {userName ? <SignOutButton /> : null}
      </div>
    </header>
  );
}
