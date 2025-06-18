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
exports.SysProfileController = void 0;
const core_1 = require("@midwayjs/core");
const validate_1 = require("@midwayjs/validate");
const regular_1 = require("../../../framework/utils/regular/regular");
const operate_log_1 = require("../../../framework/middleware/operate_log");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const bcrypt_1 = require("../../../framework/utils/crypto/bcrypt");
const user_token_1 = require("../../../framework/token/user_token");
const auth_1 = require("../../../framework/reqctx/auth");
const api_1 = require("../../../framework/resp/api");
const sys_post_1 = require("../service/sys_post");
const sys_role_1 = require("../service/sys_role");
const sys_user_1 = require("../service/sys_user");
/**个人信息 控制层处理 */
let SysProfileController = exports.SysProfileController = class SysProfileController {
    /**上下文 */
    c;
    /**Token工具 */
    token;
    /**用户服务 */
    sysUserService;
    /**角色服务 */
    sysRoleService;
    /**岗位服务 */
    sysPostService;
    /**个人信息 */
    async info() {
        const [info, err] = (0, auth_1.loginUser)(this.c);
        if (err) {
            this.c.status = 401;
            return api_1.Resp.codeMsg(401002, err);
        }
        // 查询用户所属角色组
        const roleGroup = [];
        const roles = await this.sysRoleService.findByUserId(info.userId);
        for (const role of roles) {
            roleGroup.push(role.roleName);
        }
        // 查询用户所属岗位组
        const postGroup = [];
        const posts = await this.sysPostService.findByUserId(info.userId);
        for (const post of posts) {
            postGroup.push(post.postName);
        }
        return api_1.Resp.okData({
            user: info.user,
            roleGroup: [...new Set(roleGroup)],
            postGroup: [...new Set(postGroup)],
        });
    }
    /**个人信息修改 */
    async updateProfile(nickName, sex, phone, email, avatar) {
        if (nickName === '' || sex === '') {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: nickName or sex not is empty');
        }
        // 登录用户信息
        const [info, err] = (0, auth_1.loginUser)(this.c);
        if (err) {
            this.c.status = 401;
            return api_1.Resp.codeMsg(401002, err);
        }
        const userId = info.userId;
        // 检查手机号码格式并判断是否唯一
        if (phone !== '') {
            if ((0, regular_1.validMobile)(phone)) {
                const uniquePhone = await this.sysUserService.checkUniqueByPhone(phone, userId);
                if (!uniquePhone) {
                    return api_1.Resp.errMsg('抱歉，手机号码已存在');
                }
            }
            else {
                return api_1.Resp.errMsg('抱歉，手机号码格式错误');
            }
        }
        // 检查邮箱格式并判断是否唯一
        if (email) {
            if ((0, regular_1.validEmail)(email)) {
                const uniqueEmail = await this.sysUserService.checkUniqueByEmail(email, userId);
                if (!uniqueEmail) {
                    return api_1.Resp.errMsg('抱歉，邮箱已存在');
                }
            }
            else {
                return api_1.Resp.errMsg('抱歉，邮箱格式错误');
            }
        }
        // 查询当前登录用户信息
        const userInfo = await this.sysUserService.findById(userId);
        if (userInfo.userId !== userId) {
            return api_1.Resp.errMsg('没有权限访问用户数据！');
        }
        // 用户基本资料
        userInfo.nickName = nickName;
        userInfo.phone = phone;
        userInfo.email = email;
        userInfo.sex = sex;
        userInfo.avatar = avatar;
        userInfo.password = ''; // 密码不更新
        userInfo.updateBy = userInfo.userName;
        const rows = await this.sysUserService.update(userInfo);
        if (rows > 0) {
            // 更新缓存用户信息
            info.user = userInfo;
            // 更新信息
            await this.token.UserInfoUpdate(info);
            return api_1.Resp.ok();
        }
        return api_1.Resp.errMsg('修改个人信息异常');
    }
    /**个人重置密码 */
    async updatePassword(oldPassword, newPassword) {
        if (!oldPassword || !newPassword)
            return api_1.Resp.err();
        // 登录用户信息
        const [info, err] = (0, auth_1.loginUser)(this.c);
        if (err) {
            this.c.status = 401;
            return api_1.Resp.codeMsg(401002, err);
        }
        const userId = info.userId;
        // 查询当前登录用户信息得到密码值
        const userInfo = await this.sysUserService.findById(userId);
        if (userInfo.userId !== userId) {
            return api_1.Resp.errMsg('没有权限访问用户数据！');
        }
        // 检查匹配用户密码
        const oldCompare = await (0, bcrypt_1.bcryptCompare)(oldPassword, userInfo.password);
        if (!oldCompare) {
            return api_1.Resp.errMsg('修改密码失败，旧密码错误');
        }
        const newCompare = await (0, bcrypt_1.bcryptCompare)(newPassword, userInfo.password);
        if (newCompare) {
            return api_1.Resp.errMsg('新密码不能与旧密码相同');
        }
        // 修改新密码
        userInfo.password = newPassword;
        userInfo.updateBy = userInfo.userName;
        const rows = await this.sysUserService.update(userInfo);
        if (rows > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], SysProfileController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", user_token_1.UserTokenService)
], SysProfileController.prototype, "token", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_user_1.SysUserService)
], SysProfileController.prototype, "sysUserService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_role_1.SysRoleService)
], SysProfileController.prototype, "sysRoleService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_post_1.SysPostService)
], SysProfileController.prototype, "sysPostService", void 0);
__decorate([
    (0, core_1.Get)('', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)()],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SysProfileController.prototype, "info", null);
