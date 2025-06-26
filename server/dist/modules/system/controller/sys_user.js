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
exports.SysUserController = void 0;
const core_1 = require("@midwayjs/core");
const validate_1 = require("@midwayjs/validate");
const regular_1 = require("../../../framework/utils/regular/regular");
const parse_1 = require("../../../framework/utils/parse/parse");
const auth_1 = require("../../../framework/reqctx/auth");
const operate_log_1 = require("../../../framework/middleware/operate_log");
const repeat_submit_1 = require("../../../framework/middleware/repeat_submit");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const api_1 = require("../../../framework/resp/api");
const config_1 = require("../../../framework/config/config");
const file_1 = require("../../../framework/utils/file/file");
const execl_1 = require("../../../framework/utils/file/execl");
const account_1 = require("../../auth/service/account");
const sys_user_1 = require("../service/sys_user");
const sys_role_1 = require("../service/sys_role");
const sys_post_1 = require("../service/sys_post");
const sys_role_2 = require("../model/sys_role");
const sys_user_2 = require("../model/sys_user");
const sys_post_2 = require("../model/sys_post");
/**用户信息 控制层处理 */
let SysUserController = exports.SysUserController = class SysUserController {
    /**上下文 */
    c;
    /**配置信息 */
    config;
    /**文件服务 */
    fileUtil;
    /**用户服务 */
    sysUserService;
    /**角色服务 */
    sysRoleService;
    /**岗位服务 */
    sysPostService;
    /**账号身份操作服务 */
    accountService;
    /**用户信息列表 */
    async list(query) {
        const dataScopeSQL = (0, auth_1.loginUserToDataScopeSQL)(this.c, 'sys_user', 'sys_user');
        const [rows, total] = await this.sysUserService.findByPage(query, dataScopeSQL);
        return api_1.Resp.okData({ rows, total });
    }
    /**用户信息详情 */
    async info(userId) {
        if (userId < 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: userId is empty');
        }
        // 查询系统角色列表
        const roles = await this.sysRoleService.find(new sys_role_2.SysRole());
        // 查询系统岗位列表
        const posts = await this.sysPostService.find(new sys_post_2.SysPost());
        // 新增用户时，用户ID为0
        if (userId === 0) {
            return api_1.Resp.okData({
                user: {},
                roleIds: [],
                postIds: [],
                roles: roles,
                posts: posts,
            });
        }
        // 检查用户是否存在
        const userInfo = await this.sysUserService.findById(userId);
        if (userInfo.userId !== userId) {
            return api_1.Resp.errMsg('没有权限访问用户数据');
        }
        delete userInfo.password;
        // 角色ID组
        const roleIds = userInfo.roles.map(r => r.roleId);
        // 岗位ID组
        const userPosts = await this.sysPostService.findByUserId(userInfo.userId);
        const postIds = userPosts.map(p => p.postId);
        return api_1.Resp.okData({
            user: userInfo,
            roleIds: roleIds,
            postIds: postIds,
            roles: roles,
            posts: posts,
        });
    }
    /**用户信息新增 */
    async add(body) {
        if (body.userId > 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: userId not is empty');
        }
        if (!(0, regular_1.validUsername)(body.userName)) {
            return api_1.Resp.errMsg(`新增用户【${body.userName}】失败，登录账号用户账号只能包含大写小写字母，数字，且不少于4位`);
        }
        if (!(0, regular_1.validPassword)(body.password)) {
            return api_1.Resp.errMsg(`新增用户【${body.userName}】失败，登录密码至少包含大小写字母、数字、特殊符号，且不少于6位`);
        }
        // 检查用户登录账号是否唯一
        const uniqueUserName = await this.sysUserService.checkUniqueByUserName(body.userName, 0);
        if (!uniqueUserName) {
            return api_1.Resp.errMsg(`新增用户【${body.userName}】失败，登录账号已存在`);
        }
        // 检查手机号码格式并判断是否唯一
        if (body.phone) {
            if ((0, regular_1.validMobile)(body.phone)) {
                const uniquePhone = await this.sysUserService.checkUniqueByPhone(body.phone, 0);
                if (!uniquePhone) {
                    return api_1.Resp.errMsg(`新增用户【${body.userName}】失败，手机号码已存在`);
                }
            }
            else {
                return api_1.Resp.errMsg(`新增用户【${body.userName}】失败，手机号码格式错误`);
            }
        }
        // 检查邮箱格式并判断是否唯一
        if (body.email) {
            if ((0, regular_1.validEmail)(body.email)) {
                const uniqueEmail = await this.sysUserService.checkUniqueByEmail(body.email, 0);
                if (!uniqueEmail) {
                    return api_1.Resp.errMsg(`新增用户【${body.userName}】失败，邮箱已存在`);
                }
            }
            else {
                return api_1.Resp.errMsg(`新增用户【${body.userName}】失败，邮箱格式错误`);
            }
        }
        const sysUser = new sys_user_2.SysUser();
        sysUser.userName = body.userName;
        sysUser.password = body.password;
        sysUser.nickName = body.nickName;
        sysUser.email = body.email;
        sysUser.phone = body.phone;
        sysUser.sex = body.sex;
        sysUser.statusFlag = body.statusFlag;
        sysUser.remark = body.remark;
        sysUser.deptId = body.deptId; // 部门ID
        sysUser.roleIds = body.roleIds; // 角色ID组
        sysUser.postIds = body.postIds; // 岗位ID组
        sysUser.avatar = body.avatar;
        sysUser.createBy = (0, auth_1.loginUserToUserName)(this.c);
        const insertId = await this.sysUserService.insert(sysUser);
        if (insertId > 0) {
            return api_1.Resp.okData(insertId);
        }
        return api_1.Resp.err();
    }
    /**用户信息修改 */
    async edit(body) {
        if (body.userId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: userId is empty');
        }
        // 检查是否系统管理员用户
        if (this.config.isSystemUser(body.userId)) {
            return api_1.Resp.errMsg('不允许操作系统管理员用户');
        }
        // 检查是否存在
        const userInfo = await this.sysUserService.findById(body.userId);
        if (userInfo.userId !== body.userId) {
            return api_1.Resp.errMsg('没有权限访问用户数据！');
        }
        // 检查手机号码格式并判断是否唯一
        if (body.phone) {
            if ((0, regular_1.validMobile)(body.phone)) {
                const uniquePhone = await this.sysUserService.checkUniqueByPhone(body.phone, body.userId);
                if (!uniquePhone) {
                    return api_1.Resp.errMsg(`修改用户【${userInfo.userName}】失败，手机号码已存在`);
                }
            }
            else {
                return api_1.Resp.errMsg(`修改用户【${userInfo.userName}】失败，手机号码格式错误`);
            }
        }
        // 检查邮箱格式并判断是否唯一
        if (body.email) {
            if ((0, regular_1.validEmail)(body.email)) {
                const uniqueEmail = await this.sysUserService.checkUniqueByEmail(body.email, body.userId);
                if (!uniqueEmail) {
                    return api_1.Resp.errMsg(`修改用户【${userInfo.userName}】失败，邮箱已存在`);
                }
            }
            else {
                return api_1.Resp.errMsg(`修改用户【${userInfo.userName}】失败，邮箱格式错误`);
            }
        }
        userInfo.phone = body.phone;
        userInfo.email = body.email;
        userInfo.sex = body.sex;
        userInfo.statusFlag = body.statusFlag;
        userInfo.remark = body.remark;
        userInfo.deptId = body.deptId;
        userInfo.roleIds = body.roleIds;
        userInfo.postIds = body.postIds;
        userInfo.password = ''; // 忽略修改密码
        userInfo.updateBy = (0, auth_1.loginUserToUserName)(this.c);
        const rows = await this.sysUserService.updateUserAndRolePost(userInfo);
        if (rows > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
    /**用户信息删除 */
    async remove(userId) {
        if (userId === '') {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: userId is empty');
        }
        // 处理字符转id数组后去重
        const uniqueIDs = (0, parse_1.parseRemoveDuplicatesToArray)(userId, ',');
        // 转换成number数组类型
        const ids = uniqueIDs.map(id => (0, parse_1.parseNumber)(id));
        // 检查是否管理员用户
        const loginUserId = (0, auth_1.loginUserToUserID)(this.c);
        for (const id of ids) {
            if (id === loginUserId) {
                return api_1.Resp.errMsg('当前用户不能删除');
            }
            if (this.config.isSystemUser(id)) {
                return api_1.Resp.errMsg('不允许操作管理员用户');
            }
        }
        const [rows, err] = await this.sysUserService.deleteByIds(ids);
        if (err) {
            return api_1.Resp.errMsg(err);
        }
        return api_1.Resp.okMsg(`删除成功: ${rows}`);
    }
    /**用户密码修改 */
    async password(userId, password) {
        // 检查是否系统管理员用户
        if (this.config.isSystemUser(userId)) {
            return api_1.Resp.errMsg('不允许操作系统管理员用户');
        }
        if (!(0, regular_1.validPassword)(password)) {
            return api_1.Resp.errMsg('登录密码至少包含大小写字母、数字、特殊符号，且不少于6位');
        }
        // 检查是否存在
        const userInfo = await this.sysUserService.findById(userId);
        if (userInfo.userId !== userId) {
            return api_1.Resp.errMsg('没有权限访问用户数据！');
        }
        userInfo.password = password;
        userInfo.updateBy = (0, auth_1.loginUserToUserName)(this.c);
        const rows = await this.sysUserService.update(userInfo);
        if (rows > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
    /**用户状态修改 */
    async status(userId, statusFlag) {
        // 检查是否系统管理员用户
        if (this.config.isSystemUser(userId)) {
            return api_1.Resp.errMsg('不允许操作系统管理员用户');
        }
        // 检查是否存在
        const userInfo = await this.sysUserService.findById(userId);
        if (userInfo.userId !== userId) {
            return api_1.Resp.errMsg('没有权限访问用户数据！');
        }
        // 与旧值相等不变更
        if (userInfo.statusFlag === statusFlag) {
            return api_1.Resp.errMsg('变更状态与旧值相等！');
        }
        userInfo.statusFlag = statusFlag;
        userInfo.password = ''; // 密码不更新
        userInfo.updateBy = (0, auth_1.loginUserToUserName)(this.c);
        const rows = await this.sysUserService.update(userInfo);
        if (rows > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
    /**用户账户解锁 */
    async unlock(userName) {
        if (!userName) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: userName is empty');
        }
        const ok = await this.accountService.clearLoginRecordCache(userName);
        if (ok) {
            return api_1.Resp.okMsg('unlock success');
        }
        return api_1.Resp.errMsg('not found unlock user');
    }
    /**用户信息列表导出 */
    async export(query) {
        // 查询结果，根据查询条件结果，单页最大值限制
        const dataScopeSQL = (0, auth_1.loginUserToDataScopeSQL)(this.c, 'sys_user', 'sys_user');
        const [rows, total] = await this.sysUserService.findByPage(query, dataScopeSQL);
        if (total === 0) {
            return api_1.Resp.errMsg('export data record as empty');
        }
        // 导出文件名称
        const fileName = `user_export_${rows.length}_${Date.now()}.xlsx`;
        this.c.set('content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        this.c.set('content-disposition', `attachment;filename=${encodeURIComponent(fileName)}`);
        return await this.sysUserService.exportData(rows, fileName);
    }
    /**用户信息列表导入模板下载 */
    async template() {
        const fileName = `user_import_template_${Date.now()}.xlsx`;
        this.c.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        this.c.set('Content-disposition', `attachment;filename=${encodeURIComponent(fileName)}`);
        const [fileData, err] = await this.fileUtil.readAssetsFileStream('template/excel/user_import_template.xlsx');
        if (err) {
            this.c.status = 400;
            return 'failed to read file';
        }
        return fileData;
    }
    /**用户信息列表导入 */
    async import(filePath, update) {
        // 表格文件绝对地址
        const fileAbsPath = this.fileUtil.parseUploadFileAbsPath(filePath);
        // 读取表格数据
        const [rows, err] = await (0, execl_1.readSheet)(fileAbsPath);
        if (err) {
            return api_1.Resp.errMsg(err);
        }
        if (rows.length <= 0) {
            return api_1.Resp.errMsg('导入用户数据不能为空！');
        }
        // 获取操作人名称
        const operaName = (0, auth_1.loginUserToUserName)(this.c);
        // 导入数据
        const message = await this.sysUserService.importData(rows, operaName, update);
        return api_1.Resp.okMsg(message);
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], SysUserController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", config_1.GlobalConfig)
], SysUserController.prototype, "config", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", file_1.FileUtil)
], SysUserController.prototype, "fileUtil", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_user_1.SysUserService)
], SysUserController.prototype, "sysUserService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_role_1.SysRoleService)
], SysUserController.prototype, "sysRoleService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_post_1.SysPostService)
], SysUserController.prototype, "sysPostService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", account_1.AccountService)
], SysUserController.prototype, "accountService", void 0);
__decorate([
    (0, core_1.Get)('/list', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:user:list'] })],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysUserController.prototype, "list", null);
__decorate([
    (0, core_1.Get)('/:userId', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:user:query'] })],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number())),
    __param(0, (0, core_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SysUserController.prototype, "info", null);
__decorate([
    (0, core_1.Post)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:user:add'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '用户信息',
                businessType: operate_log_1.BUSINESS_TYPE.INSERT,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_user_2.SysUser]),
    __metadata("design:returntype", Promise)
], SysUserController.prototype, "add", null);
__decorate([
    (0, core_1.Put)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:user:edit'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '用户信息',
                businessType: operate_log_1.BUSINESS_TYPE.UPDATE,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_user_2.SysUser]),
    __metadata("design:returntype", Promise)
], SysUserController.prototype, "edit", null);
__decorate([
    (0, core_1.Del)('/:userId', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:user:remove'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '用户信息',
                businessType: operate_log_1.BUSINESS_TYPE.DELETE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().allow(''))),
    __param(0, (0, core_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysUserController.prototype, "remove", null);
__decorate([
    (0, core_1.Put)('/password', {
        middleware: [
            (0, repeat_submit_1.RepeatSubmitMiddleware)(5),
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:user:resetPwd'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '用户信息',
                businessType: operate_log_1.BUSINESS_TYPE.UPDATE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number().required())),
    __param(0, (0, core_1.Body)('userId')),
    __param(1, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(1, (0, core_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], SysUserController.prototype, "password", null);
__decorate([
    (0, core_1.Put)('/status', {
        middleware: [
            (0, repeat_submit_1.RepeatSubmitMiddleware)(5),
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:user:edit'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '用户信息',
                businessType: operate_log_1.BUSINESS_TYPE.UPDATE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number().required())),
    __param(0, (0, core_1.Body)('userId')),
    __param(1, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(1, (0, core_1.Body)('statusFlag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], SysUserController.prototype, "status", null);
__decorate([
    (0, core_1.Put)('/unlock/:userName', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:user:unlock'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '用户信息',
                businessType: operate_log_1.BUSINESS_TYPE.CLEAN,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().allow(''))),
    __param(0, (0, core_1.Param)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysUserController.prototype, "unlock", null);
__decorate([
    (0, core_1.Get)('/export', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:user:export'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '用户信息',
                businessType: operate_log_1.BUSINESS_TYPE.EXPORT,
            }),
        ],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysUserController.prototype, "export", null);
__decorate([
    (0, core_1.Get)('/import/template', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:user:import'] })],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SysUserController.prototype, "template", null);
__decorate([
    (0, core_1.Post)('/import', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:user:import'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '用户信息',
                businessType: operate_log_1.BUSINESS_TYPE.IMPORT,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(0, (0, core_1.Body)('filePath')),
    __param(1, (0, validate_1.Valid)(validate_1.RuleType.boolean().required())),
    __param(1, (0, core_1.Body)('update')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], SysUserController.prototype, "import", null);
exports.SysUserController = SysUserController = __decorate([
    (0, core_1.Controller)('/system/user')
], SysUserController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX3VzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zeXN0ZW0vY29udHJvbGxlci9zeXNfdXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FVd0I7QUFDeEIsaURBQXFEO0FBR3JELHNFQUtrRDtBQUNsRCxnRUFHOEM7QUFDOUMseURBSXdDO0FBQ3hDLDJFQUdtRDtBQUNuRCwrRUFBcUY7QUFDckYsaUZBQXVGO0FBQ3ZGLHFEQUFtRDtBQUNuRCw2REFBZ0U7QUFDaEUsNkRBQThEO0FBQzlELCtEQUFnRTtBQUNoRSx3REFBNEQ7QUFDNUQsa0RBQXFEO0FBQ3JELGtEQUFxRDtBQUNyRCxrREFBcUQ7QUFDckQsZ0RBQTRDO0FBQzVDLGdEQUE0QztBQUM1QyxnREFBNEM7QUFFNUMsZ0JBQWdCO0FBRVQsSUFBTSxpQkFBaUIsK0JBQXZCLE1BQU0saUJBQWlCO0lBQzVCLFNBQVM7SUFFRCxDQUFDLENBQVU7SUFFbkIsVUFBVTtJQUVGLE1BQU0sQ0FBZTtJQUU3QixVQUFVO0lBRUYsUUFBUSxDQUFXO0lBRTNCLFVBQVU7SUFFRixjQUFjLENBQWlCO0lBRXZDLFVBQVU7SUFFRixjQUFjLENBQWlCO0lBRXZDLFVBQVU7SUFFRixjQUFjLENBQWlCO0lBRXZDLGNBQWM7SUFFTixjQUFjLENBQWlCO0lBRXZDLFlBQVk7SUFJQyxBQUFOLEtBQUssQ0FBQyxJQUFJLENBQVUsS0FBNkI7UUFDdEQsTUFBTSxZQUFZLEdBQUcsSUFBQSw4QkFBdUIsRUFDMUMsSUFBSSxDQUFDLENBQUMsRUFDTixVQUFVLEVBQ1YsVUFBVSxDQUNYLENBQUM7UUFDRixNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQ3hELEtBQUssRUFDTCxZQUFZLENBQ2IsQ0FBQztRQUNGLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxF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