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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnByb2QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uZmlnL2NvbmZpZy5wcm9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0JBQWU7SUFDYixTQUFTO0lBQ1QsR0FBRyxFQUFFO1FBQ0gsSUFBSSxFQUFFLElBQUk7UUFDVixLQUFLLEVBQUUsSUFBSSxFQUFFLDhDQUE4QztLQUM1RDtJQUVELEtBQUs7SUFDTCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUU7WUFDSiwwQ0FBMEM7WUFDMUMsZ0JBQWdCLEVBQUUsQ0FBQyxTQUFTLENBQUM7U0FDOUI7S0FDRjtJQUVELGNBQWM7SUFDZCxPQUFPLEVBQUU7UUFDUCxVQUFVLEVBQUU7WUFDVixTQUFTO1lBQ1QsT0FBTyxFQUFFO2dCQUNQLElBQUksRUFBRSxnQkFBZ0I7Z0JBQ3RCLElBQUksRUFBRSxJQUFJO2dCQUNWLFFBQVEsRUFBRSxTQUFTO2dCQUNuQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsUUFBUSxFQUFFLFNBQVM7YUFDcEI7U0FDRjtLQUNGO0lBRUQsVUFBVTtJQUNWLEtBQUssRUFBRTtRQUNMLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxJQUFJO1lBQ1YsSUFBSSxFQUFFLFdBQVc7WUFDakIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsRUFBRSxFQUFFLENBQUM7U0FDTjtLQUNGO0lBRUQsWUFBWTtJQUNaLElBQUksRUFBRTtRQUNKLG1CQUFtQixFQUFFO1lBQ25CLEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUsSUFBSTtnQkFDVixJQUFJLEVBQUUsV0FBVztnQkFDakIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLEVBQUUsRUFBRSxDQUFDO2FBQ047U0FDRjtLQUNGO0lBRUQsRUFBRTtDQUNhLENBQUMifQ==