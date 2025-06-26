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
exports.RegisterService = void 0;
const core_1 = require("@midwayjs/core");
const cache_key_1 = require("../../../framework/constants/cache_key");
const common_1 = require("../../../framework/constants/common");
const parse_1 = require("../../../framework/utils/parse/parse");
const redis_1 = require("../../../framework/datasource/redis/redis");
const sys_config_1 = require("../../system/service/sys_config");
const sys_user_1 = require("../../system/service/sys_user");
const sys_user_2 = require("../../system/model/sys_user");
/**账号注册操作 服务层处理 */
let RegisterService = exports.RegisterService = class RegisterService {
    /**缓存操作 */
    redis;
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
        if (captcha !== code) {
            return 'captcha error';
        }
        return '';
    }
    /**
     * 账号注册
     * @param username 登录用户名
     * @param password 密码
     * @returns [用户ID, 错误信息]
     */
    async byUserName(username, password) {
        // 是否开启用户注册功能 true开启，false关闭
        const registerUserStr = await this.sysConfigService.findValueByKey('sys.account.registerUser');
        const captchaEnabled = (0, parse_1.parseBoolean)(registerUserStr);
        if (!captchaEnabled) {
            return [0, '很抱歉，系统已关闭外部用户注册通道'];
        }
        // 检查用户登录账号是否唯一
        const uniqueUserName = await this.sysUserService.checkUniqueByUserName(username, 0);
        if (!uniqueUserName) {
            return [0, `注册用户【${username}】失败，注册账号已存在`];
        }
        const sysUser = new sys_user_2.SysUser();
        sysUser.userName = username;
        sysUser.nickName = username; // 昵称使用名称账号
        sysUser.password = password; // 原始密码
        sysUser.sex = '0'; // 性别未选择
        sysUser.statusFlag = common_1.STATUS_YES; // 账号状态激活
        sysUser.deptId = 100; // 归属部门为根节点
        sysUser.createBy = 'register'; // 创建来源
        // 新增用户的角色管理
        sysUser.roleIds = this.registerRoleInit();
        // 新增用户的岗位管理
        sysUser.postIds = this.registerPostInit();
        const insertId = await this.sysUserService.insert(sysUser);
        if (insertId) {
            return [insertId, ''];
        }
        return [0, `注册用户【${username}】失败，请联系系统管理人员`];
    }
    /**
     * 注册初始角色
     * @returns 角色id组
     */
    registerRoleInit() {
        return [];
    }
    /**
     * 注册初始岗位
     * @returns 岗位id组
     */
    registerPostInit() {
        return [];
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", redis_1.RedisCache)
], RegisterService.prototype, "redis", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_config_1.SysConfigService)
], RegisterService.prototype, "sysConfigService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_user_1.SysUserService)
], RegisterService.prototype, "sysUserService", void 0);
exports.RegisterService = RegisterService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], RegisterService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9hdXRoL3NlcnZpY2UvcmVnaXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBRTVELHNFQUE0RTtBQUM1RSxnRUFBaUU7QUFDakUsZ0VBQW9FO0FBQ3BFLHFFQUF1RTtBQUN2RSxnRUFBbUU7QUFDbkUsNERBQStEO0FBQy9ELDBEQUFzRDtBQUV0RCxrQkFBa0I7QUFHWCxJQUFNLGVBQWUsNkJBQXJCLE1BQU0sZUFBZTtJQUMxQixVQUFVO0lBRUYsS0FBSyxDQUFhO0lBRTFCLFlBQVk7SUFFSixnQkFBZ0IsQ0FBbUI7SUFFM0MsWUFBWTtJQUVKLGNBQWMsQ0FBaUI7SUFFdkM7Ozs7O09BS0c7SUFDSSxLQUFLLENBQUMsZUFBZSxDQUFDLElBQVksRUFBRSxJQUFZO1FBQ3JELHFDQUFxQztRQUNyQyxNQUFNLGlCQUFpQixHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FDbEUsNEJBQTRCLENBQzdCLENBQUM7UUFDRixJQUFJLENBQUMsSUFBQSxvQkFBWSxFQUFDLGlCQUFpQixDQUFDLEVBQUU7WUFDcEMsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDbEIsT0FBTyxlQUFlLENBQUM7U0FDeEI7UUFDRCxNQUFNLFNBQVMsR0FBRyw4QkFBa0IsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ2xELE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLGdCQUFnQixDQUFDO1NBQ3pCO1FBQ0QsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVB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