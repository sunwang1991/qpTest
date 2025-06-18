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
exports.SysConfigController = void 0;
const core_1 = require("@midwayjs/core");
const validate_1 = require("@midwayjs/validate");
const parse_1 = require("../../../framework/utils/parse/parse");
const rate_limit_1 = require("../../../framework/middleware/rate_limit");
const operate_log_1 = require("../../../framework/middleware/operate_log");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const repeat_submit_1 = require("../../../framework/middleware/repeat_submit");
const auth_1 = require("../../../framework/reqctx/auth");
const api_1 = require("../../../framework/resp/api");
const sys_config_1 = require("../service/sys_config");
const sys_config_2 = require("../model/sys_config");
/**参数配置信息 控制层处理 */
let SysConfigController = exports.SysConfigController = class SysConfigController {
    /**上下文 */
    c;
    /**参数配置服务 */
    sysConfigService;
    /**参数配置列表 */
    async list(query) {
        const [rows, total] = await this.sysConfigService.findByPage(query);
        return api_1.Resp.okData({ rows, total });
    }
    /**参数配置信息 */
    async info(configId) {
        if (configId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: configId is empty');
        }
        const data = await this.sysConfigService.findById(configId);
        if (data.configId === configId) {
            return api_1.Resp.okData(data);
        }
        return api_1.Resp.err();
    }
    /**参数配置新增 */
    async add(body) {
        if (body.configId > 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: configId not is empty');
        }
        // 检查属性值唯一
        const uniqueConfigKey = await this.sysConfigService.checkUniqueByKey(body.configKey, 0);
        if (!uniqueConfigKey) {
            return api_1.Resp.errMsg(`参数配置新增【${body.configKey}】失败，参数键名已存在`);
        }
        body.createBy = (0, auth_1.loginUserToUserName)(this.c);
        const insertId = await this.sysConfigService.insert(body);
        if (insertId > 0) {
            return api_1.Resp.okData(insertId);
        }
        return api_1.Resp.err();
    }
    /**参数配置修改 */
    async edit(body) {
        if (body.configId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: configId is empty');
        }
        // 检查是否存在
        const configInfo = await this.sysConfigService.findById(body.configId);
        if (configInfo.configId !== body.configId) {
            return api_1.Resp.errMsg('没有权限访问参数配置数据！');
        }
        // 检查属性值唯一
        const uniqueConfigKey = await this.sysConfigService.checkUniqueByKey(body.configKey, body.configId);
        if (!uniqueConfigKey) {
            return api_1.Resp.errMsg(`参数配置修改【${body.configKey}】失败，参数键名已存在`);
        }
        configInfo.configType = body.configType;
        configInfo.configName = body.configName;
        configInfo.configKey = body.configKey;
        configInfo.configValue = body.configValue;
        configInfo.remark = body.remark;
        configInfo.updateBy = (0, auth_1.loginUserToUserName)(this.c);
        const rows = await this.sysConfigService.update(configInfo);
        if (rows > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
    /**参数配置删除 */
    async remove(configId) {
        if (configId === '') {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: configId is empty');
        }
        // 处理字符转id数组后去重
        const uniqueIDs = (0, parse_1.parseRemoveDuplicatesToArray)(configId, ',');
        // 转换成number数组类型
        const ids = uniqueIDs.map(id => (0, parse_1.parseNumber)(id));
        const [rows, err] = await this.sysConfigService.deleteByIds(ids);
        if (err) {
            return api_1.Resp.errMsg(err);
        }
        return api_1.Resp.okMsg(`删除成功: ${rows}`);
    }
    /**参数配置刷新缓存 */
    async refresh() {
        await this.sysConfigService.cacheClean('*');
        await this.sysConfigService.cacheLoad('*');
        return api_1.Resp.ok();
    }
    /**参数配置根据参数键名 */
    async configKey(configKey) {
        if (configKey === '') {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: configKey is empty');
        }
        const key = await this.sysConfigService.findValueByKey(configKey);
        return api_1.Resp.okData(key);
    }
    /**导出参数配置信息 */
    async export(query) {
        // 查询结果，根据查询条件结果，单页最大值限制
        const [rows, total] = await this.sysConfigService.findByPage(query);
        if (total === 0) {
            return api_1.Resp.errMsg('export data record as empty');
        }
        // 导出文件名称
        const fileName = `config_export_${rows.length}_${Date.now()}.xlsx`;
        this.c.set('content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        this.c.set('content-disposition', `attachment;filename=${encodeURIComponent(fileName)}`);
        return await this.sysConfigService.exportData(rows, fileName);
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], SysConfigController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_config_1.SysConfigService)
], SysConfigController.prototype, "sysConfigService", void 0);
__decorate([
    (0, core_1.Get)('/list', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:config:list'] }),
        ],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysConfigController.prototype, "list", null);
__decorate([
    (0, core_1.Get)('/:configId', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:config:query'] }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number().required())),
    __param(0, (0, core_1.Param)('configId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SysConfigController.prototype, "info", null);
__decorate([
    (0, core_1.Post)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:config:add'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '参数配置信息',
                businessType: operate_log_1.BUSINESS_TYPE.INSERT,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_config_2.SysConfig]),
    __metadata("design:returntype", Promise)
], SysConfigController.prototype, "add", null);
__decorate([
    (0, core_1.Put)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:config:edit'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '参数配置信息',
                businessType: operate_log_1.BUSINESS_TYPE.UPDATE,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_config_2.SysConfig]),
    __metadata("design:returntype", Promise)
], SysConfigController.prototype, "edit", null);
__decorate([
    (0, core_1.Del)('/:configId', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:config:remove'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '参数配置信息',
                businessType: operate_log_1.BUSINESS_TYPE.DELETE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().allow(''))),
    __param(0, (0, core_1.Param)('configId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysConfigController.prototype, "remove", null);
__decorate([
    (0, core_1.Put)('/refresh', {
        middleware: [
            (0, repeat_submit_1.RepeatSubmitMiddleware)(5),
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:config:remove'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '参数配置信息',
                businessType: operate_log_1.BUSINESS_TYPE.CLEAN,
            }),
        ],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SysConfigController.prototype, "refresh", null);
__decorate([
    (0, core_1.Get)('/config-key/:configKey', {
        middleware: [
            (0, rate_limit_1.RateLimitMiddleware)({
                time: 120,
                count: 15,
                type: rate_limit_1.LIMIT_IP,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().allow(''))),
    __param(0, (0, core_1.Param)('configKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysConfigController.prototype, "configKey", null);
__decorate([
    (0, core_1.Get)('/export', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:config:export'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '参数配置信息',
                businessType: operate_log_1.BUSINESS_TYPE.EXPORT,
            }),
        ],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysConfigController.prototype, "export", null);
exports.SysConfigController = SysConfigController = __decorate([
    (0, core_1.Controller)('/system/config')
], SysConfigController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2NvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9jb250cm9sbGVyL3N5c19jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBVXdCO0FBQ3hCLGlEQUFxRDtBQUdyRCxnRUFHOEM7QUFDOUMseUVBR2tEO0FBQ2xELDJFQUdtRDtBQUNuRCxpRkFBdUY7QUFDdkYsK0VBQXFGO0FBQ3JGLHlEQUFxRTtBQUNyRSxxREFBbUQ7QUFDbkQsc0RBQXlEO0FBQ3pELG9EQUFnRDtBQUVoRCxrQkFBa0I7QUFFWCxJQUFNLG1CQUFtQixpQ0FBekIsTUFBTSxtQkFBbUI7SUFDOUIsU0FBUztJQUVELENBQUMsQ0FBVTtJQUVuQixZQUFZO0lBRUosZ0JBQWdCLENBQW1CO0lBRTNDLFlBQVk7SUFNQyxBQUFOLEtBQUssQ0FBQyxJQUFJLENBQVUsS0FBNkI7UUFDdEQsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEUsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELFlBQVk7SUFNQyxBQUFOLEtBQUssQ0FBQyxJQUFJLENBQ3lDLFFBQWdCO1FBRXhFLElBQUksUUFBUSxJQUFJLENBQUMsRUFBRTtZQUNqQixJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDcEIsT0FBTyxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO1NBQzVEO1FBQ0QsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVELElBQUksSUFBSSxD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