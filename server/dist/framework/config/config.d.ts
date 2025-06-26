/**Config全局配置 */
export declare class GlobalConfig {
    private app;
    /**
     * 获取配置信息
     * @param key 配置项的key值
     * @returns 配置项的值
     */
    get<T>(key: string): T;
    /**
     * 获取运行服务环境
     * local prod
     **/
    getEnv(): string;
    /**
     * 程序开始运行的时间
     * local prod
     **/
    getRunTime(): Date;
    /**
     * 用户是否为系统管理员
     * @param userId 用户ID
     * @returns boolen
     */
    isSystemUser(userId: number): boolean;
}
