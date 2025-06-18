/**系统操作日志表 */
export declare class SysLogOperate {
    /**操作ID */
    id: number;
    /**模块标题 */
    title: string;
    /**业务类型（0其它 1新增 2修改 3删除 4授权 5导出 6导入 7强退 8清空数据） */
    businessType: string;
    /**请求URL */
    operaUrl: string;
    /**请求方式 */
    operaUrlMethod: string;
    /**主机地址 */
    operaIp: string;
    /**操作地点 */
    operaLocation: string;
    /**请求参数 */
    operaParam: string;
    /**操作消息 */
    operaMsg: string;
    /**方法名称 */
    operaMethod: string;
    /**操作人员 */
    operaBy: string;
    /**操作时间 */
    operaTime: number;
    /**操作状态（0异常 1正常） */
    statusFlag: string;
    /**消耗时间（毫秒） */
    costTime: number;
}
