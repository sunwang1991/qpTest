import { SysDept } from '../sys_dept';
import { SysMenu } from '../sys_menu';
/**树结构实体类 */
export declare class TreeSelect {
    /**节点ID */
    id: number;
    /**节点名称 */
    label: string;
    /**子节点 */
    children: TreeSelect[];
}
/**
 * 使用给定的 SysMenu 对象解析为 TreeSelect 对象
 * @param sysMenu 对象
 * @returns 结果
 */
export declare function sysMenuTreeSelect(sysMenu: SysMenu): TreeSelect;
/**
 * 使用给定的 SysDept 对象解析为 TreeSelect 对象
 * @param sysDept 对象
 * @returns 结果
 */
export declare function sysDeptTreeSelect(sysDept: SysDept): TreeSelect;
