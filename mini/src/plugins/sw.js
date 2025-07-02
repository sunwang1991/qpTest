export default {
	// 扫码
	scan() {
		return new Promise((resolve, reject) => {
			uni.scanCode({
				success: (res) => {
					resolve(res)
				},
				fail: (err) => {
					reject(err)
				}
			})
		})
	}
}