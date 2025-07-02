<script setup>
	import {
		onLaunch
	} from '@dcloudio/uni-app'
	import { getCurrentInstance } from 'vue'
	const { proxy } = getCurrentInstance();
	
	onLaunch(() => {
		
	})

	// function initApp() {
	// 	if (!uni.getStorageSync('userId')) login()
	// }

	// function login() {
	// 	uni.login({
	// 		provider: 'weixin',
	// 		success: (res) => {
	// 			proxy.$request('mini/user/login',{
	// 				code: res.code
	// 			}).then((res) => {
	// 				uni.setStorageSync('userId',res.data.id)
	// 			})
	// 		},
	// 	})
	// }
</script>

<style lang="scss">
	/*每个页面公共css */
	@use '@/static/scss/index.scss';
</style>