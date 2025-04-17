'use server';
import { Scrypt } from 'lucia';
// Use Scrypt instead: https://lucia-auth.com/guides/email-and-password/basics
// import { Argon2id } from 'oslo/password'; // Can't build with this even if setting vite.config.ts
import { unstable_rerenderRoute } from 'waku/router/server';

import { users } from '../db/users';
import { cookies } from '../middleware/bridges/cookies';
import { validatePassword, validateUsername } from '../auth/utils';
import { createSession, generateSessionToken } from '../auth/session';
import { createSessionCookie } from '../auth/cookie';

const scrypt = new Scrypt();

export type SigninFn = typeof signin;
export const signin = async (formData: FormData) => {
  const username = formData.get('username');
  const password = formData.get('password');
  if (!validateUsername(username) || !validatePassword(password)) {
    return {
      error: 'Invalid',
    };
  }
  const existingUser = await users.findUnique(username);
  if (!existingUser) {
    return {
      error: 'Invalid',
    };
  }

  const validPassword = await scrypt.verify(existingUser.hashed_password, password);
  if (!validPassword) {
    return {
      error: 'Invalid',
    };
  }

  const token = generateSessionToken();
  const session = await createSession(token, existingUser.id);

  const sessionCookie = createSessionCookie(session.id, session.expiresAt);

  const { setCookie } = cookies();
  setCookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  unstable_rerenderRoute('/protected');
  return null;
};
