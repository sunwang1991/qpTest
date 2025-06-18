import { MidwayConfig } from '@midwayjs/core';

export default {
  // 核心服务配置
  koa: {
    port: 6275, // 服务端口
    proxy: true, // 如果部署在反向代理中需要开启此配置，不是就关闭，以防被恶意用户伪造请求 IP 等信息。
  },

  // 安全
  security: {
    csrf: {
      // 允许调用的域名地址的，例如：http://<Referer>/mask-api
      refererWhiteList: ['Referer'],
    },
  },

  // TypeORM 数据源
  typeorm: {
    dataSource: {
      // 单数据库实例
      default: {
        host: '113.46.139.108',
        port: 3306,
        username: 'qpchess',
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
