import { randomBytes } from "node:crypto";

import { cookies } from "next/headers";

import { getDb } from "@/lib/db";
import type { AuthenticatedUser } from "@/types/dashboard";

const SESSION_COOKIE_NAME = "fatec_financas_session";
const SESSION_DURATION_IN_SECONDS = 60 * 60 * 24 * 30;

export async function createUserSession(userId: string) {
  const db = getDb();
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_IN_SECONDS * 1000);

  await db.session.create({
    data: {
      token,
      expiresAt,
      userId,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function deleteUserSession() {
  const db = getDb();
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await db.session.deleteMany({
      where: { token },
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
  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await db.session.delete({ where: { token } });
    }
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };
}
