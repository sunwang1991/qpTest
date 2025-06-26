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
exports.SysUserRepository = void 0;
const core_1 = require("@midwayjs/core");
const parse_1 = require("../../../framework/utils/parse/parse");
const db_1 = require("../../../framework/datasource/db/db");
const sys_user_1 = require("../model/sys_user");
const bcrypt_1 = require("../../../framework/utils/crypto/bcrypt");
/**用户表 数据层处理 */
let SysUserRepository = exports.SysUserRepository = class SysUserRepository {
    db;
    /**
     * 分页查询集合
     *
     * @param query 参数
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @returns 集合
     */
    async selectByPage(query, dataScopeSQL) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_user_1.SysUser, 's')
            .andWhere("s.del_flag = '0'");
        // 查询条件拼接
        if (query.userId) {
            tx.andWhere('s.user_id = :userId', { userId: query.userId });
        }
        if (query.userName) {
            tx.andWhere('s.user_name like :userName', {
                userName: query.userName + '%',
            });
        }
        if (query.phone) {
            tx.andWhere('s.phone like :phone', { phone: query.phone + '%' });
        }
        if (query.statusFlag) {
            tx.andWhere('s.status_flag = :statusFlag', {
                statusFlag: query.statusFlag,
            });
        }
        if (query.beginTime) {
            if (`${query.beginTime}`.length === 10) {
                tx.andWhere('s.login_time >= :beginTime', {
                    beginTime: (0, parse_1.parseNumber)(`${query.beginTime}000`),
                });
            }
            else if (`${query.beginTime}`.length === 13) {
                tx.andWhere('s.login_time >= :beginTime', {
                    beginTime: (0, parse_1.parseNumber)(query.beginTime),
                });
            }
        }
        if (query.endTime) {
            if (`${query.endTime}`.length === 10) {
                tx.andWhere('s.login_time <= :endTime', {
                    endTime: (0, parse_1.parseNumber)(`${query.endTime}000`),
                });
            }
            else if (`${query.endTime}`.length === 13) {
                tx.andWhere('s.login_time <= :endTime', {
                    endTime: (0, parse_1.parseNumber)(query.endTime),
                });
            }
        }
        if (query.deptId) {
            tx.andWhere(`(s.dept_id = :deptId or s.dept_id in ( 
        select t.dept_id from sys_dept t where find_in_set(:deptId, ancestors) 
        ))`, { deptId: query.deptId });
        }
        if (dataScopeSQL) {
            tx.andWhere(dataScopeSQL);
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
        rows = await tx.addOrderBy('s.user_id', 'DESC').getMany();
        return [rows, total];
    }
    /**
     * 查询集合
     *
     * @param sysUser 信息
     * @return 列表
     */
    async select(sysUser) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_user_1.SysUser, 's')
            .andWhere("s.del_flag = '0'");
        // 构建查询条件
        if (sysUser.userName) {
            tx.andWhere('s.user_name like :userName', {
                userName: sysUser.userName + '%',
            });
        }
        if (sysUser.phone) {
            tx.andWhere('s.phone like :phone', {
                phone: sysUser.phone + '%',
            });
        }
        if (sysUser.statusFlag) {
            tx.andWhere('s.status_flag = :statusFlag', {
                statusFlag: sysUser.statusFlag,
            });
        }
        if (sysUser.userId) {
            tx.andWhere('s.user_id = :userId', {
                userId: sysUser.userId,
            });
        }
        // 查询数据
        return await tx.addOrderBy('s.login_time', 'DESC').getMany();
    }
    /**
     * 通过ID查询
     *
     * @param userIds ID数组
     * @return 信息
     */
    async selectByIds(userIds) {
        if (userIds.length <= 0) {
            return [];
        }
        // 查询数据
        const rows = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_user_1.SysUser, 's')
            .andWhere("s.user_id in (:userIds) and s.del_flag = '0'", { userIds })
            .getMany();
        if (rows.length > 0) {
            return rows;
        }
        return [];
    }
    /**
     * 新增
     *
     * @param sysUser 信息
     * @return ID
     */
    async insert(sysUser) {
        sysUser.delFlag = '0';
        if (sysUser.createBy) {
            const ms = Date.now().valueOf();
            sysUser.updateBy = sysUser.createBy;
            sysUser.updateTime = ms;
            sysUser.createTime = ms;
        }
        if (sysUser.password) {
            const password = await (0, bcrypt_1.bcryptHash)(sysUser.password);
            sysUser.password = password;
        }
        // 执行插入
        const tx = await this.db
            .queryBuilder('')
            .insert()
            .into(sys_user_1.SysUser)
            .values(sysUser)
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
     * @param sysUser 信息
     * @return 影响记录数
     */
    async update(sysUser) {
        if (sysUser.userId <= 0) {
            return 0;
        }
        if (sysUser.updateBy) {
            sysUser.updateTime = Date.now().valueOf();
        }
        if (sysUser.password) {
            const password = await (0, bcrypt_1.bcryptHash)(sysUser.password);
            sysUser.password = password;
        }
        else {
            delete sysUser.password;
        }
        const data = Object.assign({}, sysUser);
        delete data.delFlag;
        delete data.createBy;
        delete data.createTime;
        delete data.dept;
        delete data.roles;
        delete data.roleId;
        delete data.roleIds;
        delete data.postIds;
        // 执行更新
        const tx = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .update(sys_user_1.SysUser)
            .set(data)
            .andWhere('user_id = :userId', { userId: sysUser.userId })
            .execute();
        return tx.affected;
    }
    /**
     * 批量删除
     *
     * @param userIds ID数组
     * @return 影响记录数
     */
    async deleteByIds(userIds) {
        if (userIds.length === 0)
            return 0;
        // 执行更新删除标记
        const tx = await this.db
            .queryBuilder('')
            .update(sys_user_1.SysUser)
            .set({ delFlag: '1' })
            .andWhere('user_id in (:userIds)', { userIds })
            .execute();
        return tx.affected;
    }
    /**
     * 检查信息是否唯一 返回数据ID
     * @param sysUser 信息
     * @returns
     */
    async checkUnique(sysUser) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_user_1.SysUser, 's')
            .andWhere("s.del_flag = '0'");
        // 查询条件拼接
        if (sysUser.userName) {
            tx.andWhere('s.user_name = :userName', {
                userName: sysUser.userName,
            });
        }
        if (sysUser.phone) {
            tx.andWhere('s.phone = :phone', {
                phone: sysUser.phone,
            });
        }
        if (sysUser.email) {
            tx.andWhere('s.email = :email', {
                email: sysUser.email,
            });
        }
        // 查询数据
        const item = await tx.getOne();
        if (!item) {
            return 0;
        }
        return item.userId;
    }
    /**
     * 通过登录账号查询信息
     * @param userName 用户账号
     * @returns
     */
    async selectByUserName(userName) {
        if (!userName) {
            return new sys_user_1.SysUser();
        }
        // 查询数据
        const item = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_user_1.SysUser, 's')
            .andWhere("s.user_name = :userName and s.del_flag = '0'", { userName })
            .getOne();
        if (!item) {
            return new sys_user_1.SysUser();
        }
        return item;
    }
    /**
     * 分页查询集合By分配用户角色
     *
     * @param query 参数
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @returns 集合
     */
    async selectAuthUsersByPage(query, dataScopeSQL) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_user_1.SysUser, 's')
            .andWhere("s.del_flag = '0'");
        // 查询条件拼接
        if (query.userName) {
            tx.andWhere('s.user_name like :userName', {
                userName: query.userName + '%',
            });
        }
        if (query.phone) {
            tx.andWhere('s.phone like :phone', {
                phone: query.phone + '%',
            });
        }
        if (query.statusFlag) {
            tx.andWhere('s.status_flag = :statusFlag', {
                statusFlag: query.statusFlag,
            });
        }
        // 分配角色的用户
        if (query.roleId) {
            const auth = (0, parse_1.parseBoolean)(query.auth);
            if (auth) {
                tx.andWhere(`s.user_id in (
            select distinct u.user_id from sys_user u 
            inner join sys_user_role ur on u.user_id = ur.user_id 
            and ur.role_id = :roleId
          )`, { roleId: query.roleId });
            }
            else {
                tx.andWhere(`s.user_id not in (
            select distinct u.user_id from sys_user u 
            inner join sys_user_role ur on u.user_id = ur.user_id 
            and ur.role_id = :roleId
          )`, { roleId: query.roleId });
            }
        }
        if (dataScopeSQL) {
            tx.andWhere(dataScopeSQL);
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
        rows = await tx.addOrderBy('s.user_id', 'DESC').getMany();
        return [rows, total];
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", db_1.DynamicDataSource)
], SysUserRepository.prototype, "db", void 0);
exports.SysUserRepository = SysUserRepository = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysUserRepository);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX3VzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zeXN0ZW0vcmVwb3NpdG9yeS9zeXNfdXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBNEQ7QUFHNUQsZ0VBRzhDO0FBQzlDLDREQUF3RTtBQUN4RSxnREFBNEM7QUFDNUMsbUVBQW9FO0FBRXBFLGVBQWU7QUFHUixJQUFNLGlCQUFpQiwrQkFBdkIsTUFBTSxpQkFBaUI7SUFFcEIsRUFBRSxDQUFvQjtJQUU5Qjs7Ozs7O09BTUc7SUFDSSxLQUFLLENBQUMsWUFBWSxDQUN2QixLQUE2QixFQUM3QixZQUFvQjtRQUVwQixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRTthQUNmLFlBQVksQ0FBQyxFQUFFLENBQUM7YUFDaEIsa0JBQWtCLEVBQUU7YUFDcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLElBQUksQ0FBQyxrQkFBTyxFQUFFLEdBQUcsQ0FBQzthQUNsQixRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNoQyxTQUFTO1FBQ1QsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2hCLEVBQUUsQ0FBQyxRQUFRLENBQUMscUJBQXFCLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDOUQ7UUFDRCxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbEIsRUFBRSxDQUFDLFFBQVEsQ0FBQyw0QkFBNEIsRUFBRTtnQkFDeEMsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLEdBQUcsR0FBRzthQUMvQixDQUFDLENBQUM7U0FDSjtRQUNELElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTtZQUNmLEVBQUUsQ0FBQyxRQUFRLENBQUMscUJBQXFCLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1NB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