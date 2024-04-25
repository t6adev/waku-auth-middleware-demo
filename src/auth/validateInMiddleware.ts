import type { ResponseCookies } from '@edge-runtime/cookies';

import { lucia } from './lucia';

export const validateInMiddleware = async (
  getCookie: ResponseCookies['get'],
  setCookie: ResponseCookies['set']
): Promise<boolean> => {
  const sessionId = getCookie(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return false;
  }

  const result = await lucia.validateSession(sessionId);
  if (result.session && result.session.fresh) {
    const sessionCookie = lucia.createSessionCookie(result.session.id);
    setCookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  }
  if (!result.session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    setCookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  }
  return !!result.session;
};
