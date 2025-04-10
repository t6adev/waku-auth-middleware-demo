import type { Middleware } from 'waku/config';
import { type ResponseCookie, stringifyCookie } from '@edge-runtime/cookies';

export const mergeSetCookies = (
  resSetCookies: string | string[],
  cookiesInContext: ResponseCookie[]
) => {
  if (typeof resSetCookies === 'string') {
    resSetCookies = [resSetCookies];
  }
  return [...resSetCookies, ...cookiesInContext.map(stringifyCookie)];
};

const setCookieMiddleware: Middleware = () => {
  return async (ctx, next) => {
    await next();
    ctx.res.headers ||= {};
    ctx.res.headers['set-cookie'] = mergeSetCookies(
      ctx.res.headers['set-cookie'] || [],
      (ctx.data.cookies || []) as ResponseCookie[]
    );
  };
};

export default setCookieMiddleware;
