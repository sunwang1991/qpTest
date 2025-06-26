"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFound = void 0;
const core_1 = require("@midwayjs/core");
const api_1 = require("../resp/api");
/**
 * 路由未找到-拦截器
 *
 * 404 错误会到这里
 */
let NotFound = exports.NotFound = class NotFound {
    async catch(_, c) {
        const msg = `Not Found ${c.method} ${c.path}`;
        // 返回404，提示错误信息
        c.body = api_1.Resp.codeMsg(404, msg);
        c.status = core_1.HttpStatus.NOT_FOUND;
    }
};
exports.NotFound = NotFound = __decorate([
    (0, core_1.Catch)(core_1.httpError.NotFoundError)
], NotFound);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90X2ZvdW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ZyYW1ld29yay9jYXRjaC9ub3RfZm91bmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEseUNBQStFO0FBRy9FLHFDQUFtQztBQUVuQzs7OztHQUlHO0FBRUksSUFBTSxRQUFRLHNCQUFkLE1BQU0sUUFBUTtJQUNuQixLQUFLLENBQUMsS0FBSyxDQUFDLENBQWtCLEVBQUUsQ0FBVTtRQUN4QyxNQUFNLEdBQUcsR0FBRyxhQUFhLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzlDLGVBQWU7UUFDZixDQUFDLENBQUMsSUFBSSxHQUFHLFVBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxNQUFNLEdBQUcsaUJBQVUsQ0FBQyxTQUFTLENBQUM7SUFDbEMsQ0FBQztDQUNGLENBQUE7bUJBUFksUUFBUTtJQURwQixJQUFBLFlBQUssRUFBQyxnQkFBUyxDQUFDLGFBQWEsQ0FBQztHQUNsQixRQUFRLENBT3BCIn0=