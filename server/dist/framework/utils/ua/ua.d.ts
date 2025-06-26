import { UAParser } from 'ua-parser-js';
/**
 * 获取user-agent信息
 * @param userAgent 请求头 user-agent
 * @returns 信息对象
 */
export declare function uaInfo(userAgent: string): UAParser;
