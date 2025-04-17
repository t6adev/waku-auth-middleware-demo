'use server';
import { generateIdFromEntropySize, Scrypt } from 'lucia';
// Use Scrypt instead: https://lucia-auth.com/guides/email-and-password/basics
// import { Argon2id } from 'oslo/password'; // Can't build with this even if setting vite.config.ts
import { unstable_rerenderRoute } from 'waku/router/server';

import { validatePassword, validateUsername } from '../auth/utils';
import { users } from '../db/users';
import { cookies } from '../middleware/bridges/cookies';
import { createSession, generateSessionToken } from '../auth/session';
import { createSessionCookie } from '../auth/cookie';

const scrypt = new Scrypt();

export type SignupFn = typeof signup;
export const signup = async (formData: FormData) => {
  const username = formData.get('username');
  const password = formData.get('password');
  if (!validateUsername(username)) {
    return {
      error: 'Invalid username',
    };
  }
  if (!validatePassword(password)) {
    return {
      error: 'Invalid password',
    };
  }

  // const hashedPassword = await new Argon2id().hash(password);
  const hashedPassword = await scrypt.hash(password);
  const userId = generateIdFromEntropySize(10); // 16 characters long

  // TODO: check if username is already used
  await users.create({
    id: userId,
    username: username,
    hashed_password: hashedPassword,
  });

  const token = generateSessionToken();
  const session = await createSession(token, userId);

  const sessionCookie = createSessionCookie(session.id, session.expiresAt);

  const { setCookie } = cookies();
  setCookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  unstable_rerenderRoute('/protected');
  return null;
};
