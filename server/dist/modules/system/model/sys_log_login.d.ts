/**系统登录日志表 */
export declare class SysLogLogin {
    /**登录ID */
    id: number;
    /**用户账号 */
    userName: string;
    /**登录IP地址 */
    loginIp: string;
    /**登录地点 */
    loginLocation: string;
    /**浏览器类型 */
    browser: string;
    /**操作系统 */
    os: string;
    /**登录状态（0失败 1成功） */
    statusFlag: string;
    /**提示消息 */
    msg: string;
    /**登录时间 */
    loginTime: number;
}
