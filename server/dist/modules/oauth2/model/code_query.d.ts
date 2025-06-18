/**重定向授权码参数 */
export declare class CodeQuery {
    /**授权回调地址 */
    redirectUrl: string;
    /**申请得到的客户端ID */
    clientId: string;
    /**随机字符串，认证服务器会原封不动地返回这个值 */
    state: string;
}
