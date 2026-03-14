export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getAppUserId() {
  return process.env.APP_USER_ID ?? "mock-user";
}
