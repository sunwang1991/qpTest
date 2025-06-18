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
exports.Oauth2ClientController = void 0;
const core_1 = require("@midwayjs/core");
const parse_1 = require("../../../framework/utils/parse/parse");
const operate_log_1 = require("../../../framework/middleware/operate_log");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const auth_1 = require("../../../framework/reqctx/auth");
const oauth2_client_1 = require("../service/oauth2_client");
const api_1 = require("../../../framework/resp/api");
const oauth2_client_2 = require("../model/oauth2_client");
/**客户端授权管理 控制层处理 */
let Oauth2ClientController = exports.Oauth2ClientController = class Oauth2ClientController {
    /**上下文 */
    c;
    /**用户授权第三方应用信息服务 */
    oauth2ClientService;
    /**列表 */
    async list(query) {
        const [rows, total] = await this.oauth2ClientService.findByPage(query);
        return api_1.Resp.okData({ rows, total });
    }
    /**信息 */
    async info(clientId) {
        if (clientId === '') {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: clientId is empty');
        }
        const data = await this.oauth2ClientService.findByClientId(clientId);
        if (data.clientId === clientId) {
            return api_1.Resp.okData(data);
        }
        return api_1.Resp.err();
    }
    /**新增 */
    async add(body) {
        if (body.id > 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: id not is empty');
        }
        const localHost = body.ipWhite.includes('127.0.0.1') ||
            body.ipWhite.includes('localhost') ||
            body.ipWhite.includes('::1');
        if (localHost || body.ipWhite.includes('::ffff:')) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'no support local host');
        }
        body.createBy = (0, auth_1.loginUserToUserName)(this.c);
        const insertId = await this.oauth2ClientService.insert(body);
        if (insertId > 0) {
            return api_1.Resp.okData(insertId);
        }
        return api_1.Resp.err();
    }
    /**更新 */
    async edit(body) {
        if (body.id <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: id is empty');
        }
        const localHost = body.ipWhite.includes('127.0.0.1') ||
            body.ipWhite.includes('localhost') ||
            body.ipWhite.includes('::1');
        if (localHost || body.ipWhite.includes('::ffff:')) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'no support local host');
        }
        // 查询信息
        const info = await this.oauth2ClientService.findByClientId(body.clientId);
        if (info.clientId != body.clientId) {
            return api_1.Resp.errMsg('修改失败，客户端ID已存在');
        }
        info.title = body.title;
        info.ipWhite = body.ipWhite;
        info.remark = body.remark;
        info.updateBy = (0, auth_1.loginUserToUserName)(this.c);
        const rows = await this.oauth2ClientService.update(info);
        if (rows > 0) {
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
        const [rows, err] = await this.oauth2ClientService.deleteByIds(ids);
        if (err) {
            return api_1.Resp.errMsg(err);
        }
        return api_1.Resp.okMsg(`删除成功: ${rows}`);
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], Oauth2ClientController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", oauth2_client_1.Oauth2ClientService)
], Oauth2ClientController.prototype, "oauth2ClientService", void 0);
__decorate([
    (0, core_1.Get)('/list', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ matchRoles: ['admin'] })],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Oauth2ClientController.prototype, "list", null);
__decorate([
    (0, core_1.Get)('/:clientId', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ matchRoles: ['admin'] })],
    }),
    __param(0, (0, core_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Oauth2ClientController.prototype, "info", null);
__decorate([
    (0, core_1.Post)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ matchRoles: ['admin'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '客户端授权管理',
                businessType: operate_log_1.BUSINESS_TYPE.INSERT,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oauth2_client_2.Oauth2Client]),
    __metadata("design:returntype", Promise)
], Oauth2ClientController.prototype, "add", null);
__decorate([
    (0, core_1.Put)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ matchRoles: ['admin'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '客户端授权管理',
                businessType: operate_log_1.BUSINESS_TYPE.UPDATE,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oauth2_client_2.Oauth2Client]),
    __metadata("design:returntype", Promise)
], Oauth2ClientController.prototype, "edit", null);
__decorate([
    (0, core_1.Del)('/:id', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ matchRoles: ['admin'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '客户端授权管理',
                businessType: operate_log_1.BUSINESS_TYPE.DELETE,
            }),
        ],
    }),
    __param(0, (0, core_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Oauth2ClientController.prototype, "remove", null);
exports.Oauth2ClientController = Oauth2ClientController = __decorate([
    (0, core_1.Controller)('/oauth2/client')
], Oauth2ClientController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgyX2NsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL29hdXRoMi9jb250cm9sbGVyL29hdXRoMl9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBVXdCO0FBR3hCLGdFQUc4QztBQUM5QywyRUFHbUQ7QUFDbkQsaUZBQXVGO0FBQ3ZGLHlEQUFxRTtBQUNyRSw0REFBK0Q7QUFDL0QscURBQW1EO0FBQ25ELDBEQUFzRDtBQUV0RCxtQkFBbUI7QUFFWixJQUFNLHNCQUFzQixvQ0FBNUIsTUFBTSxzQkFBc0I7SUFDakMsU0FBUztJQUVELENBQUMsQ0FBVTtJQUVuQixtQkFBbUI7SUFFWCxtQkFBbUIsQ0FBc0I7SUFFakQsUUFBUTtJQUlLLEFBQU4sS0FBSyxDQUFDLElBQUksQ0FBVSxLQUE2QjtRQUN0RCxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2RSxPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsUUFBUTtJQUlLLEFBQU4sS0FBSyxDQUFDLElBQUksQ0FBb0IsUUFBZ0I7UUFDbkQsSUFBSSxRQUFRLEtBQUssRUFBRSxFQUFFO1lBQ25CLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNwQixPQUFPLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLDZCQUE2QixDQUFDLENBQUM7U0FDNUQ7UUFDRCxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckUsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtZQUM5QixP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