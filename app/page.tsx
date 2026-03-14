import {
  CategoryForm,
  CategoriesPanel,
  HistoryChart,
  MobileNav,
  Sidebar,
  SummaryCard,
  TopBar,
  TransactionsList,
} from "@/components/dashboard";
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { categories, history, summaryCards, transactions } =
    await getDashboardData();

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
              <TransactionsList transactions={transactions} />
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
              <CategoriesPanel categories={categories} />
              <CategoryForm />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
