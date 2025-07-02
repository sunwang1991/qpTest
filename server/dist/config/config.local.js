"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    // 核心服务配置
    koa: {
        port: 6275,
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
                'servicewechat.com',
                'mp.weixin.qq.com',
                'https://www.sunwang.top',
                'www.sunwang.top',
                'sunwang.top',
                'localhost:6265',
                '127.0.0.1:6275', // 本地开发
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
                synchronize: false,
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
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmxvY2FsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy9jb25maWcubG9jYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxrQkFBZTtJQUNiLFNBQVM7SUFDVCxHQUFHLEVBQUU7UUFDSCxJQUFJLEVBQUUsSUFBSTtRQUNWLEtBQUssRUFBRSxLQUFLLEVBQUUsMEJBQTBCO0tBQ3pDO0lBRUQsY0FBYztJQUNkLFlBQVksRUFBRTtRQUNaLE9BQU8sRUFBRTtZQUNQLEtBQUssRUFBRSxNQUFNO1NBQ2Q7S0FDRjtJQUVELEtBQUs7SUFDTCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUU7WUFDSixpREFBaUQ7WUFDakQsZ0JBQWdCLEVBQUU7Z0JBQ2hCLG1CQUFtQjtnQkFDbkIsa0JBQWtCO2dCQUNsQix5QkFBeUI7Z0JBQ3pCLGlCQUFpQjtnQkFDakIsYUFBYTtnQkFDYixnQkFBZ0I7Z0JBQ2hCLGdCQUFnQixFQUFFLE9BQU87YUFDMUI7U0FDRjtLQUNGO0lBRUQsY0FBYztJQUNkLE9BQU8sRUFBRTtRQUNQLFVBQVUsRUFBRTtZQUNWLFNBQVM7WUFDVCxPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixRQUFRLEVBQUUsU0FBUztnQkFDbkIsV0FBVyxFQUFFLEtBQUs7Z0JBQ2xCLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVTthQUMxQjtTQUNGO0tBQ0Y7SUFFRCxVQUFVO0lBQ1YsS0FBSyxFQUFFO1FBQ0wsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLElBQUk7WUFDVixJQUFJLEVBQUUsV0FBVztZQUNqQixRQUFRLEVBQUUsRUFBRTtZQUNaLEVBQUUsRUFBRSxDQUFDO1NBQ047S0FDRjtJQUVELFlBQVk7SUFDWixJQUFJLEVBQUU7UUFDSixtQkFBbUIsRUFBRTtZQUNuQixLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLFFBQVEsRUFBRSxFQUFFO2dCQUNaLEVBQUUsRUFBRSxDQUFDO2FBQ047U0FDRjtLQUNGO0lBRUQsRUFBRTtDQUNhLENBQUMifQ==