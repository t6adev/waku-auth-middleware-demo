import { cache } from 'react';
import type { Session, User } from 'lucia';

import { lucia } from './lucia';
import { cookies } from '../middleware/bridges/cookies';

export const validateInRSC = cache(
  async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
    const { setCookie, getCookie } = cookies();
    const sessionId = getCookie(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
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
    return result;
  }
);
