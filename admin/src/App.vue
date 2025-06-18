<template>
  <el-config-provider :locale="zhCn" :size="appStore.size">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.min.js';
import useAppStore from '@/store/modules/app';
import useSettingsStore from '@/store/modules/settings';
import { handleThemeStyle } from '@/utils/theme';
const appStore = useAppStore();

onMounted(() => {
  // 输出应用版本号
  console.info(
    `%c ${appStore.appName} %c ${appStore.appCode} - ${appStore.appVersion} `,
    'color: #fadfa3; background: #030307; padding: 4px 0;',
    'color: #030307; background: #fadfa3; padding: 4px 0;'
  );
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme);
  });
});
</script>
