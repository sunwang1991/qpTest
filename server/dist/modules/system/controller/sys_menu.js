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
exports.SysMenuController = void 0;
const core_1 = require("@midwayjs/core");
const validate_1 = require("@midwayjs/validate");
const menu_1 = require("../../../framework/constants/menu");
const auth_1 = require("../../../framework/reqctx/auth");
const operate_log_1 = require("../../../framework/middleware/operate_log");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const common_1 = require("../../../framework/constants/common");
const regular_1 = require("../../../framework/utils/regular/regular");
const config_1 = require("../../../framework/config/config");
const api_1 = require("../../../framework/resp/api");
const sys_menu_1 = require("../service/sys_menu");
const sys_menu_2 = require("../model/sys_menu");
/**菜单信息 控制层处理 */
let SysMenuController = exports.SysMenuController = class SysMenuController {
    /**上下文 */
    c;
    /**配置信息 */
    config;
    /**菜单服务 */
    sysMenuService;
    /**菜单列表 */
    async list(menuName, statusFlag) {
        const sysMenu = new sys_menu_2.SysMenu();
        if (menuName)
            sysMenu.menuName = menuName;
        if (statusFlag)
            sysMenu.statusFlag = statusFlag;
        let userId = (0, auth_1.loginUserToUserID)(this.c);
        if (this.config.isSystemUser(userId)) {
            userId = 0;
        }
        const data = await this.sysMenuService.find(sysMenu, userId);
        return api_1.Resp.okData(data || []);
    }
    /**菜单信息 */
    async info(menuId) {
        if (menuId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: menuId is empty');
        }
        const data = await this.sysMenuService.findById(menuId);
        if (data.menuId === menuId) {
            return api_1.Resp.okData(data);
        }
        return api_1.Resp.err();
    }
    /**菜单新增 */
    async add(body) {
        if (body.menuId > 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: menuId not is empty');
        }
        // 目录和菜单检查地址唯一
        if ([menu_1.MENU_TYPE_DIR, menu_1.MENU_TYPE_MENU].includes(body.menuType)) {
            const uniqueNenuPath = await this.sysMenuService.checkUniqueParentIdByMenuPath(body.parentId, body.menuPath, 0);
            if (!uniqueNenuPath) {
                return api_1.Resp.errMsg(`菜单新增【${body.menuName}】失败，菜单路由地址已存在`);
            }
        }
        // 检查名称唯一
        const uniqueNenuName = await this.sysMenuService.checkUniqueParentIdByMenuName(body.parentId, body.menuName, 0);
        if (!uniqueNenuName) {
            return api_1.Resp.errMsg(`菜单新增【${body.menuName}】失败，菜单名称已存在`);
        }
        // 外链菜单需要符合网站http(s)开头
        if (body.frameFlag === common_1.STATUS_NO && !(0, regular_1.validHttp)(body.menuPath)) {
            return api_1.Resp.errMsg(`菜单新增【${body.menuName}】失败，非内部地址必须以http(s)://开头`);
        }
        body.createBy = (0, auth_1.loginUserToUserName)(this.c);
        const insertId = await this.sysMenuService.insert(body);
        if (insertId > 0) {
            return api_1.Resp.okData(insertId);
        }
        return api_1.Resp.err();
    }
    /**菜单修改 */
    async edit(body) {
        if (body.menuId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: menuId is empty');
        }
        // 上级菜单不能选自己
        if (body.menuId === body.parentId) {
            return api_1.Resp.errMsg(`菜单修改【${body.menuName}】失败，上级菜单不能选择自己`);
        }
        // 检查数据是否存在
        const menuInfo = await this.sysMenuService.findById(body.menuId);
        if (menuInfo.menuId !== body.menuId) {
            return api_1.Resp.errMsg('没有权限访问菜单数据');
        }
        // 父级ID不为0是要检查
        if (body.parentId > 0) {
            const menuParent = await this.sysMenuService.findById(body.parentId);
            if (menuParent.menuId !== body.parentId) {
                return api_1.Resp.errMsg('没有权限访问菜单数据');
            }
            // 禁用菜单时检查父菜单是否使用
            if (body.statusFlag === common_1.STATUS_YES &&
                menuParent.statusFlag === common_1.STATUS_NO) {
                return api_1.Resp.errMsg('上级菜单未启用！');
            }
        }
        // 目录和菜单检查地址唯一
        if ([menu_1.MENU_TYPE_DIR, menu_1.MENU_TYPE_MENU].includes(body.menuType)) {
            const uniqueNenuPath = await this.sysMenuService.checkUniqueParentIdByMenuPath(body.parentId, body.menuPath, body.menuId);
            if (!uniqueNenuPath) {
                return api_1.Resp.errMsg(`菜单修改【${body.menuName}】失败，菜单路由地址已存在`);
            }
        }
        // 检查名称唯一
        const uniqueNenuName = await this.sysMenuService.checkUniqueParentIdByMenuName(body.parentId, body.menuName, body.menuId);
        if (!uniqueNenuName) {
            return api_1.Resp.errMsg(`菜单修改【${body.menuName}】失败，菜单名称已存在`);
        }
        // 外链菜单需要符合网站http(s)开头
        if (body.frameFlag === common_1.STATUS_NO && !(0, regular_1.validHttp)(body.menuPath)) {
            return api_1.Resp.errMsg(`菜单修改【${body.menuName}】失败，非内部地址必须以http(s)://开头`);
        }
        // 禁用菜单时检查子菜单是否使用
        if (body.statusFlag === common_1.STATUS_NO) {
            const hasStatus = await this.sysMenuService.existChildrenByMenuIdAndStatus(body.menuId, common_1.STATUS_YES);
            if (hasStatus > 0) {
                return api_1.Resp.errMsg(`不允许禁用，存在使用子菜单数：${hasStatus}`);
            }
        }
        menuInfo.parentId = body.parentId;
        menuInfo.menuName = body.menuName;
        menuInfo.menuType = body.menuType;
        menuInfo.menuSort = body.menuSort;
        menuInfo.menuPath = body.menuPath;
        menuInfo.component = body.component;
        menuInfo.frameFlag = body.frameFlag;
        menuInfo.cacheFlag = body.cacheFlag;
        menuInfo.visibleFlag = body.visibleFlag;
        menuInfo.statusFlag = body.statusFlag;
        menuInfo.perms = body.perms;
        menuInfo.icon = body.icon;
        menuInfo.remark = body.remark;
        menuInfo.updateBy = (0, auth_1.loginUserToUserName)(this.c);
        const rows = await this.sysMenuService.update(menuInfo);
        if (rows > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
    /**菜单删除 */
    async remove(menuId) {
        if (menuId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: menuId is empty');
        }
        // 检查数据是否存在
        const menu = await this.sysMenuService.findById(menuId);
        if (!menu) {
            return api_1.Resp.errMsg('没有权限访问菜单数据！');
        }
        // 检查是否存在子菜单
        const hasChild = await this.sysMenuService.existChildrenByMenuIdAndStatus(menuId, '');
        if (hasChild > 0) {
            return api_1.Resp.errMsg(`不允许删除，存在子菜单数：${hasChild}`);
        }
        // 检查是否分配给角色
        const existRole = await this.sysMenuService.existRoleByMenuId(menuId);
        if (existRole > 0) {
            return api_1.Resp.errMsg(`不允许删除，菜单已分配给角色数：${existRole}`);
        }
        const rows = await this.sysMenuService.deleteById(menuId);
        if (rows > 0) {
            return api_1.Resp.okData(`删除成功：${rows}`);
        }
        return api_1.Resp.err();
    }
    /**菜单树结构列表 */
    async tree(menuName, statusFlag) {
        const sysMenu = new sys_menu_2.SysMenu();
        if (menuName)
            sysMenu.menuName = menuName;
        if (statusFlag)
            sysMenu.statusFlag = statusFlag;
        let userId = (0, auth_1.loginUserToUserID)(this.c);
        if (this.config.isSystemUser(userId)) {
            userId = 0;
        }
        const trees = await this.sysMenuService.buildTreeSelectByUserId(sysMenu, userId);
        return api_1.Resp.okData(trees);
    }
    /**菜单树结构列表（指定角色） */
    async treeRole(roleId, menuName, statusFlag) {
        if (roleId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: roleId is empty');
        }
        const sysMenu = new sys_menu_2.SysMenu();
        if (menuName)
            sysMenu.menuName = menuName;
        if (statusFlag)
            sysMenu.statusFlag = statusFlag;
        let userId = (0, auth_1.loginUserToUserID)(this.c);
        if (this.config.isSystemUser(userId)) {
            userId = 0;
        }
        const menuTreeSelect = await this.sysMenuService.buildTreeSelectByUserId(sysMenu, userId);
        const checkedKeys = await this.sysMenuService.findByRoleId(roleId);
        return api_1.Resp.okData({
            menus: menuTreeSelect,
            checkedKeys: checkedKeys,
        });
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], SysMenuController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", config_1.GlobalConfig)
], SysMenuController.prototype, "config", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_menu_1.SysMenuService)
], SysMenuController.prototype, "sysMenuService", void 0);
__decorate([
    (0, core_1.Get)('/list', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:menu:list'] })],
    }),
    __param(0, (0, core_1.Query)('menuName')),
    __param(1, (0, core_1.Query)('statusFlag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SysMenuController.prototype, "list", null);
__decorate([
    (0, core_1.Get)('/:menuId', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:menu:query'] })],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number())),
    __param(0, (0, core_1.Param)('menuId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SysMenuController.prototype, "info", null);
__decorate([
    (0, core_1.Post)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:menu:add'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '菜单信息',
                businessType: operate_log_1.BUSINESS_TYPE.INSERT,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_menu_2.SysMenu]),
    __metadata("design:returntype", Promise)
], SysMenuController.prototype, "add", null);
__decorate([
    (0, core_1.Put)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:menu:edit'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '菜单信息',
                businessType: operate_log_1.BUSINESS_TYPE.UPDATE,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_menu_2.SysMenu]),
    __metadata("design:returntype", Promise)
], SysMenuController.prototype, "edit", null);
__decorate([
    (0, core_1.Del)('/:menuId', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:menu:remove'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '菜单信息',
                businessType: operate_log_1.BUSINESS_TYPE.DELETE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number())),
    __param(0, (0, core_1.Param)('menuId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SysMenuController.prototype, "remove", null);
__decorate([
    (0, core_1.Get)('/tree', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:menu:list'] })],
    }),
    __param(0, (0, core_1.Query)('menuName')),
    __param(1, (0, core_1.Query)('statusFlag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SysMenuController.prototype, "tree", null);
__decorate([
    (0, core_1.Get)('/tree/role/:roleId', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:menu:list'] })],
    }),
    __param(0, (0, core_1.Param)('roleId')),
    __param(1, (0, core_1.Query)('menuName')),
    __param(2, (0, core_1.Query)('statusFlag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], SysMenuController.prototype, "treeRole", null);
exports.SysMenuController = SysMenuController = __decorate([
    (0, core_1.Controller)('/system/menu')
], SysMenuController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX21lbnUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zeXN0ZW0vY29udHJvbGxlci9zeXNfbWVudS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FVd0I7QUFDeEIsaURBQXFEO0FBR3JELDREQUcyQztBQUMzQyx5REFHd0M7QUFDeEMsMkVBR21EO0FBQ25ELGlGQUF1RjtBQUN2RixnRUFBNEU7QUFDNUUsc0VBQXFFO0FBQ3JFLDZEQUFnRTtBQUNoRSxxREFBbUQ7QUFDbkQsa0RBQXFEO0FBQ3JELGdEQUE0QztBQUU1QyxnQkFBZ0I7QUFFVCxJQUFNLGlCQUFpQiwrQkFBdkIsTUFBTSxpQkFBaUI7SUFDNUIsU0FBUztJQUVELENBQUMsQ0FBVTtJQUVuQixVQUFVO0lBRUYsTUFBTSxDQUFlO0lBRTdCLFVBQVU7SUFFRixjQUFjLENBQWlCO0lBRXZDLFVBQVU7SUFJRyxBQUFOLEtBQUssQ0FBQyxJQUFJLENBQ0ksUUFBZ0IsRUFDZCxVQUFrQjtRQUV2QyxNQUFNLE9BQU8sR0FBRyxJQUFJLGtCQUFPLEVBQUUsQ0FBQztRQUM5QixJQUFJLFFBQVE7WUFBRSxPQUFPLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUMxQyxJQUFJLFVBQVU7WUFBRSxPQUFPLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUVoRCxJQUFJLE1BQU0sR0FBRyxJQUFBLHdCQUFpQixFQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUM7U0FDWjtRQUNELE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdELE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FB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