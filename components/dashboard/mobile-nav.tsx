import Link from "next/link";

import { WalletIcon } from "@/components/dashboard/icons";

const navigation = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Transações", href: "/transactions" },
  { label: "Categorias", href: "/categories" },
  { label: "Metas", href: "/goals" },
];

export function MobileNav({
  title = "Resumo diário",
}: {
  title?: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/60 bg-white/75 px-4 py-3 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-950 text-white">
            <WalletIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Fatec Finanças
            </p>
            <p className="text-sm font-semibold text-slate-900">{title}</p>
          </div>
        </div>
      </div>

      <nav className="mt-4 grid grid-cols-4 gap-2">
        {navigation.map((item) => (
          <Link
            key={item.href}
            className="rounded-xl bg-slate-100 px-3 py-2 text-center text-xs font-medium text-slate-700"
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
