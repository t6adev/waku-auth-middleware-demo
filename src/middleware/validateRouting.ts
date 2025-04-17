import type { Middleware } from 'waku/config';
import { validateInMiddleware } from '../auth/validateInMiddleware';
import { cookies } from './bridges/cookies';
import { createSessionCookie, sessionCookieName } from '../auth/cookie';
import { mergeSetCookies } from './setCookie';

const rscPagePath = 'RSC/R'; // waku router spec
const rscFunctionPath = 'RSC/F'; // waku router spec
const ignorePaths = ['/favicon.ico', '/about', '/privacy'];
const fallbackPath = '/signup';
const pathIfValid = {
  to: '/protected',
  targets: ['/login', fallbackPath],
};
const allPaths = [pathIfValid.to, ...pathIfValid.targets, ...ignorePaths];

const checkIgnores = (pathname: string) =>
  ignorePaths.some((p) => pathname === p || pathname === `/${rscPagePath}${p}.txt`);
const isRSCPostRequest = (pathname: string, method: string) =>
  pathname.startsWith(`/${rscFunctionPath}`) && method === 'POST';
const isRSCRequest = (pathname: string) => pathname.startsWith(`/${rscPagePath}`);
const isDevRequest = (pathname: string) =>
  !allPaths.some((p) => pathname === p || pathname === `/${rscPagePath}${p}.txt`);

const validateRoutingMiddleware: Middleware = (options) => {
  const isDev = options.cmd === 'dev';

  return async (ctx, next) => {
    const { pathname } = ctx.req.url;

    if (
      checkIgnores(pathname) ||
      isRSCPostRequest(pathname, ctx.req.method) || // It's assumed that it's a Server Action Request. You have to validate at the action.
      (isDev && isDevRequest(pathname))
    ) {
      await next();
      return;
    }
    ctx.res.headers ||= {};
    const { getCookie, setCookie } = cookies();
    const sessionToken = getCookie(sessionCookieName)?.value ?? null;
    const sessionValidationResult = await validateInMiddleware(sessionToken);
    if (sessionToken && sessionValidationResult && sessionValidationResult.session) {
      const sessionCookie = createSessionCookie(
        sessionToken,
        sessionValidationResult.session.expiresAt
      );
      const responseCookies = setCookie(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      ctx.res.headers['set-cookie'] = mergeSetCookies(
        ctx.res.headers['set-cookie'] || [],
        responseCookies.getAll()
      );
    }
    const isTarget = pathIfValid.targets.some(
      (t) => pathname === t || pathname === `/${rscPagePath}${t}.txt`
    );
    if (!!sessionValidationResult?.session) {
      if (isTarget) {
        ctx.res.status = 302;
        ctx.res.headers = { ...ctx.res.headers, Location: pathIfValid.to };
        return;
      }
      await next();
      return;
    }

    if (isTarget) {
      await next();
      return;
    }

    if (isRSCRequest(pathname)) {
      ctx.res.status = 401;
    } else {
      ctx.res.status = 302;
    }
    ctx.res.headers = { ...ctx.res.headers, Location: fallbackPath };
    return;
  };
};

export default validateRoutingMiddleware;
