import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const appUserId = process.env.APP_USER_ID ?? "mock-user";

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run the seed.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const categories = [
  {
    id: "housing",
    name: "Moradia",
    description: "Aluguel, condominio e contas fixas.",
    monthlyLimit: 2450,
    color: "#0f766e",
  },
  {
    id: "food",
    name: "Alimentacao",
    description: "Mercado, delivery e refeicoes fora.",
    monthlyLimit: 1120,
    color: "#f97316",
  },
  {
    id: "transport",
    name: "Transporte",
    description: "Combustivel, apps e manutencao.",
    monthlyLimit: 780,
    color: "#2563eb",
  },
  {
    id: "leisure",
    name: "Lazer",
    description: "Cinema, viagens curtas e streaming.",
    monthlyLimit: 540,
    color: "#7c3aed",
  },
];

const transactions = [
  {
    title: "Salario",
    description: "Credito principal do mes",
    amount: 8300,
    type: "INCOME",
    categoryId: null,
    daysAgo: 1,
  },
  {
    title: "Freela UX",
    description: "Projeto de interface",
    amount: 1200,
    type: "INCOME",
    categoryId: null,
    daysAgo: 3,
  },
  {
    title: "Supermercado Aurora",
    description: "Compra mensal",
    amount: 286,
    type: "EXPENSE",
    categoryId: "food",
    daysAgo: 1,
  },
  {
    title: "Assinatura streaming",
    description: "Plano padrao",
    amount: 39,
    type: "EXPENSE",
    categoryId: "leisure",
    daysAgo: 5,
  },
  {
    title: "Combustivel",
    description: "Abastecimento",
    amount: 220,
    type: "EXPENSE",
    categoryId: "transport",
    daysAgo: 2,
  },
  {
    title: "Aluguel",
    description: "Pagamento mensal",
    amount: 1800,
    type: "EXPENSE",
    categoryId: "housing",
    daysAgo: 10,
  },
  {
    title: "Mercado complementar",
    description: "Reposicao da semana",
    amount: 145,
    type: "EXPENSE",
    categoryId: "food",
    daysAgo: 8,
  },
  {
    title: "Transporte por app",
    description: "Corridas urbanas",
    amount: 74,
    type: "EXPENSE",
    categoryId: "transport",
    daysAgo: 6,
  },
];

const goals = [
  {
    name: "Reserva de emergencia",
    target: 15000,
    current: 10950,
    deadline: addDays(new Date(), 180),
  },
  {
    name: "Viagem de ferias",
    target: 6000,
    current: 3200,
    deadline: addDays(new Date(), 240),
  },
];

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

async function main() {
  const passwordHash = await bcrypt.hash("12345678", 12);

  await prisma.user.upsert({
    where: { id: appUserId },
    update: {
      name: "Usuario Inicial",
      email: `${appUserId}@local.test`,
      passwordHash,
    },
    create: {
      id: appUserId,
      name: "Usuario Inicial",
      email: `${appUserId}@local.test`,
      passwordHash,
    },
  });

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        description: category.description,
        monthlyLimit: category.monthlyLimit,
        color: category.color,
        userId: appUserId,
      },
      create: {
        id: category.id,
        name: category.name,
        description: category.description,
        monthlyLimit: category.monthlyLimit,
        color: category.color,
        userId: appUserId,
      },
    });
  }

  await prisma.transaction.deleteMany({
    where: { userId: appUserId },
  });

  await prisma.goal.deleteMany({
    where: { userId: appUserId },
  });

  await prisma.transaction.createMany({
    data: transactions.map((transaction, index) => ({
      id: `tx-${index + 1}`,
      title: transaction.title,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      occurredAt: daysAgo(transaction.daysAgo),
      userId: appUserId,
      categoryId: transaction.categoryId,
    })),
  });

  for (const [index, goal] of goals.entries()) {
    await prisma.goal.upsert({
      where: { id: `goal-${index + 1}` },
      update: {
        name: goal.name,
        target: goal.target,
        current: goal.current,
        deadline: goal.deadline,
        userId: appUserId,
      },
      create: {
        id: `goal-${index + 1}`,
        name: goal.name,
        target: goal.target,
        current: goal.current,
        deadline: goal.deadline,
        userId: appUserId,
      },
    });
  }

  console.log("Seed concluido com sucesso.");
}

main()
  .catch((error) => {
    console.error("Falha no seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
