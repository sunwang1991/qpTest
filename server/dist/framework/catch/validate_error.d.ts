import { Context } from '@midwayjs/koa';
import { MidwayValidationError } from '@midwayjs/validate';
/**
 * 处理校验错误-拦截器
 *
 * 422 参数错误会到这里
 */
export declare class ValidateError {
    catch(err: MidwayValidationError, c: Context): Promise<void>;
}
