"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCache = void 0;
const core_1 = require("@midwayjs/core");
const redis_1 = require("@midwayjs/redis");
/**Redis连接实例 */
let RedisCache = exports.RedisCache = class RedisCache {
    redisServiceFactory;
    /**定义Lua脚本标记，避免重复定义 */
    defineCommand = {};
    /**
     * 获取实例
     * @param source redis服务标识，默认为default
     * @returns redis实例
     */
    async rdb(source) {
        if (!source) {
            source = 'default';
        }
        return await this.redisServiceFactory.get(source);
    }
    /**
     * 获取redis服务信息
     * @param source 数据源名称，空字符值默认为default
     * @returns 信息对象
     */
    async info(source) {
        const rdb = await this.rdb(source);
        const info = await rdb.info();
        // 处理字符串信息
        const infoObj = {};
        let label = '';
        const lines = info.split('\r\n');
        for (const line of lines) {
            // 记录标题节点
            if (line.includes('#')) {
                label = line.split(' ').pop().toLowerCase();
                infoObj[label] = {};
                continue;
            }
            // 节点后续键值
            const kvArr = line.split(':');
            if (kvArr.length >= 2) {
                const key = kvArr.shift();
                infoObj[label][key] = kvArr.pop();
            }
        }
        return infoObj;
    }
    /**
     * 获取redis当前连接可用键Key总数信息
     * @param source 数据源名称，空字符值默认为default
     * @return key总数
     */
    async keySize(source) {
        const rdb = await this.rdb(source);
        return await rdb.dbsize();
    }
    /**
     * 获取redis命令状态信息
     * @param source 数据源名称，空字符值默认为default
     * @return 命令状态列表
     */
    async commandStats(source) {
        const rdb = await this.rdb(source);
        const commandstats = await rdb.info('commandstats');
        // 处理字符串信息
        const statsObjArr = [];
        const lines = commandstats.split('\r\n');
        for (const line of lines) {
            if (!line.startsWith('cmdstat_'))
                continue;
            const kvArr = line.split(':');
            const key = kvArr.shift();
            const valueStr = kvArr.pop();
            statsObjArr.push({
                name: key.substring(8),
                value: valueStr.substring(6, valueStr.indexOf(',usec=')),
            });
        }
        return statsObjArr;
    }
    /**
     * 判断key是否存在
     * @param source 数据源名称，空字符值默认为default
     * @param key 键
     * @return 存在数量
     */
    async has(source, key) {
        const rdb = await this.rdb(source);
        return await rdb.exists(key);
    }
    /**
     * 设置过期时间（秒）
     * @param source 数据源名称，空字符值默认为default
     * @param key 键
     * @param seconds 有效时间，单位秒
     * @return key剩余有效期，单位秒
     */
    async setExpire(source, key, seconds) {
        const rdb = await this.rdb(source);
        return await rdb.expire(key, seconds);
    }
    /**
     * 获取键的剩余有效时间（秒）
     * @param source 数据源名称，空字符值默认为default
     * @param key 键
     * @return key剩余有效期，单位秒
     */
    async getExpire(source, key) {
        const rdb = await this.rdb(source);
        return await rdb.ttl(key);
    }
    /**
     * 获得缓存数据的key列表
     * @param source 数据源名称，空字符值默认为default
     * @param pattern 键
     * @return key列表
     */
    async getKeys(source, pattern) {
        // 数据源
        const rdb = await this.rdb(source);
        // return await rdb.keys(pattern);
        const keys = [];
        // 游标
        let cursor = '0';
        const count = 100;
        // 循环遍历获取匹配的键
        for (;;) {
            // 使用 SCAN 命令获取匹配的键
            const [nextCursor, batchKeys] = await rdb.scan(cursor, 'MATCH', pattern, 'COUNT', count);
            cursor = nextCursor;
            keys.push(...batchKeys);
            // 当 cursor 为 0，表示遍历完成
            if (cursor === '0') {
                break;
            }
        }
        return keys;
    }
    /**
     * 批量获得缓存数据
     * @param source 数据源名称，空字符值默认为default
     * @param keys 缓存的键值数组
     * @return 缓存键值对应的数据
     */
    async getBatch(source, keys) {
        if (!keys || keys.length === 0) {
            return [];
        }
        const rdb = await this.rdb(source);
        const v = await rdb.mget(keys);
        if (Array.isArray(v) && v.length > 0) {
            return v;
        }
        return [];
    }
    /**
     * 获得缓存数据
     * @param source 数据源名称，空字符值默认为default
     * @param key 缓存的键值
     * @return 缓存键值对应的数据
     */
    async get(source, key) {
        const rdb = await this.rdb(source);
        const v = await rdb.get(key);
        return v ?? '';
    }
    /**
     * 设置缓存数据
     * @param source 数据源名称，空字符值默认为default
     * @param key 键
     * @param value 值
     * @param seconds 有效时间，单位秒 0表示永久有效
     * @return 布尔
     */
    async set(source, key, value, seconds = 0) {
        const rdb = await this.rdb(source);
        let ok = '';
        if (seconds > 0) {
            ok = await rdb.set(key, value, 'EX', seconds);
        }
        else {
            ok = await rdb.set(key, value);
        }
        return ok === 'OK';
    }
    /**
     * 删除单个
     * @param source 数据源名称，空字符值默认为default
     * @param key 键
     * @return 删除key数量
     */
    async del(source, key) {
        const rdb = await this.rdb(source);
        return await rdb.del(key);
    }
    /**
     * 删除多个
     * @param source 数据源名称，空字符值默认为default
     * @param keys 多个键
     * @return 删除key数量
     */
    async delKeys(source, keys) {
        if (!keys || keys.length === 0) {
            return 0;
        }
        const rdb = await this.rdb(source);
        return await rdb.del(keys);
    }
    /**
     * 限流查询并记录
     * @param source 数据源名称，空字符值默认为default
     * @param limitKey 限流缓存key
     * @param time 限流时间,单位秒
     * @param count 限流次数
     * @return 请求记录总数
     */
    async rateLimit(source, limitKey, time, count) {
        const rdb = await this.rdb(source);
        // 定义限流命令
        let isDefine = true;
        if (Object.hasOwn(this.defineCommand, 'rateLimitCommand')) {
            if (this.defineCommand.rateLimitCommand.indexOf(source) === -1) {
                isDefine = false;
            }
        }
        else {
            this.defineCommand.rateLimitCommand = [];
            isDefine = false;
        }
        if (!isDefine) {
            // 声明定义限流脚本命令
            rdb.defineCommand('rateLimitCommand', {
                numberOfKeys: 1,
                lua: `local key = KEYS[1]
        local time = tonumber(ARGV[1])
        local count = tonumber(ARGV[2])
        local current = redis.call('get', key);
        if current and tonumber(current) >= count then
            return tonumber(current);
        end
        current = redis.call('incr', key)
        if tonumber(current) == 1 then
            redis.call('expire', key, time)
        end
        return tonumber(current);`,
            });
            this.defineCommand.rateLimitCommand.push(source);
        }
        return await rdb.rateLimitCommand(limitKey, time, count);
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", redis_1.RedisServiceFactory)
], RedisCache.prototype, "redisServiceFactory", void 0);
exports.RedisCache = RedisCache = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], RedisCache);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkaXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZnJhbWV3b3JrL2RhdGFzb3VyY2UvcmVkaXMvcmVkaXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBQzVELDJDQUE2RDtBQUU3RCxlQUFlO0FBR1IsSUFBTSxVQUFVLHdCQUFoQixNQUFNLFVBQVU7SUFFYixtQkFBbUIsQ0FBc0I7SUFFakQsc0JBQXNCO0lBQ2QsYUFBYSxHQUE2QixFQUFFLENBQUM7SUFFckQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBYztRQUM3QixJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsTUFBTSxHQUFHLFNBQVMsQ0FBQztTQUNwQjtRQUNELE9BQU8sTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLElBQUksQ0FDZixNQUFjO1FBRWQsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLE1BQU0sSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzlCLFVBQVU7UUFDVixNQUFNLE9BQU8sR0FBMkMsRUFBRSxDQUFDO1FBQzNELElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNmLE1BQU0sS0FBSyxHQUFhLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0MsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7WUFDeEIsU0FBUztZQUNULElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDdEIsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBVyxFQUFFLENB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