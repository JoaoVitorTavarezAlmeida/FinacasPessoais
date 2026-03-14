"use client";

import { useFormStatus } from "react-dom";

import { signOutAction } from "@/app/actions/auth-actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="inline-flex h-12 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 shadow-sm transition hover:bg-rose-100"
      disabled={pending}
      type="submit"
    >
      {pending ? "Saindo..." : "Sair"}
    </button>
  );
}

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <SubmitButton />
    </form>
  );
}
