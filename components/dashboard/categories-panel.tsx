import { CategoryListItem } from "@/components/dashboard/category-list-item";
import type { Category } from "@/types/dashboard";

export function CategoriesPanel({
  categories,
  title = "Organização de despesas",
  eyebrow = "Categorias",
  action,
  emptyMessage = "Nenhuma categoria encontrada para os filtros atuais.",
}: {
  categories: Category[];
  title?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  emptyMessage?: string;
}) {
  return (
    <section className="rounded-[30px] border border-white/70 bg-white/84 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            {eyebrow}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">
            {title}
          </h3>
        </div>
        {action ?? (
          <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            {categories.length} categorias
          </span>
        )}
      </div>

      {categories.length ? (
        <div className="mt-6 space-y-3">
          {categories.map((category) => (
            <CategoryListItem key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 p-6 text-sm text-slate-500">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}
