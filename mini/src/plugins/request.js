import config from "@/config";
import { toast, tansParams } from "@/utils/common";

const baseUrl = config.baseUrl;

const request = (url, data, method = "post") => {
  // get请求映射params参数
  if (method == "get") {
    let fullUrl = url + "?" + tansParams(data);
    fullUrl = fullUrl.slice(0, -1);
    url = fullUrl;
  }

  return new Promise((resolve, reject) => {
    uni
      .request({
        method: method,
        url: baseUrl + "/" + url,
        data: data,
        dataType: "json",
      })
      .then((response) => {
        const { data } = response;
        const code = data.code;
        if (code === 200001) {
          resolve(data);
        } else {
          reject(data.msg);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export default request;
