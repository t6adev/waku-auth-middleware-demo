import { getContextData } from 'waku/middleware/context';
import { RequestCookies, ResponseCookies, type ResponseCookie } from '@edge-runtime/cookies';
import { mergeSetCookies } from '../setCookie';

const cookies = () => {
  const ctx = getContextData() as {
    headers: Record<string, string | string[]>;
    cookies?: ResponseCookie[];
  };
  const headerObj = ctx.headers || {};
  headerObj['set-cookie'] = mergeSetCookies(
    headerObj['set-cookie'] || [],
    (ctx.cookies || []) as ResponseCookie[]
  );
  const headers = new Headers(headerObj as Record<string, string>);
  const reqCookies = new RequestCookies(headers);
  const resCookies = new ResponseCookies(headers);

  const getCookie: ResponseCookies['get'] = (...args) =>
    resCookies.get(...args) || reqCookies.get(...args);
  const setCookie: ResponseCookies['set'] = (...args) => {
    const updated = resCookies.set(...args);
    ctx.cookies = updated.getAll();
    return updated;
  };
  return { getCookie, setCookie };
};

export { cookies };
