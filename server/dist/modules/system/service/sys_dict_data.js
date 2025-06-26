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
exports.SysDictDataService = void 0;
const core_1 = require("@midwayjs/core");
const file_1 = require("../../../framework/utils/file/file");
const sys_dict_data_1 = require("../repository/sys_dict_data");
const sys_dict_type_1 = require("./sys_dict_type");
const sys_dict_data_2 = require("../model/sys_dict_data");
/**字典类型数据 服务层处理 */
let SysDictDataService = exports.SysDictDataService = class SysDictDataService {
    /**字典数据服务 */
    sysDictDataRepository;
    /**字典类型服务 */
    sysDictTypeService;
    /**文件服务 */
    fileUtil;
    /**
     * 分页查询列表数据
     * @param query 参数
     * @returns []
     */
    async findByPage(query) {
        return await this.sysDictDataRepository.selectByPage(query);
    }
    /**
     * 新增信息
     * @param sysDictData 信息
     * @returns 信息数组
     */
    async find(sysDictData) {
        return await this.sysDictDataRepository.select(sysDictData);
    }
    /**
     * 通过ID查询信息
     * @param dictId ID
     * @returns 结果
     */
    async findById(dictId) {
        if (dictId < 0) {
            return new sys_dict_data_2.SysDictData();
        }
        const dicts = await this.sysDictDataRepository.selectByIds([dictId]);
        if (dicts.length > 0) {
            return dicts[0];
        }
        return new sys_dict_data_2.SysDictData();
    }
    /**
     * 根据字典类型查询信息
     * @param dictType 字典类型
     * @returns []
     */
    async findByType(dictType) {
        return await this.sysDictTypeService.findDataByType(dictType);
    }
    /**
     * 新增信息
     * @param sysDictData 信息
     * @returns ID
     */
    async insert(sysDictData) {
        const insertId = await this.sysDictDataRepository.insert(sysDictData);
        if (insertId > 0) {
            await this.sysDictTypeService.cacheLoad(sysDictData.dictType);
        }
        return insertId;
    }
    /**
     * 修改信息
     * @param sysDictData 信息
     * @returns 影响记录数
     */
    async update(sysDictData) {
        const rows = await this.sysDictDataRepository.update(sysDictData);
        if (rows > 0) {
            await this.sysDictTypeService.cacheLoad(sysDictData.dictType);
        }
        return rows;
    }
    /**
     * 批量删除信息
     * @param dictIds ID数组
     * @returns [影响记录数, 错误信息]
     */
    async deleteByIds(dictIds) {
        // 检查是否存在
        const dicts = await this.sysDictDataRepository.selectByIds(dictIds);
        if (dicts.length <= 0) {
            return [0, '没有权限访问字典编码数据！'];
        }
        if (dicts.length === dictIds.length) {
            for (const v of dicts) {
                // 刷新缓存
                await this.sysDictTypeService.cacheClean(v.dictType);
                await this.sysDictTypeService.cacheLoad(v.dictType);
            }
            const rows = await this.sysDictDataRepository.deleteByIds(dictIds);
            return [rows, ''];
        }
        return [0, '删除字典数据信息失败！'];
    }
    /**
     * 检查同字典类型下字典标签是否唯一
     * @param dictType 字典类型
     * @param dataLabel 数据标签
     * @param dataId 数据ID
     * @returns 结果
     */
    async checkUniqueTypeByLabel(dictType, dataLabel, dataId) {
        const sysDictData = new sys_dict_data_2.SysDictData();
        sysDictData.dictType = dictType;
        sysDictData.dataLabel = dataLabel;
        const uniqueId = await this.sysDictDataRepository.checkUnique(sysDictData);
        if (uniqueId === dataId) {
            return true;
        }
        return uniqueId === 0;
    }
    /**
     * 检查同字典类型下字典键值是否唯一
     * @param dictType 字典类型
     * @param dataValue 数据键值
     * @param dataId 数据ID
     * @returns 结果
     */
    async checkUniqueTypeByValue(dictType, dataValue, dataId) {
        const sysDictData = new sys_dict_data_2.SysDictData();
        sysDictData.dictType = dictType;
        sysDictData.dataValue = dataValue;
        const uniqueId = await this.sysDictDataRepository.checkUnique(sysDictData);
        if (uniqueId === dataId) {
            return true;
        }
        return uniqueId === 0;
    }
    /**
     * 导出数据表格
     * @param rows 信息
     * @param fileName 文件名
     * @returns 结果
     */
    async exportData(rows, fileName) {
        // 导出数据组装
        const dataCells = [];
        for (const row of rows) {
            let statusValue = '停用';
            if (row.statusFlag === '1') {
                statusValue = '正常';
            }
            const data = {
                字典类型: row.dictType,
                数据排序: row.dataSort,
                数据编号: row.dataId,
                数据标签: row.dataLabel,
                数据键值: row.dataValue,
                数据状态: statusValue,
            };
            dataCells.push(data);
        }
        return await this.fileUtil.excelWriteRecord(dataCells, fileName);
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_dict_data_1.SysDictDataRepository)
], SysDictDataService.prototype, "sysDictDataRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_dict_type_1.SysDictTypeService)
], SysDictDataService.prototype, "sysDictTypeService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", file_1.FileUtil)
], SysDictDataService.prototype, "fileUtil", void 0);
exports.SysDictDataService = SysDictDataService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysDictDataService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2RpY3RfZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9zZXJ2aWNlL3N5c19kaWN0X2RhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBRTVELDZEQUE4RDtBQUM5RCwrREFBb0U7QUFDcEUsbURBQXFEO0FBQ3JELDBEQUFxRDtBQUVyRCxrQkFBa0I7QUFHWCxJQUFNLGtCQUFrQixnQ0FBeEIsTUFBTSxrQkFBa0I7SUFDN0IsWUFBWTtJQUVKLHFCQUFxQixDQUF3QjtJQUVyRCxZQUFZO0lBRUosa0JBQWtCLENBQXFCO0lBRS9DLFVBQVU7SUFFRixRQUFRLENBQVc7SUFFM0I7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxVQUFVLENBQ3JCLEtBQTZCO1FBRTdCLE9BQU8sTUFBTSxJQUFJLENBQUMscUJBQXFCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLElBQUksQ0FBQyxXQUF3QjtRQUN4QyxPQUFPLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBYztRQUNsQyxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDZCxPQUFPLElBQUksMkJBQVcsRUFBRSxDQUFDO1NBQzFCO1FBQ0QsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNyRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3BCLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pCO1FBQ0QsT0FBTyxJQUFJLDJCQUFXLEVBQUUsQ0FB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