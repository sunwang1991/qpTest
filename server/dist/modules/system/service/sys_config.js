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
exports.SysConfigService = void 0;
const core_1 = require("@midwayjs/core");
const cache_key_1 = require("../../../framework/constants/cache_key");
const redis_1 = require("../../../framework/datasource/redis/redis");
const file_1 = require("../../../framework/utils/file/file");
const sys_config_1 = require("../repository/sys_config");
const sys_config_2 = require("../model/sys_config");
/**参数配置 服务层处理 */
let SysConfigService = exports.SysConfigService = class SysConfigService {
    /**参数配置表数据 */
    sysConfigRepository;
    /**文件服务 */
    fileUtil;
    /**缓存服务 */
    redisCache;
    /**初始化 */
    async init() {
        // 启动时，刷新缓存-参数配置
        await this.cacheClean('*');
        await this.cacheLoad('*');
    }
    /**
     * 分页查询列表数据
     * @param query 参数
     * @returns []
     */
    async findByPage(query) {
        return await this.sysConfigRepository.selectByPage(query);
    }
    /**
     * 通过ID查询信息
     * @param configId ID
     * @returns 结果
     */
    async findById(configId) {
        if (configId < 0) {
            return new sys_config_2.SysConfig();
        }
        const configs = await this.sysConfigRepository.selectByIds([configId]);
        if (configs.length > 0) {
            return configs[0];
        }
        return new sys_config_2.SysConfig();
    }
    /**
     * 新增信息
     * @param sysConfig 信息
     * @returns ID
     */
    async insert(sysConfig) {
        const configId = await this.sysConfigRepository.insert(sysConfig);
        if (configId > 0) {
            await this.cacheLoad(sysConfig.configKey);
        }
        return configId;
    }
    /**
     * 修改信息
     * @param sysConfig 信息
     * @returns 影响记录数
     */
    async update(sysConfig) {
        const rows = await this.sysConfigRepository.update(sysConfig);
        if (rows > 0) {
            await this.cacheLoad(sysConfig.configKey);
        }
        return rows;
    }
    /**
     * 批量删除信息
     * @param configIds ID数组
     * @returns [影响记录数, 错误信息]
     */
    async deleteByIds(configIds) {
        // 检查是否存在
        const configs = await this.sysConfigRepository.selectByIds(configIds);
        if (configs.length <= 0) {
            return [0, '没有权限访问参数配置数据！'];
        }
        for (const config of configs) {
            // 检查是否为内置参数
            if (config.configType === 'Y') {
                return [0, '该配置参数属于内置参数，禁止删除！'];
            }
            // 清除缓存
            this.cacheClean(config.configKey);
        }
        if (configs.length === configIds.length) {
            const rows = await this.sysConfigRepository.deleteByIds(configIds);
            return [rows, ''];
        }
        return [0, '删除参数配置信息失败！'];
    }
    /**
     * 检查参数键名是否唯一
     * @param configKey 配置Key
     * @param configId 配置ID
     * @returns 结果
     */
    async checkUniqueByKey(configKey, configId) {
        const sysConfig = new sys_config_2.SysConfig();
        sysConfig.configKey = configKey;
        const uniqueId = await this.sysConfigRepository.checkUnique(sysConfig);
        if (uniqueId === configId) {
            return true;
        }
        return uniqueId === 0;
    }
    /**
     * 通过参数键名查询参数值
     * @param configKey 配置Key
     * @returns 结果
     */
    async findValueByKey(configKey) {
        const cacheKey = cache_key_1.CACHE_SYS_CONFIG + ':' + configKey;
        // 从缓存中读取
        const cacheValue = await this.redisCache.get('', cacheKey);
        if (cacheValue) {
            return cacheValue;
        }
        // 无缓存时读取数据放入缓存中
        const configValue = await this.sysConfigRepository.selectValueByKey(configKey);
        if (configValue) {
            await this.redisCache.set('', cacheKey, configValue);
            return configValue;
        }
        return '';
    }
    /**
     * 加载参数缓存数据
     * @param configKey 配置Key 传入*查询全部
     * @returns 结果
     */
    async cacheLoad(configKey) {
        // 查询全部参数
        if (configKey === '*' || configKey === '') {
            const sysConfigs = await this.sysConfigRepository.select(new sys_config_2.SysConfig());
            for (const v of sysConfigs) {
                const key = cache_key_1.CACHE_SYS_CONFIG + ':' + v.configKey;
                await this.redisCache.del('', key);
                await this.redisCache.set('', key, v.configValue);
            }
            return;
        }
        // 指定参数
        const cacheValue = await this.sysConfigRepository.selectValueByKey(configKey);
        if (cacheValue) {
            const key = cache_key_1.CACHE_SYS_CONFIG + ':' + configKey;
            await this.redisCache.del('', key);
            await this.redisCache.set('', key, cacheValue);
        }
    }
    /**
     * 清空参数缓存数据
     * @param configKey 配置Key 传入*清除全部
     * @returns 结果
     */
    async cacheClean(configKey) {
        const key = cache_key_1.CACHE_SYS_CONFIG + ':' + configKey;
        const keys = await this.redisCache.getKeys('', key);
        const rows = await this.redisCache.delKeys('', keys);
        return rows > 0;
    }
    /**
     * 导出数据表格
     * @param rows 信息
     * @param fileName 文件名
     * @returns 结果
     */
    async exportData(rows, fileName) {
        // 导出数据组装
        const arr = [];
        for (const row of rows) {
            // 系统内置
            let configType = '否';
            if (row.configType === 'Y') {
                configType = '是';
            }
            const data = {
                参数编号: row.configId,
                参数名称: row.configName,
                参数键名: row.configKey,
                参数键值: row.configValue,
                系统内置: configType,
            };
            arr.push(data);
        }
        return await this.fileUtil.excelWriteRecord(arr, fileName);
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_config_1.SysConfigRepository)
], SysConfigService.prototype, "sysConfigRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", file_1.FileUtil)
], SysConfigService.prototype, "fileUtil", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", redis_1.RedisCache)
], SysConfigService.prototype, "redisCache", void 0);
__decorate([
    (0, core_1.Init)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SysConfigService.prototype, "init", null);
exports.SysConfigService = SysConfigService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysConfigService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2NvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9zZXJ2aWNlL3N5c19jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQWtFO0FBRWxFLHNFQUEwRTtBQUMxRSxxRUFBdUU7QUFDdkUsNkRBQThEO0FBQzlELHlEQUErRDtBQUMvRCxvREFBZ0Q7QUFFaEQsZ0JBQWdCO0FBR1QsSUFBTSxnQkFBZ0IsOEJBQXRCLE1BQU0sZ0JBQWdCO0lBQzNCLGFBQWE7SUFFTCxtQkFBbUIsQ0FBc0I7SUFFakQsVUFBVTtJQUVGLFFBQVEsQ0FBVztJQUUzQixVQUFVO0lBRUYsVUFBVSxDQUFhO0lBRS9CLFNBQVM7SUFFSSxBQUFOLEtBQUssQ0FBQyxJQUFJO1FBQ2YsZ0JBQWdCO1FBQ2hCLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQixNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsVUFBVSxDQUNyQixLQUE2QjtRQUU3QixPQUFPLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBZ0I7UUFDcEMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFO1lBQ2hCLE9BQU8sSUFBSSxzQkFBUyxFQUFFLENBQUM7U0FDeEI7UUFDRCxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdEIsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLENB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