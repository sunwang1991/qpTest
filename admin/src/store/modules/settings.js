import defaultSettings from '@/settings';
import { useDynamicTitle } from '@/utils/dynamicTitle';
import cache from '@/plugins/cache';
import { CACHE_LOCAL_LAYOUTCONFIG } from '@/constants/cache-keys-constants';

const {
  sideTheme,
  showSettings,
  topNav,
  tagsView,
  fixedHeader,
  sidebarLogo,
  dynamicTitle,
} = defaultSettings;

const storageSetting = cache.local.getJSON(CACHE_LOCAL_LAYOUTCONFIG) || {};

const useSettingsStore = defineStore('settings', {
  state: () => ({
    title: '',
    theme: storageSetting.theme || '#409EFF',
    sideTheme: storageSetting.sideTheme || sideTheme,
    showSettings: showSettings,
    topNav:
      storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
    tagsView:
      storageSetting.tagsView === undefined
        ? tagsView
        : storageSetting.tagsView,
    fixedHeader:
      storageSetting.fixedHeader === undefined
        ? fixedHeader
        : storageSetting.fixedHeader,
    sidebarLogo:
      storageSetting.sidebarLogo === undefined
        ? sidebarLogo
        : storageSetting.sidebarLogo,
    dynamicTitle:
      storageSetting.dynamicTitle === undefined
        ? dynamicTitle
        : storageSetting.dynamicTitle,
  }),
  actions: {
    // 修改布局设置
    changeSetting(data) {
      const { key, value } = data;
      if (Reflect.has(this, key)) {
        this[key] = value;
      }
    },
    // 设置网页标题
    setTitle(title) {
      this.title = title;
      useDynamicTitle();
    },
  },
});

export default useSettingsStore;
