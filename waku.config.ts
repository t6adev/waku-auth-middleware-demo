export default {
  middleware: [
    'waku/middleware/context',
    './src/middleware/headers',
    './src/middleware/setCookie',
    './src/middleware/validateRouting',
    'waku/middleware/dev-server',
    'waku/middleware/handler',
  ],
};
