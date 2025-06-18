/// <reference types="node" />
/// <reference types="node" />
import { Redis } from '@midwayjs/redis';
/**Redis连接实例 */
export declare class RedisCache {
    private redisServiceFactory;
    /**定义Lua脚本标记，避免重复定义 */
    private defineCommand;
    /**
     * 获取实例
     * @param source redis服务标识，默认为default
     * @returns redis实例
     */
    rdb(source: string): Promise<Redis>;
    /**
     * 获取redis服务信息
     * @param source 数据源名称，空字符值默认为default
     * @returns 信息对象
     */
    info(source: string): Promise<Record<string, Record<string, string>>>;
    /**
     * 获取redis当前连接可用键Key总数信息
     * @param source 数据源名称，空字符值默认为default
     * @return key总数
     */
    keySize(source: string): Promise<number>;
    /**
     * 获取redis命令状态信息
     * @param source 数据源名称，空字符值默认为default
     * @return 命令状态列表
     */
    commandStats(source: string): Promise<Record<string, string>[]>;
    /**
     * 判断key是否存在
     * @param source 数据源名称，空字符值默认为default
     * @param key 键
     * @return 存在数量
     */
    has(source: string, key: string): Promise<number>;
    /**
     * 设置过期时间（秒）
     * @param source 数据源名称，空字符值默认为default
     * @param key 键
     * @param seconds 有效时间，单位秒
     * @return key剩余有效期，单位秒
     */
    setExpire(source: string, key: string, seconds: number): Promise<number>;
    /**
     * 获取键的剩余有效时间（秒）
     * @param source 数据源名称，空字符值默认为default
     * @param key 键
     * @return key剩余有效期，单位秒
     */
    getExpire(source: string, key: string): Promise<number>;
    /**
     * 获得缓存数据的key列表
     * @param source 数据源名称，空字符值默认为default
     * @param pattern 键
     * @return key列表
     */
    getKeys(source: string, pattern: string): Promise<string[]>;
    /**
     * 批量获得缓存数据
     * @param source 数据源名称，空字符值默认为default
     * @param keys 缓存的键值数组
     * @return 缓存键值对应的数据
     */
    getBatch(source: string, keys: string[]): Promise<string[]>;
    /**
     * 获得缓存数据
     * @param source 数据源名称，空字符值默认为default
     * @param key 缓存的键值
     * @return 缓存键值对应的数据
     */
    get(source: string, key: string): Promise<string>;
    /**
     * 设置缓存数据
     * @param source 数据源名称，空字符值默认为default
     * @param key 键
     * @param value 值
     * @param seconds 有效时间，单位秒 0表示永久有效
     * @return 布尔
     */
    set(source: string, key: string, value: string | Buffer | number, seconds?: number): Promise<boolean>;
    /**
     * 删除单个
     * @param source 数据源名称，空字符值默认为default
     * @param key 键
     * @return 删除key数量
     */
    del(source: string, key: string): Promise<number>;
    /**
     * 删除多个
     * @param source 数据源名称，空字符值默认为default
     * @param keys 多个键
     * @return 删除key数量
     */
    delKeys(source: string, keys: string[]): Promise<number>;
    /**
     * 限流查询并记录
     * @param source 数据源名称，空字符值默认为default
     * @param limitKey 限流缓存key
     * @param time 限流时间,单位秒
     * @param count 限流次数
     * @return 请求记录总数
     */
    rateLimit(source: string, limitKey: string, time: number, count: number): Promise<number>;
}
