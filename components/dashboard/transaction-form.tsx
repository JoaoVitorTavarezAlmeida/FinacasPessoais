"use client";

import { useActionState, useState } from "react";

import { initialTransactionFormState } from "@/app/form-states";
import { ActionToast } from "@/components/feedback/action-toast";
import {
  createTransactionAction,
} from "@/app/actions/transaction-actions";
import type { Category, Goal, TransactionScope } from "@/types/dashboard";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="mt-2 text-xs text-rose-200">{errors[0]}</p>;
}

export function TransactionForm({
  categories,
  goals,
}: {
  categories: Category[];
  goals: Goal[];
}) {
  const [state, formAction, isPending] = useActionState(
    createTransactionAction,
    initialTransactionFormState,
  );
  const formState = state ?? initialTransactionFormState;
  const [scope, setScope] = useState<TransactionScope>("balance");

  return (
    <section className="rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96))] p-5 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] md:p-6">
      <ActionToast message={formState.message} success={formState.success} />

      <p className="text-sm uppercase tracking-[0.2em] text-white/60">
        Nova transacao
      </p>
      <h3 className="mt-2 text-xl font-semibold">Registrar movimentacao</h3>
      <p className="mt-2 text-sm leading-6 text-white/72">
        Registre entradas, saidas e aportes ou retiradas de metas.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-white/80">Aplicar em</span>
          <select
            className="mt-2 h-[50px] w-full rounded-2xl border border-white/12 bg-slate-900 px-4 text-sm text-white"
            defaultValue="balance"
            name="scope"
            onChange={(event) => setScope(event.target.value as TransactionScope)}
          >
            <option value="balance">Saldo geral</option>
            <option value="goal">Meta</option>
          </select>
          <FieldError errors={formState.errors.scope} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-white/80">Titulo</span>
          <input
            className="mt-2 w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white"
            name="title"
            placeholder="Ex.: Mercado do mes"
            type="text"
          />
          <FieldError errors={formState.errors.title} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-white/80">Valor</span>
            <input
              className="mt-2 w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white"
              name="amount"
              placeholder="R$ 0,00"
              type="text"
            />
            <FieldError errors={formState.errors.amount} />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-white/80">Tipo</span>
            <select
              className="mt-2 h-[50px] w-full rounded-2xl border border-white/12 bg-slate-900 px-4 text-sm text-white"
              defaultValue="expense"
              name="type"
            >
              <option value="expense">Saida</option>
              <option value="income">Entrada</option>
            </select>
            <FieldError errors={formState.errors.type} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label
            className={`block transition ${
              scope === "balance" ? "opacity-100" : "opacity-45"
            }`}
          >
            <span className="text-sm font-medium text-white/80">
              Categoria
            </span>
            <select
              className="mt-2 h-[50px] w-full rounded-2xl border border-white/12 bg-slate-900 px-4 text-sm text-white disabled:cursor-not-allowed disabled:bg-slate-950/60 disabled:text-white/35"
              defaultValue=""
              disabled={scope !== "balance"}
              name="categoryId"
            >
              <option disabled value="">
                Selecione
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <FieldError errors={formState.errors.categoryId} />
          </label>

          <label
            className={`block transition ${
              scope === "goal" ? "opacity-100" : "opacity-45"
            }`}
          >
            <span className="text-sm font-medium text-white/80">Meta</span>
            <select
              className="mt-2 h-[50px] w-full rounded-2xl border border-white/12 bg-slate-900 px-4 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue=""
              disabled={scope !== "goal"}
              name="goalId"
            >
              <option disabled value="">
                Selecione
              </option>
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.name}
                </option>
              ))}
            </select>
            <FieldError errors={formState.errors.goalId} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-white/80">Data</span>
            <input
              className="mt-2 h-[50px] w-full rounded-2xl border border-white/12 bg-white/8 px-4 text-sm text-white"
              defaultValue={new Date().toISOString().slice(0, 10)}
              name="occurredAt"
              type="date"
            />
            <FieldError errors={formState.errors.occurredAt} />
          </label>
          <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm leading-6 text-white/72">
            {scope === "goal"
              ? "Movimentações de meta atualizam o saldo da meta e ficam fora do saldo geral."
              : "Movimentações operacionais entram no saldo, cards e histórico da dashboard."}
          </div>
        </div>

        {formState.message ? (
          <p
            className={`text-sm ${
              formState.success ? "text-emerald-100" : "text-rose-100"
            }`}
          >
            {formState.message}
          </p>
        ) : null}

        <button
          className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Salvando..." : "Salvar transacao"}
        </button>
      </form>
    </section>
  );
}
