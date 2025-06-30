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
                'localhost:6265', // 本地前端
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmxvY2FsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy9jb25maWcubG9jYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxrQkFBZTtJQUNiLFNBQVM7SUFDVCxHQUFHLEVBQUU7UUFDSCxJQUFJLEVBQUUsSUFBSTtRQUNWLEtBQUssRUFBRSxLQUFLLEVBQUUsMEJBQTBCO0tBQ3pDO0lBRUQsY0FBYztJQUNkLFlBQVksRUFBRTtRQUNaLE9BQU8sRUFBRTtZQUNQLEtBQUssRUFBRSxNQUFNO1NBQ2Q7S0FDRjtJQUVELEtBQUs7SUFDTCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUU7WUFDSixpREFBaUQ7WUFDakQsZ0JBQWdCLEVBQUU7Z0JBQ2hCLG1CQUFtQjtnQkFDbkIsZ0JBQWdCLEVBQUUsT0FBTzthQUMxQjtTQUNGO0tBQ0Y7SUFFRCxjQUFjO0lBQ2QsT0FBTyxFQUFFO1FBQ1AsVUFBVSxFQUFFO1lBQ1YsU0FBUztZQUNULE9BQU8sRUFBRTtnQkFDUCxJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixJQUFJLEVBQUUsSUFBSTtnQkFDVixRQUFRLEVBQUUsU0FBUztnQkFDbkIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFFBQVEsRUFBRSxTQUFTO2dCQUNuQixXQUFXLEVBQUUsS0FBSztnQkFDbEIsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVO2FBQzFCO1NBQ0Y7S0FDRjtJQUVELFVBQVU7SUFDVixLQUFLLEVBQUU7UUFDTCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsSUFBSTtZQUNWLElBQUksRUFBRSxXQUFXO1lBQ2pCLFFBQVEsRUFBRSxFQUFFO1lBQ1osRUFBRSxFQUFFLENBQUM7U0FDTjtLQUNGO0lBRUQsWUFBWTtJQUNaLElBQUksRUFBRTtRQUNKLG1CQUFtQixFQUFFO1lBQ25CLEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUsSUFBSTtnQkFDVixJQUFJLEVBQUUsV0FBVztnQkFDakIsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osRUFBRSxFQUFFLENBQUM7YUFDTjtTQUNGO0tBQ0Y7SUFFRCxFQUFFO0NBQ2EsQ0FBQyJ9