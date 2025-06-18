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
exports.GlobalConfig = void 0;
const core_1 = require("@midwayjs/core");
/**Config全局配置 */
let GlobalConfig = exports.GlobalConfig = class GlobalConfig {
    app;
    /**
     * 获取配置信息
     * @param key 配置项的key值
     * @returns 配置项的值
     */
    get(key) {
        try {
            return this.app.getConfig(key);
        }
        catch (e) {
            throw new Error(`获取配置信息异常, ${e.message}.`);
        }
    }
    /**
     * 获取运行服务环境
     * local prod
     **/
    getEnv() {
        return this.app.getEnv();
    }
    /**
     * 程序开始运行的时间
     * local prod
     **/
    getRunTime() {
        const runTime = this.app.getAttr('runTime');
        return new Date(runTime);
    }
    /**
     * 用户是否为系统管理员
     * @param userId 用户ID
     * @returns boolen
     */
    isSystemUser(userId) {
        if (userId <= 0)
            return false;
        // 从配置中获取系统管理员ID列表
        const arr = this.get('systemUser');
        if (Array.isArray(arr)) {
            return arr.includes(userId);
        }
        return false;
    }
};
__decorate([
    (0, core_1.App)('koa'),
    __metadata("design:type", Object)
], GlobalConfig.prototype, "app", void 0);
exports.GlobalConfig = GlobalConfig = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], GlobalConfig);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ZyYW1ld29yay9jb25maWcvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUF5RDtBQUd6RCxnQkFBZ0I7QUFHVCxJQUFNLFlBQVksMEJBQWxCLE1BQU0sWUFBWTtJQUVmLEdBQUcsQ0FBYztJQUV6Qjs7OztPQUlHO0lBQ0ksR0FBRyxDQUFJLEdBQVc7UUFDdkIsSUFBSTtZQUNGLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFNLENBQUM7U0FDckM7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztTQUM1QztJQUNILENBQUM7SUFFRDs7O1FBR0k7SUFDRyxNQUFNO1FBQ1gsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRDs7O1FBR0k7SUFDRyxVQUFVO1FBQ2YsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQVMsU0FBUyxDQUFDLENBQUM7UUFDcEQsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLFlBQVksQ0FBQyxNQUFjO1FBQ2hDLElBQUksTUFBTSxJQUFJLENBQUM7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUM5QixrQkFBa0I7UUFDbEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBVyxZQUFZLENBQUMsQ0FBQztRQUM3QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdEIsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzdCO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0NBQ0YsQ0FBQTtBQTlDUztJQURQLElBQUEsVUFBRyxFQUFDLEtBQUssQ0FBQzs7eUNBQ2M7dUJBRmQsWUFBWTtJQUZ4QixJQUFBLGNBQU8sR0FBRTtJQUNULElBQUEsZ0JBQVMsR0FBRTtHQUNDLFlBQVksQ0FnRHhCIn0=