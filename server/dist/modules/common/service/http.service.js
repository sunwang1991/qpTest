"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpService = void 0;
const decorator_1 = require("@midwayjs/decorator");
const axios_1 = require("axios");
const axios_instance = axios_1.default.create({
    baseURL: '',
    timeout: 120000,
});
axios_instance.interceptors.response.use(result => {
    const { data } = result;
    return data;
}, error => {
    console.error('加载失败');
    return Promise.reject(error);
});
function getParamsStr(params) {
    if (!params) {
        return '';
    }
    const keys = Object.keys(params);
    if (!keys.length) {
        return '';
    }
    const params_str = keys
        .map(key => {
        return `${key}=${params[key]}`;
    })
        .join('&');
    return params_str;
}
let HttpService = exports.HttpService = class HttpService {
    async get(url, params) {
        const params_str = getParamsStr(params);
        let fullUrl = url;
        if (params_str) {
            if (url.indexOf('?') > -1) {
                fullUrl += '&' + params_str;
            }
            else {
                fullUrl += '?' + params_str;
            }
        }
        return axios_instance.get(fullUrl);
    }
    async del(url, params) {
        return axios_instance.delete(url, {
            data: params,
        });
    }
    async post(url, params) {
        return axios_instance.post(url, params);
    }
};
exports.HttpService = HttpService = __decorate([
    (0, decorator_1.Provide)()
], HttpService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvY29tbW9uL3NlcnZpY2UvaHR0cC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLG1EQUE4QztBQUM5QyxpQ0FBMEI7QUFDMUIsTUFBTSxjQUFjLEdBQUcsZUFBSyxDQUFDLE1BQU0sQ0FBQztJQUNsQyxPQUFPLEVBQUUsRUFBRTtJQUNYLE9BQU8sRUFBRSxNQUFNO0NBQ2hCLENBQUMsQ0FBQztBQUVILGNBQWMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FDdEMsTUFBTSxDQUFDLEVBQUU7SUFDUCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDO0lBQ3hCLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxFQUNELEtBQUssQ0FBQyxFQUFFO0lBQ04sT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUNGLENBQUM7QUFFRixTQUFTLFlBQVksQ0FBQyxNQUFXO0lBQy9CLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDWCxPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQ0QsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNoQixPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQ0QsTUFBTSxVQUFVLEdBQUcsSUFBSTtTQUNwQixHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDVCxPQUFPLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0lBQ2pDLENBQUMsQ0FBQztTQUNELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNiLE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUM7QUFHTSxJQUFNLFdBQVcseUJBQWpCLE1BQU0sV0FBVztJQUN0QixLQUFLLENBQUMsR0FBRyxDQUFDLEdBQVcsRUFBRSxNQUFXO1FBQ2hDLE1BQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDbEIsSUFBSSxVQUFVLEVBQUU7WUFDZCxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3pCLE9BQU8sSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDO2FBQzdCO2lCQUFNO2dCQUNMLE9BQU8sSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDO2FBQzdCO1NBQ0Y7UUFDRCxPQUFPLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBVyxFQUFFLE1BQVc7UUFDaEMsT0FBTyxjQUFjLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNoQyxJQUFJLEVBQUUsTUFBTTtTQUNiLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQVcsRUFBRSxNQUFXO1FBQ2pDLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUMsQ0FBQztDQUNGLENBQUE7c0JBdkJZLFdBQVc7SUFEdkIsSUFBQSxtQkFBTyxHQUFFO0dBQ0csV0FBVyxDQXVCdkIifQ==