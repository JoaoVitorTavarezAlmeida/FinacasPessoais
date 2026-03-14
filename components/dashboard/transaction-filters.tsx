import type { Category } from "@/types/dashboard";

type TransactionFiltersProps = {
  categories: Category[];
  endDate?: string;
  startDate?: string;
  selectedCategory?: string;
  selectedType?: string;
  search?: string;
};

export function TransactionFilters({
  categories,
  endDate = "",
  startDate = "",
  selectedCategory = "",
  selectedType = "",
  search = "",
}: TransactionFiltersProps) {
  return (
    <section className="rounded-[30px] border border-white/70 bg-white/84 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Filtros
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">
            Refine a visualização
          </h3>
        </div>
      </div>

      <form className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <label className="block min-w-0">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Busca
          </span>
          <input
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900"
            defaultValue={search}
            name="q"
            placeholder="Titulo ou categoria"
            type="search"
          />
        </label>

        <label className="block min-w-0">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Tipo
          </span>
          <select
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900"
            defaultValue={selectedType}
            name="type"
          >
            <option value="">Todos</option>
            <option value="income">Entradas</option>
            <option value="expense">Saídas</option>
          </select>
        </label>

        <label className="block min-w-0">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Categoria
          </span>
          <select
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900"
            defaultValue={selectedCategory}
            name="category"
          >
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block min-w-0">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            De
          </span>
          <input
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900"
            defaultValue={startDate}
            name="start"
            type="date"
          />
        </label>

        <label className="block min-w-0">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Até
          </span>
          <input
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900"
            defaultValue={endDate}
            name="end"
            type="date"
          />
        </label>

        <div className="flex flex-col items-stretch gap-2 sm:col-span-2 sm:flex-row sm:items-end xl:col-span-3 xl:justify-end">
          <button
            className="h-12 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white sm:min-w-[112px]"
            type="submit"
          >
            Aplicar
          </button>
          <a
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-700 sm:min-w-[112px]"
            href="/transactions"
          >
            Limpar
          </a>
        </div>
      </form>
    </section>
  );
}
