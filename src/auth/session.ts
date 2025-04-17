import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';

import type { User, Session } from '../db/type';
import { users } from '../db/users';
import { sessions } from '../db/sessions';

const sessionDuration = 1000 * 60; // e.g. 1000 * 60 * 60 * 24 * 30

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(token: string, userId: string): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + sessionDuration),
  };
  await sessions.create(session);
  return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session = await sessions.findUnique(sessionId);
  if (session === null) {
    return { session: null, user: null };
  }
  const user = await users.findUnique(session.userId);
  if (user === null) {
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime()) {
    await sessions.deleteManyById(sessionId);
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - sessionDuration / 2) {
    session.expiresAt = new Date(Date.now() + sessionDuration);
    await sessions.updateExpiresAt(session.id, session.expiresAt);
  }
  return { session, user };
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
