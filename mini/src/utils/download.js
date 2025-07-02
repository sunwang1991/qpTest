function saveImageToPhotosAlbum(url) {
	let base64 = url.replace(/^data:image\/\w+;base64,/, ""); //去掉data:image/png;base64,
	let filePath = wx.env.USER_DATA_PATH + '/qrImg.png';
	return new Promise((resolve, reject) => {
		uni.getFileSystemManager().writeFile({
			filePath: filePath, //创建一个临时文件名
			data: base64, //写入的文本或二进制数据
			encoding: 'base64', //写入当前文件的字符编码
			success: res => {
				uni.saveImageToPhotosAlbum({
					filePath: filePath,
					success: function(res2) {
						resolve(res2)
					},
					fail: function(err) {
						reject(err)
					}
				})
			},
			fail: err => {
				reject(err)
			}
		})
	})
}

export function base64DownLoad(url) {
	return new Promise((resolve, reject) => {
		uni.getSetting({ //获取用户的当前设置
			success: (res) => {
				if (res.authSetting['scope.writePhotosAlbum']) { //验证用户是否授权可以访问相册
					saveImageToPhotosAlbum(url).then(res => {
						resolve(res)
					}).catch(err => {
						reject(err)
					})
				} else {
					uni.authorize({ //如果没有授权，向用户发起请求
						scope: 'scope.writePhotosAlbum',
						success: () => {
							saveImageToPhotosAlbum(url).then(res => {
								resolve(res)
							}).catch(err => {
								reject(err)
							})
						},
						fail: (err) => {
							uni.showModal({
								title: '提示',
								content: '您未开启保存图片到相册的权限，请点击确定去开启权限！',
								success(res) {
									if (res.confirm) {
										uni.openSetting()
									}
								}
							})
							reject(err)
						}
					})
				}
			}
		})
	})
}

export function imgDownLoad(url) {
	return new Promise((resolve, reject) => {
		uni.getSetting({
			success: function(res) {
				if (!res.authSetting['scope.writePhotosAlbum']) { //判断是否开启相册权限
					uni.authorize({
						scope: 'scope.writePhotosAlbum',
						success: function(res) {
							uni.downloadFile({
								url: url,
								success: function(res) {
									uni.saveImageToPhotosAlbum({
										filePath: res.tempFilePath,
										success: function(res) {
											resolve(res)
										}
									})
								},
								fail: function(err) {
									reject(err)
								}
							})
						},
						fail(err) {
							uni.showModal({
								title: '提示',
								content: '您未开启保存图片到相册的权限，请点击确定去开启权限！',
								success(res) {
									if (res.confirm) {
										uni.openSetting()
									}
								}
							})
							reject(err)
						}
					})
				} else {
					uni.downloadFile({
						url: url,
						success: function(res) {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function(res) {
									resolve(res)
								},
								fail: function(err) {
									reject(err)
								}
							})
						},
						fail: function(err) {
							reject(err)
						}
					})

				}
			},
			fail(err) {
				uni.showToast({
					title: '保存失败'
				})
				reject(err)
			}
		})
	})
}

export  function fileDownLoad(url){
	
}