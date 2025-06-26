"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceFingerprint = exports.uaOsBrowser = exports.ipaddrLocation = void 0;
const ip2region_1 = require("../ip2region/ip2region");
const hash_1 = require("../utils/crypto/hash");
const ua_1 = require("../utils/ua/ua");
/**
 * 解析ip地址
 * @param c 上下文对象
 * @returns [ip地址, 地理位置]
 */
async function ipaddrLocation(c) {
    const ipaddr = (0, ip2region_1.clientIP)(c.ip);
    const location = await (0, ip2region_1.realAddressByIp)(ipaddr);
    return [ipaddr, location];
}
exports.ipaddrLocation = ipaddrLocation;
/**
 * 解析请求用户代理信息
 * @param c 上下文对象
 * @returns [操作系统, 浏览器]
 */
async function uaOsBrowser(c) {
    const ua = (0, ua_1.uaInfo)(c.get('user-agent'));
    const oName = ua.getOS().name;
    const oVersion = ua.getOS().version;
    let os = '-';
    if (oName && oVersion) {
        os = `${oName} ${oVersion}`;
    }
    const bName = ua.getBrowser().name;
    const bVersion = ua.getBrowser().version;
    let browser = '-';
    if (bName && bVersion) {
        browser = `${bName} ${bVersion}`;
    }
    return [os, browser];
}
exports.uaOsBrowser = uaOsBrowser;
/**
 * 设备指纹信息
 * @param c 上下文对象
 * @returns 字符
 */
async function deviceFingerprint(c, v) {
    const str = `${v}:${c.get('user-agent')}`;
    return (0, hash_1.sha256ToBase64)(str);
}
exports.deviceFingerprint = deviceFingerprint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZnJhbWV3b3JrL3JlcWN0eC9wYXJhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxzREFBbUU7QUFDbkUsK0NBQXNEO0FBQ3RELHVDQUF3QztBQUV4Qzs7OztHQUlHO0FBQ0ksS0FBSyxVQUFVLGNBQWMsQ0FBQyxDQUFVO0lBQzdDLE1BQU0sTUFBTSxHQUFHLElBQUEsb0JBQVEsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDOUIsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLDJCQUFlLEVBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0MsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBSkQsd0NBSUM7QUFFRDs7OztHQUlHO0FBQ0ksS0FBSyxVQUFVLFdBQVcsQ0FBQyxDQUFVO0lBQzFDLE1BQU0sRUFBRSxHQUFHLElBQUEsV0FBTSxFQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUN2QyxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDO0lBQzlCLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUM7SUFDcEMsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDO0lBQ2IsSUFBSSxLQUFLLElBQUksUUFBUSxFQUFFO1FBQ3JCLEVBQUUsR0FBRyxHQUFHLEtBQUssSUFBSSxRQUFRLEVBQUUsQ0FBQztLQUM3QjtJQUNELE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDbkMsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQztJQUN6QyxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUM7SUFDbEIsSUFBSSxLQUFLLElBQUksUUFBUSxFQUFFO1FBQ3JCLE9BQU8sR0FBRyxHQUFHLEtBQUssSUFBSSxRQUFRLEVBQUUsQ0FBQztLQUNsQztJQUNELE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDdkIsQ0FBQztBQWZELGtDQWVDO0FBRUQ7Ozs7R0FJRztBQUNJLEtBQUssVUFBVSxpQkFBaUIsQ0FDckMsQ0FBVSxFQUNWLENBQWtCO0lBRWxCLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQztJQUMxQyxPQUFPLElBQUEscUJBQWMsRUFBQyxHQUFHLENBQUMsQ0FBQztBQUM3QixDQUFDO0FBTkQsOENBTUMifQ==