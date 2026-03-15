export const SESSION_COOKIE_NAME = "fatec_financas_session";
export const SESSION_DURATION_IN_SECONDS = 60 * 60 * 24 * 7;
export const SESSION_RENEW_THRESHOLD_IN_SECONDS = 60 * 60 * 24;
export const MAX_SESSIONS_PER_USER = 5;

export const AUTH_ROUTE = "/auth";
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/transactions",
  "/categories",
  "/goals",
  "/statistics",
] as const;
