import type { Middleware } from 'waku/config';
import { RequestCookies, ResponseCookies } from '@edge-runtime/cookies';
import { validateInMiddleware } from '../auth/validateInMiddleware';

const rscPagePath = 'RSC/R'; // waku router spec
const rscFunctionPath = 'RSC/F'; // waku router spec
const ignoreDynamicPaths = ['/about', '/privacy'];
const fallbackPath = '/signup';
const pathIfValid = {
  to: '/protected',
  targets: ['/login', fallbackPath],
};
const allPaths = [pathIfValid.to, ...pathIfValid.targets, ...ignoreDynamicPaths];

const checkIgnores = (pathname: string) =>
  ignoreDynamicPaths.some((p) => pathname === p || pathname === `/${rscPagePath}${p}.txt`);
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
    const headers = new Headers(ctx.req.headers);
    const reqCookies = new RequestCookies(headers);
    const resCookies = new ResponseCookies(headers);
    const getCookie: RequestCookies['get'] = (...args) => reqCookies.get(...args);
    const setCookie: ResponseCookies['set'] = (...args) => resCookies.set(...args);
    const validated = await validateInMiddleware(getCookie, setCookie);
    const isTarget = pathIfValid.targets.some(
      (t) => pathname === t || pathname === `/${rscPagePath}${t}.txt`
    );
    if (validated) {
      if (isTarget) {
        ctx.res.status = 302;
        ctx.res.headers = { ...ctx.res.headers, Location: pathIfValid.to };
        return;
      }
      await next();
      return;
    } else if (isTarget) {
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
