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
exports.Oauth2LogLoginRepository = void 0;
const core_1 = require("@midwayjs/core");
const db_1 = require("../../../framework/datasource/db/db");
const parse_1 = require("../../../framework/utils/parse/parse");
const oauth2_log_login_1 = require("../model/oauth2_log_login");
/**用户授权第三方应用登录日志表 数据层处理 */
let Oauth2LogLoginRepository = exports.Oauth2LogLoginRepository = class Oauth2LogLoginRepository {
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
            .from(oauth2_log_login_1.Oauth2LogLogin, 's');
        // 查询条件拼接
        if (query.loginIp) {
            tx.andWhere('s.login_ip like :loginIp', {
                loginIp: query.loginIp + '%',
            });
        }
        if (query.clientId) {
            tx.andWhere('s.client_id = :clientId', {
                clientId: query.clientId + '%',
            });
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
     * @param param 信息
     * @return ID
     */
    async insert(param) {
        param.loginTime = Date.now().valueOf();
        // 执行插入
        const tx = await this.db
            .queryBuilder('')
            .insert()
            .into(oauth2_log_login_1.Oauth2LogLogin)
            .values(param)
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
            .from(oauth2_log_login_1.Oauth2LogLogin)
            .execute();
        return tx.affected;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", db_1.DynamicDataSource)
], Oauth2LogLoginRepository.prototype, "db", void 0);
exports.Oauth2LogLoginRepository = Oauth2LogLoginRepository = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], Oauth2LogLoginRepository);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgyX2xvZ19sb2dpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL29hdXRoMi9yZXBvc2l0b3J5L29hdXRoMl9sb2dfbG9naW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBRzVELDREQUF3RTtBQUN4RSxnRUFBbUU7QUFDbkUsZ0VBQTJEO0FBRTNELDBCQUEwQjtBQUduQixJQUFNLHdCQUF3QixzQ0FBOUIsTUFBTSx3QkFBd0I7SUFFM0IsRUFBRSxDQUFvQjtJQUU5Qjs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxZQUFZLENBQ3ZCLEtBQTZCO1FBRTdCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFO2FBQ2YsWUFBWSxDQUFDLEVBQUUsQ0FBQzthQUNoQixrQkFBa0IsRUFBRTthQUNwQixNQUFNLENBQUMsR0FBRyxDQUFDO2FBQ1gsSUFBSSxDQUFDLGlDQUFjLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDN0IsU0FBUztRQUNULElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtZQUNqQixFQUFFLENBQUMsUUFBUSxDQUFDLDBCQUEwQixFQUFFO2dCQUN0QyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHO2FBQzdCLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQ2xCLEVBQUUsQ0FBQyxRQUFRLENBQUMseUJBQXlCLEVBQUU7Z0JBQ3JDLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxHQUFHLEdBQUc7YUFDL0IsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDcEIsRUFBRSxDQUFDLFFBQVEsQ0FBQyw2QkFBNkIsRUFBRTtnQkFDekMsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO2FBQzdCLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxLQUFLLENBQUMsU0FBUyxF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