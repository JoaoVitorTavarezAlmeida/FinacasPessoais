import type { ReactNode } from "react";

type IconProps = {
  className?: string;
};

function IconWrapper({
  className,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      {children}
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <IconWrapper className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconWrapper>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <IconWrapper className={className}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </IconWrapper>
  );
}

export function BellIcon({ className }: IconProps) {
  return (
    <IconWrapper className={className}>
      <path d="M6.5 15.5V11a5.5 5.5 0 1 1 11 0v4.5l1.5 1.5H5z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </IconWrapper>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <IconWrapper className={className}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </IconWrapper>
  );
}

export function ArrowUpRightIcon({ className }: IconProps) {
  return (
    <IconWrapper className={className}>
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </IconWrapper>
  );
}

export function WalletIcon({ className }: IconProps) {
  return (
    <IconWrapper className={className}>
      <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 15.5z" />
      <path d="M16 13h4" />
      <circle cx="16" cy="13" r=".5" fill="currentColor" stroke="none" />
    </IconWrapper>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <IconWrapper className={className}>
      <path d="m4 11 8-6 8 6" />
      <path d="M6.5 10.5V19h11v-8.5" />
      <path d="M10 19v-5h4v5" />
    </IconWrapper>
  );
}

export function ChartIcon({ className }: IconProps) {
  return (
    <IconWrapper className={className}>
      <path d="M5 17V7" />
      <path d="M12 17V10" />
      <path d="M19 17V5" />
    </IconWrapper>
  );
}

export function TagIcon({ className }: IconProps) {
  return (
    <IconWrapper className={className}>
      <path d="m10 4 9 9-6 6-9-9V4z" />
      <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </IconWrapper>
  );
}

export function GoalIcon({ className }: IconProps) {
  return (
    <IconWrapper className={className}>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="3" />
      <path d="m16.5 7.5 2-2" />
    </IconWrapper>
  );
}
