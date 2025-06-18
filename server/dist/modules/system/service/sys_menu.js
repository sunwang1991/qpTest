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
exports.SysMenuService = void 0;
const core_1 = require("@midwayjs/core");
const menu_1 = require("../../../framework/constants/menu");
const regular_1 = require("../../../framework/utils/regular/regular");
const parse_1 = require("../../../framework/utils/parse/parse");
const common_1 = require("../../../framework/constants/common");
const tree_select_1 = require("../model/vo/tree_select");
const router_1 = require("../model/vo/router");
const sys_menu_1 = require("../repository/sys_menu");
const sys_role_menu_1 = require("../repository/sys_role_menu");
const sys_role_1 = require("../repository/sys_role");
const sys_menu_2 = require("../model/sys_menu");
/**菜单 服务层处理 */
let SysMenuService = exports.SysMenuService = class SysMenuService {
    /**菜单服务 */
    sysMenuRepository;
    /**角色与菜单关联服务 */
    sysRoleMenuRepository;
    /**角色服务 */
    sysRoleRepository;
    /**
     * 查询数据
     * @param sysMenu 信息
     * @param userId 用户ID
     * @returns []
     */
    async find(sysMenu, userId) {
        return await this.sysMenuRepository.select(sysMenu, userId);
    }
    /**
     * 根据ID查询信息
     * @param menuId ID
     * @returns 结果
     */
    async findById(menuId) {
        if (menuId <= 0) {
            return new sys_menu_2.SysMenu();
        }
        const menus = await this.sysMenuRepository.selectByIds([menuId]);
        if (menus.length > 0) {
            return menus[0];
        }
        return new sys_menu_2.SysMenu();
    }
    /**
     * 新增信息
     * @param sysMenu 信息
     * @returns ID
     */
    async insert(sysMenu) {
        return await this.sysMenuRepository.insert(sysMenu);
    }
    /**
     * 修改信息
     * @param sysMenu 信息
     * @returns 影响记录数
     */
    async update(sysMenu) {
        return await this.sysMenuRepository.update(sysMenu);
    }
    /**
     * 删除信息
     * @param menuId ID
     * @returns 影响记录数
     */
    async deleteById(menuId) {
        await this.sysRoleMenuRepository.deleteByMenuIds([menuId]); // 删除角色与部门关联
        return await this.sysMenuRepository.deleteById(menuId);
    }
    /**
     * 菜单下同状态存在子节点数量
     * @param menuId 菜单ID
     * @param status 状态
     * @returns 数量
     */
    async existChildrenByMenuIdAndStatus(menuId, status) {
        return await this.sysMenuRepository.existChildrenByMenuIdAndStatus(menuId, status);
    }
    /**
     * 菜单分配给的角色数量
     * @param menuId 菜单ID
     * @returns 数量
     */
    async existRoleByMenuId(menuId) {
        return await this.sysRoleMenuRepository.existRoleByMenuId(menuId);
    }
    /**
     * 检查同级下菜单名称是否唯一
     * @param parentId 父级部门ID
     * @param menuName 菜单名称
     * @param menuId 菜单ID
     * @returns 结果
     */
    async checkUniqueParentIdByMenuName(parentId, menuName, menuId) {
        const sysMenu = new sys_menu_2.SysMenu();
        sysMenu.menuName = menuName;
        sysMenu.parentId = parentId;
        const uniqueId = await this.sysMenuRepository.checkUnique(sysMenu);
        if (uniqueId === menuId) {
            return true;
        }
        return uniqueId === 0;
    }
    /**
     * 检查同级下路由地址是否唯一（针对目录和菜单）
     * @param parentId 父级部门ID
     * @param menuPath 菜单路径
     * @param menuId 菜单ID
     * @returns 结果
     */
    async checkUniqueParentIdByMenuPath(parentId, menuPath, menuId) {
        const sysMenu = new sys_menu_2.SysMenu();
        sysMenu.menuPath = menuPath;
        sysMenu.parentId = parentId;
        const uniqueId = await this.sysMenuRepository.checkUnique(sysMenu);
        if (uniqueId === menuId) {
            return true;
        }
        return uniqueId === 0;
    }
    /**
     * 根据用户ID查询权限标识
     * @param userId 用户ID
     * @returns 数量
     */
    async findPermsByUserId(userId) {
        return await this.sysMenuRepository.selectPermsByUserId(userId);
    }
    /**
     * 根据角色ID查询菜单树信息
     * @param roleId 角色ID
     * @returns 菜单ID数组
     */
    async findByRoleId(roleId) {
        const roles = await this.sysRoleRepository.selectByIds([roleId]);
        if (roles.length > 0) {
            const role = roles[0];
            if (role.roleId === roleId) {
                return await this.sysMenuRepository.selectByRoleId(role.roleId, role.menuCheckStrictly === '1');
            }
        }
        return [];
    }
    /**
     * 根据用户ID查询菜单树状嵌套
     * @param userId 用户ID
     * @returns 结果
     */
    async buildTreeMenusByUserId(userId) {
        const arr = await this.sysMenuRepository.selectTreeByUserId(userId);
        return this.parseDataToTree(arr);
    }
    /**
     * 根据用户ID查询菜单树状结构
     * @param sysMenu 信息
     * @param userId 用户ID
     * @returns 结果
     */
    async buildTreeSelectByUserId(sysMenu, userId) {
        const arr = await this.sysMenuRepository.select(sysMenu, userId);
        const treeArr = await this.parseDataToTree(arr);
        const tree = [];
        for (const item of treeArr) {
            tree.push((0, tree_select_1.sysMenuTreeSelect)(item));
        }
        return tree;
    }
    /**
     * 将数据解析为树结构，构建前端所需要下拉树结构
     * @param arr 菜单对象数组
     * @returns 数组
     */
    async parseDataToTree(arr) {
        // 节点分组
        const map = new Map();
        // 节点id
        const treeIds = [];
        // 树节点
        const tree = [];
        for (const item of arr) {
            const parentId = item.parentId;
            // 分组
            const mapItem = map.get(parentId) ?? [];
            mapItem.push(item);
            map.set(parentId, mapItem);
            // 记录节点id
            treeIds.push(item.menuId);
        }
        for (const [key, value] of map) {
            // 选择不是节点id的作为树节点
            if (!treeIds.includes(key)) {
                tree.push(...value);
            }
        }
        for (const iterator of tree) {
            componet(iterator);
        }
        /**闭包递归函数 */
        function componet(iterator) {
            const id = iterator.menuId;
            const item = map.get(id);
            if (item) {
                iterator.children = item;
            }
            if (iterator.children) {
                for (const v of iterator.children) {
                    componet(v);
                }
            }
        }
        return tree;
    }
    /**
     * 构建前端路由所需要的菜单
     * @param sysMenus 菜单数组
     * @param prefix 前缀字符
     * @returns
     */
    async buildRouteMenus(sysMenus, prefix = '') {
        const routers = [];
        for (const item of sysMenus) {
            const router = new router_1.Router();
            router.name = this.getRouteName(item);
            router.path = this.getRouterPath(item);
            router.component = this.getComponent(item);
            router.meta = this.getRouteMeta(item);
            router.children = [];
            router.redirect = '';
            // 子项菜单 目录类型 非路径链接
            const cMenus = item.children;
            if (Array.isArray(cMenus) &&
                cMenus.length > 0 &&
                item.menuType === menu_1.MENU_TYPE_DIR &&
                !(0, regular_1.validHttp)(item.menuPath)) {
                // 获取重定向地址
                const { redirectPrefix, redirectPath } = this.getRouteRedirect(cMenus, router.path, prefix);
                router.redirect = redirectPath;
                // 子菜单进入递归
                router.children = await this.buildRouteMenus(cMenus, redirectPrefix);
            }
            else if (item.parentId === 0 &&
                item.frameFlag === common_1.STATUS_YES &&
                item.menuType === menu_1.MENU_TYPE_MENU) {
                // 父菜单 内部跳转 菜单类型
                const menuPath = '/' + item.menuId;
                const childPath = menuPath + this.getRouterPath(item);
                const children = new router_1.Router();
                children.name = this.getRouteName(item);
                children.path = childPath;
                children.component = item.component;
                children.meta = this.getRouteMeta(item);
                router.meta.hideChildInMenu = true;
                router.children = [children];
                router.name = `${item.menuId}`;
                router.path = menuPath;
                router.redirect = childPath;
                router.component = menu_1.MENU_COMPONENT_LAYOUT_BASIC;
            }
            else if (item.parentId === 0 &&
                item.frameFlag === common_1.STATUS_YES &&
                (0, regular_1.validHttp)(item.menuPath)) {
                // 父菜单 内部跳转 路径链接
                const menuPath = '/' + item.menuId;
                const childPath = menuPath + this.getRouterPath(item);
                const children = new router_1.Router();
                children.name = this.getRouteName(item);
                children.path = childPath;
                children.component = menu_1.MENU_COMPONENT_LAYOUT_LINK;
                children.meta = this.getRouteMeta(item);
                router.meta.hideChildInMenu = true;
                router.children = [children];
                router.name = `${item.menuId}`;
                router.path = menuPath;
                router.redirect = childPath;
                router.component = menu_1.MENU_COMPONENT_LAYOUT_BASIC;
            }
            routers.push(router);
        }
        return routers;
    }
    /**
     * 获取路由名称
     *
     * 路径英文首字母大写
     *
     * @param sysMenu 菜单信息
     * @return 路由名称
     */
    getRouteName(sysMenu) {
        const routerName = (0, parse_1.ConvertToCamelCase)(sysMenu.menuPath);
        // 路径链接
        if ((0, regular_1.validHttp)(sysMenu.menuPath)) {
            return `${routerName.substring(0, 5)}Link${sysMenu.menuId}`;
        }
        // 拼上菜单ID防止name重名
        return routerName + '_' + sysMenu.menuId;
    }
    /**
     * 获取路由地址
     *
     * @param sysMenu 菜单信息
     * @return 路由地址
     */
    getRouterPath(sysMenu) {
        let routerPath = `${sysMenu.menuPath}`;
        // 显式路径
        if (!routerPath || routerPath.startsWith('/')) {
            return routerPath;
        }
        // 路径链接 内部跳转
        if ((0, regular_1.validHttp)(routerPath) && sysMenu.frameFlag === common_1.STATUS_YES) {
            routerPath = (0, regular_1.replace)('/^http(s)?://+/', routerPath, '');
            routerPath = Buffer.from(routerPath, 'utf8').toString('base64');
        }
        // 父菜单 内部跳转
        if (sysMenu.parentId === 0 && sysMenu.frameFlag === common_1.STATUS_YES) {
            routerPath = `/${routerPath}`;
        }
        return routerPath;
    }
    /**
     * 获取组件信息
     *
     * @param sysMenu 菜单信息
     * @return 组件信息
     */
    getComponent(sysMenu) {
        // 内部跳转 路径链接
        if (sysMenu.frameFlag === common_1.STATUS_YES && (0, regular_1.validHttp)(sysMenu.menuPath)) {
            return menu_1.MENU_COMPONENT_LAYOUT_LINK;
        }
        // 非父菜单 目录类型
        if (sysMenu.parentId > 0 && sysMenu.menuType === menu_1.MENU_TYPE_DIR) {
            return menu_1.MENU_COMPONENT_LAYOUT_BLANK;
        }
        // 组件路径 内部跳转 菜单类型
        if (sysMenu.component &&
            sysMenu.frameFlag === common_1.STATUS_YES &&
            sysMenu.menuType === menu_1.MENU_TYPE_MENU) {
            // 父菜单套外层布局
            if (sysMenu.parentId === 0) {
                return menu_1.MENU_COMPONENT_LAYOUT_BASIC;
            }
            return sysMenu.component;
        }
        return menu_1.MENU_COMPONENT_LAYOUT_BASIC;
    }
    /**
     * 获取路由元信息
     *
     * @param sysMenu 菜单信息
     * @return 元信息
     */
    getRouteMeta(sysMenu) {
        const meta = new router_1.RouterMeta();
        meta.icon = sysMenu.icon === '#' ? '' : sysMenu.icon;
        meta.title = sysMenu.menuName;
        meta.hideChildInMenu = false;
        meta.hideInMenu = sysMenu.visibleFlag === common_1.STATUS_NO;
        meta.cache = sysMenu.cacheFlag === common_1.STATUS_YES;
        meta.target = '';
        // 路径链接 非内部跳转
        if ((0, regular_1.validHttp)(sysMenu.menuPath) && sysMenu.frameFlag === common_1.STATUS_NO) {
            meta.target = '_blank';
        }
        return meta;
    }
    /**
     * 获取路由重定向地址（针对目录）
     *
     * @param cMenus 子菜单数组
     * @param routerPath 当期菜单路径
     * @param prefix 菜单重定向路径前缀
     * @return 重定向地址和前缀
     */
    getRouteRedirect(cMenus, routerPath, prefix) {
        let redirectPath = '';
        // 重定向为首个显示并启用的子菜单
        let firstChild = cMenus.find(item => item.frameFlag === common_1.STATUS_YES && item.visibleFlag === common_1.STATUS_YES);
        // 检查内嵌隐藏菜单是否可做重定向
        if (!firstChild) {
            firstChild = cMenus.find(item => item.frameFlag === common_1.STATUS_YES &&
                item.visibleFlag === common_1.STATUS_NO &&
                item.menuPath.includes(menu_1.MENU_PATH_INLINE));
        }
        if (firstChild) {
            const firstChildPath = this.getRouterPath(firstChild);
            if (firstChildPath.startsWith('/')) {
                redirectPath = firstChildPath;
            }
            else {
                // 拼接追加路径
                if (!routerPath.startsWith('/')) {
                    prefix += '/';
                }
                prefix = `${prefix}${routerPath}`;
                redirectPath = `${prefix}/${firstChildPath}`;
            }
        }
        return { redirectPrefix: prefix, redirectPath };
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_menu_1.SysMenuRepository)
], SysMenuService.prototype, "sysMenuRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_role_menu_1.SysRoleMenuRepository)
], SysMenuService.prototype, "sysRoleMenuRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_role_1.SysRoleRepository)
], SysMenuService.prototype, "sysRoleRepository", void 0);
exports.SysMenuService = SysMenuService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysMenuService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX21lbnUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zeXN0ZW0vc2VydmljZS9zeXNfbWVudS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBNEQ7QUFFNUQsNERBTzJDO0FBQzNDLHNFQUE4RTtBQUM5RSxnRUFBMEU7QUFDMUUsZ0VBQTRFO0FBQzVFLHlEQUF3RTtBQUN4RSwrQ0FBd0Q7QUFDeEQscURBQTJEO0FBQzNELCtEQUFvRTtBQUNwRSxxREFBMkQ7QUFDM0QsZ0RBQTRDO0FBRTVDLGNBQWM7QUFHUCxJQUFNLGNBQWMsNEJBQXBCLE1BQU0sY0FBYztJQUN6QixVQUFVO0lBRUYsaUJBQWlCLENBQW9CO0lBRTdDLGVBQWU7SUFFUCxxQkFBcUIsQ0FBd0I7SUFFckQsVUFBVTtJQUVGLGlCQUFpQixDQUFvQjtJQUU3Qzs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBZ0IsRUFBRSxNQUFjO1FBQ2hELE9BQU8sTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBYztRQUNsQyxJQUFJLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDZixPQUFPLElBQUksa0JBQU8sRUFBRSxDQUFDO1NBQ3RCO1FBQ0QsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNqRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3BCLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pCO1FBQ0QsT0FBTyxJQUFJLGtCQUFPLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtB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