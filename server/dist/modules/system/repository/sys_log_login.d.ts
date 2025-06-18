import { SysLogLogin } from '../model/sys_log_login';
/**系统登录访问表 数据层处理 */
export declare class SysLogLoginRepository {
    private db;
    /**
     * 分页查询集合
     *
     * @param query 参数
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @returns 集合
     */
    selectByPage(query: Record<string, string>, dataScopeSQL: string): Promise<[SysLogLogin[], number]>;
    /**
     * 新增
     *
     * @param sysLogLogin 信息
     * @return ID
     */
    insert(sysLogLogin: SysLogLogin): Promise<number>;
    /**
     * 清空信息
     *
     * @return 影响记录数
     */
    clean(): Promise<number>;
}
