/**用户授权第三方应用登录日志表 */
export declare class Oauth2LogLogin {
    /**登录ID */
    id: number;
    /**应用的唯一标识 */
    clientId: string;
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
