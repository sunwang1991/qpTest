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
exports.SysUserOnlineController = void 0;
const core_1 = require("@midwayjs/core");
const validate_1 = require("@midwayjs/validate");
const operate_log_1 = require("../../../framework/middleware/operate_log");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const parse_1 = require("../../../framework/utils/parse/parse");
const cache_key_1 = require("../../../framework/constants/cache_key");
const redis_1 = require("../../../framework/datasource/redis/redis");
const user_info_1 = require("../../../framework/token/user_info");
const api_1 = require("../../../framework/resp/api");
const sys_user_online_1 = require("../service/sys_user_online");
/**在线用户信息 控制层处理 */
let SysUserOnlineController = exports.SysUserOnlineController = class SysUserOnlineController {
    /**上下文 */
    c;
    /**缓存服务 */
    redisCache;
    /**在线用户服务 */
    sysUserOnlineService;
    /**
     * 在线用户列表
     */
    async list(loginIp, userName) {
        // 获取所有在线用户key
        const keys = await this.redisCache.getKeys('', `${cache_key_1.CACHE_TOKEN_DEVICE}:*`);
        // 分批获取
        const arr = [];
        for (let i = 0; i < keys.length; i += 20) {
            let end = i + 20;
            if (end > keys.length) {
                end = keys.length;
            }
            const chunk = keys.slice(i, end);
            const values = await this.redisCache.getBatch('', chunk);
            if (values.length > 0) {
                arr.push(...values);
            }
        }
        // 遍历字符串信息解析组合可用对象
        const userOnlines = [];
        for (const str of arr) {
            if (!str)
                continue;
            let info = new user_info_1.UserInfo();
            try {
                info = JSON.parse(str);
            }
            catch (error) {
                continue;
            }
            const onlineUser = await this.sysUserOnlineService.userInfoToUserOnline(info);
            if (onlineUser.tokenId !== '') {
                userOnlines.push(onlineUser);
            }
        }
        // 根据查询条件过滤
        let filteredUserOnline = [];
        if (loginIp && userName) {
            for (const o of userOnlines) {
                if (o.loginIp.includes(loginIp) && o.userName.includes(userName)) {
                    filteredUserOnline.push(o);
                }
            }
        }
        else if (loginIp) {
            for (const o of userOnlines) {
                if (o.loginIp.includes(loginIp)) {
                    filteredUserOnline.push(o);
                }
            }
        }
        else if (userName) {
            for (const o of userOnlines) {
                if (o.userName.includes(userName)) {
                    filteredUserOnline.push(o);
                }
            }
        }
        else {
            filteredUserOnline = userOnlines;
        }
        // 按登录时间排序
        filteredUserOnline = filteredUserOnline.sort((a, b) => b.loginTime - a.loginTime);
        return api_1.Resp.okData({
            total: filteredUserOnline.length,
            rows: filteredUserOnline,
        });
    }
    /**
     * 在线用户强制退出
     */
    async logout(tokenId) {
        if (tokenId === '' || tokenId.indexOf('*') >= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: tokenId is empty');
        }
        // 处理字符转id数组后去重
        const uniqueIDs = (0, parse_1.parseRemoveDuplicatesToArray)(tokenId, ',');
        for (const v of uniqueIDs) {
            const key = `${cache_key_1.CACHE_TOKEN_DEVICE}:${v}`;
            await this.redisCache.del('', key);
        }
        return api_1.Resp.ok();
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], SysUserOnlineController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", redis_1.RedisCache)
], SysUserOnlineController.prototype, "redisCache", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_user_online_1.SysUserOnlineService)
], SysUserOnlineController.prototype, "sysUserOnlineService", void 0);
__decorate([
    (0, core_1.Get)('/list', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:online:list'] }),
        ],
    }),
    __param(0, (0, core_1.Query)('loginIp')),
    __param(1, (0, core_1.Query)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SysUserOnlineController.prototype, "list", null);
__decorate([
    (0, core_1.Del)('/logout/:tokenId', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:online:logout'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '在线用户监控',
                businessType: operate_log_1.BUSINESS_TYPE.FORCE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().allow(''))),
    __param(0, (0, core_1.Param)('tokenId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysUserOnlineController.prototype, "logout", null);
exports.SysUserOnlineController = SysUserOnlineController = __decorate([
    (0, core_1.Controller)('/monitor/user-online')
], SysUserOnlineController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX3VzZXJfb25saW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvbW9uaXRvci9jb250cm9sbGVyL3N5c191c2VyX29ubGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBNEU7QUFDNUUsaURBQXFEO0FBR3JELDJFQUdtRDtBQUNuRCxpRkFBdUY7QUFDdkYsZ0VBQW9GO0FBQ3BGLHNFQUE0RTtBQUM1RSxxRUFBdUU7QUFDdkUsa0VBQThEO0FBQzlELHFEQUFtRDtBQUVuRCxnRUFBa0U7QUFFbEUsa0JBQWtCO0FBRVgsSUFBTSx1QkFBdUIscUNBQTdCLE1BQU0sdUJBQXVCO0lBQ2xDLFNBQVM7SUFFRCxDQUFDLENBQVU7SUFFbkIsVUFBVTtJQUVGLFVBQVUsQ0FBYTtJQUUvQixZQUFZO0lBRUosb0JBQW9CLENBQXVCO0lBRW5EOztPQUVHO0lBTVUsQUFBTixLQUFLLENBQUMsSUFBSSxDQUNHLE9BQWUsRUFDZCxRQUFnQjtRQUVuQyxjQUFjO1FBQ2QsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsR0FBRyw4QkFBa0IsSUFBSSxDQUFDLENBQUM7UUFFMUUsT0FBTztRQUNQLE1BQU0sR0FBRyxHQUFhLEVBQUUsQ0FBQztRQUN6QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3hDLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDakIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDckIsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7YUFDbkI7WUFDRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENB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