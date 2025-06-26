import { Resp } from '../../../framework/resp/api';
/**路由主页 控制层处理 */
export declare class IndexController {
    /**内置的信息服务，提供基础的项目数据 */
    private midwayInformationService;
    /**根路由 */
    index(): Promise<Resp>;
}
