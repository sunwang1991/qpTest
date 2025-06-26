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
exports.SysDictDataRepository = void 0;
const core_1 = require("@midwayjs/core");
const db_1 = require("../../../framework/datasource/db/db");
const sys_dict_data_1 = require("../model/sys_dict_data");
/**字典类型数据表 数据层处理 */
let SysDictDataRepository = exports.SysDictDataRepository = class SysDictDataRepository {
    db;
    /**
     * 分页查询集合
     *
     * @param query 参数
     * @returns 集合
     */
    async selectByPage(query) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_dict_data_1.SysDictData, 's')
            .andWhere("s.del_flag = '0'");
        // 查询条件拼接
        if (query.dictType) {
            tx.andWhere('s.dict_type = :dictType', {
                dictType: query.dictType,
            });
        }
        if (query.dataLabel) {
            tx.andWhere('s.data_label like :dataLabel', {
                dataLabel: query.dataLabel + '%',
            });
        }
        if (query.statusFlag) {
            tx.andWhere('s.status_flag = :statusFlag', {
                statusFlag: query.statusFlag,
            });
        }
        // 查询结果
        let total = 0;
        let rows = [];
        // 查询数量为0直接返回
        total = await tx.getCount();
        if (total <= 0) {
            return [rows, total];
        }
        // 查询数据分页
        const [pageNum, pageSize] = this.db.pageNumSize(query.pageNum, query.pageSize);
        tx.skip(pageSize * pageNum).take(pageSize);
        rows = await tx.getMany();
        return [rows, total];
    }
    /**
     * 查询集合
     *
     * @param sysDictData 信息
     * @return 列表
     */
    async select(sysDictData) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_dict_data_1.SysDictData, 's')
            .andWhere("s.del_flag = '0'");
        // 构建查询条件
        if (sysDictData.dataLabel) {
            tx.andWhere('s.data_label like :dataLabel', {
                dataLabel: sysDictData.dataLabel + '%',
            });
        }
        if (sysDictData.dictType) {
            tx.andWhere('s.dict_type = :dictType', {
                dictType: sysDictData.dictType,
            });
        }
        if (sysDictData.statusFlag) {
            tx.andWhere('s.status_flag = :statusFlag', {
                statusFlag: sysDictData.statusFlag,
            });
        }
        // 查询数据
        return await tx.addOrderBy('s.data_sort', 'ASC').getMany();
    }
    /**
     * 通过ID查询
     *
     * @param dataIds ID数组
     * @return 信息
     */
    async selectByIds(dataIds) {
        if (dataIds.length <= 0) {
            return [];
        }
        // 查询数据
        const rows = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_dict_data_1.SysDictData, 's')
            .andWhere("s.data_id in (:dataIds) and s.del_flag = '0'", { dataIds })
            .getMany();
        if (rows.length > 0) {
            return rows;
        }
        return [];
    }
    /**
     * 新增
     *
     * @param sysDictData 信息
     * @return ID
     */
    async insert(sysDictData) {
        sysDictData.delFlag = '0';
        if (sysDictData.createBy) {
            const ms = Date.now().valueOf();
            sysDictData.updateBy = sysDictData.createBy;
            sysDictData.updateTime = ms;
            sysDictData.createTime = ms;
        }
        // 执行插入
        const tx = await this.db
            .queryBuilder('')
            .insert()
            .into(sys_dict_data_1.SysDictData)
            .values(sysDictData)
            .execute();
        const raw = tx.raw;
        if (raw.insertId > 0) {
            return raw.insertId;
        }
        return 0;
    }
    /**
     * 更新
     *
     * @param sysDictData 信息
     * @return 影响记录数
     */
    async update(sysDictData) {
        if (sysDictData.dataId <= 0) {
            return 0;
        }
        if (sysDictData.updateBy) {
            sysDictData.updateTime = Date.now().valueOf();
        }
        const data = Object.assign({}, sysDictData);
        delete data.dataId;
        delete data.delFlag;
        delete data.createBy;
        delete data.createTime;
        // 执行更新
        const tx = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .update(sys_dict_data_1.SysDictData)
            .set(data)
            .andWhere('data_id = :dataId', { dataId: sysDictData.dataId })
            .execute();
        return tx.affected;
    }
    /**
     * 批量删除
     *
     * @param dataIds ID数组
     * @return 影响记录数
     */
    async deleteByIds(dataIds) {
        if (dataIds.length === 0)
            return 0;
        // 执行更新删除标记
        const tx = await this.db
            .queryBuilder('')
            .update(sys_dict_data_1.SysDictData)
            .set({ delFlag: '1' })
            .andWhere('data_id in (:dataIds)', { dataIds })
            .execute();
        return tx.affected;
    }
    /**
     * 检查信息是否唯一 返回数据ID
     * @param sysDictData 信息
     * @returns
     */
    async checkUnique(sysDictData) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_dict_data_1.SysDictData, 's')
            .andWhere("s.del_flag = '0'");
        // 查询条件拼接
        if (sysDictData.dictType) {
            tx.andWhere('s.dict_type = :dictType', {
                dictType: sysDictData.dictType,
            });
        }
        if (sysDictData.dataLabel) {
            tx.andWhere('s.data_label = :dataLabel', {
                dataLabel: sysDictData.dataLabel,
            });
        }
        if (sysDictData.dataValue) {
            tx.andWhere('s.data_value = :dataValue', {
                dataValue: sysDictData.dataValue,
            });
        }
        // 查询数据
        const item = await tx.getOne();
        if (!item) {
            return 0;
        }
        return item.dataId;
    }
    /**
     * 存在数据数量
     *
     * @param dictType 字典类型
     * @return 数量
     */
    async existDataByDictType(dictType) {
        if (!dictType) {
            return 0;
        }
        // 查询数据
        const count = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_dict_data_1.SysDictData, 's')
            .andWhere("s.del_flag = '0'")
            .andWhere('s.dict_type = :dictType', { dictType })
            .getCount();
        return count;
    }
    /**
     * 更新一组字典类型
     *
     * @param oldDictType 旧字典类型
     * @param newDictType 新字典类型
     * @return 影响记录数
     */
    async updateDataByDictType(oldDictType, newDictType) {
        if (!oldDictType || !newDictType) {
            return 0;
        }
        // 执行更新状态标记
        const tx = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .update(sys_dict_data_1.SysDictData)
            .set({ dictType: newDictType })
            .andWhere('dict_type = :oldDictType', { oldDictType })
            .execute();
        return tx.affected;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", db_1.DynamicDataSource)
], SysDictDataRepository.prototype, "db", void 0);
exports.SysDictDataRepository = SysDictDataRepository = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysDictDataRepository);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2RpY3RfZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9yZXBvc2l0b3J5L3N5c19kaWN0X2RhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBRzVELDREQUF3RTtBQUN4RSwwREFBcUQ7QUFFckQsbUJBQW1CO0FBR1osSUFBTSxxQkFBcUIsbUNBQTNCLE1BQU0scUJBQXFCO0lBRXhCLEVBQUUsQ0FBb0I7SUFFOUI7Ozs7O09BS0c7SUFDSSxLQUFLLENBQUMsWUFBWSxDQUN2QixLQUE2QjtRQUU3QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRTthQUNmLFlBQVksQ0FBQyxFQUFFLENBQUM7YUFDaEIsa0JBQWtCLEVBQUU7YUFDcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLElBQUksQ0FBQywyQkFBVyxFQUFFLEdBQUcsQ0FBQzthQUN0QixRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNoQyxTQUFTO1FBQ1QsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQ2xCLEVBQUUsQ0FBQyxRQUFRLENBQUMseUJBQXlCLEVBQUU7Z0JBQ3JDLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTthQUN6QixDQUFDLENBQUM7U0FDSjtRQUNELElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRTtZQUNuQixFQUFFLENBQUMsUUFBUSxDQUFDLDhCQUE4QixFQUFFO2dCQUMxQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsR0FBRyxHQUFHO2FBQ2pDLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQ3BCLEVBQUUsQ0FBQyxRQUFRLENBQUMsNkJBQTZCLEVBQUU7Z0JBQ3pDLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTthQUM3QixDQUFDLENBQUM7U0FDSjtRQUVELE9BQU87UUFDUCxJQUFJLEtBQUssR0FB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