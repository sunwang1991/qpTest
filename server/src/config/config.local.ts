import { MidwayConfig } from '@midwayjs/core';

export default {
  // 核心服务配置
  koa: {
    port: 6275, // 服务端口
    proxy: false, // 是否开启代理，部署在反向代理之后需要开启此配置
  },

  // Logger 程序日志
  midwayLogger: {
    default: {
      level: 'info',
    },
  },

  // 安全
  security: {
    csrf: {
      // 允许调用的域名地址的，例如：http://192.168.56.101/mask-antd/
      refererWhiteList: [
        'localhost:6265',
        'servicewechat.com', // 微信小程序请求来源
      ],
    },
  },

  // TypeORM 数据源
  typeorm: {
    dataSource: {
      // 单数据库实例
      default: {
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'qpchess',
        synchronize: false, // 如果第一次使用，不关闭它，会自动创建数据库表
        logging: true, // 输出sql日志
      },
    },
  },

  // Redis缓存
  redis: {
    client: {
      port: 6379,
      host: 'localhost',
      password: '',
      db: 1,
    },
  },

  // Bull 任务队列
  bull: {
    defaultQueueOptions: {
      redis: {
        port: 6379,
        host: 'localhost',
        password: '',
        db: 1,
      },
    },
  },

  //
} as MidwayConfig;
