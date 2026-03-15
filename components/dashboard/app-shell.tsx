import type { ReactNode } from "react";

import { MobileNav } from "@/components/dashboard/mobile-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import type { GoalHighlight } from "@/lib/dashboard/get-goal-highlight";
import type { AuthenticatedUser } from "@/types/dashboard";

type AppShellProps = {
  children: ReactNode;
  title: string;
  eyebrow: string;
  description?: string;
  searchAction?: string;
  searchDefaultValue?: string;
  searchHiddenFields?: Record<string, string | undefined>;
  searchPlaceholder?: string;
  goalHighlight?: GoalHighlight | null;
  user?: AuthenticatedUser | null;
};

export function AppShell({
  children,
  title,
  eyebrow,
  description,
  searchAction,
  searchDefaultValue,
  searchHiddenFields,
  searchPlaceholder,
  goalHighlight,
  user,
}: AppShellProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,116,144,0.12),_transparent_28%),linear-gradient(180deg,#f5f7f4_0%,#eef2f1_100%)] px-4 py-4 text-slate-950 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex gap-6 lg:items-start">
          <Sidebar goalHighlight={goalHighlight} />

          <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-6">
            <MobileNav title={title} />
            <TopBar
              description={description}
              eyebrow={eyebrow}
              searchAction={searchAction}
              searchDefaultValue={searchDefaultValue}
              searchHiddenFields={searchHiddenFields}
              searchPlaceholder={searchPlaceholder}
              title={title}
              userEmail={user?.email}
              userName={user?.name}
            />
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
