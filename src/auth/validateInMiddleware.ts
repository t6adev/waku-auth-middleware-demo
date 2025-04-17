import type { ResponseCookies } from '@edge-runtime/cookies';

import { createSessionCookie, sessionCookieName } from './cookie';
import { validateSessionToken } from './session';

export const validateInMiddleware = async (
  getCookie: ResponseCookies['get'],
  setCookie: ResponseCookies['set']
): Promise<boolean> => {
  const sessionToken = getCookie(sessionCookieName)?.value ?? null;
  if (!sessionToken) {
    return false;
  }

  const result = await validateSessionToken(sessionToken);
  if (result.session) {
    const sessionCookie = createSessionCookie(result.session.id, result.session.expiresAt);
    setCookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  }
  return !!result.session;
};
