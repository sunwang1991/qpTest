/**获取访问令牌参数 */
export declare class TokenBody {
    /**申请应用时获得的client_id */
    clientId: string;
    /**申请应用时分配的secret */
    clientSecret: string;
    /**请求的类型，此处的值固定为 authorization_code/refresh_token */
    grantType: string;
    /**授权拿到的code值 */
    code: string;
    /**刷新令牌 */
    refreshToken: string;
}