__decorate([
    (0, core_1.Put)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)(),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '个人信息',
                businessType: operate_log_1.BUSINESS_TYPE.UPDATE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(0, (0, core_1.Body)('nickName')),
    __param(1, (0, validate_1.Valid)(validate_1.RuleType.string().pattern(/^[012]$/))),
    __param(1, (0, core_1.Body)('sex')),
    __param(2, (0, validate_1.Valid)(validate_1.RuleType.string().allow(''))),
    __param(2, (0, core_1.Body)('phone')),
    __param(3, (0, validate_1.Valid)(validate_1.RuleType.string().allow(''))),
    __param(3, (0, core_1.Body)('email')),
    __param(4, (0, validate_1.Valid)(validate_1.RuleType.string().allow(''))),
    __param(4, (0, core_1.Body)('avatar')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], SysProfileController.prototype, "updateProfile", null);
__decorate([
    (0, core_1.Put)('/password', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)(),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '个人信息',
                businessType: operate_log_1.BUSINESS_TYPE.UPDATE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(0, (0, core_1.Body)('oldPassword')),
    __param(1, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(1, (0, core_1.Body)('newPassword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SysProfileController.prototype, "updatePassword", null);
exports.SysProfileController = SysProfileController = __decorate([
    (0, core_1.Controller)('/system/user/profile')
], SysProfileController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX3Byb2ZpbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zeXN0ZW0vY29udHJvbGxlci9zeXNfcHJvZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBb0U7QUFDcEUsaURBQXFEO0FBR3JELHNFQUdrRDtBQUNsRCwyRUFHbUQ7QUFDbkQsaUZBQXVGO0FBQ3ZGLG1FQUF1RTtBQUN2RSxvRUFBdUU7QUFDdkUseURBQTJEO0FBQzNELHFEQUFtRDtBQUNuRCxrREFBcUQ7QUFDckQsa0RBQXFEO0FBQ3JELGtEQUFxRDtBQUVyRCxnQkFBZ0I7QUFFVCxJQUFNLG9CQUFvQixrQ0FBMUIsTUFBTSxvQkFBb0I7SUFDL0IsU0FBUztJQUVELENBQUMsQ0FBVTtJQUVuQixhQUFhO0lBRUwsS0FBSyxDQUFtQjtJQUVoQyxVQUFVO0lBRUYsY0FBYyxDQUFpQjtJQUV2QyxVQUFVO0lBRUYsY0FBYyxDQUFpQjtJQUV2QyxVQUFVO0lBRUYsY0FBYyxDQUFpQjtJQUV2QyxVQUFVO0lBSUcsQUFBTixLQUFLLENBQUMsSUFBSTtRQUNmLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBQSxnQkFBUyxFQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxJQUFJLEdBQUcsRUFBRTtZQUNQLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNwQixPQUFPLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsWUFBWTtRQUNaLE1BQU0sU0FBUyxHQUFhLEVBQUUsQ0FBQztRQUMvQixNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRSxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFB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