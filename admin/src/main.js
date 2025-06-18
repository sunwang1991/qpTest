import { createApp } from 'vue';
import App from './App';
import store from './store';
import router from './router';
import './permission'; // permission control

// 注册指令
import directive from './directive'; // directive

// 挂载全局方法函数
import plugins from './plugins'; // plugins
import { download } from '@/utils/request';
import { useDict } from '@/utils/dict';
import {
  parseTime,
  resetForm,
  addDateRange,
  handleTree,
  selectDictLabel,
  selectDictLabels,
} from '@/utils/ruoyi';

// 注册全局svg图标
import 'virtual:svg-icons-register';
import SvgIcon from '@/components/SvgIcon';
import elementIcons from '@/components/SvgIcon/svgicon';

// 全局样式
import '@/assets/styles/index.scss'; // global css

const app = createApp(App);
app.use(store);
app.use(router);

// 挂载全局方法函数
app.use(plugins);
app.config.globalProperties.useDict = useDict;
app.config.globalProperties.download = download;
app.config.globalProperties.parseTime = parseTime;
app.config.globalProperties.resetForm = resetForm;
app.config.globalProperties.handleTree = handleTree;
app.config.globalProperties.addDateRange = addDateRange;
app.config.globalProperties.selectDictLabel = selectDictLabel;
app.config.globalProperties.selectDictLabels = selectDictLabels;

// 注册全局svg图标
app.use(elementIcons);
app.component('svg-icon', SvgIcon);

// 注册指令
directive(app);

app.mount('#app');
