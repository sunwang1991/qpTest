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
exports.Oauth2ClientRepository = void 0;
const core_1 = require("@midwayjs/core");
const db_1 = require("../../../framework/datasource/db/db");
const parse_1 = require("../../../framework/utils/parse/parse");
const oauth2_client_1 = require("../model/oauth2_client");
/**用户授权第三方应用表 数据层处理 */
let Oauth2ClientRepository = exports.Oauth2ClientRepository = class Oauth2ClientRepository {
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
            .from(oauth2_client_1.Oauth2Client, 's')
            .andWhere("s.del_flag = '0'");
        // 查询条件拼接
        if (query.clientId) {
            tx.andWhere('s.client_id = :clientId', {
                clientId: query.clientId,
            });
        }
        if (query.title) {
            tx.andWhere('s.title like :title', {
                title: query.title + '%',
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
        rows = await tx.getMany();
        return [rows, total];
    }
    /**
     * 查询集合
     *
     * @param sysConfig 信息
     * @return 列表
     */
    async select(param) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(oauth2_client_1.Oauth2Client, 's')
            .andWhere("s.del_flag = '0'");
        // 构建查询条件
        if (param.clientId) {
            tx.andWhere('s.client_id = :clientId', {
                clientId: param.clientId,
            });
        }
        if (param.title) {
            tx.andWhere('s.title like :title', {
                title: param.title + '%',
            });
        }
        // 查询数据
        return await tx.getMany();
    }
    /**
     * 通过ID查询信息
     *
     * @param ids ID数组
     * @return 信息
     */
    async selectByIds(ids) {
        if (ids.length <= 0) {
            return [];
        }
        // 查询数据
        const rows = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(oauth2_client_1.Oauth2Client, 's')
            .andWhere("s.id in (:ids) and s.del_flag = '0'", {
            ids,
        })
            .getMany();
        if (rows.length > 0) {
            return rows;
        }
        return [];
    }
    /**
     * 新增信息 返回新增数据ID
     *
     * @param param 信息
     * @return ID
     */
    async insert(param) {
        if (param.createBy) {
            const ms = Date.now().valueOf();
            param.updateBy = param.createBy;
            param.updateTime = ms;
            param.createTime = ms;
            param.delFlag = '0';
        }
        // 执行插入
        const tx = await this.db
            .queryBuilder('')
            .insert()
            .into(oauth2_client_1.Oauth2Client)
            .values(param)
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
     * @param param 信息
     * @return 影响记录数
     */
    async update(param) {
        if (param.id <= 0) {
            return 0;
        }
        if (param.updateBy) {
            param.updateTime = Date.now().valueOf();
        }
        const data = Object.assign({}, param);
        delete data.id;
        delete data.delFlag;
        delete data.createBy;
        delete data.createTime;
        // 执行更新
        const tx = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .update(oauth2_client_1.Oauth2Client)
            .set(data)
            .andWhere('id = :id', { id: param.id })
            .execute();
        return tx.affected;
    }
    /**
     * 批量删除信息 返回受影响行数
     *
     * @param ids ID数组
     * @return 影响记录数
     */
    async deleteByIds(ids) {
        if (ids.length === 0)
            return 0;
        // 执行更新删除标记
        const tx = await this.db
            .queryBuilder('')
            .update(oauth2_client_1.Oauth2Client)
            .set({ delFlag: '1' })
            .andWhere('id in (:ids)', { ids })
            .execute();
        return tx.affected;
    }
    /**
     * 通过clientId查询
     * @param clientId 客户端ID
     * @returns
     */
    async selectByClientId(clientId) {
        if (!clientId) {
            return new oauth2_client_1.Oauth2Client();
        }
        // 查询数据
        const item = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(oauth2_client_1.Oauth2Client, 's')
            .andWhere("s.client_id = :clientId and s.del_flag = '0'", { clientId })
            .getOne();
        if (!item) {
            return new oauth2_client_1.Oauth2Client();
        }
        return item;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", db_1.DynamicDataSource)
], Oauth2ClientRepository.prototype, "db", void 0);
exports.Oauth2ClientRepository = Oauth2ClientRepository = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], Oauth2ClientRepository);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgyX2NsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL29hdXRoMi9yZXBvc2l0b3J5L29hdXRoMl9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBRzVELDREQUF3RTtBQUN4RSxnRUFBbUU7QUFDbkUsMERBQXNEO0FBRXRELHNCQUFzQjtBQUdmLElBQU0sc0JBQXNCLG9DQUE1QixNQUFNLHNCQUFzQjtJQUV6QixFQUFFLENBQW9CO0lBRTlCOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLFlBQVksQ0FDdkIsS0FBNkI7UUFFN0IsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUU7YUFDZixZQUFZLENBQUMsRUFBRSxDQUFDO2FBQ2hCLGtCQUFrQixFQUFFO2FBQ3BCLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDWCxJQUFJLENBQUMsNEJBQVksRUFBRSxHQUFHLENBQUM7YUFDdkIsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDaEMsU0FBUztRQUNULElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUNsQixFQUFFLENBQUMsUUFBUSxDQUFDLHlCQUF5QixFQUFFO2dCQUNyQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7YUFDekIsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7WUFDZixFQUFFLENBQUMsUUFBUSxDQUFDLHFCQUFxQixFQUFFO2dCQUNqQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssR0FBRyxHQUFHO2FBQ3pCLENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFO1lBQ25CLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUMsTUFBTSxLQUFLLEVBQUUsRUFBRTtnQkFDdEMsRUFBRSxDQUFDLFFBQVEsQ0FBQyw0QkFBNEIsRUFBRTtvQkFDeEMs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