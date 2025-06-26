/**用户授权第三方应用表 */
export declare class Oauth2Client {
    /**应用ID */
    id: number;
    /**应用的唯一标识 */
    clientId: string;
    /**应用的凭证秘钥 */
    clientSecret: string;
    /**应用名称 */
    title: string;
    /**IP白名单 */
    ipWhite: string;
    /**删除标志（0代表存在 1代表删除） */
    delFlag: string;
    /**最后登录IP */
    loginIp: string;
    /**最后登录时间 */
    loginTime: number;
    /**创建者 */
    createBy: string;
    /**创建时间 */
    createTime: number;
    /**更新者 */
    updateBy: string;
    /**更新时间 */
    updateTime: number;
    /**备注 */
    remark: string;
}
