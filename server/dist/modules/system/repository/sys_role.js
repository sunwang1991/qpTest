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
exports.SysRoleRepository = void 0;
const core_1 = require("@midwayjs/core");
const db_1 = require("../../../framework/datasource/db/db");
const parse_1 = require("../../../framework/utils/parse/parse");
const sys_role_1 = require("../model/sys_role");
/**角色表 数据层处理 */
let SysRoleRepository = exports.SysRoleRepository = class SysRoleRepository {
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
            .from(sys_role_1.SysRole, 's')
            .andWhere("s.del_flag = '0'");
        // 查询条件拼接
        if (query.roleName) {
            tx.andWhere('s.role_name like :roleName', {
                roleName: query.roleName + '%',
            });
        }
        if (query.roleKey) {
            tx.andWhere('s.role_key like :roleKey', {
                roleKey: query.roleKey + '%',
            });
        }
        if (query.statusFlag) {
            tx.andWhere('s.status_flag = :statusFlag', {
                statusFlag: query.statusFlag,
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
        if (query.deptId) {
            tx.andWhere(`s.role_id in ( 
        select distinct role_id from sys_role_dept where sys_role_dept.dept_id IN ( 
        SELECT dept_id FROM sys_dept WHERE dept_id = :deptId or find_in_set(:deptId , ancestors ) 
        ))`, { deptId: query.deptId });
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
        rows = await tx.addOrderBy('s.role_sort', 'ASC').getMany();
        return [rows, total];
    }
    /**
     * 查询集合
     *
     * @param sysRole 信息
     * @return 列表
     */
    async select(sysRole) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_role_1.SysRole, 's')
            .andWhere("s.del_flag = '0'");
        // 构建查询条件
        if (sysRole.roleKey) {
            tx.andWhere('s.role_key like :roleKey', {
                roleKey: sysRole.roleKey + '%',
            });
        }
        if (sysRole.roleName) {
            tx.andWhere('s.role_name like :roleName', {
                roleName: sysRole.roleName + '%',
            });
        }
        if (sysRole.statusFlag) {
            tx.andWhere('s.status_flag = :statusFlag', {
                statusFlag: sysRole.statusFlag,
            });
        }
        // 查询数据
        return await tx.addOrderBy('s.role_sort', 'ASC').getMany();
    }
    /**
     * 通过ID查询
     *
     * @param roleIds ID数组
     * @return 信息
     */
    async selectByIds(roleIds) {
        if (roleIds.length <= 0) {
            return [];
        }
        // 查询数据
        const rows = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_role_1.SysRole, 's')
            .andWhere("s.role_id in (:roleIds) and s.del_flag = '0'", { roleIds })
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
    async insert(sysRole) {
        sysRole.delFlag = '0';
        if (sysRole.createBy) {
            const ms = Date.now().valueOf();
            sysRole.updateBy = sysRole.createBy;
            sysRole.updateTime = ms;
            sysRole.createTime = ms;
        }
        // 执行插入
        const tx = await this.db
            .queryBuilder('')
            .insert()
            .into(sys_role_1.SysRole)
            .values(sysRole)
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
     * @param sysRole 信息
     * @return 影响记录数
     */
    async update(sysRole) {
        if (sysRole.roleId <= 0) {
            return 0;
        }
        if (sysRole.updateBy) {
            sysRole.updateTime = Date.now().valueOf();
        }
        const data = Object.assign({}, sysRole);
        delete data.roleId;
        delete data.delFlag;
        delete data.createBy;
        delete data.createTime;
        delete data.deptIds;
        delete data.menuIds;
        // 执行更新
        const tx = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .update(sys_role_1.SysRole)
            .set(data)
            .andWhere('role_id = :roleId', { roleId: sysRole.roleId })
            .execute();
        return tx.affected;
    }
    /**
     * 批量删除
     *
     * @param roleIds ID数组
     * @return 影响记录数
     */
    async deleteByIds(roleIds) {
        if (roleIds.length === 0)
            return 0;
        // 执行更新删除标记
        const tx = await this.db
            .queryBuilder('')
            .update(sys_role_1.SysRole)
            .set({ delFlag: '1' })
            .andWhere('role_id in (:roleIds)', { roleIds })
            .execute();
        return tx.affected;
    }
    /**
     * 检查信息是否唯一 返回数据ID
     * @param sysRole 信息
     * @returns
     */
    async checkUnique(sysRole) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_role_1.SysRole, 's')
            .andWhere("s.del_flag = '0'");
        // 查询条件拼接
        if (sysRole.roleName) {
            tx.andWhere('s.role_name = :roleName', {
                roleName: sysRole.roleName,
            });
        }
        if (sysRole.roleKey) {
            tx.andWhere('s.role_key = :roleKey', {
                roleKey: sysRole.roleKey,
            });
        }
        // 查询数据
        const item = await tx.getOne();
        if (!item) {
            return 0;
        }
        return item.roleId;
    }
    /**
     * 根据用户ID获取角色信息
     * @param userId 用户ID
     * @returns 角色数组
     */
    async selectByUserId(userId) {
        if (userId <= 0) {
            return [];
        }
        const rows = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .distinct(true)
            .select('r')
            .from(sys_role_1.SysRole, 'r')
            .leftJoin('sys_user_role', 'ur', 'ur.role_id = r.role_id')
            .leftJoin('sys_user', 'u', 'u.user_id = ur.user_id')
            .andWhere("u.del_flag = '0' AND ur.user_id = :userId", { userId })
            .getMany();
        return rows;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", db_1.DynamicDataSource)
], SysRoleRepository.prototype, "db", void 0);
exports.SysRoleRepository = SysRoleRepository = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysRoleRepository);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX3JvbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zeXN0ZW0vcmVwb3NpdG9yeS9zeXNfcm9sZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBNEQ7QUFHNUQsNERBQXdFO0FBQ3hFLGdFQUFtRTtBQUNuRSxnREFBNEM7QUFFNUMsZUFBZTtBQUdSLElBQU0saUJBQWlCLCtCQUF2QixNQUFNLGlCQUFpQjtJQUVwQixFQUFFLENBQW9CO0lBRTlCOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLFlBQVksQ0FDdkIsS0FBNkI7UUFFN0IsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUU7YUFDZixZQUFZLENBQUMsRUFBRSxDQUFDO2FBQ2hCLGtCQUFrQixFQUFFO2FBQ3BCLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDWCxJQUFJLENBQUMsa0JBQU8sRUFBRSxHQUFHLENBQUM7YUFDbEIsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDaEMsU0FBUztRQUNULElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUNsQixFQUFFLENBQUMsUUFBUSxDQUFDLDRCQUE0QixFQUFFO2dCQUN4QyxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsR0FBRyxHQUFHO2FBQy9CLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO1lBQ2pCLEVBQUUsQ0FBQyxRQUFRLENBQUMsMEJBQTBCLEVBQUU7Z0JBQ3RDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUc7YUFDN0IsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDcEIsRUFBRSxDQUFDLFFBQVEsQ0FBQyw2QkFBNkIsRUFBRTtnQkFDekMsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO2FBQzdCLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxLQUFLLENB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