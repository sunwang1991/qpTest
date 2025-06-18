import useSettingsStore from '@/store/modules/settings'
import useAppStore from '@/store/modules/app';

/**
 * 动态修改标题
 */
export function useDynamicTitle() {
  const settingsStore = useSettingsStore();
  const appStore = useAppStore();
  if (settingsStore.dynamicTitle) {
    document.title = settingsStore.title + ' - ' + appStore.appName;
  } else {
    document.title = appStore.appName;
  }
}