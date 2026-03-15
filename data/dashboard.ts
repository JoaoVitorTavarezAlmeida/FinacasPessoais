import type {
  Category,
  DashboardData,
  Goal,
  HistoryPoint,
  HistoryPeriod,
  HistorySeries,
  SummaryCardData,
  Transaction,
} from "@/types/dashboard";

export const summaryCards: SummaryCardData[] = [
  {
    id: "income",
    label: "Entradas",
    value: "R$ 12.480",
    change: "+8,2% este mês",
    tone: "success",
  },
  {
    id: "expense",
    label: "Saídas",
    value: "R$ 7.930",
    change: "-3,1% vs. fevereiro",
    tone: "danger",
  },
  {
    id: "balance",
    label: "Saldo",
    value: "R$ 4.550",
    change: "Reserva em crescimento",
    tone: "neutral",
  },
  {
    id: "goals",
    label: "Metas",
    value: "73%",
    change: "Meta viagem em destaque",
    tone: "accent",
  },
];

export const history: HistoryPoint[] = [
  { date: "2026-03-01", day: "01", amount: 3200 },
  { date: "2026-03-02", day: "02", amount: 2800 },
  { date: "2026-03-03", day: "03", amount: 3500 },
  { date: "2026-03-04", day: "04", amount: 3000 },
  { date: "2026-03-05", day: "05", amount: 3900 },
  { date: "2026-03-06", day: "06", amount: 3600 },
  { date: "2026-03-07", day: "07", amount: 4200 },
  { date: "2026-03-08", day: "08", amount: 4100 },
  { date: "2026-03-09", day: "09", amount: 4600 },
  { date: "2026-03-10", day: "10", amount: 4300 },
  { date: "2026-03-11", day: "11", amount: 4700 },
  { date: "2026-03-12", day: "12", amount: 4400 },
  { date: "2026-03-13", day: "13", amount: 5200 },
  { date: "2026-03-14", day: "14", amount: 4800 },
  { date: "2026-03-15", day: "15", amount: 5100 },
  { date: "2026-03-16", day: "16", amount: 4950 },
  { date: "2026-03-17", day: "17", amount: 5300 },
  { date: "2026-03-18", day: "18", amount: 5000 },
  { date: "2026-03-19", day: "19", amount: 5450 },
  { date: "2026-03-20", day: "20", amount: 5150 },
  { date: "2026-03-21", day: "21", amount: 5600 },
  { date: "2026-03-22", day: "22", amount: 5380 },
  { date: "2026-03-23", day: "23", amount: 5900 },
  { date: "2026-03-24", day: "24", amount: 5700 },
  { date: "2026-03-25", day: "25", amount: 6200 },
  { date: "2026-03-26", day: "26", amount: 6000 },
  { date: "2026-03-27", day: "27", amount: 6550 },
  { date: "2026-03-28", day: "28", amount: 6320 },
  { date: "2026-03-29", day: "29", amount: 6820 },
  { date: "2026-03-30", day: "30", amount: 6650 },
];

export const historyPeriod: HistoryPeriod = {
  preset: "current_month",
  startDate: "2026-03-01",
  endDate: "2026-03-30",
  label: "Mês atual",
};

export const historySeries: HistorySeries[] = [
  {
    id: "balance",
    label: "Saldo principal",
    color: "#0f766e",
    isPrimary: true,
    points: history,
  },
  {
    id: "food",
    label: "Alimentação",
    color: "#f97316",
    points: history.map((point, index) => ({
      ...point,
      amount: [-120, -220, -80, -150, -260, -140, -190, -230, -210, -240][
        index % 10
      ]
        ? history
            .slice(0, index + 1)
            .reduce(
              (total, _, innerIndex) =>
                total +
                [-120, -220, -80, -150, -260, -140, -190, -230, -210, -240][
                  innerIndex % 10
                ],
              0,
            )
        : 0,
    })),
  },
  {
    id: "transport",
    label: "Transporte",
    color: "#2563eb",
    points: history.map((point, index) => ({
      ...point,
      amount: history
        .slice(0, index + 1)
        .reduce(
          (total, _, innerIndex) =>
            total + [-40, -65, -20, -90, -35, -60][innerIndex % 6],
          0,
        ),
    })),
  },
  {
    id: "leisure",
    label: "Lazer",
    color: "#7c3aed",
    points: history.map((point, index) => ({
      ...point,
      amount: history
        .slice(0, index + 1)
        .reduce(
          (total, _, innerIndex) =>
            total + [-15, -25, -10, -40, -18][innerIndex % 5],
          0,
        ),
    })),
  },
];

export const transactions: Transaction[] = [
  {
    id: "1",
    title: "Salário",
    category: "Renda fixa",
    date: "Hoje, 09:12",
    amount: "+R$ 8.300",
    scope: "balance",
    type: "income",
  },
  {
    id: "2",
    title: "Supermercado Aurora",
    category: "Alimentação",
    date: "Hoje, 07:45",
    amount: "-R$ 286",
    scope: "balance",
    type: "expense",
  },
  {
    id: "3",
    title: "Assinatura de streaming",
    category: "Lazer",
    date: "Ontem, 22:18",
    amount: "-R$ 39",
    scope: "balance",
    type: "expense",
  },
  {
    id: "4",
    title: "Freela UX",
    category: "Projetos extras",
    date: "Ontem, 18:03",
    amount: "+R$ 1.200",
    scope: "balance",
    type: "income",
  },
  {
    id: "5",
    title: "Combustível",
    category: "Transporte",
    date: "12 mar, 08:30",
    amount: "-R$ 220",
    scope: "balance",
    type: "expense",
  },
];

export const categories: Category[] = [
  {
    id: "housing",
    name: "Moradia",
    description: "Aluguel, condomínio e contas fixas.",
    amount: "R$ 2.450",
    color: "#0f766e",
  },
  {
    id: "food",
    name: "Alimentação",
    description: "Mercado, delivery e refeições fora.",
    amount: "R$ 1.120",
    color: "#f97316",
  },
  {
    id: "transport",
    name: "Transporte",
    description: "Combustível, apps e manutenção.",
    amount: "R$ 780",
    color: "#2563eb",
  },
  {
    id: "leisure",
    name: "Lazer",
    description: "Cinema, viagens curtas e streaming.",
    amount: "R$ 540",
    color: "#7c3aed",
  },
];

export const goals: Goal[] = [
  {
    id: "reserve",
    name: "Reserva de emergencia",
    target: "R$ 15.000",
    current: "R$ 10.950",
    progress: 73,
    deadline: "2026-12-12",
  },
  {
    id: "trip",
    name: "Viagem de ferias",
    target: "R$ 6.000",
    current: "R$ 3.200",
    progress: 53,
    deadline: "2027-01-18",
  },
];

export const dashboardMockData: DashboardData = {
  summaryCards,
  history,
  historyPeriod,
  historySeries,
  transactions,
  categories,
  goals,
};
