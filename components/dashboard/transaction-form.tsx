"use client";

import { useActionState } from "react";

import { initialTransactionFormState } from "@/app/form-states";
import { ActionToast } from "@/components/feedback/action-toast";
import {
  createTransactionAction,
} from "@/app/actions/transaction-actions";
import type { Category } from "@/types/dashboard";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="mt-2 text-xs text-rose-200">{errors[0]}</p>;
}

export function TransactionForm({ categories }: { categories: Category[] }) {
  const [state, formAction, isPending] = useActionState(
    createTransactionAction,
    initialTransactionFormState,
  );
  const formState = state ?? initialTransactionFormState;

  return (
    <section className="rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96))] p-5 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] md:p-6">
      <ActionToast message={formState.message} success={formState.success} />

      <p className="text-sm uppercase tracking-[0.2em] text-white/60">
        Nova transacao
      </p>
      <h3 className="mt-2 text-xl font-semibold">Registrar movimentacao</h3>
      <p className="mt-2 text-sm leading-6 text-white/72">
        Alimente a dashboard com entradas e saidas reais.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
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
          <label className="block">
            <span className="text-sm font-medium text-white/80">Categoria</span>
            <select
              className="mt-2 h-[50px] w-full rounded-2xl border border-white/12 bg-slate-900 px-4 text-sm text-white"
              defaultValue=""
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
