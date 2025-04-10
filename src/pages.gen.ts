// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages, GetConfigResponse } from 'waku/router';

// prettier-ignore
import type { getConfig as About_getConfig } from './pages/about';
// prettier-ignore
import type { getConfig as Index_getConfig } from './pages/index';
// prettier-ignore
import type { getConfig as Login_getConfig } from './pages/login';
// prettier-ignore
import type { getConfig as Privacy_getConfig } from './pages/privacy';
// prettier-ignore
import type { getConfig as Protected_getConfig } from './pages/protected';
// prettier-ignore
import type { getConfig as Signup_getConfig } from './pages/signup';

// prettier-ignore
type Page =
| ({ path: '/about' } & GetConfigResponse<typeof About_getConfig>)
| ({ path: '/' } & GetConfigResponse<typeof Index_getConfig>)
| ({ path: '/login' } & GetConfigResponse<typeof Login_getConfig>)
| ({ path: '/privacy' } & GetConfigResponse<typeof Privacy_getConfig>)
| ({ path: '/protected' } & GetConfigResponse<typeof Protected_getConfig>)
| ({ path: '/signup' } & GetConfigResponse<typeof Signup_getConfig>);

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>;
  }
  interface CreatePagesConfig {
    pages: Page;
  }
}
  