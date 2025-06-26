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
exports.SysRoleMenu = void 0;
const validate_1 = require("@midwayjs/validate");
const typeorm_1 = require("typeorm");
/**角色和菜单关联表 */
let SysRoleMenu = exports.SysRoleMenu = class SysRoleMenu {
    /**角色ID */
    roleId;
    /**菜单ID */
    menuId;
};
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.PrimaryColumn)({ name: 'role_id' }),
    __metadata("design:type", Number)
], SysRoleMenu.prototype, "roleId", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.PrimaryColumn)({ name: 'menu_id' }),
    __metadata("design:type", Number)
], SysRoleMenu.prototype, "menuId", void 0);
exports.SysRoleMenu = SysRoleMenu = __decorate([
    (0, typeorm_1.Entity)('sys_role_menu')
], SysRoleMenu);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX3JvbGVfbWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9tb2RlbC9zeXNfcm9sZV9tZW51LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLGlEQUFvRDtBQUNwRCxxQ0FBZ0Q7QUFFaEQsY0FBYztBQUVQLElBQU0sV0FBVyx5QkFBakIsTUFBTSxXQUFXO0lBQ3RCLFVBQVU7SUFHVixNQUFNLENBQVM7SUFFZixVQUFVO0lBR1YsTUFBTSxDQUFTO0NBQ2hCLENBQUE7QUFOQztJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLElBQUEsdUJBQWEsRUFBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQzs7MkNBQ3BCO0FBS2Y7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxJQUFBLHVCQUFhLEVBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUM7OzJDQUNwQjtzQkFUSixXQUFXO0lBRHZCLElBQUEsZ0JBQU0sRUFBQyxlQUFlLENBQUM7R0FDWCxXQUFXLENBVXZCIn0=