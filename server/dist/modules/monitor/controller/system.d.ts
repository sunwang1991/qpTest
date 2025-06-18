import { Resp } from '../../../framework/resp/api';
/**服务器监控信息 控制层处理 */
export declare class SystemInfoController {
    /**在线用户服务 */
    private systemInfoService;
    /**
     * 服务器信息
     */
    info(): Promise<Resp>;
}
