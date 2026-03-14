import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { getCurrentUser } from "@/lib/auth/session";
import { hasDatabaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function AuthPage() {
  if (!hasDatabaseUrl()) {
    redirect("/dashboard");
  }

  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,116,144,0.12),_transparent_28%),linear-gradient(180deg,#f5f7f4_0%,#eef2f1_100%)] px-4 py-6">
      <AuthCard />
    </main>
  );
}
