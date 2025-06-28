import { MidwayConfig } from '@midwayjs/core';

export default {
  // 核心服务配置
  koa: {
    port: 6275, // 服务端口
    key: '/www/server/panel/vhost/cert/servers/privkey.pem', // SSL私钥路径
    cert: '/www/server/panel/vhost/cert/servers/fullchain.pem', // SSL证书路径
    proxy: false, // 直接HTTPS访问，不需要代理
  },

  // 安全
  security: {
    csrf: {
      // 允许调用的域名地址的，例如：http://<Referer>/mask-api
      refererWhiteList: [
        'servicewechat.com',
        'https://www.sunwang.top:6275',
        'https://sunwang.top:6275',
      ],
    },
  },

  // TypeORM 数据源
  typeorm: {
    dataSource: {
      // 单数据库实例
      default: {
        host: '113.46.139.108',
        port: 3306,
        username: 'qpChess',
        password: '123456',
        database: 'qpchess',
      },
    },
  },

  // Redis缓存
  redis: {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '123456',
      db: 0,
    },
  },

  // Bull 任务队列
  bull: {
    defaultQueueOptions: {
      redis: {
        port: 6379,
        host: '127.0.0.1',
        password: '123456',
        db: 0,
      },
    },
  },

  //
} as MidwayConfig;
