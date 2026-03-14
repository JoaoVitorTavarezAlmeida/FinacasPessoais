import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";
import { hasDatabaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (hasDatabaseUrl()) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,116,144,0.12),_transparent_28%),linear-gradient(180deg,#f5f7f4_0%,#eef2f1_100%)] px-4 py-6">
          <div className="w-full max-w-md rounded-[32px] border border-white/70 bg-white/88 p-6 text-center shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
              Acesso necessario
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              Entre para usar a dashboard
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Crie sua conta ou faca login para registrar transacoes e categorias.
            </p>
            <a
              className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              href="/auth"
            >
              Ir para autenticacao
            </a>
          </div>
        </main>
      );
    }

    const {
      CategoryForm,
      CategoriesPanel,
      HistoryChart,
      MobileNav,
      Sidebar,
      SummaryCard,
      TopBar,
      TransactionForm,
      TransactionsList,
    } = await import("@/components/dashboard");

    const { categories, history, summaryCards, transactions } =
      await getDashboardData(currentUser.id);

    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,116,144,0.12),_transparent_28%),linear-gradient(180deg,#f5f7f4_0%,#eef2f1_100%)] px-4 py-4 text-slate-950 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-6 lg:items-start">
            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-6">
              <MobileNav />
              <TopBar userEmail={currentUser.email} userName={currentUser.name} />

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => (
                  <SummaryCard key={card.id} card={card} />
                ))}
              </section>

              <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.95fr)]">
                <HistoryChart data={history} />
                <TransactionsList
                  categories={categories}
                  transactions={transactions}
                />
              </section>

              <section className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
                <CategoriesPanel categories={categories} />
                <TransactionForm categories={categories} />
              </section>

              <section className="grid gap-4">
                <CategoryForm />
              </section>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const {
    CategoryForm,
    CategoriesPanel,
    HistoryChart,
    MobileNav,
    Sidebar,
    SummaryCard,
    TopBar,
    TransactionForm,
    TransactionsList,
  } = await import("@/components/dashboard");

  const { categories, history, summaryCards, transactions } =
    await getDashboardData("mock-user");

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,116,144,0.12),_transparent_28%),linear-gradient(180deg,#f5f7f4_0%,#eef2f1_100%)] px-4 py-4 text-slate-950 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex gap-6 lg:items-start">
          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-6">
            <MobileNav />
            <TopBar />

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => (
                <SummaryCard key={card.id} card={card} />
              ))}
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.95fr)]">
              <HistoryChart data={history} />
              <TransactionsList
                categories={categories}
                transactions={transactions}
              />
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
              <CategoriesPanel categories={categories} />
              <TransactionForm categories={categories} />
            </section>

            <section className="grid gap-4">
              <CategoryForm />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
