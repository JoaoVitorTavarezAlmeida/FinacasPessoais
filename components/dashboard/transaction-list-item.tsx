"use client";

import { useActionState } from "react";

import {
  deleteTransactionAction,
  initialTransactionFormState,
  updateTransactionAction,
} from "@/app/actions/transaction-actions";
import type { Category, Transaction } from "@/types/dashboard";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="mt-2 text-xs text-rose-600">{errors[0]}</p>;
}

export function TransactionListItem({
  transaction,
  categories,
}: {
  transaction: Transaction;
  categories: Category[];
}) {
  const [state, formAction, isPending] = useActionState(
    updateTransactionAction,
    initialTransactionFormState,
  );
  const formState = state ?? initialTransactionFormState;

  return (
    <article className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            {transaction.title}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span>{transaction.category}</span>
            <span>{transaction.date}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p
            className={`shrink-0 text-sm font-semibold ${
              transaction.type === "income"
                ? "text-emerald-600"
                : "text-rose-600"
            }`}
          >
            {transaction.amount}
          </p>
          <details className="group">
            <summary className="cursor-pointer list-none rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700">
              Editar
            </summary>
            <div className="mt-3 w-full min-w-[280px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <form action={formAction} className="space-y-3">
                <input name="id" type="hidden" value={transaction.id} />

                <label className="block">
                  <span className="text-xs font-medium text-slate-600">
                    Titulo
                  </span>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                    defaultValue={transaction.title}
                    name="title"
                    type="text"
                  />
                  <FieldError errors={formState.errors.title} />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-medium text-slate-600">
                      Valor
                    </span>
                    <input
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                      defaultValue={transaction.amount.replace("+", "").replace("-", "")}
                      name="amount"
                      type="text"
                    />
                    <FieldError errors={formState.errors.amount} />
                  </label>

                  <label className="block">
                    <span className="text-xs font-medium text-slate-600">
                      Tipo
                    </span>
                    <select
                      className="mt-1 h-[42px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900"
                      defaultValue={transaction.type}
                      name="type"
                    >
                      <option value="expense">Saida</option>
                      <option value="income">Entrada</option>
                    </select>
                    <FieldError errors={formState.errors.type} />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-medium text-slate-600">
                      Categoria
                    </span>
                    <select
                      className="mt-1 h-[42px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900"
                      defaultValue={transaction.categoryId ?? ""}
                      name="categoryId"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <FieldError errors={formState.errors.categoryId} />
                  </label>

                  <label className="block">
                    <span className="text-xs font-medium text-slate-600">
                      Data
                    </span>
                    <input
                      className="mt-1 h-[42px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900"
                      defaultValue={transaction.occurredAt}
                      name="occurredAt"
                      type="date"
                    />
                    <FieldError errors={formState.errors.occurredAt} />
                  </label>
                </div>

                {formState.message ? (
                  <p
                    className={`text-xs ${
                      formState.success ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {formState.message}
                  </p>
                ) : null}

                <div className="flex items-center justify-between gap-3">
                  <button
                    className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white"
                    disabled={isPending}
                    type="submit"
                  >
                    {isPending ? "Salvando..." : "Salvar"}
                  </button>

                  <button
                    className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600"
                    formAction={deleteTransactionAction}
                    type="submit"
                  >
                    Excluir
                  </button>
                </div>
              </form>
            </div>
          </details>
        </div>
      </div>
    </article>
  );
}
