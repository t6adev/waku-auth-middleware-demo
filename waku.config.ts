const DO_NOT_BUNDLE = '';

/** @type {import('waku/config').Config} */

export default {
  middleware: (cmd: 'dev' | 'start') => [
    ...(cmd === 'dev'
      ? [import(/* @vite-ignore */ DO_NOT_BUNDLE + 'waku/middleware/dev-server')]
      : []),
    import('./src/middleware/headers'),
    import('./src/middleware/setCookie'),
    import('./src/middleware/validateRouting'),
    import('waku/middleware/ssr'),
    import('waku/middleware/rsc'),
  ],
  // /**
  //  * Prefix for HTTP requests to indicate RSC requests.
  //  * Defaults to "RSC".
  //  */
  rscPath: 'RSC', // Just for clarification
};
