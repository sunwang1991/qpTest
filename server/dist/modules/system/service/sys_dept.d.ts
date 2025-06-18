import { TreeSelect } from '../model/vo/tree_select';
import { SysDept } from '../model/sys_dept';
/**部门管理 服务层处理 */
export declare class SysDeptService {
    /**部门服务 */
    private sysDeptRepository;
    /**角色服务 */
    private sysRoleDeptRepository;
    /**角色与部门关联服务 */
    private sysRoleRepository;
    /**
     * 查询数据
     * @param sysDept 信息
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @returns []
     */
    find(sysDept: SysDept, dataScopeSQL: string): Promise<SysDept[]>;
    /**
     * 根据ID查询信息
     * @param deptId ID
     * @returns 结果
     */
    findById(deptId: number): Promise<SysDept>;
    /**
     * 新增信息
     * @param sysDept 信息
     * @returns ID
     */
    insert(sysDept: SysDept): Promise<number>;
    /**
     * 修改信息
     * @param sysDept 信息
     * @returns 影响记录数
     */
    update(sysDept: SysDept): Promise<number>;
    /**
     * 修改所在部门正常状态
     * @param ancestors 祖级字符
     * @returns 影响记录数
     */
    private updateDeptStatusNormal;
    /**
     * 修改子元素关系
     * @param deptId 部门ID
     * @param newAncestors 新祖级字符
     * @param oldAncestors 旧祖级字符
     * @returns 影响记录数
     */
    private updateDeptChildren;
    /**
     * 删除信息
     * @param deptId 部门ID
     * @returns 影响记录数
     */
    deleteById(deptId: number): Promise<number>;
    /**
     * 根据角色ID查询包含的部门ID
     * @param roleId 角色ID
     * @returns 部门ID数组
     */
    findDeptIdsByRoleId(roleId: number): Promise<number[]>;
    /**
     * 部门下存在子节点数量
     * @param deptId 部门ID
     * @returns 数量
     */
    existChildrenByDeptId(deptId: number): Promise<number>;
    /**
     * 部门下存在用户数量
     * @param deptId 部门ID
     * @returns 数量
     */
    existUserByDeptId(deptId: number): Promise<number>;
    /**
     * 检查同级下部门名称唯一
     * @param parentId 父级部门ID
     * @param deptName 部门名称
     * @param deptId 部门ID
     * @returns 结果
     */
    checkUniqueParentIdByDeptName(parentId: number, deptName: string, deptId: number): Promise<boolean>;
    /**
     * 查询部门树状结构
     * @param sysDept 信息
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @returns 结果
     */
    buildTreeSelect(sysDept: SysDept, dataScopeSQL: string): Promise<TreeSelect[]>;
    /**
     * 将数据解析为树结构，构建前端所需要下拉树结构
     * @param arr 部门对象数组
     * @returns 数组
     */
    private parseDataToTree;
}
