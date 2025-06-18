/**
 * 查询IP所在地
 * @param ip ip地址 218.4.167.70
 * @returns 返回结果 国家|区域|省份|城市|ISP
 * {"region":"中国|0|江苏省|苏州市|电信","ioCount":0,"took":326.8}
 */
export declare function regionSearchByIp(ip: string): Promise<{
    region: string;
    ioCount: number;
    took: number;
}>;
/**
 * 获取地址IP所在地
 * @param ip ip地址 218.4.167.70
 * @returns 返回结果 江苏省 苏州市
 */
export declare function realAddressByIp(ip: string): Promise<string>;
/**
 * 处理客户端IP地址显示iPv4
 * @param ip 上下文ip地址 ::1 127.0.0.1
 * @returns 返回结果 iPv4
 */
export declare function clientIP(ip: string): string;
