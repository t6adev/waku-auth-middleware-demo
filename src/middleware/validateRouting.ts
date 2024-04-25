import type { Middleware } from 'waku/config';
import { RequestCookies, ResponseCookies } from '@edge-runtime/cookies';
import { validateInMiddleware } from '../auth/validateInMiddleware';
import wakuConfig from '../../waku.config.js';

const { rscPath } = wakuConfig;
const ignoreDynamicPaths = ['/about', '/privacy'];
const fallbackPath = '/signup';
const pathIfValid = {
  to: '/protected',
  targets: ['/login', fallbackPath],
};

const checkIgnores = (pathname: string) =>
  ignoreDynamicPaths.some((p) => pathname === p || pathname === `/${rscPath}${p}.txt`);
const isRSCPostRequest = (pathname: string, method: string) =>
  pathname.startsWith(`/${rscPath}`) && method === 'POST';
const isRSCRequest = (pathname: string) => pathname.startsWith(`/${rscPath}`);

const validateRoutingMiddleware: Middleware = (options) => {
  const isDev = options.cmd === 'dev';

  return async (ctx, next) => {
    /** Note: All requests are handled here in prd if pages are dynamic. However, we need to handle requests that are in dev.
     * As you can see, the following code is working in prd.
     * ```waku/packages/waku/src/cli.ts
     *   app.use('*', serveStatic({ root: path.join(distDir, publicDir) }));
     *   app.use('*', runner({ cmd: 'start', loadEntries, env: process.env as any }));
     * ```
     */
    // In dev, if it's false, the request is as text/html
    // await ctx.devServer?.willBeHandledLater(ctx.req.url.pathname)
    if (isDev) {
      throw new Error('Not implemented yet. Run with build & start');
    }

    const { pathname } = ctx.req.url;
    if (
      checkIgnores(pathname) ||
      isRSCPostRequest(pathname, ctx.req.method) // It's assumed that it's a Server Action Request. You have to validate at the action.
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
    const isTarget = pathIfValid.targets.includes(pathname);
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
