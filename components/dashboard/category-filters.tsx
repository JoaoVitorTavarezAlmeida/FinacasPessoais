type CategoryFiltersProps = {
  selectedLimit?: string;
  search?: string;
};

export function CategoryFilters({
  selectedLimit = "",
  search = "",
}: CategoryFiltersProps) {
  return (
    <section className="rounded-[30px] border border-white/70 bg-white/84 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Filtros
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">
            Refine as categorias
          </h3>
        </div>
      </div>

      <form className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1.25fr)_minmax(220px,0.75fr)_auto]">
        <label className="block min-w-0">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Busca
          </span>
          <input
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900"
            defaultValue={search}
            name="q"
            placeholder="Nome ou descricao"
            type="search"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Limite
          </span>
          <select
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900"
            defaultValue={selectedLimit}
            name="limit"
          >
            <option value="">Todas</option>
            <option value="limited">Com limite</option>
            <option value="unlimited">Sem limite</option>
          </select>
        </label>

        <div className="flex items-end gap-2">
          <button
            className="h-12 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white"
            type="submit"
          >
            Aplicar
          </button>
          <a
            className="inline-flex h-12 items-center rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-700"
            href="/categories"
          >
            Limpar
          </a>
        </div>
      </form>
    </section>
  );
}
