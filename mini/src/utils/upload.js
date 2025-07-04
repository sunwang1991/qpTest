import useUserStore from '@/stores/user.js';
import config from '@/config'
import {
	getToken
} from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import {
	toast,
	showConfirm,
	tansParams
} from '@/utils/common'
let timeout = 10000
const baseUrl = config.baseUrl

const upload = config => {
	// 是否需要设置 token
	const isToken = (config.headers || {}).isToken === false
	config.header = config.header || {}
	if (getToken() && !isToken) {
		config.header['satoken'] = getToken()
	}
	// get请求映射params参数
	if (config.params) {
		let url = config.url + '?' + tansParams(config.params)
		url = url.slice(0, -1)
		config.url = url
	}
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			timeout: config.timeout || timeout,
			url: config.url,
			filePath: config.filePath,
			name: config.name || 'file',
			header: config.header,
			formData: config.formData,
			success: (result) => {
				const code = result.statusCode || 200
				if (code == 204) {
					resolve(result)
				} else if (code == 401) {
					showConfirm("登录状态已过期，您可以继续留在该页面，或者重新登录?").then(res => {
						if (res.confirm) {
							useUserStore().LogOut().then(res => {
								uni.reLaunch({
									url: '/pages/login/login'
								})
							})
						}
					})
					reject('无效的会话，或者会话已过期，请重新登录。')
				} else if (code === 500) {
					// toast(msg)
					reject('500')
				} else if (code !== 200) {
					// toast(msg)
					reject(code)
				}
			},
			fail: (error) => {
				let {
					message
				} = error
				if (message == 'Network Error') {
					message = '后端接口连接异常'
				} else if (message.includes('timeout')) {
					message = '系统接口请求超时'
				} else if (message.includes('Request failed with status code')) {
					message = '系统接口' + message.substr(message.length - 3) + '异常'
				}
				toast(message)
				reject(error)
			}
		})
	})
}
export default upload