"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterMeta = exports.Router = void 0;
/**路由信息对象 */
class Router {
    /**路由名字 英文首字母大写 */
    name;
    /**路由地址 */
    path;
    /**其他元素 */
    meta;
    /**组件地址 */
    component;
    /**重定向地址 */
    redirect;
    /**子路由 */
    children;
}
exports.Router = Router;
/**路由元信息对象 */
class RouterMeta {
    /**设置该菜单在侧边栏和面包屑中展示的名字 */
    title;
    /**设置该菜单的图标 */
    icon;
    /**设置为true，则不会被 <keep-alive>缓存 */
    cache;
    /**内链地址（http(s)://开头）, 打开目标位置 '_blank' | '_self' | '' */
    target;
    /**在菜单中隐藏子节点 */
    hideChildInMenu;
    /**在菜单中隐藏自己和子节点 */
    hideInMenu;
}
exports.RouterMeta = RouterMeta;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvc3lzdGVtL21vZGVsL3ZvL3JvdXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxZQUFZO0FBQ1osTUFBYSxNQUFNO0lBQ2pCLGtCQUFrQjtJQUNsQixJQUFJLENBQVM7SUFFYixVQUFVO0lBQ1YsSUFBSSxDQUFTO0lBRWIsVUFBVTtJQUNWLElBQUksQ0FBYTtJQUVqQixVQUFVO0lBQ1YsU0FBUyxDQUFTO0lBRWxCLFdBQVc7SUFDWCxRQUFRLENBQVM7SUFFakIsU0FBUztJQUNULFFBQVEsQ0FBVztDQUNwQjtBQWxCRCx3QkFrQkM7QUFFRCxhQUFhO0FBQ2IsTUFBYSxVQUFVO0lBQ3JCLHlCQUF5QjtJQUN6QixLQUFLLENBQVM7SUFFZCxjQUFjO0lBQ2QsSUFBSSxDQUFTO0lBRWIsaUNBQWlDO0lBQ2pDLEtBQUssQ0FBVztJQUVoQix3REFBd0Q7SUFDeEQsTUFBTSxDQUFVO0lBRWhCLGVBQWU7SUFDZixlQUFlLENBQVc7SUFFMUIsa0JBQWtCO0lBQ2xCLFVBQVUsQ0FBVztDQUN0QjtBQWxCRCxnQ0FrQkMifQ==