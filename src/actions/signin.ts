'use server';
import { generateIdFromEntropySize, Scrypt } from 'lucia';
// Use Scrypt instead: https://lucia-auth.com/guides/email-and-password/basics
// import { Argon2id } from 'oslo/password'; // Can't build with this even if setting vite.config.ts
import { unstable_rerenderRoute } from 'waku/router/server';

import { lucia } from '../auth/lucia';
import { users } from '../db/users';
import { cookies } from '../middleware/bridges/cookies';
import { validatePassword, validateUsername } from '../auth/utils';

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

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  const { setCookie } = cookies();
  setCookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  unstable_rerenderRoute('/protected');
  return null;
};
