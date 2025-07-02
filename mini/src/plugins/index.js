import tab from './tab'
import modal from './modal'
import request from './request'
import sw from './sw'

export default function installPlugins(app) {
	// 页签操作
	app.config.globalProperties.$tab = tab
	// 模态框对象
	app.config.globalProperties.$modal = modal
	//请求方法
	app.config.globalProperties.$request = request
	//公用方法
	app.config.globalProperties.$sw = sw
}