import { Resp } from '../../../framework/resp/api';
/**验证码操作 控制层处理 */
export declare class CaptchaController {
    /**缓存服务 */
    private redisCache;
    /**配置信息 */
    private config;
    /**参数配置服务 */
    private sysConfigService;
    /**获取验证码-图片 */
    image(): Promise<Resp>;
}
