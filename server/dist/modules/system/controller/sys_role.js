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
exports.SysRoleController = void 0;
const core_1 = require("@midwayjs/core");
const validate_1 = require("@midwayjs/validate");
const parse_1 = require("../../../framework/utils/parse/parse");
const auth_1 = require("../../../framework/reqctx/auth");
const operate_log_1 = require("../../../framework/middleware/operate_log");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const system_1 = require("../../../framework/constants/system");
const api_1 = require("../../../framework/resp/api");
const sys_role_1 = require("../service/sys_role");
const sys_user_1 = require("../service/sys_user");
const sys_role_2 = require("../model/sys_role");
/**角色信息 控制层处理 */
let SysRoleController = exports.SysRoleController = class SysRoleController {
    /**上下文 */
    c;
    /**角色服务 */
    sysRoleService;
    /**用户服务 */
    sysUserService;
    /**角色列表 */
    async list(query) {
        const [rows, total] = await this.sysRoleService.findByPage(query);
        return api_1.Resp.okData({ rows, total });
    }
    /**角色信息详情 */
    async info(roleId) {
        if (roleId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: roleId is empty');
        }
        const data = await this.sysRoleService.findById(roleId);
        if (data.roleId === roleId) {
            return api_1.Resp.okData(data);
        }
        return api_1.Resp.err();
    }
    /**角色信息新增 */
    async add(body) {
        if (body.roleId > 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: roleId not is empty');
        }
        // 判断角色名称是否唯一
        const uniqueName = await this.sysRoleService.checkUniqueByName(body.roleName, 0);
        if (!uniqueName) {
            return api_1.Resp.errMsg(`角色新增【${body.roleName}】失败，角色名称已存在`);
        }
        // 判断角色键值是否唯一
        const uniqueKey = await this.sysRoleService.checkUniqueByKey(body.roleKey, 0);
        if (!uniqueKey) {
            return api_1.Resp.errMsg(`角色新增【${body.roleName}】失败，角色键值已存在`);
        }
        body.createBy = (0, auth_1.loginUserToUserName)(this.c);
        const insertId = await this.sysRoleService.insert(body);
        if (insertId > 0) {
            return api_1.Resp.okData(insertId);
        }
        return api_1.Resp.err();
    }
    /**角色信息修改 */
    async edit(body) {
        if (body.roleId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: roleId is empty');
        }
        // 检查是否系统管理员角色
        if (body.roleId === system_1.SYS_ROLE_SYSTEM_ID) {
            return api_1.Resp.errMsg('不允许操作系统管理员角色');
        }
        // 检查是否分配给当前用户
        const [info, err] = (0, auth_1.loginUser)(this.c);
        if (err) {
            this.c.status = 401;
            return api_1.Resp.codeMsg(401002, err);
        }
        if (Array.isArray(info.user.roleIds) && info.user.roleIds.length > 0) {
            if (info.user.roleIds.includes(body.roleId)) {
                return api_1.Resp.errMsg('不允许操作分配给自己的角色');
            }
        }
        // 判断角色名称是否唯一
        const uniqueName = await this.sysRoleService.checkUniqueByName(body.roleName, body.roleId);
        if (!uniqueName) {
            return api_1.Resp.errMsg(`角色修改【${body.roleName}】失败，角色名称已存在`);
        }
        // 判断角色键值是否唯一
        const uniqueKey = await this.sysRoleService.checkUniqueByKey(body.roleKey, body.roleId);
        if (!uniqueKey) {
            return api_1.Resp.errMsg(`角色修改【${body.roleName}】失败，角色键值已存在`);
        }
        // 检查是否存在
        const roleInfo = await this.sysRoleService.findById(body.roleId);
        if (roleInfo.roleId !== body.roleId) {
            return api_1.Resp.errMsg('没有权限访问角色数据！');
        }
        roleInfo.roleName = body.roleName;
        roleInfo.roleKey = body.roleKey;
        roleInfo.roleSort = body.roleSort;
        roleInfo.dataScope = body.dataScope;
        roleInfo.menuCheckStrictly = body.menuCheckStrictly;
        roleInfo.deptCheckStrictly = body.deptCheckStrictly;
        roleInfo.statusFlag = body.statusFlag;
        roleInfo.remark = body.remark;
        roleInfo.updateBy = (0, auth_1.loginUserToUserName)(this.c);
        roleInfo.menuIds = body.menuIds;
        roleInfo.deptIds = body.deptIds;
        const rows = await this.sysRoleService.update(roleInfo);
        if (rows > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
    /**角色信息删除 */
    async remove(roleId) {
        if (roleId === '') {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: roleId is empty');
        }
        // 处理字符转id数组后去重
        const uniqueIDs = (0, parse_1.parseRemoveDuplicatesToArray)(roleId, ',');
        // 转换成number数组类型
        const ids = uniqueIDs.map(id => (0, parse_1.parseNumber)(id));
        // 检查是否管理员角色
        for (const id of ids) {
            if (id === system_1.SYS_ROLE_SYSTEM_ID) {
                return api_1.Resp.errMsg('不允许操作管理员角色');
            }
        }
        const [rows, err] = await this.sysRoleService.deleteByIds(ids);
        if (err) {
            return api_1.Resp.errMsg(err);
        }
        return api_1.Resp.okMsg(`删除成功: ${rows}`);
    }
    /**角色状态变更 */
    async status(roleId, statusFlag) {
        // 检查是否管理员角色
        if (roleId === system_1.SYS_ROLE_SYSTEM_ID) {
            return api_1.Resp.errMsg('不允许操作管理员角色');
        }
        // 检查是否存在
        const role = await this.sysRoleService.findById(roleId);
        if (role.roleId !== roleId) {
            return api_1.Resp.errMsg('没有权限访问角色数据！');
        }
        // 与旧值相等不变更
        if (role.statusFlag === statusFlag) {
            return api_1.Resp.errMsg('变更状态与旧值相等！');
        }
        // 更新状态不刷新缓存
        role.statusFlag = statusFlag;
        role.updateBy = (0, auth_1.loginUserToUserName)(this.c);
        const rows = await this.sysRoleService.update(role);
        if (rows > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
    /**角色数据权限修改 */
    async dataScope(roleId, deptIds, dataScope, deptCheckStrictly) {
        if (roleId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: roleId is empty');
        }
        // 检查是否系统管理员角色
        if (roleId === system_1.SYS_ROLE_SYSTEM_ID) {
            return api_1.Resp.errMsg('不允许操作系统管理员角色');
        }
        // 检查是否存在
        const roleInfo = await this.sysRoleService.findById(roleId);
        if (roleInfo.roleId !== roleId) {
            return api_1.Resp.errMsg('没有权限访问角色数据！');
        }
        // 更新数据权限
        roleInfo.deptIds = deptIds;
        roleInfo.dataScope = dataScope;
        roleInfo.deptCheckStrictly = deptCheckStrictly;
        roleInfo.updateBy = (0, auth_1.loginUserToUserName)(this.c);
        const rows = await this.sysRoleService.updateAndDataScope(roleInfo);
        if (rows > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
    /**角色分配用户列表 */
    async userAuthList(query) {
        const roleId = (0, parse_1.parseNumber)(query.roleId);
        if (roleId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: roleId is empty');
        }
        // 检查是否存在
        const role = await this.sysRoleService.findById(roleId);
        if (role.roleId !== roleId) {
            return api_1.Resp.errMsg('没有权限访问角色数据！');
        }
        const dataScopeSQL = (0, auth_1.loginUserToDataScopeSQL)(this.c, 'sys_user', 'sys_user');
        const [rows, total] = await this.sysUserService.findAuthUsersPage(query, dataScopeSQL);
        return api_1.Resp.okData({ rows, total });
    }
    /**角色分配选择授权 */
    async userAuthChecked(roleId, userIds, auth) {
        if (userIds.length <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: userIds is empty');
        }
        // 检查是否存在
        const role = await this.sysRoleService.findById(roleId);
        if (role.roleId !== roleId) {
            return api_1.Resp.errMsg('没有权限访问角色数据！');
        }
        let rows = 0;
        if (auth) {
            rows = await this.sysRoleService.insertAuthUsers(roleId, userIds);
        }
        else {
            rows = await this.sysRoleService.deleteAuthUsers(roleId, userIds);
        }
        if (rows > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
    /**导出角色信息 */
    async export(query) {
        // 查询结果，根据查询条件结果，单页最大值限制
        const [rows, total] = await this.sysRoleService.findByPage(query);
        if (total === 0) {
            return api_1.Resp.errMsg('export data record as empty');
        }
        // 导出文件名称
        const fileName = `role_export_${rows.length}_${Date.now()}.xlsx`;
        this.c.set('content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        this.c.set('content-disposition', `attachment;filename=${encodeURIComponent(fileName)}`);
        return await this.sysRoleService.exportData(rows, fileName);
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], SysRoleController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_role_1.SysRoleService)
], SysRoleController.prototype, "sysRoleService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_user_1.SysUserService)
], SysRoleController.prototype, "sysUserService", void 0);
__decorate([
    (0, core_1.Get)('/list', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:role:list'] })],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysRoleController.prototype, "list", null);
__decorate([
    (0, core_1.Get)('/:roleId', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:role:query'] })],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number())),
    __param(0, (0, core_1.Param)('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SysRoleController.prototype, "info", null);
__decorate([
    (0, core_1.Post)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:role:add'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '角色信息',
                businessType: operate_log_1.BUSINESS_TYPE.INSERT,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_role_2.SysRole]),
    __metadata("design:returntype", Promise)
], SysRoleController.prototype, "add", null);
__decorate([
    (0, core_1.Put)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:role:edit'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '角色信息',
                businessType: operate_log_1.BUSINESS_TYPE.UPDATE,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_role_2.SysRole]),
    __metadata("design:returntype", Promise)
], SysRoleController.prototype, "edit", null);
__decorate([
    (0, core_1.Del)('/:roleId', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:role:remove'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '角色信息',
                businessType: operate_log_1.BUSINESS_TYPE.DELETE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().allow(''))),
    __param(0, (0, core_1.Param)('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysRoleController.prototype, "remove", null);
__decorate([
    (0, core_1.Put)('/status', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:role:edit'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '角色信息',
                businessType: operate_log_1.BUSINESS_TYPE.UPDATE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number().required())),
    __param(0, (0, core_1.Body)('roleId')),
    __param(1, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(1, (0, core_1.Body)('statusFlag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], SysRoleController.prototype, "status", null);
__decorate([
    (0, core_1.Put)('/data-scope', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:role:edit'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '角色信息',
                businessType: operate_log_1.BUSINESS_TYPE.UPDATE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number().required())),
    __param(0, (0, core_1.Body)('roleId')),
    __param(1, (0, validate_1.Valid)(validate_1.RuleType.array())),
    __param(1, (0, core_1.Body)('deptIds')),
    __param(2, (0, validate_1.Valid)(validate_1.RuleType.string()
        .pattern(/^[12345]$/)
        .required())),
    __param(2, (0, core_1.Body)('dataScope')),
    __param(3, (0, validate_1.Valid)(validate_1.RuleType.string()
        .pattern(/^[01]$/)
        .required())),
    __param(3, (0, core_1.Body)('deptCheckStrictly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array, String, String]),
    __metadata("design:returntype", Promise)
], SysRoleController.prototype, "dataScope", null);
__decorate([
    (0, core_1.Get)('/user/list', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:role:list'] })],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysRoleController.prototype, "userAuthList", null);
__decorate([
    (0, core_1.Put)('/user/auth', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:role:edit'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '角色信息',
                businessType: operate_log_1.BUSINESS_TYPE.GRANT,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number().required())),
    __param(0, (0, core_1.Body)('roleId')),
    __param(1, (0, validate_1.Valid)(validate_1.RuleType.array().required())),
    __param(1, (0, core_1.Body)('userIds')),
    __param(2, (0, validate_1.Valid)(validate_1.RuleType.boolean().required())),
    __param(2, (0, core_1.Body)('auth')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array, Boolean]),
    __metadata("design:returntype", Promise)
], SysRoleController.prototype, "userAuthChecked", null);
__decorate([
    (0, core_1.Get)('/export', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:role:export'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '角色信息',
                businessType: operate_log_1.BUSINESS_TYPE.EXPORT,
            }),
        ],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysRoleController.prototype, "export", null);
exports.SysRoleController = SysRoleController = __decorate([
    (0, core_1.Controller)('/system/role')
], SysRoleController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX3JvbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zeXN0ZW0vY29udHJvbGxlci9zeXNfcm9sZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FVd0I7QUFDeEIsaURBQXFEO0FBR3JELGdFQUc4QztBQUM5Qyx5REFJd0M7QUFDeEMsMkVBR21EO0FBQ25ELGlGQUF1RjtBQUN2RixnRUFBeUU7QUFDekUscURBQW1EO0FBQ25ELGtEQUFxRDtBQUNyRCxrREFBcUQ7QUFDckQsZ0RBQTRDO0FBRTVDLGdCQUFnQjtBQUVULElBQU0saUJBQWlCLCtCQUF2QixNQUFNLGlCQUFpQjtJQUM1QixTQUFTO0lBRUQsQ0FBQyxDQUFVO0lBRW5CLFVBQVU7SUFFRixjQUFjLENBQWlCO0lBRXZDLFVBQVU7SUFFRixjQUFjLENBQWlCO0lBRXZDLFVBQVU7SUFJRyxBQUFOLEtBQUssQ0FBQyxJQUFJLENBQVUsS0FBNkI7UUFDdEQsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xFLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxZQUFZO0lBSUMsQUFBTixLQUFLLENBQUMsSUFBSSxDQUM0QixNQUFjO1FBRXpELElBQUksTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNmLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNwQixPQUFPLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLDJCQUEyQixDQUFDLENBQUM7U0FDMUQ7UUFDRCxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FB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