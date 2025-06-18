"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sysDeptTreeSelect = exports.sysMenuTreeSelect = exports.TreeSelect = void 0;
/**树结构实体类 */
class TreeSelect {
    /**节点ID */
    id;
    /**节点名称 */
    label;
    /**子节点 */
    children;
}
exports.TreeSelect = TreeSelect;
/**
 * 使用给定的 SysMenu 对象解析为 TreeSelect 对象
 * @param sysMenu 对象
 * @returns 结果
 */
function sysMenuTreeSelect(sysMenu) {
    const t = new TreeSelect();
    t.id = sysMenu.menuId;
    t.label = sysMenu.menuName;
    t.children = [];
    if (Array.isArray(sysMenu.children) && sysMenu.children.length > 0) {
        for (const menu of sysMenu.children) {
            const child = sysMenuTreeSelect(menu);
            t.children.push(child);
        }
    }
    return t;
}
exports.sysMenuTreeSelect = sysMenuTreeSelect;
/**
 * 使用给定的 SysDept 对象解析为 TreeSelect 对象
 * @param sysDept 对象
 * @returns 结果
 */
function sysDeptTreeSelect(sysDept) {
    const t = new TreeSelect();
    t.id = sysDept.deptId;
    t.label = sysDept.deptName;
    t.children = [];
    if (Array.isArray(sysDept.children) && sysDept.children.length > 0) {
        for (const dept of sysDept.children) {
            const child = sysDeptTreeSelect(dept);
            t.children.push(child);
        }
    }
    return t;
}
exports.sysDeptTreeSelect = sysDeptTreeSelect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZV9zZWxlY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zeXN0ZW0vbW9kZWwvdm8vdHJlZV9zZWxlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR0EsWUFBWTtBQUNaLE1BQWEsVUFBVTtJQUNyQixVQUFVO0lBQ1YsRUFBRSxDQUFTO0lBRVgsVUFBVTtJQUNWLEtBQUssQ0FBUztJQUVkLFNBQVM7SUFDVCxRQUFRLENBQWU7Q0FDeEI7QUFURCxnQ0FTQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixpQkFBaUIsQ0FBQyxPQUFnQjtJQUNoRCxNQUFNLENBQUMsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0lBQzNCLENBQUMsQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUN0QixDQUFDLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7SUFDM0IsQ0FBQyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDaEIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDbEUsS0FBSyxNQUFNLElBQUksSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO1lBQ25DLE1BQU0sS0FBSyxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3hCO0tBQ0Y7SUFDRCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFaRCw4Q0FZQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixpQkFBaUIsQ0FBQyxPQUFnQjtJQUNoRCxNQUFNLENBQUMsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0lBQzNCLENBQUMsQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUN0QixDQUFDLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7SUFDM0IsQ0FBQyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDaEIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDbEUsS0FBSyxNQUFNLElBQUksSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO1lBQ25DLE1BQU0sS0FBSyxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3hCO0tBQ0Y7SUFDRCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFaRCw4Q0FZQyJ9