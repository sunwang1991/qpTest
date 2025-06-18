/**服务器系统相关信息 服务层处理 */
export declare class SystemInfoService {
    /**内置的信息服务，提供基础的项目数据 */
    private midwayInformationService;
    /**主框架中的 app 对象 */
    private app;
    /**程序项目信息 */
    projectInfo(): Record<string, string>;
    /**系统信息 */
    systemInfo(): Record<string, any>;
    /**系统时间信息 */
    timeInfo(): Record<string, string>;
    /**内存信息 */
    memoryInfo(): Record<string, string>;
    /**CPU信息 */
    cpuInfo(): Record<string, any>;
    /**网络信息 */
    networkInfo(): Record<string, string>;
    /**磁盘信息 */
    diskInfo(): Promise<Record<string, string>[]>;
}
