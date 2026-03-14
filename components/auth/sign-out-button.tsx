import { signOutAction } from "@/app/actions/auth-actions";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        className="rounded-2xl border border-white/14 bg-white/8 px-4 py-2 text-sm font-medium text-white"
        type="submit"
      >
        Sair
      </button>
    </form>
  );
}
