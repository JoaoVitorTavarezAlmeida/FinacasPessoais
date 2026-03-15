import type {
  Category,
  DashboardData,
  Goal,
  HistoryPoint,
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
  { day: "01", amount: 3200 },
  { day: "02", amount: 2800 },
  { day: "03", amount: 3500 },
  { day: "04", amount: 3000 },
  { day: "05", amount: 3900 },
  { day: "06", amount: 3600 },
  { day: "07", amount: 4200 },
  { day: "08", amount: 4100 },
  { day: "09", amount: 4600 },
  { day: "10", amount: 4300 },
  { day: "11", amount: 4700 },
  { day: "12", amount: 4400 },
  { day: "13", amount: 5200 },
  { day: "14", amount: 4800 },
  { day: "15", amount: 5100 },
  { day: "16", amount: 4950 },
  { day: "17", amount: 5300 },
  { day: "18", amount: 5000 },
  { day: "19", amount: 5450 },
  { day: "20", amount: 5150 },
  { day: "21", amount: 5600 },
  { day: "22", amount: 5380 },
  { day: "23", amount: 5900 },
  { day: "24", amount: 5700 },
  { day: "25", amount: 6200 },
  { day: "26", amount: 6000 },
  { day: "27", amount: 6550 },
  { day: "28", amount: 6320 },
  { day: "29", amount: 6820 },
  { day: "30", amount: 6650 },
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
  transactions,
  categories,
  goals,
};
