import config from "@/config";
let timeout = 10000;
const baseUrl = config.baseUrl;

/**
 * 图片上传
 * @param {String} tempFilePath 图片临时路径
 * @param {String} type 图片类型
 * @returns {Promise}	
 */
const imgUpload = (tempFilePath,type) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${baseUrl}/file/upload`,
      filePath: tempFilePath,
      name: "file",
      formData: {
        subPath:type,
      },
      success: (res) => {
        const permanentUrl = baseUrl+JSON.parse(res.data).data.filePath;
        resolve(permanentUrl);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};
export default imgUpload;
