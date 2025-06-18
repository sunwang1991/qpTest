import { MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
/**
 * 路由未找到-拦截器
 *
 * 404 错误会到这里
 */
export declare class NotFound {
    catch(_: MidwayHttpError, c: Context): Promise<void>;
}
