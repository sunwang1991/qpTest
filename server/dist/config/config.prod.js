"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    // 核心服务配置
    koa: {
        port: 6275,
        proxy: true, // 如果部署在反向代理中需要开启此配置，不是就关闭，以防被恶意用户伪造请求 IP 等信息。
    },
    // 安全
    security: {
        csrf: {
            // 允许调用的域名地址的，例如：http://<Referer>/mask-api
            refererWhiteList: ['https://servicewechat.com'],
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
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnByb2QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uZmlnL2NvbmZpZy5wcm9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0JBQWU7SUFDYixTQUFTO0lBQ1QsR0FBRyxFQUFFO1FBQ0gsSUFBSSxFQUFFLElBQUk7UUFDVixLQUFLLEVBQUUsSUFBSSxFQUFFLDhDQUE4QztLQUM1RDtJQUVELEtBQUs7SUFDTCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUU7WUFDSiwwQ0FBMEM7WUFDMUMsZ0JBQWdCLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQztTQUNoRDtLQUNGO0lBRUQsY0FBYztJQUNkLE9BQU8sRUFBRTtRQUNQLFVBQVUsRUFBRTtZQUNWLFNBQVM7WUFDVCxPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixRQUFRLEVBQUUsU0FBUzthQUNwQjtTQUNGO0tBQ0Y7SUFFRCxVQUFVO0lBQ1YsS0FBSyxFQUFFO1FBQ0wsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLElBQUk7WUFDVixJQUFJLEVBQUUsV0FBVztZQUNqQixRQUFRLEVBQUUsUUFBUTtZQUNsQixFQUFFLEVBQUUsQ0FBQztTQUNOO0tBQ0Y7SUFFRCxZQUFZO0lBQ1osSUFBSSxFQUFFO1FBQ0osbUJBQW1CLEVBQUU7WUFDbkIsS0FBSyxFQUFFO2dCQUNMLElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSxXQUFXO2dCQUNqQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsRUFBRSxFQUFFLENBQUM7YUFDTjtTQUNGO0tBQ0Y7SUFFRCxFQUFFO0NBQ2EsQ0FBQyJ9