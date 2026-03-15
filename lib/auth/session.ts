import { createHash, randomBytes } from "node:crypto";

import { cookies } from "next/headers";

import { getDb } from "@/lib/db";
import {
  MAX_SESSIONS_PER_USER,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_IN_SECONDS,
  SESSION_RENEW_THRESHOLD_IN_SECONDS,
} from "@/lib/auth/constants";
import type { AuthenticatedUser } from "@/types/dashboard";

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getTokenCandidates(token: string) {
  return [token, hashSessionToken(token)];
}

async function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
    priority: "high",
  });
}

export async function createUserSession(userId: string) {
  const db = getDb();
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_IN_SECONDS * 1000);
  const tokenHash = hashSessionToken(token);

  await db.session.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { userId, expiresAt: { lt: new Date() } },
      ],
    },
  });

  await db.session.create({
    data: {
      token: tokenHash,
      expiresAt,
      userId,
    },
  });

  const userSessions = await db.session.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  const staleSessions = userSessions.slice(MAX_SESSIONS_PER_USER).map((session) => session.id);

  if (staleSessions.length) {
    await db.session.deleteMany({
      where: {
        id: { in: staleSessions },
      },
    });
  }

  await setSessionCookie(token, expiresAt);
}

export async function deleteUserSession() {
  const db = getDb();
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await db.session.deleteMany({
      where: {
        token: { in: getTokenCandidates(token) },
      },
    });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  let cookieStore;

  try {
    cookieStore = await cookies();
  } catch {
    return null;
  }

  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const db = getDb();
  const session = await db.session.findFirst({
    where: {
      token: { in: getTokenCandidates(token) },
    },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await db.session.delete({ where: { id: session.id } });
    }
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  const secondsUntilExpiration = Math.round(
    (session.expiresAt.getTime() - Date.now()) / 1000,
  );

  if (secondsUntilExpiration <= SESSION_RENEW_THRESHOLD_IN_SECONDS) {
    const renewedExpiresAt = new Date(
      Date.now() + SESSION_DURATION_IN_SECONDS * 1000,
    );

    await db.session.update({
      where: { id: session.id },
      data: { expiresAt: renewedExpiresAt, token: hashSessionToken(token) },
    });

    await setSessionCookie(token, renewedExpiresAt);
  } else if (session.token === token) {
    await db.session.update({
      where: { id: session.id },
      data: { token: hashSessionToken(token) },
    });
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };
}
