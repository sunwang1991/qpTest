import { IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
/**防止表单重复提交-中间件 */
export declare class RepeatSubmit implements IMiddleware<Context, NextFunction> {
    resolve(_: any, interval: number): (c: Context, next: NextFunction) => Promise<any>;
    static getName(): string;
}
/**
 * 防止表单重复提交-中间件
 *
 * 小于间隔时间视为重复提交
 * @param interval 间隔时间(单位秒) 默认:5
 */
export declare function RepeatSubmitMiddleware(interval?: number): import("@midwayjs/core").CompositionMiddleware<import("@midwayjs/core").Context, unknown, unknown>;
