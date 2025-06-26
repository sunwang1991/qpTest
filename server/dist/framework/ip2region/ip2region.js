"use strict";
// 依赖来源 https://gitee.com/lionsoul/ip2region
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientIP = exports.realAddressByIp = exports.regionSearchByIp = void 0;
// 读取xdb工具包
const binding_1 = require("./binding");
const node_path_1 = require("node:path");
// 指定ip2region数据文件路径
const dbPath = (0, node_path_1.resolve)(__dirname, '../../assets/ip2region.xdb');
// 读取文件Buffer缓存
const ip2regionBuffer = (0, binding_1.loadContentFromFile)(dbPath);
// 检索实例
const searcher = (0, binding_1.newWithBuffer)(ip2regionBuffer);
// 网络地址(内网)
const LOCAT_HOST = '127.0.0.1';
/**
 * 查询IP所在地
 * @param ip ip地址 218.4.167.70
 * @returns 返回结果 国家|区域|省份|城市|ISP
 * {"region":"中国|0|江苏省|苏州市|电信","ioCount":0,"took":326.8}
 */
async function regionSearchByIp(ip) {
    let data = { region: '0|0|0|0|0', ioCount: 0, took: 0 };
    ip = clientIP(ip);
    if (ip === LOCAT_HOST) {
        data.region = '0|0|0|内网IP|内网IP';
    }
    try {
        data = await searcher.search(ip);
    }
    catch (e) {
        console.error('failed to RegionSearchByIp err =>', e.message);
    }
    return data;
}
exports.regionSearchByIp = regionSearchByIp;
/**
 * 获取地址IP所在地
 * @param ip ip地址 218.4.167.70
 * @returns 返回结果 江苏省 苏州市
 */
async function realAddressByIp(ip) {
    ip = clientIP(ip);
    if (ip === LOCAT_HOST) {
        return '内网IP';
    }
    try {
        const { region } = await searcher.search(ip);
        if (region) {
            const [, , province, city] = region.split('|');
            if (province === '0' && city === '0') {
                return '未知';
            }
            if (province === '0' && city !== '0') {
                return city;
            }
            return `${province} ${city}`;
        }
    }
    catch (e) {
        console.error('failed to RealAddressByIp err =>', e.message);
    }
    // 未知IP
    return '未知';
}
exports.realAddressByIp = realAddressByIp;
/**
 * 处理客户端IP地址显示iPv4
 * @param ip 上下文ip地址 ::1 127.0.0.1
 * @returns 返回结果 iPv4
 */
function clientIP(ip) {
    if (ip.startsWith('::ffff:')) {
        ip = ip.replace('::ffff:', '');
    }
    if (ip === LOCAT_HOST || ip === '::1') {
        return LOCAT_HOST;
    }
    return ip;
}
exports.clientIP = clientIP;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXAycmVnaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ZyYW1ld29yay9pcDJyZWdpb24vaXAycmVnaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0Q0FBNEM7OztBQUU1QyxXQUFXO0FBQ1gsdUNBQStEO0FBQy9ELHlDQUFvQztBQUNwQyxvQkFBb0I7QUFDcEIsTUFBTSxNQUFNLEdBQUcsSUFBQSxtQkFBTyxFQUFDLFNBQVMsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO0FBQ2hFLGVBQWU7QUFDZixNQUFNLGVBQWUsR0FBRyxJQUFBLDZCQUFtQixFQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BELE9BQU87QUFDUCxNQUFNLFFBQVEsR0FBRyxJQUFBLHVCQUFhLEVBQUMsZUFBZSxDQUFDLENBQUM7QUFDaEQsV0FBVztBQUNYLE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQztBQUUvQjs7Ozs7R0FLRztBQUNJLEtBQUssVUFBVSxnQkFBZ0IsQ0FBQyxFQUFVO0lBSy9DLElBQUksSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUN4RCxFQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2xCLElBQUksRUFBRSxLQUFLLFVBQVUsRUFBRTtRQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLGlCQUFpQixDQUFDO0tBQ2pDO0lBQ0QsSUFBSTtRQUNGLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDbEM7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMsbUNBQW1DLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQy9EO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBaEJELDRDQWdCQztBQUVEOzs7O0dBSUc7QUFDSSxLQUFLLFVBQVUsZUFBZSxDQUFDLEVBQVU7SUFDOUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNsQixJQUFJLEVBQUUsS0FBSyxVQUFVLEVBQUU7UUFDckIsT0FBTyxNQUFNLENBQUM7S0FDZjtJQUNELElBQUk7UUFDRixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLElBQUksTUFBTSxFQUFFO1lBQ1YsTUFBTSxDQUFDLEVBQUUsQUFBRCxFQUFHLFFBQVEsRUFBRSxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9DLElBQUksUUFBUSxLQUFLLEdBQUcsSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFO2dCQUNwQyxPQUFPLElBQUksQ0FBQzthQUNiO1lBQ0QsSUFBSSxRQUFRLEtBQUssR0FBRyxJQUFJLElBQUksS0FBSyxHQUFHLEVBQUU7Z0JBQ3BDLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFDRCxPQUFPLEdBQUcsUUFBUSxJQUFJLElBQUksRUFBRSxDQUFDO1NBQzlCO0tBQ0Y7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMsa0NBQWtDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzlEO0lBQ0QsT0FBTztJQUNQLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQXRCRCwwQ0FzQkM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0IsUUFBUSxDQUFDLEVBQVU7SUFDakMsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQzVCLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNoQztJQUNELElBQUksRUFBRSxLQUFLLFVBQVUsSUFBSSxFQUFFLEtBQUssS0FBSyxFQUFFO1FBQ3JDLE9BQU8sVUFBVSxDQUFDO0tBQ25CO0lBQ0QsT0FBTyxFQUFFLENBQUM7QUFDWixDQUFDO0FBUkQsNEJBUUMifQ==