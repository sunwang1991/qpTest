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
exports.SysNoticeController = void 0;
const core_1 = require("@midwayjs/core");
const validate_1 = require("@midwayjs/validate");
const parse_1 = require("../../../framework/utils/parse/parse");
const operate_log_1 = require("../../../framework/middleware/operate_log");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const auth_1 = require("../../../framework/reqctx/auth");
const api_1 = require("../../../framework/resp/api");
const sys_notice_1 = require("../service/sys_notice");
const sys_notice_2 = require("../model/sys_notice");
/**通知公告信息 控制层处理 */
let SysNoticeController = exports.SysNoticeController = class SysNoticeController {
    /**上下文 */
    c;
    /**公告服务 */
    sysNoticeService;
    /**通知公告列表 */
    async list(query) {
        const [rows, total] = await this.sysNoticeService.findByPage(query);
        return api_1.Resp.okData({ rows, total });
    }
    /**通知公告信息 */
    async info(noticeId) {
        if (noticeId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: noticeId is empty');
        }
        const data = await this.sysNoticeService.findById(noticeId);
        if (data.noticeId === noticeId) {
            return api_1.Resp.okData(data);
        }
        return api_1.Resp.err();
    }
    /**通知公告新增 */
    async add(body) {
        if (body.noticeId > 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: noticeId not is empty');
        }
        body.createBy = (0, auth_1.loginUserToUserName)(this.c);
        const insertId = await this.sysNoticeService.insert(body);
        if (insertId > 0) {
            return api_1.Resp.okData(insertId);
        }
        return api_1.Resp.err();
    }
    /**通知公告修改 */
    async edit(body) {
        if (body.noticeId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: noticeId is empty');
        }
        // 检查是否存在
        const noticeInfo = await this.sysNoticeService.findById(body.noticeId);
        if (noticeInfo.noticeId !== body.noticeId) {
            return api_1.Resp.errMsg('没有权限访问公告信息数据！');
        }
        noticeInfo.noticeTitle = body.noticeTitle;
        noticeInfo.noticeType = body.noticeType;
        noticeInfo.noticeContent = body.noticeContent;
        noticeInfo.statusFlag = body.statusFlag;
        noticeInfo.remark = body.remark;
        noticeInfo.updateBy = (0, auth_1.loginUserToUserName)(this.c);
        const rows = await this.sysNoticeService.update(noticeInfo);
        if (rows > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
    /**通知公告删除 */
    async remove(noticeId) {
        if (noticeId === '') {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: noticeId is empty');
        }
        // 处理字符转id数组后去重
        const uniqueIDs = (0, parse_1.parseRemoveDuplicatesToArray)(noticeId, ',');
        // 转换成number数组类型
        const ids = uniqueIDs.map(id => (0, parse_1.parseNumber)(id));
        const [rows, err] = await this.sysNoticeService.deleteByIds(ids);
        if (err) {
            return api_1.Resp.errMsg(err);
        }
        return api_1.Resp.okMsg(`删除成功: ${rows}`);
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], SysNoticeController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_notice_1.SysNoticeService)
], SysNoticeController.prototype, "sysNoticeService", void 0);
__decorate([
    (0, core_1.Get)('/list', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:notice:list'] })],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysNoticeController.prototype, "list", null);
__decorate([
    (0, core_1.Get)('/:noticeId', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:notice:query'] }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number())),
    __param(0, (0, core_1.Param)('noticeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SysNoticeController.prototype, "info", null);
__decorate([
    (0, core_1.Post)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:notice:add'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '通知公告信息',
                businessType: operate_log_1.BUSINESS_TYPE.INSERT,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_notice_2.SysNotice]),
    __metadata("design:returntype", Promise)
], SysNoticeController.prototype, "add", null);
__decorate([
    (0, core_1.Put)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:notice:edit'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '通知公告信息',
                businessType: operate_log_1.BUSINESS_TYPE.UPDATE,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_notice_2.SysNotice]),
    __metadata("design:returntype", Promise)
], SysNoticeController.prototype, "edit", null);
__decorate([
    (0, core_1.Del)('/:noticeId', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:notice:remove'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '通知公告信息',
                businessType: operate_log_1.BUSINESS_TYPE.DELETE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().allow(''))),
    __param(0, (0, core_1.Param)('noticeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysNoticeController.prototype, "remove", null);
exports.SysNoticeController = SysNoticeController = __decorate([
    (0, core_1.Controller)('/system/notice')
], SysNoticeController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX25vdGljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9jb250cm9sbGVyL3N5c19ub3RpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBVXdCO0FBQ3hCLGlEQUFxRDtBQUdyRCxnRUFHOEM7QUFDOUMsMkVBR21EO0FBQ25ELGlGQUF1RjtBQUN2Rix5REFBcUU7QUFDckUscURBQW1EO0FBQ25ELHNEQUF5RDtBQUN6RCxvREFBZ0Q7QUFFaEQsa0JBQWtCO0FBRVgsSUFBTSxtQkFBbUIsaUNBQXpCLE1BQU0sbUJBQW1CO0lBQzlCLFNBQVM7SUFFRCxDQUFDLENBQVU7SUFFbkIsVUFBVTtJQUVGLGdCQUFnQixDQUFtQjtJQUUzQyxZQUFZO0lBSUMsQUFBTixLQUFLLENBQUMsSUFBSSxDQUFVLEtBQTZCO1FBQ3RELE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BFLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxZQUFZO0lBTUMsQUFBTixLQUFLLENBQUMsSUFBSSxDQUM4QixRQUFnQjtRQUU3RCxJQUFJLFFBQVEsSUFBSSxDQUFDLEVBQUU7WUFDakIsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBQ3BCLE9BQU8sVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztTQUM1RDtRQUNELE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1RCxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFO1lB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