"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SysUserOnlineService = void 0;
const core_1 = require("@midwayjs/core");
const sys_user_online_1 = require("../model/sys_user_online");
/**在线用户 服务层处理 */
let SysUserOnlineService = exports.SysUserOnlineService = class SysUserOnlineService {
    /**
     * 在线用户信息
     *
     * @param info 登录用户信息
     * @return 在线用户
     */
    async userInfoToUserOnline(info) {
        if (info.userId <= 0) {
            return new sys_user_online_1.SysUserOnline();
        }
        const iten = new sys_user_online_1.SysUserOnline();
        iten.tokenId = info.deviceId;
        iten.userName = info.user?.userName;
        iten.loginIp = info.loginIp;
        iten.loginLocation = info.loginLocation;
        iten.browser = info.browser;
        iten.os = info.os;
        iten.loginTime = info.loginTime;
        if (info.user && info.user?.deptId > 0) {
            iten.deptName = info.user?.dept?.deptName;
        }
        return iten;
    }
};
exports.SysUserOnlineService = SysUserOnlineService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysUserOnlineService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX3VzZXJfb25saW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvbW9uaXRvci9zZXJ2aWNlL3N5c191c2VyX29ubGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSx5Q0FBb0Q7QUFFcEQsOERBQXlEO0FBRXpELGdCQUFnQjtBQUdULElBQU0sb0JBQW9CLGtDQUExQixNQUFNLG9CQUFvQjtJQUMvQjs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxJQUFjO1FBQzlDLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDcEIsT0FBTyxJQUFJLCtCQUFhLEVBQUUsQ0FBQztTQUM1QjtRQUVELE1BQU0sSUFBSSxHQUFHLElBQUksK0JBQWEsRUFBRSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM1QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzVCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDaEMsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN0QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQztTQUMzQztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUNGLENBQUE7K0JBekJZLG9CQUFvQjtJQUZoQyxJQUFBLGNBQU8sR0FBRTtJQUNULElBQUEsZ0JBQVMsR0FBRTtHQUNDLG9CQUFvQixDQXlCaEMifQ==