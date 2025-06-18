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
exports.SysDeptService = void 0;
const core_1 = require("@midwayjs/core");
const tree_select_1 = require("../model/vo/tree_select");
const common_1 = require("../../../framework/constants/common");
const parse_1 = require("../../../framework/utils/parse/parse");
const sys_role_dept_1 = require("../repository/sys_role_dept");
const sys_dept_1 = require("../repository/sys_dept");
const sys_role_1 = require("../repository/sys_role");
const sys_dept_2 = require("../model/sys_dept");
/**部门管理 服务层处理 */
let SysDeptService = exports.SysDeptService = class SysDeptService {
    /**部门服务 */
    sysDeptRepository;
    /**角色服务 */
    sysRoleDeptRepository;
    /**角色与部门关联服务 */
    sysRoleRepository;
    /**
     * 查询数据
     * @param sysDept 信息
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @returns []
     */
    async find(sysDept, dataScopeSQL) {
        return await this.sysDeptRepository.select(sysDept, dataScopeSQL);
    }
    /**
     * 根据ID查询信息
     * @param deptId ID
     * @returns 结果
     */
    async findById(deptId) {
        return await this.sysDeptRepository.selectById(deptId);
    }
    /**
     * 新增信息
     * @param sysDept 信息
     * @returns ID
     */
    async insert(sysDept) {
        return await this.sysDeptRepository.insert(sysDept);
    }
    /**
     * 修改信息
     * @param sysDept 信息
     * @returns 影响记录数
     */
    async update(sysDept) {
        const dept = await this.sysDeptRepository.selectById(sysDept.deptId);
        const parentDept = await this.sysDeptRepository.selectById(sysDept.parentId);
        // 上级与当前部门祖级列表更新
        if (parentDept.deptId === sysDept.parentId &&
            dept.deptId === sysDept.deptId) {
            const newAncestors = `${parentDept.ancestors},${parentDept.deptId}`;
            const oldAncestors = dept.ancestors;
            // 祖级列表不一致时更新
            if (newAncestors !== oldAncestors) {
                dept.ancestors = newAncestors;
                await this.updateDeptChildren(dept.deptId, newAncestors, oldAncestors);
            }
        }
        // 如果该部门是启用状态，则启用该部门的所有上级部门
        if (sysDept.statusFlag === common_1.STATUS_YES &&
            parentDept.statusFlag === common_1.STATUS_NO) {
            await this.updateDeptStatusNormal(sysDept.ancestors);
        }
        return await this.sysDeptRepository.update(sysDept);
    }
    /**
     * 修改所在部门正常状态
     * @param ancestors 祖级字符
     * @returns 影响记录数
     */
    async updateDeptStatusNormal(ancestors) {
        if (!ancestors || ancestors === '0') {
            return 0;
        }
        const deptIds = [];
        for (const v of ancestors.split(',')) {
            deptIds.push((0, parse_1.parseNumber)(v));
        }
        return await this.sysDeptRepository.updateDeptStatusNormal(deptIds);
    }
    /**
     * 修改子元素关系
     * @param deptId 部门ID
     * @param newAncestors 新祖级字符
     * @param oldAncestors 旧祖级字符
     * @returns 影响记录数
     */
    async updateDeptChildren(deptId, newAncestors, oldAncestors) {
        let arr = await this.sysDeptRepository.selectChildrenDeptById(deptId);
        if (arr.length === 0) {
            return 0;
        }
        // 替换父ID
        arr = arr.map(item => {
            item.ancestors = item.ancestors.replace(oldAncestors, newAncestors);
            return item;
        });
        return await this.sysDeptRepository.updateDeptChildren(arr);
    }
    /**
     * 删除信息
     * @param deptId 部门ID
     * @returns 影响记录数
     */
    async deleteById(deptId) {
        await this.sysRoleDeptRepository.deleteByDeptIds([deptId]); // 删除角色与部门关联
        return await this.sysDeptRepository.deleteById(deptId);
    }
    /**
     * 根据角色ID查询包含的部门ID
     * @param roleId 角色ID
     * @returns 部门ID数组
     */
    async findDeptIdsByRoleId(roleId) {
        const roles = await this.sysRoleRepository.selectByIds([roleId]);
        if (roles.length > 0) {
            const role = roles[0];
            if (role.roleId === roleId) {
                return await this.sysDeptRepository.selectDeptIdsByRoleId(role.roleId, role.deptCheckStrictly === '1');
            }
        }
        return [];
    }
    /**
     * 部门下存在子节点数量
     * @param deptId 部门ID
     * @returns 数量
     */
    async existChildrenByDeptId(deptId) {
        return await this.sysDeptRepository.existChildrenByDeptId(deptId);
    }
    /**
     * 部门下存在用户数量
     * @param deptId 部门ID
     * @returns 数量
     */
    async existUserByDeptId(deptId) {
        return await this.sysDeptRepository.existUserByDeptId(deptId);
    }
    /**
     * 检查同级下部门名称唯一
     * @param parentId 父级部门ID
     * @param deptName 部门名称
     * @param deptId 部门ID
     * @returns 结果
     */
    async checkUniqueParentIdByDeptName(parentId, deptName, deptId) {
        const sysDept = new sys_dept_2.SysDept();
        sysDept.deptName = deptName;
        sysDept.parentId = parentId;
        const uniqueId = await this.sysDeptRepository.checkUnique(sysDept);
        if (uniqueId === deptId) {
            return true;
        }
        return uniqueId === 0;
    }
    /**
     * 查询部门树状结构
     * @param sysDept 信息
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @returns 结果
     */
    async buildTreeSelect(sysDept, dataScopeSQL) {
        const arr = await this.sysDeptRepository.select(sysDept, dataScopeSQL);
        const treeArr = await this.parseDataToTree(arr);
        const tree = [];
        for (const item of treeArr) {
            tree.push((0, tree_select_1.sysDeptTreeSelect)(item));
        }
        return tree;
    }
    /**
     * 将数据解析为树结构，构建前端所需要下拉树结构
     * @param arr 部门对象数组
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
            treeIds.push(item.deptId);
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
            const id = iterator.deptId;
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
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_dept_1.SysDeptRepository)
], SysDeptService.prototype, "sysDeptRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_role_dept_1.SysRoleDeptRepository)
], SysDeptService.prototype, "sysRoleDeptRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_role_1.SysRoleRepository)
], SysDeptService.prototype, "sysRoleRepository", void 0);
exports.SysDeptService = SysDeptService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysDeptService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2RlcHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zeXN0ZW0vc2VydmljZS9zeXNfZGVwdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBNEQ7QUFFNUQseURBQXdFO0FBQ3hFLGdFQUE0RTtBQUM1RSxnRUFBbUU7QUFDbkUsK0RBQW9FO0FBQ3BFLHFEQUEyRDtBQUMzRCxxREFBMkQ7QUFDM0QsZ0RBQTRDO0FBRTVDLGdCQUFnQjtBQUdULElBQU0sY0FBYyw0QkFBcEIsTUFBTSxjQUFjO0lBQ3pCLFVBQVU7SUFFRixpQkFBaUIsQ0FBb0I7SUFFN0MsVUFBVTtJQUVGLHFCQUFxQixDQUF3QjtJQUVyRCxlQUFlO0lBRVAsaUJBQWlCLENBQW9CO0lBRTdDOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLElBQUksQ0FDZixPQUFnQixFQUNoQixZQUFvQjtRQUVwQixPQUFPLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQWM7UUFDbEMsT0FBTyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQWdCO1FBQ2xDLE9BQU8sTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFnQjtRQUNsQyxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JFLE1BQU0s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