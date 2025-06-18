import axios from 'axios';
import { ElMessage } from 'element-plus';
import { saveAs } from 'file-saver';
import { getAccessToken } from '@/utils/auth';
import { TOKEN_KEY, TOKEN_KEY_PREFIX } from '@/constants/token-constants';
import errorCode from '@/utils/errorCode';
import { blobValidate } from '@/utils/ruoyi';
import { encode } from 'js-base64';

const baseURL = import.meta.env.VITE_APP_BASE_API;

export default {
  resource(resource) {
    var url = baseURL + '/file/download/' + encode(resource);
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { [TOKEN_KEY]: TOKEN_KEY_PREFIX + ' ' + getAccessToken() },
    }).then(res => {
      const isBlob = blobValidate(res.data);
      if (isBlob) {
        const blob = new Blob([res.data]);
        this.saveAs(blob, decodeURIComponent(res.headers['download-filename']));
      } else {
        this.printErrMsg(res.data);
      }
    });
  },
  zip(url, name) {
    var url = baseURL + url;
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { [TOKEN_KEY]: TOKEN_KEY_PREFIX + ' ' + getAccessToken() },
    }).then(res => {
      const isBlob = blobValidate(res.data);
      if (isBlob) {
        const blob = new Blob([res.data], { type: 'application/zip' });
        this.saveAs(blob, name);
      } else {
        this.printErrMsg(res.data);
      }
    });
  },
  saveAs(text, name, opts) {
    saveAs(text, name, opts);
  },
  async printErrMsg(data) {
    const resText = await data.text();
    const rspObj = JSON.parse(resText);
    const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default'];
    ElMessage.error(errMsg);
  },
};
