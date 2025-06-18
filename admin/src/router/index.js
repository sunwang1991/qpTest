import {
  createWebHistory,
  createWebHashHistory,
  createRouter,
} from 'vue-router';
import { constantRoutes } from './routes';

// 根据.env配置获取是否带井号和基础路径
const hasHash = import.meta.env.VITE_HISTORY_HASH;
const bashUrl = import.meta.env.VITE_HISTORY_BASE_URL;
const historyType =
  hasHash === 'true'
    ? createWebHashHistory(bashUrl)
    : createWebHistory(bashUrl);

const router = createRouter({
  history: historyType,
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
