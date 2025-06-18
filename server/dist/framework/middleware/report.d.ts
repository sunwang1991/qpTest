import { IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
/**请求响应日志-中间件 */
export declare class ReportMiddleware implements IMiddleware<Context, NextFunction> {
    resolve(): (c: Context, next: NextFunction) => Promise<any>;
    static getName(): string;
}
