import { redirect } from "next/navigation";

import { AppShell, CategoriesPanel, CategoryForm } from "@/components/dashboard";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";
import { hasDatabaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  if (!hasDatabaseUrl()) {
    redirect("/dashboard");
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth");
  }

  const { categories } = await getDashboardData(currentUser.id);

  return (
    <AppShell
      description="Organize seus gastos por grupos, ajuste limites e mantenha a classificação das transações consistente."
      eyebrow="Categorias"
      title="Controle de categorias"
      user={currentUser}
    >
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <CategoriesPanel categories={categories} />
        <CategoryForm />
      </section>
    </AppShell>
  );
}
