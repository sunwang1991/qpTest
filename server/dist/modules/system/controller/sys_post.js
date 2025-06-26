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
exports.SysPostController = void 0;
const core_1 = require("@midwayjs/core");
const validate_1 = require("@midwayjs/validate");
const parse_1 = require("../../../framework/utils/parse/parse");
const operate_log_1 = require("../../../framework/middleware/operate_log");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const auth_1 = require("../../../framework/reqctx/auth");
const api_1 = require("../../../framework/resp/api");
const sys_post_1 = require("../service/sys_post");
const sys_post_2 = require("../model/sys_post");
/**岗位信息 控制层处理*/
let SysPostController = exports.SysPostController = class SysPostController {
    /**上下文 */
    c;
    /**岗位服务 */
    sysPostService;
    /**岗位列表 */
    async list(query) {
        const [rows, total] = await this.sysPostService.findByPage(query);
        return api_1.Resp.okData({ rows, total });
    }
    /**岗位信息 */
    async info(postId) {
        if (postId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: postId is empty');
        }
        const data = await this.sysPostService.findById(postId);
        if (data.postId === postId) {
            return api_1.Resp.okData(data);
        }
        return api_1.Resp.err();
    }
    /**岗位新增 */
    async add(body) {
        if (body.postId > 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: postId not is empty');
        }
        // 检查名称唯一
        const uniqueuName = await this.sysPostService.checkUniqueByName(body.postName, 0);
        if (!uniqueuName) {
            return api_1.Resp.errMsg(`岗位新增【${body.postName}】失败，岗位名称已存在`);
        }
        // 检查编码属性值唯一
        const uniqueCode = await this.sysPostService.checkUniqueByCode(body.postCode, 0);
        if (!uniqueCode) {
            return api_1.Resp.errMsg(`岗位新增【${body.postName}】失败，岗位编码已存在`);
        }
        body.createBy = (0, auth_1.loginUserToUserName)(this.c);
        const insertId = await this.sysPostService.insert(body);
        if (insertId > 0) {
            return api_1.Resp.okData(insertId);
        }
        return api_1.Resp.err();
    }
    /**岗位修改 */
    async edit(body) {
        if (body.postId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: postId is empty');
        }
        // 检查是否存在
        const postInfo = await this.sysPostService.findById(body.postId);
        if (postInfo.postId !== body.postId) {
            return api_1.Resp.errMsg('没有权限访问岗位数据！');
        }
        // 检查名称属性值唯一
        const uniqueuName = await this.sysPostService.checkUniqueByName(body.postName, body.postId);
        if (!uniqueuName) {
            return api_1.Resp.errMsg(`岗位修改【${body.postName}】失败，岗位名称已存在`);
        }
        // 检查编码属性值唯一
        const uniqueCode = await this.sysPostService.checkUniqueByCode(body.postCode, body.postId);
        if (!uniqueCode) {
            return api_1.Resp.errMsg(`岗位修改【${body.postName}】失败，岗位编码已存在`);
        }
        postInfo.postCode = body.postCode;
        postInfo.postName = body.postName;
        postInfo.postSort = body.postSort;
        postInfo.statusFlag = body.statusFlag;
        postInfo.remark = body.remark;
        postInfo.updateBy = (0, auth_1.loginUserToUserName)(this.c);
        const rows = await this.sysPostService.update(postInfo);
        if (rows > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
    /**岗位删除 */
    async remove(postId) {
        if (postId === '') {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: postId is empty');
        }
        // 处理字符转id数组后去重
        const uniqueIDs = (0, parse_1.parseRemoveDuplicatesToArray)(postId, ',');
        // 转换成number数组类型
        const ids = uniqueIDs.map(id => (0, parse_1.parseNumber)(id));
        const [rows, err] = await this.sysPostService.deleteByIds(ids);
        if (err) {
            return api_1.Resp.errMsg(err);
        }
        return api_1.Resp.okMsg(`删除成功: ${rows}`);
    }
    /**导出岗位信息 */
    async export(query) {
        // 查询结果，根据查询条件结果，单页最大值限制
        const [rows, total] = await this.sysPostService.findByPage(query);
        if (total === 0) {
            return api_1.Resp.errMsg('export data record as empty');
        }
        // 导出文件名称
        const fileName = `post_export_${rows.length}_${Date.now()}.xlsx`;
        this.c.set('content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        this.c.set('content-disposition', `attachment;filename=${encodeURIComponent(fileName)}`);
        return await this.sysPostService.exportData(rows, fileName);
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], SysPostController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_post_1.SysPostService)
], SysPostController.prototype, "sysPostService", void 0);
__decorate([
    (0, core_1.Get)('/list', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:post:list'] })],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysPostController.prototype, "list", null);
__decorate([
    (0, core_1.Get)('/:postId', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:post:query'] })],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number())),
    __param(0, (0, core_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SysPostController.prototype, "info", null);
__decorate([
    (0, core_1.Post)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:post:add'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '岗位信息',
                businessType: operate_log_1.BUSINESS_TYPE.INSERT,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_post_2.SysPost]),
    __metadata("design:returntype", Promise)
], SysPostController.prototype, "add", null);
__decorate([
    (0, core_1.Put)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:post:edit'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '岗位信息',
                businessType: operate_log_1.BUSINESS_TYPE.UPDATE,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_post_2.SysPost]),
    __metadata("design:returntype", Promise)
], SysPostController.prototype, "edit", null);
__decorate([
    (0, core_1.Del)('/:postId', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:post:remove'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '岗位信息',
                businessType: operate_log_1.BUSINESS_TYPE.DELETE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().allow(''))),
    __param(0, (0, core_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysPostController.prototype, "remove", null);
__decorate([
    (0, core_1.Get)('/export', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:post:export'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '岗位信息',
                businessType: operate_log_1.BUSINESS_TYPE.EXPORT,
            }),
        ],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysPostController.prototype, "export", null);
exports.SysPostController = SysPostController = __decorate([
    (0, core_1.Controller)('/system/post')
], SysPostController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX3Bvc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zeXN0ZW0vY29udHJvbGxlci9zeXNfcG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FVd0I7QUFDeEIsaURBQXFEO0FBR3JELGdFQUc4QztBQUM5QywyRUFHbUQ7QUFDbkQsaUZBQXVGO0FBQ3ZGLHlEQUFxRTtBQUNyRSxxREFBbUQ7QUFDbkQsa0RBQXFEO0FBQ3JELGdEQUE0QztBQUU1QyxlQUFlO0FBRVIsSUFBTSxpQkFBaUIsK0JBQXZCLE1BQU0saUJBQWlCO0lBQzVCLFNBQVM7SUFFRCxDQUFDLENBQVU7SUFFbkIsVUFBVTtJQUVGLGNBQWMsQ0FBaUI7SUFFdkMsVUFBVTtJQUlHLEFBQU4sS0FBSyxDQUFDLElBQUksQ0FBVSxLQUE2QjtRQUN0RCxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEUsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELFVBQVU7SUFJRyxBQUFOLEtBQUssQ0FBQyxJQUFJLENBQzRCLE1BQWM7UUFFekQsSUFBSSxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ2YsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBQ3BCLE9BQU8sVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztTQUMxRDtRQUNELE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtZQUMxQixPQUFPLFVBQUks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