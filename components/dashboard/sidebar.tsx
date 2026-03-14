import {
  ArrowUpRightIcon,
  ChartIcon,
  GoalIcon,
  TagIcon,
  WalletIcon,
} from "@/components/dashboard/icons";

const navigation = [
  { label: "Visão geral", icon: ChartIcon, active: true },
  { label: "Transações", icon: ArrowUpRightIcon, active: false },
  { label: "Categorias", icon: TagIcon, active: false },
  { label: "Planejamento", icon: GoalIcon, active: false },
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 flex-col justify-between rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(12,43,35,0.96),rgba(8,19,22,0.98))] p-6 text-white shadow-[0_24px_80px_rgba(6,18,24,0.24)] lg:flex">
      <div className="space-y-10">
        <div className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <WalletIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-white/55">
              Fatec Finanças
            </p>
            <h1 className="mt-2 text-2xl font-semibold">Dashboard pessoal</h1>
          </div>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                  item.active
                    ? "bg-white text-slate-950 shadow-lg"
                    : "text-white/72 hover:bg-white/8 hover:text-white"
                }`}
                type="button"
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
        <p className="text-sm text-white/65">Meta em andamento</p>
        <p className="mt-2 text-xl font-semibold">Reserva de emergência</p>
        <p className="mt-3 text-sm text-white/70">
          Você já completou 73% da sua meta anual.
        </p>
        <div className="mt-5 h-2 rounded-full bg-white/10">
          <div className="h-2 w-[73%] rounded-full bg-emerald-300" />
        </div>
      </div>
    </aside>
  );
}
