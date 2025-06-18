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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoORMController = void 0;
const core_1 = require("@midwayjs/core");
const parse_1 = require("../../../framework/utils/parse/parse");
const api_1 = require("../../../framework/resp/api");
const demo_orm_1 = require("../service/demo_orm");
const demo_orm_2 = require("../model/demo_orm");
/**
 * 演示-TypeORM基本使用
 *
 * 更多功能需要查阅 https://midwayjs.org/docs/extensions/orm
 */
let DemoORMController = exports.DemoORMController = class DemoORMController {
    /**上下文 */
    c;
    /**测试ORM信息服务 */
    demoORMService;
    /**列表分页 */
    async list(query) {
        const [rows, total] = await this.demoORMService.findByPage(query);
        return api_1.Resp.okData({ rows, total });
    }
    /**列表无分页 */
    async all(title, statusFlag) {
        const demoORM = new demo_orm_2.DemoORM();
        if (title !== '') {
            demoORM.title = title;
        }
        if (statusFlag !== '') {
            demoORM.statusFlag = statusFlag;
        }
        const data = await this.demoORMService.find(demoORM);
        return api_1.Resp.okData(data);
    }
    /**信息 */
    async info(id) {
        if (id <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422001, 'bind err: id is empty');
        }
        const data = await this.demoORMService.findById(id);
        if (data.id === id) {
            return api_1.Resp.okData(data);
        }
        return api_1.Resp.err();
    }
    /**新增 */
    async add(demoORM) {
        if (demoORM.id > 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: id not is empty');
        }
        const insertId = await this.demoORMService.insert(demoORM);
        if (insertId > 0) {
            return api_1.Resp.okData(insertId);
        }
        return api_1.Resp.err();
    }
    /**
     * 更新
     */
    async update(demoORM) {
        if (demoORM.id <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: id is empty');
        }
        const rowsAffected = await this.demoORMService.update(demoORM);
        if (rowsAffected > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
    /**删除 */
    async remove(id) {
        if (id === '') {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: id is empty');
        }
        // 处理字符转id数组后去重
        const uniqueIDs = (0, parse_1.parseRemoveDuplicatesToArray)(id, ',');
        // 转换成number数组类型
        const ids = uniqueIDs.map(id => (0, parse_1.parseNumber)(id));
        const rowsAffected = await this.demoORMService.deleteByIds(ids);
        if (rowsAffected > 0) {
            return api_1.Resp.okMsg(`删除成功：${rowsAffected}`);
        }
        return api_1.Resp.err();
    }
    /**清空 */
    async clean() {
        const rows = await this.demoORMService.clean();
        return api_1.Resp.okData(rows);
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], DemoORMController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", demo_orm_1.DemoORMService)
], DemoORMController.prototype, "demoORMService", void 0);
__decorate([
    (0, core_1.Get)('/list'),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DemoORMController.prototype, "list", null);
__decorate([
    (0, core_1.Get)('/all'),
    __param(0, (0, core_1.Query)('title')),
    __param(1, (0, core_1.Query)('statusFlag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DemoORMController.prototype, "all", null);
__decorate([
    (0, core_1.Get)('/:id'),
    __param(0, (0, core_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DemoORMController.prototype, "info", null);
__decorate([
    (0, core_1.Post)(),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [demo_orm_2.DemoORM]),
    __metadata("design:returntype", Promise)
], DemoORMController.prototype, "add", null);
__decorate([
    (0, core_1.Put)(),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [demo_orm_2.DemoORM]),
    __metadata("design:returntype", Promise)
], DemoORMController.prototype, "update", null);
__decorate([
    (0, core_1.Del)('/:id'),
    __param(0, (0, core_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DemoORMController.prototype, "remove", null);
__decorate([
    (0, core_1.Del)('/clean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DemoORMController.prototype, "clean", null);
exports.DemoORMController = DemoORMController = __decorate([
    (0, core_1.Controller)('/demo/orm')
], DemoORMController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVtb19vcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9kZW1vL2NvbnRyb2xsZXIvZGVtb19vcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBVXdCO0FBR3hCLGdFQUc4QztBQUM5QyxxREFBbUQ7QUFDbkQsa0RBQXFEO0FBQ3JELGdEQUE0QztBQUU1Qzs7OztHQUlHO0FBRUksSUFBTSxpQkFBaUIsK0JBQXZCLE1BQU0saUJBQWlCO0lBQzVCLFNBQVM7SUFFRCxDQUFDLENBQVU7SUFFbkIsZUFBZTtJQUVQLGNBQWMsQ0FBaUI7SUFFdkMsVUFBVTtJQUVHLEFBQU4sS0FBSyxDQUFDLElBQUksQ0FBVSxLQUE2QjtRQUN0RCxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEUsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELFdBQVc7SUFFRSxBQUFOLEtBQUssQ0FBQyxHQUFHLENBQ0UsS0FBYSxFQUNSLFVBQWtCO1FBRXZDLE1BQU0sT0FBTyxHQUFHLElBQUksa0JBQU8sRUFBRSxDQUFDO1FBQzlCLElBQUksS0FBSyxLQUFLLEVBQUUsRUFBRTtZQUNoQixPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztTQUN2QjtRQUNELElBQUksVUFBVSxLQUFLLEVBQUUsRUFBRTtZQUNyQixPQUFPLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztTQUNqQztRQUNELE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckQsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNC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