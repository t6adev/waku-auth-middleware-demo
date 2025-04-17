import type { ResponseCookie } from '@edge-runtime/cookies';

export const sessionCookieName = 'waku_app_session';

export const createSessionCookie = (
  sessionId: string,
  expiresAt: Date
): {
  name: string;
  value: string;
  attributes: Pick<ResponseCookie, 'path' | 'httpOnly' | 'secure' | 'sameSite' | 'expires'>;
} => ({
  name: sessionCookieName,
  value: sessionId,
  attributes: {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
  },
});
