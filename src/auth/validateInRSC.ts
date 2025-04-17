import { cache } from 'react';

import { createSessionCookie, sessionCookieName } from './cookie';
import { SessionValidationResult, validateSessionToken } from './session';
import { cookies } from '../middleware/bridges/cookies';

export const validateInRSC = cache(async (): Promise<SessionValidationResult> => {
  const { setCookie, getCookie } = cookies();
  const sessionToken = getCookie(sessionCookieName)?.value ?? null;
  if (!sessionToken) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await validateSessionToken(sessionToken);
  if (result.session) {
    const sessionCookie = createSessionCookie(result.session.id, result.session.expiresAt);
    setCookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return result;
  }
  return {
    user: null,
    session: null,
  };
});
