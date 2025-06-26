import { SysDept } from '../model/sys_dept';
/**部门表 数据层处理 */
export declare class SysDeptRepository {
    private db;
    /**
     * 查询集合
     *
     * @param sysDept 信息
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @return 列表
     */
    select(sysDept: SysDept, dataScopeSQL: string): Promise<SysDept[]>;
    /**
     * 通过ID查询
     *
     * @param deptId ID
     * @return 信息
     */
    selectById(deptId: number): Promise<SysDept>;
    /**
     * 新增
     *
     * @param sysDept 信息
     * @return ID
     */
    insert(sysDept: SysDept): Promise<number>;
    /**
     * 更新
     *
     * @param sysDept 信息
     * @return 影响记录数
     */
    update(sysDept: SysDept): Promise<number>;
    /**
     * 删除信息
     *
     * @param deptId ID
     * @return 影响记录数
     */
    deleteById(deptId: number): Promise<number>;
    /**
     * 检查信息是否唯一 返回数据ID
     * @param sysDept 信息
     * @returns
     */
    checkUnique(sysDept: SysDept): Promise<number>;
    /**
     * 存在子节点数量
     *
     * @param deptId ID
     * @return 数量
     */
    existChildrenByDeptId(deptId: number): Promise<number>;
    /**
     * 存在用户使用数量
     *
     * @param deptId ID
     * @return 数量
     */
    existUserByDeptId(deptId: number): Promise<number>;
    /**
     * 通过角色ID查询包含的部门ID
     *
     * @param roleId 角色ID
     * @param deptCheckStrictly 是否关联显示
     * @return 数量
     */
    selectDeptIdsByRoleId(roleId: number, deptCheckStrictly: boolean): Promise<number[]>;
    /**
     * 根据ID查询所有子部门
     *
     * @param deptId ID
     * @return 数量
     */
    selectChildrenDeptById(deptId: number): Promise<SysDept[]>;
    /**
     * 修改所在部门正常状态
     *
     * @param deptIds ID数组
     * @return 影响记录数
     */
    updateDeptStatusNormal(deptIds: number[]): Promise<number>;
    /**
     * 修改子元素关系
     *
     * @param arr 信息数组
     * @return 影响记录数
     */
    updateDeptChildren(arr: SysDept[]): Promise<number>;
}
