import { Context } from '@midwayjs/koa';
/**
 * 默认全局错误统一捕获
 *
 * 所有的未分类错误会到这里
 */
export declare class ErrorCatch {
    catch(err: Error, c: Context): Promise<void>;
}
