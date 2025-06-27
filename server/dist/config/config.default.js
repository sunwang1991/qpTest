"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = require("node:path");
exports.default = () => {
    // 程序资源文件路径，与项目目录同级
    const filePath = (0, node_path_1.resolve)(process.cwd(), '../mask_file');
    return {
        // use for cookie sign key, should change to your own and keep security
        keys: '1662290627179_89234',
        /**核心服务配置 http://www.midwayjs.org/docs/extensions/koa */
        koa: {
            /**服务端口 */
            port: 6275,
            /**是否开启代理 */
            proxy: false,
        },
        /**请求数据解析大小限制 */
        bodyParser: {
            enableTypes: ['json', 'form', 'text', 'xml'],
            formLimit: '1mb',
            jsonLimit: '1mb',
            textLimit: '1mb',
            xmlLimit: '1mb',
        },
        /**Logger 程序日志 http://www.midwayjs.org/docs/logger#配置日志根目录 */
        midwayLogger: {
            default: {
                level: 'warn',
                transports: {
                    file: {
                        dir: (0, node_path_1.normalize)((0, node_path_1.join)(filePath, '/logs')),
                    },
                    error: {
                        dir: (0, node_path_1.normalize)((0, node_path_1.join)(filePath, '/logs')),
                    },
                },
            },
        },
        /**文件上传 https://midwayjs.org/docs/extensions/upload */
        upload: {
            /**最大上传文件大小，默认为 10mb */
            fileSize: '10mb',
            /**文件扩展名白名单 */
            whitelist: [
                // 图片
                '.bmp',
                '.webp',
                '.gif',
                '.jpg',
                '.jpeg',
                '.png',
                // word excel powerpoint
                '.doc',
                '.docx',
                '.xls',
                '.xlsx',
                '.ppt',
                '.pptx',
                // 文本文件
                '.html',
                '.htm',
                '.txt',
                // pdf
                '.pdf',
                // 压缩文件
                '.zip',
                '.gz',
                '.tgz',
                '.gzip',
                // 音视频格式
                '.mp3',
                '.mp4',
                '.avi',
                '.rmvb',
            ],
            /**上传的文件临时存储路径 */
            tmpdir: (0, node_path_1.normalize)((0, node_path_1.join)(filePath, '/temp')),
            /**上传的文件在临时目录中多久之后自动删除，默认为 5 分钟 */
            cleanTimeout: 5 * 60 * 1000,
            /**设置原始body是否是base64格式，默认为false，一般用于腾讯云的兼容 */
            base64: false,
        },
        /**静态文件配置 https://midwayjs.org/docs/extensions/static_file */
        staticFile: {
            dirs: {
                // 默认资源，dir目录需要预先创建
                default: {
                    prefix: '/static',
                    dir: (0, node_path_1.normalize)((0, node_path_1.join)(filePath, '/static')),
                },
                // 文件上传资源目录映射
                upload: {
                    prefix: '/upload',
                    dir: (0, node_path_1.normalize)((0, node_path_1.join)(filePath, '/upload')),
                },
            },
        },
        /**跨域 https://midwayjs.org/docs/extensions/cross_domain */
        cors: {
            // 设置 Access-Control-Allow-Origin 的值，【默认值】会获取请求头上的 origin
            // 也可以配置为一个回调方法，传入的参数为 request，需要返回 origin 值
            // 例如：http://test.midwayjs.org
            // 如果请求设置了 credentials，则 origin 不能设置为 *
            origin: '*',
            // 设置 Access-Control-Allow-Credentials，【默认值】false
            // 也可以配置为一个回调方法，传入的参数为 request，返回值为 true 或 false
            credentials: true,
            // 设置 Access-Control-Max-Age
            maxAge: 31536000,
            // 允许跨域的方法，【默认值】为 GET,HEAD,PUT,POST,DELETE,PATCH
            allowMethods: ['OPTIONS', 'HEAD', 'GET', 'POST', 'PUT', 'DELET'],
            // 设置 Access-Control-Allow-Headers 的值，【默认值】会获取请求头上的 Access-Control-Request-Headers
            allowHeaders: [
                'X-App-Code',
                'X-App-Version',
                'Authorization',
                'Origin',
                'X-Requested-With',
                'Content-Type',
                'Content-Language',
                'Accept',
                'Range',
            ],
            // 设置 Access-Control-Expose-Headers 的值
            exposeHeaders: ['"X-RepeatSubmit-Rest'],
        },
        /**安全 https://midwayjs.org/docs/extensions/security */
        security: {
            csrf: {
                enable: true,
                type: 'referer',
                refererWhiteList: [
                    'servicewechat.com',
                    'mp.weixin.qq.com',
                    '127.0.0.1:6275', // 本地开发
                ],
            },
            xframe: {
                enable: true,
                value: 'SAMEORIGIN',
            },
            csp: {
                enable: true,
            },
            hsts: {
                enable: false,
                maxAge: 365 * 24 * 3600,
                includeSubdomains: false,
            },
            noopen: {
                enable: false,
            },
            nosniff: {
                enable: false,
            },
            xssProtection: {
                enable: true,
                value: '1; mode=block',
            },
        },
        /**JWT 令牌配置 */
        jwt: {
            /**令牌算法 HS256 HS384 HS512 */
            algorithm: 'HS512',
            /**令牌密钥 */
            secret: 'abcdefghijklmnopqrstuvwxyz',
            /**访问令牌有效期（默认15分钟） */
            expiresIn: 15,
            /**刷新令牌有效期（默认7*24*60分钟） */
            refreshIn: 10080,
        },
        /**TypeORM 数据源 https://midwayjs.org/docs/extensions/orm */
        typeorm: {
            dataSource: {
                // 默认数据库实例
                default: {
                    /**数据库类型 */
                    type: 'mysql',
                    host: '127.0.0.1',
                    port: 3306,
                    username: '<mysql username>',
                    password: '<mysql password>',
                    database: '<mysql database>',
                    logging: false,
                    /**配置实体模型以扫描形式 */
                    entities: ['modules/*/model/*{.ts,.js}'],
                },
            },
            // 多个数据源时可以用这个指定默认的数据源
            defaultDataSourceName: 'default',
        },
        /**Redis 缓存数据 http://www.midwayjs.org/docs/extensions/redis */
        redis: {
            client: {
                port: 6379,
                host: '127.0.0.1',
                password: '<redis password>',
                db: 0,
            },
        },
        /**Bull 任务队列 http://www.midwayjs.org/docs/extensions/bull */
        bull: {
            defaultQueueOptions: {
                redis: {
                    port: 6379,
                    host: '127.0.0.1',
                    password: '<redis password>',
                    db: 0,
                },
                prefix: 'bull_queue',
                // 默认的任务配置
                defaultJobOptions: {
                    // 成功后移除任务记录，最多保留最近 10 条记录
                    removeOnComplete: 10,
                    // 失败后移除任务记录，最多保留最近 10 条记录
                    removeOnFail: 10,
                },
            },
            // 清理之前的任务
            clearRepeatJobWhenStart: true,
        },
        /**参数校验 http://www.midwayjs.org/docs/extensions/validate */
        validate: {
            validationOptions: {
                allowUnknown: true,
                stripUnknown: false, // 剔除参数中的未定义属性
                // 临时禁用全局校验
                // @Body() user: Partial<UserDTO>
            },
        },
        /**系统用户，将用户ID设定为系统管理员角色 */
        systemUser: [1],
        /**char 字符验证码配置 */
        charCaptcha: {
            /**宽度 */
            width: 120,
            /**高度 */
            height: 40,
            /**干扰线条的数量 */
            noise: 4,
            /**验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有 */
            color: true,
            // 验证码图片背景颜色
            background: '#fafafa',
            /**验证码长度 */
            size: 4,
            /**验证码字符中排除 0o1i */
            ignoreChars: '0o1i',
        },
        /**math 数值计算码配置 */
        mathCaptcha: {
            /**宽度 */
            width: 120,
            /**高度 */
            height: 40,
            /**干扰线条的数量 */
            noise: 4,
            /**验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有 */
            color: true,
            /**验证码图片背景颜色 */
            background: '#fafafa',
            /**计算式，默认"+"，可选"+", "-" or "+/-" */
            mathOperator: '+/-',
            /**算数值最小值，默认1 */
            mathMin: 1,
            /**算数值最大值，默认9 */
            mathMax: 15,
        },
        //
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmRlZmF1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uZmlnL2NvbmZpZy5kZWZhdWx0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQXFEO0FBR3JELGtCQUFlLEdBQWlCLEVBQUU7SUFDaEMsbUJBQW1CO0lBQ25CLE1BQU0sUUFBUSxHQUFHLElBQUEsbUJBQU8sRUFBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDeEQsT0FBTztRQUNMLHVFQUF1RTtRQUN2RSxJQUFJLEVBQUUscUJBQXFCO1FBRTNCLHdEQUF3RDtRQUN4RCxHQUFHLEVBQUU7WUFDSCxVQUFVO1lBQ1YsSUFBSSxFQUFFLElBQUk7WUFDVixZQUFZO1lBQ1osS0FBSyxFQUFFLEtBQUs7U0FDYjtRQUVELGdCQUFnQjtRQUNoQixVQUFVLEVBQUU7WUFDVixXQUFXLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUM7WUFDNUMsU0FBUyxFQUFFLEtBQUs7WUFDaEIsU0FBUyxFQUFFLEtBQUs7WUFDaEIsU0FBUyxFQUFFLEtBQUs7WUFDaEIsUUFBUSxFQUFFLEtBQUs7U0FDaEI7UUFFRCw2REFBNkQ7UUFDN0QsWUFBWSxFQUFFO1lBQ1osT0FBTyxFQUFFO2dCQUNQLEtBQUssRUFBRSxNQUFNO2dCQUNiLFVBQVUsRUFBRTtvQkFDVixJQUFJLEVBQUU7d0JBQ0osR0FBRyxFQUFFLElBQUEscUJBQVMsRUFBQyxJQUFBLGdCQUFJLEVBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO3FCQUN4QztvQkFDRCxLQUFLLEVBQUU7d0JBQ0wsR0FBRyxFQUFFLElBQUEscUJBQVMsRUFBQyxJQUFBLGdCQUFJLEVBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO3FCQUN4QztpQkFDRjthQUNGO1NBQ0Y7UUFFRCxzREFBc0Q7UUFDdEQsTUFBTSxFQUFFO1lBQ04sdUJBQXVC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