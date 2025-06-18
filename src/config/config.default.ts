import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1750168450169_6128',
  koa: {
    port: 7001,
    hostname: '0.0.0.0', // cors: true,
  },
} as MidwayConfig;
