<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="tagsViewStore.cachedViews">
          <component
            v-if="!route.meta.link"
            :is="fnComponentSetName(Component, route)"
            :key="route.path"
          />
        </keep-alive>
      </transition>
    </router-view>
    <iframe-toggle />
  </section>
</template>

<script setup>
import iframeToggle from './IframeToggle/index';
import useTagsViewStore from '@/store/modules/tagsView';

const tagsViewStore = useTagsViewStore();

/**
 * 给页面组件设置路由名称
 *
 * 路由名称设为缓存key
 * @param component 页面组件
 * @param name 路由名称
 */
function fnComponentSetName(component, to) {
  if (component && component.type) {
    // 通过路由取最后匹配的，确认是缓存的才处理
    const matched = to.matched.concat();
    const lastRoute = matched[matched.length - 1];
    if (!lastRoute.meta.cache) return component;
    const routeName = lastRoute.name;
    const routeDef = lastRoute.components.default;
    // 有命名但不是跳转的路由文件
    const __name = component.type.__name;
    if (__name && __name !== routeName) {
      routeDef.name = routeName;
      routeDef.__name = routeName;
      Reflect.set(component, 'type', routeDef);
      return component;
    }
  }
  return component;
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 6px;
  }
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 3px;
}
</style>
