import type { Goal } from "@/types/dashboard";

export type GoalHighlight = {
  name: string;
  progress: number;
  statusLabel: string;
  description: string;
};

export function getGoalHighlight(goals: Goal[]): GoalHighlight | null {
  if (!goals.length) {
    return null;
  }

  const highlight = [...goals].sort((left, right) => right.progress - left.progress)[0];

  if (highlight.progress >= 100) {
    return {
      name: highlight.name,
      progress: 100,
      statusLabel: "Meta atingida",
      description: "Objetivo concluído com 100% de progresso.",
    };
  }

  if (highlight.progress > 0) {
    return {
      name: highlight.name,
      progress: highlight.progress,
      statusLabel: "Meta em andamento",
      description: `Você já completou ${highlight.progress}% da meta atual.`,
    };
  }

  return {
    name: highlight.name,
    progress: 0,
    statusLabel: "Meta iniciada",
    description: "Comece a alimentar essa meta com aportes reais.",
  };
}
