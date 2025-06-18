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
exports.SysDictTypeService = void 0;
const core_1 = require("@midwayjs/core");
const common_1 = require("../../../framework/constants/common");
const cache_key_1 = require("../../../framework/constants/cache_key");
const redis_1 = require("../../../framework/datasource/redis/redis");
const file_1 = require("../../../framework/utils/file/file");
const sys_dict_type_1 = require("../repository/sys_dict_type");
const sys_dict_data_1 = require("../repository/sys_dict_data");
const sys_dict_data_2 = require("../model/sys_dict_data");
const sys_dict_type_2 = require("../model/sys_dict_type");
/**字典类型 服务层处理 */
let SysDictTypeService = exports.SysDictTypeService = class SysDictTypeService {
    /**字典类型服务 */
    sysDictTypeRepository;
    /**字典数据服务 */
    sysDictDataRepository;
    /**文件服务 */
    fileUtil;
    /**缓存服务 */
    redisCache;
    /**初始化 */
    async init() {
        // 启动时，刷新缓存-字典类型数据
        await this.cacheClean('*');
        await this.cacheLoad('*');
    }
    /**
     * 分页查询列表数据
     * @param query 参数
     * @returns []
     */
    async findByPage(query) {
        return await this.sysDictTypeRepository.selectByPage(query);
    }
    /**
     * 查询数据
     * @param sysDictType 信息
     * @returns []
     */
    async find(sysDictType) {
        return await this.sysDictTypeRepository.select(sysDictType);
    }
    /**
     * 通过ID查询信息
     * @param dictId ID
     * @returns 结果
     */
    async findById(dictId) {
        if (dictId < 0) {
            return new sys_dict_type_2.SysDictType();
        }
        const dictTypes = await this.sysDictTypeRepository.selectByIds([dictId]);
        if (dictTypes.length > 0) {
            return dictTypes[0];
        }
        return new sys_dict_type_2.SysDictType();
    }
    /**
     * 根据字典类型查询信息
     * @param dictType 字典类型
     * @returns 结果
     */
    async findByType(dictType) {
        return await this.sysDictTypeRepository.selectByType(dictType);
    }
    /**
     * 新增信息
     * @param sysDictType 信息
     * @returns ID
     */
    async insert(sysDictType) {
        const insertId = await this.sysDictTypeRepository.insert(sysDictType);
        if (insertId > 0) {
            await this.cacheLoad(sysDictType.dictType);
        }
        return insertId;
    }
    /**
     * 修改信息
     * @param sysDictType 信息
     * @returns 影响记录数
     */
    async update(sysDictType) {
        const arr = await this.sysDictTypeRepository.selectByIds([
            sysDictType.dictId,
        ]);
        if (arr.length === 0) {
            return 0;
        }
        // 同字典类型被修改时，同步更新修改
        const oldDictType = arr[0].dictType;
        const rows = await this.sysDictTypeRepository.update(sysDictType);
        if (rows > 0 &&
            oldDictType !== '' &&
            oldDictType !== sysDictType.dictType) {
            this.sysDictDataRepository.updateDataByDictType(oldDictType, sysDictType.dictType);
        }
        // 刷新缓存
        this.cacheLoad(sysDictType.dictType);
        return rows;
    }
    /**
     * 批量删除信息
     * @param dictIds ID数组
     * @returns [影响记录数, 错误信息]
     */
    async deleteByIds(dictIds) {
        // 检查是否存在
        const arr = await this.sysDictTypeRepository.selectByIds(dictIds);
        if (arr.length <= 0) {
            return [0, '没有权限访问字典类型数据！'];
        }
        for (const v of arr) {
            // 字典类型下级含有数据
            const useCount = await this.sysDictDataRepository.existDataByDictType(v.dictType);
            if (useCount > 0) {
                return [0, `【${v.dictName}】存在字典数据,不能删除`];
            }
            // 清除缓存
            this.cacheClean(v.dictType);
        }
        if (arr.length === dictIds.length) {
            const rows = await this.sysDictTypeRepository.deleteByIds(dictIds);
            return [rows, ''];
        }
        return [0, '删除字典数据信息失败！'];
    }
    /**
     * 检查字典名称是否唯一
     * @param dictName 字典名称
     * @param dictId 字典ID
     * @returns 结果
     */
    async checkUniqueByName(dictName, dictId) {
        const sysDictType = new sys_dict_type_2.SysDictType();
        sysDictType.dictName = dictName;
        const uniqueId = await this.sysDictTypeRepository.checkUnique(sysDictType);
        if (uniqueId === dictId) {
            return true;
        }
        return uniqueId === 0;
    }
    /**
     * 检查字典类型是否唯一
     * @param dictType 字典类型
     * @param dictId 字典ID
     * @returns 结果
     */
    async checkUniqueByType(dictType, dictId) {
        const sysDictType = new sys_dict_type_2.SysDictType();
        sysDictType.dictType = dictType;
        const uniqueId = await this.sysDictTypeRepository.checkUnique(sysDictType);
        if (uniqueId === dictId) {
            return true;
        }
        return uniqueId === 0;
    }
    /**
     * 获取字典数据缓存数据
     * @param dictType 字典类型
     * @returns 结果
     */
    async findDataByType(dictType) {
        let data = [];
        const key = cache_key_1.CACHE_SYS_DICT + ':' + dictType;
        const jsonStr = await this.redisCache.get('', key);
        if (jsonStr.length > 7) {
            data = JSON.parse(jsonStr);
        }
        else {
            const sysDictData = new sys_dict_data_2.SysDictData();
            sysDictData.statusFlag = common_1.STATUS_YES;
            sysDictData.dictType = dictType;
            data = await this.sysDictDataRepository.select(sysDictData);
            if (data.length > 0) {
                await this.redisCache.del('', key);
                await this.redisCache.set('', key, JSON.stringify(data));
            }
        }
        return data;
    }
    /**
     * 加载字典缓存数据
     * @param dictType 字典类型 传入*查询全部
     * @returns 结果
     */
    async cacheLoad(dictType) {
        const sysDictData = new sys_dict_data_2.SysDictData();
        sysDictData.dictType = dictType;
        sysDictData.statusFlag = common_1.STATUS_YES;
        // 指定字典类型
        if (dictType === '*' || dictType === '') {
            sysDictData.dictType = '';
        }
        const arr = await this.sysDictDataRepository.select(sysDictData);
        if (arr.length === 0) {
            return;
        }
        // 将字典数据按类型分组
        const m = new Map();
        for (const v of arr) {
            const key = v.dictType;
            if (m[key]) {
                m[key].push(v);
            }
            else {
                m[key] = [v];
            }
        }
        // 放入缓存
        for (const [k, v] of m) {
            const key = cache_key_1.CACHE_SYS_DICT + ':' + k;
            await this.redisCache.del('', key);
            await this.redisCache.set('', key, JSON.stringify(v));
        }
    }
    /**
     * 清空字典缓存数据
     * @param dictType 字典类型 传入*清除全部
     * @returns 结果
     */
    async cacheClean(dictType) {
        const key = cache_key_1.CACHE_SYS_DICT + ':' + dictType;
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
            let statusValue = '停用';
            if (row.statusFlag === '1') {
                statusValue = '正常';
            }
            const data = {
                字典编号: row.dictId,
                字典名称: row.dictName,
                字典类型: row.dictType,
                字典状态: statusValue,
            };
            arr.push(data);
        }
        return await this.fileUtil.excelWriteRecord(arr, fileName);
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_dict_type_1.SysDictTypeRepository)
], SysDictTypeService.prototype, "sysDictTypeRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_dict_data_1.SysDictDataRepository)
], SysDictTypeService.prototype, "sysDictDataRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", file_1.FileUtil)
], SysDictTypeService.prototype, "fileUtil", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", redis_1.RedisCache)
], SysDictTypeService.prototype, "redisCache", void 0);
__decorate([
    (0, core_1.Init)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SysDictTypeService.prototype, "init", null);
exports.SysDictTypeService = SysDictTypeService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysDictTypeService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2RpY3RfdHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9zZXJ2aWNlL3N5c19kaWN0X3R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQWtFO0FBRWxFLGdFQUFpRTtBQUNqRSxzRUFBd0U7QUFDeEUscUVBQXVFO0FBQ3ZFLDZEQUE4RDtBQUM5RCwrREFBb0U7QUFDcEUsK0RBQW9FO0FBQ3BFLDBEQUFxRDtBQUNyRCwwREFBcUQ7QUFFckQsZ0JBQWdCO0FBR1QsSUFBTSxrQkFBa0IsZ0NBQXhCLE1BQU0sa0JBQWtCO0lBQzdCLFlBQVk7SUFFSixxQkFBcUIsQ0FBd0I7SUFFckQsWUFBWTtJQUVKLHFCQUFxQixDQUF3QjtJQUVyRCxVQUFVO0lBRUYsUUFBUSxDQUFXO0lBRTNCLFVBQVU7SUFFRixVQUFVLENBQWE7SUFFL0IsU0FBUztJQUVJLEFBQU4sS0FBSyxDQUFDLElBQUk7UUFDZixrQkFBa0I7UUFDbEIsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxVQUFVLENBQ3JCLEtBQTZCO1FBRTdCLE9BQU8sTUFBTSxJQUFJLENBQUMscUJBQXFCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLElBQUksQ0FBQyxXQUF3QjtRQUN4QyxPQUFPLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBYztRQUNsQyxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFD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