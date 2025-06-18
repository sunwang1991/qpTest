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
exports.SysLogLoginRepository = void 0;
const core_1 = require("@midwayjs/core");
const db_1 = require("../../../framework/datasource/db/db");
const parse_1 = require("../../../framework/utils/parse/parse");
const sys_log_login_1 = require("../model/sys_log_login");
/**系统登录访问表 数据层处理 */
let SysLogLoginRepository = exports.SysLogLoginRepository = class SysLogLoginRepository {
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
            .from(sys_log_login_1.SysLogLogin, 's');
        // 查询条件拼接
        if (query.loginIp) {
            tx.andWhere('s.login_ip like :loginIp', {
                loginIp: query.loginIp + '%',
            });
        }
        if (query.userName) {
            tx.andWhere('s.user_name like :userName', {
                userName: query.userName + '%',
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
        if (dataScopeSQL) {
            dataScopeSQL = `select distinct user_name from sys_user where ${dataScopeSQL}`;
            tx.andWhere(`s.user_name in ( ${dataScopeSQL} )`);
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
        // 排序
        if (query.sortBy && query.sortOrder) {
            const sortByArr = query.sortBy.split(',');
            const sortOrderArr = query.sortOrder.split(',');
            for (let i = 0; i < sortByArr.length; i++) {
                const sortBy = sortByArr[i];
                const sortOrder = sortOrderArr[i];
                // 排序字段
                let sort = 's.id';
                if (sortBy === 'loginIp') {
                    sort = 's.login_ip';
                }
                else if (sortBy === 'userName') {
                    sort = 's.user_name';
                }
                else if (sortBy === 'createTime') {
                    sort = 's.create_time';
                }
                // 排序方式
                let order = 'ASC';
                if (sortOrder.startsWith('asc')) {
                    order = 'ASC';
                }
                else if (sortOrder.startsWith('desc')) {
                    order = 'DESC';
                }
                tx.addOrderBy(sort, order);
            }
        }
        else {
            tx.addOrderBy('s.id', 'DESC');
        }
        // 查询数据
        rows = await tx.getMany();
        return [rows, total];
    }
    /**
     * 新增
     *
     * @param sysLogLogin 信息
     * @return ID
     */
    async insert(sysLogLogin) {
        sysLogLogin.loginTime = Date.now().valueOf();
        // 执行插入
        const tx = await this.db
            .queryBuilder('')
            .insert()
            .into(sys_log_login_1.SysLogLogin)
            .values(sysLogLogin)
            .execute();
        const raw = tx.raw;
        if (raw.insertId > 0) {
            return raw.insertId;
        }
        return 0;
    }
    /**
     * 清空信息
     *
     * @return 影响记录数
     */
    async clean() {
        // 执行删除
        const tx = await this.db
            .queryBuilder('')
            .delete()
            .from(sys_log_login_1.SysLogLogin)
            .execute();
        return tx.affected;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", db_1.DynamicDataSource)
], SysLogLoginRepository.prototype, "db", void 0);
exports.SysLogLoginRepository = SysLogLoginRepository = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysLogLoginRepository);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2xvZ19sb2dpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9yZXBvc2l0b3J5L3N5c19sb2dfbG9naW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBRzVELDREQUF3RTtBQUN4RSxnRUFBbUU7QUFDbkUsMERBQXFEO0FBRXJELG1CQUFtQjtBQUdaLElBQU0scUJBQXFCLG1DQUEzQixNQUFNLHFCQUFxQjtJQUV4QixFQUFFLENBQW9CO0lBRTlCOzs7Ozs7T0FNRztJQUNJLEtBQUssQ0FBQyxZQUFZLENBQ3ZCLEtBQTZCLEVBQzdCLFlBQW9CO1FBRXBCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFO2FBQ2YsWUFBWSxDQUFDLEVBQUUsQ0FBQzthQUNoQixrQkFBa0IsRUFBRTthQUNwQixNQUFNLENBQUMsR0FBRyxDQUFDO2FBQ1gsSUFBSSxDQUFDLDJCQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDMUIsU0FBUztRQUNULElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtZQUNqQixFQUFFLENBQUMsUUFBUSxDQUFDLDBCQUEwQixFQUFFO2dCQUN0QyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHO2FBQzdCLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQ2xCLEVBQUUsQ0FBQyxRQUFRLENBQUMsNEJBQTRCLEVBQUU7Z0JBQ3hDLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxHQUFHLEdBQUc7YUFDL0IsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDcEIsRUFBRSxDQUFDLFFBQVEsQ0FBQyw2QkFBNkIsRUFBRTtnQkFDekMsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO2FBQzdCLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxLQUFLLENBQUMs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