import { redirect } from "next/navigation";

import {
  AppShell,
  CategoriesPanel,
  CategoryFilters,
  CategoryForm,
} from "@/components/dashboard";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";
import { hasDatabaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

type CategoriesPageProps = {
  searchParams: Promise<{
    q?: string;
    limit?: string;
  }>;
};

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  if (!hasDatabaseUrl()) {
    redirect("/dashboard");
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth");
  }

  const { categories } = await getDashboardData(currentUser.id);
  const filters = await searchParams;
  const search = filters.q?.trim().toLowerCase() ?? "";
  const selectedLimit = filters.limit ?? "";
  const filteredCategories = categories.filter((category) =>
    [
      search
        ? `${category.name} ${category.description}`
            .toLowerCase()
            .includes(search)
        : true,
      selectedLimit === "limited"
        ? category.amount !== "Sem limite"
        : selectedLimit === "unlimited"
          ? category.amount === "Sem limite"
          : true,
    ].every(Boolean),
  );
  const totalLimited = filteredCategories.filter(
    (category) => category.amount !== "Sem limite",
  ).length;
  const highlightCategory = filteredCategories.find(
    (category) => category.amount !== "Sem limite",
  );

  return (
    <AppShell
      description="Organize seus gastos por grupos, ajuste limites e mantenha a classificação das transações consistente."
      eyebrow="Categorias"
      title="Controle de categorias"
      user={currentUser}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[26px] border border-white/70 bg-white/84 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur">
          <p className="text-sm text-slate-500">Categorias filtradas</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {filteredCategories.length}
          </p>
        </article>
        <article className="rounded-[26px] border border-white/70 bg-white/84 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur">
          <p className="text-sm text-slate-500">Com limite definido</p>
          <p className="mt-3 text-3xl font-semibold text-sky-700">{totalLimited}</p>
        </article>
        <article className="rounded-[26px] border border-white/70 bg-white/84 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur">
          <p className="text-sm text-slate-500">Categoria em destaque</p>
          <p className="mt-3 text-lg font-semibold text-amber-600">
            {highlightCategory?.name ?? "Nenhuma"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {highlightCategory?.amount ?? "Ajuste filtros ou crie uma categoria"}
          </p>
        </article>
      </section>

      <CategoryFilters search={filters.q} selectedLimit={selectedLimit} />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <CategoriesPanel
          action={
            <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              {filteredCategories.length} itens
            </span>
          }
          categories={filteredCategories}
          eyebrow="Resultado"
          title="Categorias encontradas"
        />
        <CategoryForm />
      </section>
    </AppShell>
  );
}
