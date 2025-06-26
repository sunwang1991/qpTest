import { Resp } from '../../../framework/resp/api';
import { SysDept } from '../model/sys_dept';
/**部门信息 控制层处理 */
export declare class SysDeptController {
    /**上下文 */
    private c;
    /**部门服务 */
    private sysDeptService;
    /**部门列表 */
    list(deptId: number, parentId: number, deptName: string, statusFlag: string): Promise<Resp>;
    /**部门信息 */
    info(deptId: number): Promise<Resp>;
    /**部门新增 */
    add(body: SysDept): Promise<Resp>;
    /**部门修改 */
    edit(body: SysDept): Promise<Resp>;
    /**部门删除 */
    remove(deptId: number): Promise<Resp>;
    /**部门列表（排除节点） */
    excludeChild(deptId: number): Promise<Resp>;
    /**部门树结构列表 */
    tree(deptId: number, parentId: number, deptName: string, statusFlag: string): Promise<Resp>;
    /**部门树结构列表（指定角色） */
    treeRole(roleId: number): Promise<Resp>;
}
