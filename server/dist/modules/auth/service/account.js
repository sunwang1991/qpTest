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
exports.AccountService = void 0;
const core_1 = require("@midwayjs/core");
const cache_key_1 = require("../../../framework/constants/cache_key");
const system_1 = require("../../../framework/constants/system");
const common_1 = require("../../../framework/constants/common");
const parse_1 = require("../../../framework/utils/parse/parse");
const redis_1 = require("../../../framework/datasource/redis/redis");
const user_info_1 = require("../../../framework/token/user_info");
const config_1 = require("../../../framework/config/config");
const bcrypt_1 = require("../../../framework/utils/crypto/bcrypt");
const sys_config_1 = require("../../system/service/sys_config");
const sys_menu_1 = require("../../system/service/sys_menu");
const sys_role_1 = require("../../system/service/sys_role");
const sys_user_1 = require("../../system/service/sys_user");
/**账号身份操作 服务层处理 */
let AccountService = exports.AccountService = class AccountService {
    /**缓存操作 */
    redis;
    /**配置信息 */
    config;
    /**菜单服务 */
    sysMenuService;
    /**角色服务 */
    sysRoleService;
    /**参数配置服务 */
    sysConfigService;
    /**用户信息服务 */
    sysUserService;
    /**
     * 校验验证码
     * @param code 验证码
     * @param uuid 唯一标识
     * @return 错误结果信息
     */
    async validateCaptcha(code, uuid) {
        // 验证码检查，从数据库配置获取验证码开关 true开启，false关闭
        const captchaEnabledStr = await this.sysConfigService.findValueByKey('sys.account.captchaEnabled');
        if (!(0, parse_1.parseBoolean)(captchaEnabledStr)) {
            return '';
        }
        if (!code || !uuid) {
            return 'captcha empty';
        }
        const verifyKey = cache_key_1.CACHE_CAPTCHA_CODE + ':' + uuid;
        const captcha = await this.redis.get('', verifyKey);
        if (!captcha) {
            return 'captcha expire';
        }
        await this.redis.del('', verifyKey);
        if (captcha !== code.toLowerCase()) {
            return 'captcha error';
        }
        return '';
    }
    /**
     * 登录创建用户信息
     * @param username 登录用户名
     * @param password 密码
     * @return [UserInfo, string] 登录用户信息对象和错误结果信息
     */
    async byUsername(username, password) {
        const info = new user_info_1.UserInfo();
        // 检查密码重试次数
        const [retryKey, retryCount, lockTime, err] = await this.passwordRetryCount(username);
        if (err) {
            return [info, err];
        }
        // 查询用户登录账号
        const sysUser = await this.sysUserService.findByUserName(username);
        if (sysUser.userName !== username) {
            return [info, 'user does not exist or password is incorrect'];
        }
        if (sysUser.delFlag === common_1.STATUS_YES) {
            return [
                info,
                'sorry, your account has been deleted. Sorry, your account has been deleted',
            ];
        }
        if (sysUser.statusFlag === common_1.STATUS_NO) {
            return [info, 'sorry, your account has been disabled'];
        }
        // 检验用户密码
        const compareBool = await (0, bcrypt_1.bcryptCompare)(password, sysUser.password);
        if (compareBool) {
            // 清除错误记录次数
            await this.clearLoginRecordCache(username);
        }
        else {
            await this.redis.set('', retryKey, retryCount + 1, lockTime);
            return [info, 'user does not exist or password is incorrect'];
        }
        // 登录用户信息
        info.userId = sysUser.userId;
        info.deptId = sysUser.deptId;
        info.user = sysUser;
        // 用户权限组标识
        if (this.config.isSystemUser(sysUser.userId)) {
            info.permissions = [system_1.SYS_PERMISSION_SYSTEM];
        }
        else {
            const perms = await this.sysMenuService.findPermsByUserId(sysUser.userId);
            info.permissions = [...new Set(perms)];
        }
        return [info, ''];
    }
    /**
     * 用户ID刷新令牌创建用户信息
     * @param userId 登录ID
     * @return [UserInfo, string] 登录用户信息对象和错误结果信息
     */
    async byUserId(userId) {
        const info = new user_info_1.UserInfo();
        // 查询用户登录账号
        const sysUser = await this.sysUserService.findById(userId);
        if (sysUser.userId !== userId) {
            return [info, 'user does not exist'];
        }
        if (sysUser.delFlag === common_1.STATUS_YES) {
            return [
                info,
                'sorry, your account has been deleted. Sorry, your account has been deleted',
            ];
        }
        if (sysUser.statusFlag === common_1.STATUS_NO) {
            return [info, 'sorry, your account has been disabled'];
        }
        // 登录用户信息
        info.userId = sysUser.userId;
        info.deptId = sysUser.deptId;
        info.user = sysUser;
        // 用户权限组标识
        if (this.config.isSystemUser(sysUser.userId)) {
            info.permissions = [system_1.SYS_PERMISSION_SYSTEM];
        }
        else {
            const perms = await this.sysMenuService.findPermsByUserId(sysUser.userId);
            info.permissions = [...new Set(perms)];
        }
        return [info, ''];
    }
    /**
     * 更新登录时间和IP
     * @param info 登录用户信息对象
     * @returns 记录完成
     */
    async updateLoginDateAndIP(info) {
        const item = await this.sysUserService.findById(info.userId);
        item.password = ''; // 密码不更新
        item.loginIp = info.loginIp;
        item.loginTime = info.loginTime;
        const rows = await this.sysUserService.update(item);
        return rows > 0;
    }
    /**
     * 清除错误记录次数
     * @param username 登录用户名
     * @returns boolean
     */
    async clearLoginRecordCache(username) {
        const base64UserName = Buffer.from(username, 'utf8').toString('base64');
        const cacheKey = cache_key_1.CACHE_PWD_ERR_COUNT + ':' + base64UserName;
        const hasKey = await this.redis.has('', cacheKey);
        if (hasKey > 0) {
            const rows = await this.redis.del('', cacheKey);
            return rows > 0;
        }
        return false;
    }
    /**
     * 密码重试次数
     * @param username 登录用户名
     * @returns [retryKey, retryCount, lockTime, err]
     */
    async passwordRetryCount(username) {
        // 验证登录次数和错误锁定时间
        const maxRetryCountStr = await this.sysConfigService.findValueByKey('sys.account.passwordRetryMaxCount');
        const lockTimeStr = await this.sysConfigService.findValueByKey('sys.account.passwordRetryLockTime');
        const maxRetryCount = (0, parse_1.parseNumber)(maxRetryCountStr);
        const lockTime = (0, parse_1.parseNumber)(lockTimeStr);
        // 验证缓存记录次数
        const base64UserName = Buffer.from(username, 'utf8').toString('base64');
        const retryKey = cache_key_1.CACHE_PWD_ERR_COUNT + ':' + base64UserName;
        let retryCount = await this.redis.get('', retryKey);
        if (!retryCount) {
            retryCount = '0';
        }
        // 是否超过错误值
        const retryCountInt = (0, parse_1.parseNumber)(retryCount);
        if (retryCountInt >= maxRetryCount) {
            const msg = `密码输入错误 ${maxRetryCount} 次，帐户锁定 ${lockTime} 分钟`;
            return [retryKey, retryCountInt, lockTime * 60, msg];
        }
        return [retryKey, retryCountInt, lockTime * 60, ''];
    }
    /**
     * 角色和菜单数据权限
     * @param userId 用户ID
     * @param isSystemUser 是否为系统管理员
     * @returns [角色key数组, 菜单权限key数组]
     */
    async roleAndMenuPerms(userId, isSystemUser) {
        if (isSystemUser) {
            return [[system_1.SYS_ROLE_SYSTEM_KEY], [system_1.SYS_PERMISSION_SYSTEM]];
        }
        // 角色key
        const roleGroup = [];
        const roles = await this.sysRoleService.findByUserId(userId);
        for (const role of roles) {
            roleGroup.push(role.roleKey);
        }
        // 菜单权限key
        const perms = await this.sysMenuService.findPermsByUserId(userId);
        return [roleGroup, perms];
    }
    /**
     * 前端路由所需要的菜单
     * @param userId 用户ID
     * @param isSystemUser 是否为系统管理员
     * @returns 路由菜单数组
     */
    async routeMenus(userId, isSystemUser) {
        let buildMenus = [];
        if (isSystemUser) {
            const menus = await this.sysMenuService.buildTreeMenusByUserId(0);
            buildMenus = await this.sysMenuService.buildRouteMenus(menus, '');
        }
        else {
            const menus = await this.sysMenuService.buildTreeMenusByUserId(userId);
            buildMenus = await this.sysMenuService.buildRouteMenus(menus, '');
        }
        return buildMenus;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", redis_1.RedisCache)
], AccountService.prototype, "redis", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", config_1.GlobalConfig)
], AccountService.prototype, "config", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_menu_1.SysMenuService)
], AccountService.prototype, "sysMenuService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_role_1.SysRoleService)
], AccountService.prototype, "sysRoleService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_config_1.SysConfigService)
], AccountService.prototype, "sysConfigService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_user_1.SysUserService)
], AccountService.prototype, "sysUserService", void 0);
exports.AccountService = AccountService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], AccountService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2F1dGgvc2VydmljZS9hY2NvdW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUE0RDtBQUU1RCxzRUFHZ0Q7QUFDaEQsZ0VBRzZDO0FBQzdDLGdFQUE0RTtBQUM1RSxnRUFHOEM7QUFDOUMscUVBQXVFO0FBQ3ZFLGtFQUE4RDtBQUM5RCw2REFBZ0U7QUFDaEUsbUVBQXVFO0FBQ3ZFLGdFQUFtRTtBQUNuRSw0REFBK0Q7QUFDL0QsNERBQStEO0FBQy9ELDREQUErRDtBQUcvRCxrQkFBa0I7QUFHWCxJQUFNLGNBQWMsNEJBQXBCLE1BQU0sY0FBYztJQUN6QixVQUFVO0lBRUYsS0FBSyxDQUFhO0lBRTFCLFVBQVU7SUFFRixNQUFNLENBQWU7SUFFN0IsVUFBVTtJQUVGLGNBQWMsQ0FBaUI7SUFFdkMsVUFBVTtJQUVGLGNBQWMsQ0FBaUI7SUFFdkMsWUFBWTtJQUVKLGdCQUFnQixDQUFtQjtJQUUzQyxZQUFZO0lBRUosY0FBYyxDQUFpQjtJQUV2Qzs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBWSxFQUFFLElBQVk7UUFDckQscUNBQXFDO1FBQ3JDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUNsRSw0QkFBNEIsQ0FDN0IsQ0FBQztRQUNGLElBQUksQ0FBQyxJQUFBLG9CQUFZLEVBQUMsaUJBQWlCLENBQUMsRUFBRTtZQUNwQyxPQUFPLEVBQUUsQ0FBQztTQUNYO1FBQ0QsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNsQixPQUFPLGVBQWUsQ0FBQztTQUN4QjtRQUNELE1BQU0sU0FBUyxHQUFHLDhCQUFrQixHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDbEQsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE9BQU8sZ0JBQWdCLENBQUM7U0FDekI7UUFDRCxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNwQyxJQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDbEMsT0FBTyxlQUFlLENBQUM7U0FDeEI7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxVQUFVLENBQ3JCLFFBQWdCLEVBQ2hCLFFBQWdCO1FBRWhCLE1BQU0sSUFBSSxHQUFHLElBQUksb0JBQVEsRUFBRSxDQUFDO1FBRTVCLFdBQVc7UUFDWCxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQ3pFLFFBQVEsQ0FDVCxDQUFDO1FBQ0YsSUFBSSxHQUFHLEVBQUU7WUFDUCxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ3BCO1FBRUQsV0FBVztRQUNYLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkUsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtZQUNqQyxPQUFPLENBQUMsSUFBSSxFQUFFLDhDQUE4QyxDQUFDLENBQUM7U0FDL0Q7UUFDRCxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssbUJBQVUsRUFBRTtZQUNsQyxPQUFPO2dCQUNMLElBQUk7Z0JBQ0osNEVBQTRFO2FBQzdFLENBQUM7U0FDSDtRQUNELElBQUksT0FBTyxDQUFDLFVBQVUsS0FBSyxrQkFBUyxFQUFFO1lBQ3BDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsdUNBQXVDLENBQUMsQ0FBQztTQUN4RDtRQUVELFNBQVM7UUFDVCxNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUEsc0JBQWEsRUFBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BFLElBQUksV0FBVyxFQUFFO1lBQ2YsV0FBVztZQUNYLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzVDO2FBQU07WUFDTCxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUM3RCxPQUFPLENBQUMsSUFBSSxFQUFFLDhDQUE4QyxDQUFDLENBQUM7U0FDL0Q7UUFFRCxTQUFTO1FBQ1QsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztRQUNwQixVQUFVO1FBQ1YsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDNUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLDhCQUFxQixDQUFDLENBQUM7U0FDNUM7YUFBTTtZQUNMLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUN4QztRQUNELE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQWM7UUFDbEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxvQkFBUSxFQUFFLENBQUM7UUFFNUIsV0FBVztRQUNYLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0QsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtZQUM3QixPQUFPLENBQUMsSUFBSSxFQUFFLHFCQUFxQixDQUFDLENBQUM7U0FDdEM7UUFDRCxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssbUJBQVUsRUFBRTtZQUNsQyxPQUFPO2dCQUNMLElBQUk7Z0JBQ0osNEVBQTRFO2FBQzdFLENBQUM7U0FDSDtRQUNELElBQUksT0FBTyxDQUFDLFVBQVUsS0FBSyxrQkFBUyxFQUFFO1lBQ3BDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsdUNBQXVDLENBQUMsQ0FBQztTQUN4RDtRQUVELFNBQVM7UUFDVCxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ3BCLFVBQVU7UUFDVixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM1QyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsOEJBQXFCLENBQUMsQ0FBQztTQUM1QzthQUFNO1lBQ0wsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxRSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ3hDO1FBQ0QsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxJQUFjO1FBQzlDLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUMsUUFBUTtRQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2hDLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEQsT0FBTyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLHFCQUFxQixDQUFDLFFBQWdCO1FBQ2pELE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4RSxNQUFNLFFBQVEsR0FBRywrQkFBbUIsR0FBRyxHQUFHLEdBQUcsY0FBYyxDQUFDO1FBQzVELE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELElBQUksTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNkLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2hELE9BQU8sSUFBSSxHQUFHLENBQUMsQ0FBQztTQUNqQjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsa0JBQWtCLENBQzdCLFFBQWdCO1FBRWhCLGdCQUFnQjtRQUNoQixNQUFNLGdCQUFnQixHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FDakUsbUNBQW1DLENBQ3BDLENBQUM7UUFDRixNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQzVELG1DQUFtQyxDQUNwQyxDQUFDO1FBQ0YsTUFBTSxhQUFhLEdBQVcsSUFBQSxtQkFBVyxFQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDNUQsTUFBTSxRQUFRLEdBQVcsSUFBQSxtQkFBVyxFQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2xELFdBQVc7UUFDWCxNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEUsTUFBTSxRQUFRLEdBQUcsK0JBQW1CLEdBQUcsR0FBRyxHQUFHLGNBQWMsQ0FBQztRQUM1RCxJQUFJLFVBQVUsR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2YsVUFBVSxHQUFHLEdBQUcsQ0FBQztTQUNsQjtRQUNELFVBQVU7UUFDVixNQUFNLGFBQWEsR0FBRyxJQUFBLG1CQUFXLEVBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUMsSUFBSSxhQUFhLElBQUksYUFBYSxFQUFFO1lBQ2xDLE1BQU0sR0FBRyxHQUFHLFVBQVUsYUFBYSxXQUFXLFFBQVEsS0FBSyxDQUFDO1lBQzVELE9BQU8sQ0FBQyxRQUFRLEVBQUUsYUFBYSxFQUFFLFFBQVEsR0FBRyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDdEQ7UUFDRCxPQUFPLENBQUMsUUFBUSxFQUFFLGFBQWEsRUFBRSxRQUFRLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FDM0IsTUFBYyxFQUNkLFlBQXFCO1FBRXJCLElBQUksWUFBWSxFQUFFO1lBQ2hCLE9BQU8sQ0FBQyxDQUFDLDRCQUFtQixDQUFDLEVBQUUsQ0FBQyw4QkFBcUIsQ0FBQyxDQUFDLENBQUM7U0FDekQ7UUFDRCxRQUFRO1FBQ1IsTUFBTSxTQUFTLEdBQWEsRUFBRSxDQUFDO1FBQy9CLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0QsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7WUFDeEIsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDOUI7UUFDRCxVQUFVO1FBQ1YsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xFLE9BQU8sQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLFVBQVUsQ0FDckIsTUFBYyxFQUNkLFlBQXFCO1FBRXJCLElBQUksVUFBVSxHQUFhLEVBQUUsQ0FBQztRQUM5QixJQUFJLFlBQVksRUFBRTtZQUNoQixNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEUsVUFBVSxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ25FO2FBQU07WUFDTCxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkUsVUFBVSxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ25FO1FBQ0QsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztDQUNGLENBQUE7QUE5UFM7SUFEUCxJQUFBLGFBQU0sR0FBRTs4QkFDTSxrQkFBVTs2Q0FBQztBQUlsQjtJQURQLElBQUEsYUFBTSxHQUFFOzhCQUNPLHFCQUFZOzhDQUFDO0FBSXJCO0lBRFAsSUFBQSxhQUFNLEdBQUU7OEJBQ2UseUJBQWM7c0RBQUM7QUFJL0I7SUFEUCxJQUFBLGFBQU0sR0FBRTs4QkFDZSx5QkFBYztzREFBQztBQUkvQjtJQURQLElBQUEsYUFBTSxHQUFFOzhCQUNpQiw2QkFBZ0I7d0RBQUM7QUFJbkM7SUFEUCxJQUFBLGFBQU0sR0FBRTs4QkFDZSx5QkFBYztzREFBQzt5QkF2QjVCLGNBQWM7SUFGMUIsSUFBQSxjQUFPLEdBQUU7SUFDVCxJQUFBLGdCQUFTLEdBQUU7R0FDQyxjQUFjLENBaVExQiJ9