export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getAppUserId() {
  return process.env.APP_USER_ID ?? "mock-user";
}

export function getAppBaseUrl() {
  return process.env.APP_BASE_URL ?? "http://localhost:3000";
}

export function hasEmailDeliveryConfig() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}
