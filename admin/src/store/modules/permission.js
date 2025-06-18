import auth from '@/plugins/auth';
import { constantRoutes } from '@/router/routes';
import { getRouters } from '@/api/auth';
import { isHttp } from '@/utils/validate';
import Layout from '@/layout/index';
import ParentView from '@/components/ParentView';
import InnerLink from '@/layout/components/InnerLink';
import {
  MENU_COMPONENT_LAYOUT_BASIC,
  MENU_COMPONENT_LAYOUT_BLANK,
  MENU_COMPONENT_LAYOUT_LINK,
} from '@/constants/menu-constants';

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue');

const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: [],
  }),
  actions: {
    setRoutes(routes) {
      this.addRoutes = routes;
      this.routes = constantRoutes.concat(routes);
    },
    setDefaultRoutes(routes) {
      this.defaultRoutes = constantRoutes.concat(routes);
    },
    setTopbarRoutes(routes) {
      this.topbarRouters = routes;
    },
    setSidebarRouters(routes) {
      this.sidebarRouters = routes;
    },
    generateRoutes(roles) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then(res => {
          const sdata = JSON.parse(JSON.stringify(res.data));
          const rdata = JSON.parse(JSON.stringify(res.data));
          const defaultData = JSON.parse(JSON.stringify(res.data));
          const sidebarRoutes = filterAsyncRouter(sdata);
          const rewriteRoutes = filterAsyncRouter(rdata, false, true);
          const defaultRoutes = filterAsyncRouter(defaultData);
          // const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
          // asyncRoutes.forEach(route => {
          //   router.addRoute(route);
          // });
          this.setRoutes(rewriteRoutes);
          this.setSidebarRouters(constantRoutes.concat(sidebarRoutes));
          this.setDefaultRoutes(sidebarRoutes);
          this.setTopbarRoutes(defaultRoutes);
          resolve(rewriteRoutes);
        });
      });
    },
  },
});

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children);
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === MENU_COMPONENT_LAYOUT_BASIC) {
        // 网络地址处理
        if (isHttp(route.path)) {
          route.component = InnerLink;
          route.meta.link = route.path;
        } else {
          // 目录菜单处理
          route.component = Layout;
          // 菜单中隐藏子节点不显示
          const hideChildInMenu = route.meta?.hideChildInMenu || false;
          if (hideChildInMenu) {
            route.alwaysShow = false;
            route.meta.activeMenu = route.path;
          } else {
            route.alwaysShow = true;
            route.redirect = 'noRedirect';
          }
        }
      } else if (route.component === MENU_COMPONENT_LAYOUT_BLANK) {
        route.component = ParentView;
      } else if (route.component === MENU_COMPONENT_LAYOUT_LINK) {
        route.component = InnerLink;
        route.meta.link = route.path;
      } else {
        route.component = loadView(route.component);
      }
    }

    // 元数据属性处理
    const hideInMenu = route.meta?.hideInMenu || false;
    route.hidden = hideInMenu;
    const cache = route.meta?.cache || false;
    route.meta.noCache = !cache;
    let metaIcon = route.meta?.icon || '';
    if (!metaIcon.startsWith('icon-')) {
      route.meta.icon = metaIcon; // 图标组件
    }

    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type);
    } else {
      delete route['children'];
      delete route['redirect'];
    }
    return true;
  });
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = [];
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === MENU_COMPONENT_LAYOUT_BLANK && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path;
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path;
    }
    children = children.concat(el);
  });
  return children;
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = [];
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route);
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route);
      }
    }
  });
  return res;
}

export const loadView = view => {
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0];
    if (dir === view) {
      return () => modules[path]();
    }
  }
  return () => import('@/views/error/404');
};

export default usePermissionStore;
