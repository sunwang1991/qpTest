import axios from 'axios';
import { ElNotification, ElMessage, ElLoading } from 'element-plus';
import {
  getAccessToken,
  setAccessToken,
  delAccessToken,
  getRefreshToken,
  setRefreshToken,
  delRefreshToken,
} from '@/utils/auth';
import errorCode, {
  RESULT_CODE_ERROR,
  RESULT_CODE_SUCCESS,
  RESULT_CODE_ACCESS,
  RESULT_CODE_EXPIRED,
} from '@/utils/errorCode';
import { tansParams, blobValidate } from '@/utils/ruoyi';
import cache from '@/plugins/cache';
import { TOKEN_KEY, TOKEN_KEY_PREFIX } from '@/constants/token-constants';
import { CACHE_SESSION_AXIOS } from '@/constants/cache-keys-constants';
import {
  APP_REQUEST_HEADER_CODE,
  APP_REQUEST_HEADER_VERSION,
} from '@/constants/app-constants';
import { saveAs } from 'file-saver';
import { refreshToken } from '@/api/auth';

let downloadLoadingInstance;
// 是否显示重新登录
export let isRelogin = { show: false };

axios.defaults.headers = {
  [APP_REQUEST_HEADER_CODE]: import.meta.env.VITE_APP_CODE,
  [APP_REQUEST_HEADER_VERSION]: import.meta.env.VITE_APP_VERSION,
  'Content-Type': 'application/json;charset=utf-8',
};

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时
  timeout: 10_000,
});

// request拦截器
service.interceptors.request.use(
  config => {
    // 使用apifoxmock.com时开启
    if (import.meta.env.DEV || url?.includes('apifoxmock.com')) {
      config.headers['apifoxToken'] = '0KoMW8oFm5ruPw8HtaAlcQZP2YsZkbS1';
    }

    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
    const accessToken = getAccessToken();
    if (accessToken && !isToken) {
      config.headers[TOKEN_KEY] = TOKEN_KEY_PREFIX + ' ' + accessToken; // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // get请求映射params参数
    if (config.params && Object.keys(config.params).length > 0) {
      let url = config.url + '?' + tansParams(config.params);
      config.params = {};
      config.url = url;
    }
    // 非get参数提交
    if (
      !isRepeatSubmit &&
      !(config.data instanceof FormData) &&
      ['post', 'put'].includes(config.method)
    ) {
      const requestObj = {
        url: config.url,
        data: JSON.stringify(config.data) || '',
        time: new Date().getTime(),
      };
      const sessionObj = cache.session.getJSON(CACHE_SESSION_AXIOS);
      if (sessionObj) {
        const { url, data, time } = sessionObj;
        const interval = 3 * 1000; // 间隔时间(ms)，小于此时间视为重复提交
        if (
          requestObj.url === url &&
          requestObj.data === data &&
          requestObj.time - time < interval
        ) {
          const message = '数据正在处理，请勿重复提交';
          console.warn(`[${url}]: ` + message);
          return Promise.reject(new Error(message));
        } else {
          cache.session.setJSON(CACHE_SESSION_AXIOS, requestObj);
        }
      } else {
        cache.session.setJSON(CACHE_SESSION_AXIOS, requestObj);
      }
    }

    return config;
  },
  error => {
    console.log(error);
    Promise.reject(error);
  }
);

// 登录身份失效401
async function error401(config) {
  const result = await refreshToken(getRefreshToken());
  // 更新访问令牌和刷新令牌
  if (result.code === RESULT_CODE_SUCCESS) {
    setAccessToken(result.data.accessToken, result.data.refreshExpiresIn);
    setRefreshToken(result.data.refreshToken, result.data.refreshExpiresIn);
    const res = await service(config);
    return Promise.resolve(res);
  } else {
    delAccessToken();
    delRefreshToken();
    window.location.reload();
  }
  return Promise.reject('无效的会话，或者会话已过期，请重新登录。');
}

// 响应拦截器
service.interceptors.response.use(
  async res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default'];
    // 二进制数据则直接返回
    if (
      res.request.responseType === 'blob' ||
      res.request.responseType === 'arraybuffer'
    ) {
      if (res.data.type.endsWith('json')) {
        const resText = await res.data.text();
        return JSON.parse(resText);
      }
      return res;
    }
    if (code === RESULT_CODE_ACCESS) {
      return await error401(res.config);
    } else if (code === RESULT_CODE_EXPIRED) {
      ElMessage({ message: msg, type: 'error' });
      return Promise.reject(new Error(msg));
    } else if (code === RESULT_CODE_ERROR) {
      ElMessage({ message: msg, type: 'warning' });
      return Promise.reject(new Error(msg));
    } else if (code !== RESULT_CODE_SUCCESS) {
      ElNotification.error({ title: msg });
      return Promise.reject('error');
    } else {
      return Promise.resolve(res.data);
    }
  },
  async error => {
    let { message } = error;
    if (message.endsWith('code 401')) {
      return error401(error.config);
    }
    if (message.endsWith('code 400')) {
      const resq = error.response?.data;
      if (resq instanceof Blob && resq?.type.endsWith('json')) {
        const resText = await error.response.data.text();
        return JSON.parse(resText);
      }
      return resq;
    }
    if (message == 'Network Error') {
      message = '后端接口连接异常';
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时';
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常';
    }
    ElMessage({ message: message, type: 'error', duration: 5 * 1000 });
    return Promise.reject(error);
  }
);

// 通用下载方法
export function download(url, params, filename, config) {
  downloadLoadingInstance = ElLoading.service({
    text: '正在下载数据，请稍候',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const headers = { 'Content-Type': 'application/octet-stream' };
  // 使用apifoxmock.com时开启
  if (import.meta.env.DEV || url?.includes('apifoxmock.com')) {
    headers['apifoxToken'] = '0KoMW8oFm5ruPw8HtaAlcQZP2YsZkbS1';
  }
  url = url + '?' + tansParams(params);
  return service
    .get(url, {
      headers,
      responseType: 'blob',
      ...config,
    })
    .then(async res => {
      const isBlob = blobValidate(res.data);
      if (res.data instanceof Blob && isBlob) {
        saveAs(res.data, filename);
      } else {
        const resText = await res.data.text();
        const rspObj = JSON.parse(resText);
        const errMsg =
          errorCode[rspObj.code] || rspObj.msg || errorCode['default'];
        ElMessage.error(errMsg);
      }
      downloadLoadingInstance.close();
    })
    .catch(r => {
      console.error(r);
      ElMessage.error('下载文件出现错误，请联系管理员！');
      downloadLoadingInstance.close();
    });
}

export default service;
