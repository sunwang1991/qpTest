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
                'sunwang.top',
                'localhost:6265', // 本地开发
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnByb2QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uZmlnL2NvbmZpZy5wcm9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0JBQWU7SUFDYixTQUFTO0lBQ1QsR0FBRyxFQUFFO1FBQ0gsSUFBSSxFQUFFLElBQUk7UUFDVixHQUFHLEVBQUUsa0RBQWtEO1FBQ3ZELElBQUksRUFBRSxvREFBb0Q7UUFDMUQsS0FBSyxFQUFFLEtBQUssRUFBRSxrQkFBa0I7S0FDakM7SUFFRCxLQUFLO0lBQ0wsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFLElBQUk7WUFDWixJQUFJLEVBQUUsU0FBUztZQUNmLGdCQUFnQixFQUFFO2dCQUNoQixtQkFBbUI7Z0JBQ25CLGtCQUFrQjtnQkFDbEIseUJBQXlCO2dCQUN6QixpQkFBaUI7Z0JBQ2pCLGFBQWE7Z0JBQ2IsZ0JBQWdCLEVBQUUsT0FBTzthQUMxQjtTQUNGO0tBQ0Y7SUFFRCxjQUFjO0lBQ2QsT0FBTyxFQUFFO1FBQ1AsVUFBVSxFQUFFO1lBQ1YsU0FBUztZQUNULE9BQU8sRUFBRTtnQkFDUCxJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixJQUFJLEVBQUUsSUFBSTtnQkFDVixRQUFRLEVBQUUsU0FBUztnQkFDbkIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFFBQVEsRUFBRSxTQUFTO2FBQ3BCO1NBQ0Y7S0FDRjtJQUVELFVBQVU7SUFDVixLQUFLLEVBQUU7UUFDTCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsSUFBSTtZQUNWLElBQUksRUFBRSxXQUFXO1lBQ2pCLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLEVBQUUsRUFBRSxDQUFDO1NBQ047S0FDRjtJQUVELFlBQVk7SUFDWixJQUFJLEVBQUU7UUFDSixtQkFBbUIsRUFBRTtZQUNuQixLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixFQUFFLEVBQUUsQ0FBQzthQUNOO1NBQ0Y7S0FDRjtDQUNjLENBQUMifQ==