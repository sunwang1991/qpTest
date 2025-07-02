"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    // 核心服务配置
    koa: {
        port: 6275,
        key: '/www/server/panel/vhost/cert/servers/privkey.pem',
        cert: '/www/server/panel/vhost/cert/servers/fullchain.pem',
        proxy: false, // 直接HTTPS访问，不需要代理
    },
    // 安全
    security: {
        csrf: {
            enable: true,
            type: 'referer',
            refererWhiteList: [
                'servicewechat.com',
                'mp.weixin.qq.com',
                'https://www.sunwang.top',
                'www.sunwang.top',
                'sunwang.top', // 裸域名
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
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnByb2QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uZmlnL2NvbmZpZy5wcm9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0JBQWU7SUFDYixTQUFTO0lBQ1QsR0FBRyxFQUFFO1FBQ0gsSUFBSSxFQUFFLElBQUk7UUFDVixHQUFHLEVBQUUsa0RBQWtEO1FBQ3ZELElBQUksRUFBRSxvREFBb0Q7UUFDMUQsS0FBSyxFQUFFLEtBQUssRUFBRSxrQkFBa0I7S0FDakM7SUFFRCxLQUFLO0lBQ0wsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFLElBQUk7WUFDWixJQUFJLEVBQUUsU0FBUztZQUNmLGdCQUFnQixFQUFFO2dCQUNoQixtQkFBbUI7Z0JBQ25CLGtCQUFrQjtnQkFDbEIseUJBQXlCO2dCQUN6QixpQkFBaUI7Z0JBQ2pCLGFBQWEsRUFBRSxNQUFNO2FBQ3RCO1NBQ0Y7S0FDRjtJQUVELGNBQWM7SUFDZCxPQUFPLEVBQUU7UUFDUCxVQUFVLEVBQUU7WUFDVixTQUFTO1lBQ1QsT0FBTyxFQUFFO2dCQUNQLElBQUksRUFBRSxnQkFBZ0I7Z0JBQ3RCLElBQUksRUFBRSxJQUFJO2dCQUNWLFFBQVEsRUFBRSxTQUFTO2dCQUNuQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsUUFBUSxFQUFFLFNBQVM7YUFDcEI7U0FDRjtLQUNGO0lBRUQsVUFBVTtJQUNWLEtBQUssRUFBRTtRQUNMLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxJQUFJO1lBQ1YsSUFBSSxFQUFFLFdBQVc7WUFDakIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsRUFBRSxFQUFFLENBQUM7U0FDTjtLQUNGO0lBRUQsWUFBWTtJQUNaLElBQUksRUFBRTtRQUNKLG1CQUFtQixFQUFFO1lBQ25CLEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUsSUFBSTtnQkFDVixJQUFJLEVBQUUsV0FBVztnQkFDakIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLEVBQUUsRUFBRSxDQUFDO2FBQ047U0FDRjtLQUNGO0NBQ2MsQ0FBQyJ9