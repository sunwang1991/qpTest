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
exports.SysConfigRepository = void 0;
const core_1 = require("@midwayjs/core");
const db_1 = require("../../../framework/datasource/db/db");
const parse_1 = require("../../../framework/utils/parse/parse");
const sys_config_1 = require("../model/sys_config");
/**参数配置表 数据层处理 */
let SysConfigRepository = exports.SysConfigRepository = class SysConfigRepository {
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
            .from(sys_config_1.SysConfig, 's')
            .andWhere("s.del_flag = '0'");
        // 查询条件拼接
        if (query.configName) {
            tx.andWhere('s.config_name like :configName', {
                configName: query.configName + '%',
            });
        }
        if (query.configType) {
            tx.andWhere('s.config_type = :configType', {
                configType: query.configType,
            });
        }
        if (query.configKey) {
            tx.andWhere('s.config_key like :configKey', {
                configKey: query.configKey + '%',
            });
        }
        if (query.beginTime) {
            if (`${query.beginTime}`.length === 10) {
                tx.andWhere('s.create_time >= :beginTime', {
                    beginTime: (0, parse_1.parseNumber)(`${query.beginTime}000`),
                });
            }
            else if (`${query.beginTime}`.length === 13) {
                tx.andWhere('s.create_time >= :beginTime', {
                    beginTime: (0, parse_1.parseNumber)(query.beginTime),
                });
            }
        }
        if (query.endTime) {
            if (`${query.endTime}`.length === 10) {
                tx.andWhere('s.create_time <= :endTime', {
                    endTime: (0, parse_1.parseNumber)(`${query.endTime}000`),
                });
            }
            else if (`${query.endTime}`.length === 13) {
                tx.andWhere('s.create_time <= :endTime', {
                    endTime: (0, parse_1.parseNumber)(query.endTime),
                });
            }
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
     * @param sysConfig 信息
     * @return 列表
     */
    async select(sysConfig) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_config_1.SysConfig, 's')
            .andWhere("s.del_flag = '0'");
        // 构建查询条件
        if (sysConfig.configName) {
            tx.andWhere('s.config_name like :configName', {
                configName: sysConfig.configName + '%',
            });
        }
        if (sysConfig.configType) {
            tx.andWhere('s.config_type = :configType', {
                configType: sysConfig.configType,
            });
        }
        if (sysConfig.configKey) {
            tx.andWhere('s.config_key like :configKey', {
                configKey: sysConfig.configKey + '%',
            });
        }
        if (sysConfig.createTime) {
            tx.andWhere('s.create_time = :createTime', {
                createTime: sysConfig.createTime,
            });
        }
        // 查询数据
        return await tx.getMany();
    }
    /**
     * 通过ID查询
     *
     * @param configIds ID数组
     * @return 信息
     */
    async selectByIds(configIds) {
        if (configIds.length <= 0) {
            return [];
        }
        // 查询数据
        const rows = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_config_1.SysConfig, 's')
            .andWhere("s.config_id in (:configIds) and s.del_flag = '0'", {
            configIds,
        })
            .getMany();
        if (rows.length > 0) {
            return rows;
        }
        return [];
    }
    /**
     * 新增
     *
     * @param sysConfig 信息
     * @return ID
     */
    async insert(sysConfig) {
        if (sysConfig.createBy) {
            const ms = Date.now().valueOf();
            sysConfig.updateBy = sysConfig.createBy;
            sysConfig.updateTime = ms;
            sysConfig.createTime = ms;
        }
        // 执行插入
        const tx = await this.db
            .queryBuilder('')
            .insert()
            .into(sys_config_1.SysConfig)
            .values(sysConfig)
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
     * @param sysConfig 信息
     * @return 影响记录数
     */
    async update(sysConfig) {
        if (sysConfig.configId <= 0) {
            return 0;
        }
        if (sysConfig.updateBy) {
            sysConfig.updateTime = Date.now().valueOf();
        }
        const data = Object.assign({}, sysConfig);
        delete data.configId;
        delete data.delFlag;
        delete data.createBy;
        delete data.createTime;
        // 执行更新
        const tx = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .update(sys_config_1.SysConfig)
            .set(data)
            .andWhere('config_id = :configId', { configId: sysConfig.configId })
            .execute();
        return tx.affected;
    }
    /**
     * 批量删除
     *
     * @param configIds ID数组
     * @return 影响记录数
     */
    async deleteByIds(configIds) {
        if (configIds.length === 0)
            return 0;
        // 执行更新删除标记
        const tx = await this.db
            .queryBuilder('')
            .update(sys_config_1.SysConfig)
            .set({ delFlag: '1' })
            .andWhere('config_id in (:configIds)', { configIds })
            .execute();
        return tx.affected;
    }
    /**
     * 检查信息是否唯一 返回数据ID
     * @param sysConfig 信息
     * @returns
     */
    async checkUnique(sysConfig) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_config_1.SysConfig, 's')
            .andWhere("s.del_flag = '0'");
        // 查询条件拼接
        if (sysConfig.configType) {
            tx.andWhere('s.config_type = :configType', {
                configType: sysConfig.configType,
            });
        }
        if (sysConfig.configKey) {
            tx.andWhere('s.config_key = :configKey', {
                configKey: sysConfig.configKey,
            });
        }
        // 查询数据
        const item = await tx.getOne();
        if (!item) {
            return 0;
        }
        return item.configId;
    }
    /**
     * 通过Key查询Value
     * @param configKey 数据Key
     * @returns
     */
    async selectValueByKey(configKey) {
        if (!configKey)
            return '';
        // 查询数据
        const item = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_config_1.SysConfig, 's')
            .andWhere("s.config_key = :configKey and s.del_flag = '0'", { configKey })
            .getOne();
        if (!item) {
            return '';
        }
        return item.configValue;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", db_1.DynamicDataSource)
], SysConfigRepository.prototype, "db", void 0);
exports.SysConfigRepository = SysConfigRepository = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysConfigRepository);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2NvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9yZXBvc2l0b3J5L3N5c19jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBRzVELDREQUF3RTtBQUN4RSxnRUFBbUU7QUFDbkUsb0RBQWdEO0FBRWhELGlCQUFpQjtBQUdWLElBQU0sbUJBQW1CLGlDQUF6QixNQUFNLG1CQUFtQjtJQUV0QixFQUFFLENBQW9CO0lBRTlCOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLFlBQVksQ0FDdkIsS0FBNkI7UUFFN0IsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUU7YUFDZixZQUFZLENBQUMsRUFBRSxDQUFDO2FBQ2hCLGtCQUFrQixFQUFFO2FBQ3BCLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDWCxJQUFJLENBQUMsc0JBQVMsRUFBRSxHQUFHLENBQUM7YUFDcEIsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDaEMsU0FBUztRQUNULElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRTtZQUNwQixFQUFFLENBQUMsUUFBUSxDQUFDLGdDQUFnQyxFQUFFO2dCQUM1QyxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVUsR0FBRyxHQUFHO2FBQ25DLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQ3BCLEVBQUUsQ0FBQyxRQUFRLENBQUMsNkJBQTZCLEVBQUU7Z0JBQ3pDLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTthQUM3QixDQUFDLENBQUM7U0FDSjtRQUNELElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRTtZQUNuQixFQUFFLENBQUMsUUFBUSxDQUFDLDhCQUE4QixFQUFFO2dCQUMxQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsR0FBRyxHQUFHO2FBQ2pDLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxL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