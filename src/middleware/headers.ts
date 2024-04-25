import type { Middleware } from 'waku/config';

const headersMiddleware: Middleware = () => {
  return async (ctx, next) => {
    ctx.context.headers = ctx.req.headers;
    await next();
  };
};

export default headersMiddleware;
