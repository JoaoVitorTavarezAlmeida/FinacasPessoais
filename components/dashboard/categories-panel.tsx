import { PlusIcon } from "@/components/dashboard/icons";
import type { Category } from "@/types/dashboard";

export function CategoriesPanel({ categories }: { categories: Category[] }) {
  return (
    <section className="rounded-[30px] border border-white/70 bg-white/84 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Categorias
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">
            Organização de despesas
          </h3>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white"
          type="button"
        >
          <PlusIcon className="h-4 w-4" />
          Nova categoria
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {categories.map((category) => (
          <article
            key={category.id}
            className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1 h-3 w-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {category.name}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {category.description}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {category.amount}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
