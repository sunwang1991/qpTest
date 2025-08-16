<template>
	<view class="container">
		<!-- 顶部背景装饰 -->
		<view class="header-bg">
			<view class="bg-circle circle-1"></view>
			<view class="bg-circle circle-2"></view>
			<view class="bg-circle circle-3"></view>
		</view>

		<!-- 用户信息卡片 -->
		<view class="user-card" @click="showUserInfoSetting">
			<view class="user-info">
				<view class="avatar-wrapper">
					<image :src="userInfo?.avatar" mode="aspectFill" class="avatar"></image>
					<view class="online-dot"></view>
				</view>
				<view class="user-details">
					<view class="nick-name">{{ userInfo?.nickName || "游客" }}</view>
					<view class="user-id">ID: {{ userInfo?.id || "000000" }}</view>
				</view>
			</view>
			<view class="level-badge">
				<text class="level-text">LV.1</text>
			</view>
			<!-- <view class="edit-hint">
        <text class="edit-text">点击编辑</text>
      </view> -->
		</view>

		<!-- 统计数据卡片 -->
		<view class="stats-card">
			<view class="stats-header">
				<text class="stats-title">战绩统计</text>
				<text class="stats-subtitle">总计</text>
			</view>
			<view class="stats-grid">
				<view class="stat-item income">
					<view class="stat-icon">💰</view>
					<view class="stat-value">{{ userInfo?.gameStats.netIncome }}</view>
					<view class="stat-label">总收入</view>
				</view>
				<view class="stat-item rate">
					<view class="stat-icon">📈</view>
					<view class="stat-value">{{ userInfo?.gameStats.winRate }}%</view>
					<view class="stat-label">胜率</view>
				</view>
				<view class="stat-item games">
					<view class="stat-icon">🎮</view>
					<view class="stat-value">{{ userInfo?.gameStats.totalGames }}</view>
					<view class="stat-label">总局数</view>
				</view>
				<view class="stat-item wins">
					<view class="stat-icon">🏆</view>
					<view class="stat-value">{{ userInfo?.gameStats.winGames }}</view>
					<view class="stat-label">胜利</view>
				</view>
			</view>
		</view>

		<!-- 功能按钮区域 -->
		<view class="action-section">
			<view class="section-title">快速开始</view>
			<view class="action-buttons">
				<!-- 扫码加入 -->
				<!-- <view class="action-btn scan-btn" @click="scan">
          <view class="btn-icon">
            <text class="icon">📱</text>
          </view>
          <view class="btn-content">
            <text class="btn-title">扫码加入</text>
            <text class="btn-subtitle">扫描二维码进入房间</text>
          </view>
          <view class="btn-arrow">→</view>
        </view> -->

				<!-- 输入房间号加入 -->
				<view class="action-btn scan-btn" @click="enter">
					<view class="btn-icon">
						<text class="icon">📱</text>
					</view>
					<view class="btn-content">
						<text class="btn-title">加入房间</text>
						<text class="btn-subtitle">输入房间号进入房间</text>
					</view>
					<view class="btn-arrow">→</view>
				</view>

				<!-- 创建房间 -->
				<view class="action-btn create-btn" @click="create">
					<view class="btn-icon">
						<text class="icon">🏠</text>
					</view>
					<view class="btn-content">
						<text class="btn-title">创建房间</text>
						<text class="btn-subtitle">创建新的游戏房间</text>
					</view>
					<view class="btn-arrow">→</view>
				</view>

				<!-- 对局记录 -->
				<view class="action-btn history-btn" @click="viewGameRecords">
					<view class="btn-icon">
						<text class="icon">📋</text>
					</view>
					<view class="btn-content">
						<text class="btn-title">对局记录</text>
						<text class="btn-subtitle">查看历史对局记录</text>
					</view>
					<view class="btn-arrow">→</view>
				</view>
			</view>
		</view>

		<!-- 底部装饰 -->
		<view class="footer-decoration">
			<view class="decoration-line"></view>
		</view>

		<!-- 用户信息设置弹框 -->
		<view v-if="showUserInfoDialog" class="user-info-modal">
			<view class="modal-overlay" @click="closeUserInfoDialog"></view>
			<view class="modal-content">
				<view class="modal-header">
					<text class="modal-title">完善个人信息</text>
					<text class="modal-subtitle">获取微信头像和昵称，提升游戏体验</text>
				</view>

				<view class="user-info-form">
					<!-- 头像设置 -->
					<view class="form-item">
						<text class="form-label">头像</text>
						<view class="avatar-setting">
							<button class="avatar-btn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
								<image :src="
                    tempUserInfo.avatar ||
                    'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
                  " class="preview-avatar" mode="aspectFill">
								</image>
								<view class="avatar-overlay">
									<text class="avatar-text">点击选择</text>
								</view>
							</button>
						</view>
					</view>

					<!-- 昵称设置 -->
					<view class="form-item">
						<text class="form-label">昵称</text>
						<input class="nickname-input" type="nickname" placeholder="请输入昵称"
							v-model="tempUserInfo.nickName" maxlength="20" />
					</view>
				</view>

				<view class="modal-actions">
					<button class="action-btn cancel-btn" @click="closeUserInfoDialog">
						稍后设置
					</button>
					<button class="action-btn confirm-btn" @click="saveUserInfo">
						保存信息
					</button>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
	import imgUpload from '@/utils/upload.js'

	const {
		proxy
	} = getCurrentInstance();
	let userInfo = ref(null);

	// 用户信息设置弹框相关状态
	const showUserInfoDialog = ref(false);
	const tempUserInfo = ref({
		avatar: "",
		nickName: "",
	});

	function login() {
		return new Promise((resolve, reject) => {
			try {
				uni.login({
					provider: "weixin",
					success: (res) => {
						proxy
							.$request("mini/user/login", {
								code: res.code,
							})
							.then((res) => {
								resolve(res.data);
							});
					},
					fail: (err) => {
						reject(err);
					},
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	function create() {
		const roomNames = [
			"牌王之家",
			"雀神聚会",
			"棋牌天地",
			"欢乐牌局",
			"高手对决",
			"牌友俱乐部",
			"金牌棋室",
			"牌技交流会",
			"赢家之约",
			"棋牌乐园",
			"牌坛高手",
			"麻将世界",
			"棋牌竞技场",
			"牌友会所",
			"牌技切磋室",
			"棋牌大师堂",
			"牌局天下",
			"棋牌精英会",
			"牌艺交流站",
			"棋牌欢乐谷",
		];
		proxy
			.$request("mini/room/create", {
				creator: uni.getStorageSync("userId"),
				roomName: roomNames[Math.floor(Math.random() * roomNames.length)],
			})
			.then((res) => {
				proxy.$tab.reLaunch("/pages/room");
			});
	}

	function hasGameFun(userId) {
		return new Promise((resolve, reject) => {
			proxy
				.$request("mini/room/active-room", {
					userId: userId,
				})
				.then(async (res) => {
					const roomData = res.data;
					if (roomData?.id) {
						console.log("发现活跃房间，检查是否需要自动结算...");
						// 检查是否需要自动结算
						const shouldAutoSettle = await checkAutoSettle(roomData.id);
						if (shouldAutoSettle) {
							console.log("需要自动结算，执行结算操作...");
							// 自动结算房间
							await autoSettleRoom(roomData.id, userId);
							proxy.$modal.msg("房间已自动结算（超过30分钟无活动）");
							resolve(null); // 返回null表示没有活跃房间
						} else {
							console.log("不需要自动结算，继续进入房间");
							resolve(roomData);
						}
					} else {
						console.log("没有活跃房间");
						resolve(null);
					}
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	async function scan() {
		const scanRes = await proxy.$sw.scan();
		const roomId = scanRes.result;
		await join(roomId);
		proxy.$tab.reLaunch("/pages/room");
	}

	async function enter() {
		uni.showModal({
			title: "输入房间号",
			content: "",
			editable: true,
			success: async (res) => {
				if (res.confirm) {
					try {
						const roomId = res.content;
						await join(roomId);
						proxy.$tab.reLaunch("/pages/room");
					} catch (error) {
						proxy.$modal.msg(error);
					}
				}
			},
		});
	}

	function join(roomId) {
		return new Promise((resolve, reject) => {
			proxy
				.$request("mini/room/join", {
					roomId: roomId,
					userId: uni.getStorageSync("userId"),
				})
				.then((res) => {
					resolve(res.data);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	// 查看对局记录
	function viewGameRecords() {
		proxy.$tab.navigateTo("/pages/game-records");
	}

	// 检查是否需要自动结算
	function checkAutoSettle(roomId) {
		return new Promise((resolve, reject) => {
			proxy
				.$request("mini/room/transaction-stats", {
					roomId: roomId,
				})
				.then((res) => {
					if (
						res.data &&
						Array.isArray(res.data.transactions) &&
						res.data.transactions.length > 0
					) {
						// 获取最后一条交易记录（按时间倒序排列，第一个是最新的）
						const lastTransaction = res.data.transactions[0];
						const lastTransactionTime = new Date(lastTransaction.createTime);
						const currentTime = new Date();
						const timeDiff =
							currentTime.getTime() - lastTransactionTime.getTime();
						const thirtyMinutes = 30 * 60 * 1000; // 30分钟的毫秒数

						console.log("最后交易时间:", lastTransactionTime);
						console.log("当前时间:", currentTime);
						console.log("时间差(分钟):", Math.floor(timeDiff / (60 * 1000)));

						// 如果超过30分钟，需要自动结算
						resolve(timeDiff > thirtyMinutes);
					} else {
						// 没有交易记录，检查房间创建时间
						console.log("没有交易记录，检查房间创建时间");
						resolve(false);
					}
				})
				.catch((err) => {
					console.error("检查自动结算失败:", err);
					resolve(false); // 出错时不进行自动结算
				});
		});
	}

	// 自动结算房间
	function autoSettleRoom(roomId, userId) {
		return new Promise((resolve, reject) => {
			proxy
				.$request("mini/room/finish", {
					roomId: roomId,
					userId: userId,
				})
				.then((res) => {
					resolve(res.data);
				})
				.catch((err) => {
					console.error("自动结算失败:", err);
					reject(err);
				});
		});
	}

	// 分享转发功能
	const handleShare = () => {
		// 触发微信小程序的分享功能
		uni.showShareMenu({
			withShareTicket: true,
			success: () => {
				proxy.$modal.msgSuccess("请点击右上角分享按钮");
			},
			fail: (err) => {
				console.error("分享菜单显示失败:", err);
				// 如果不支持分享菜单，则使用自定义分享弹框
				showCustomShare();
			},
		});
	};

	// 自定义分享弹框
	const showCustomShare = () => {
		uni.showActionSheet({
			itemList: ["分享给微信好友", "分享到朋友圈", "复制链接"],
			success: (res) => {
				switch (res.tapIndex) {
					case 0:
						shareToFriend();
						break;
					case 1:
						shareToMoments();
						break;
					case 2:
						copyShareLink();
						break;
				}
			},
		});
	};

	// 分享给好友
	const shareToFriend = () => {
		// 这里可以调用微信分享API或者显示分享信息
		proxy.$modal.msg("请使用右上角菜单分享给好友");
	};

	// 分享到朋友圈
	const shareToMoments = () => {
		proxy.$modal.msg("请使用右上角菜单分享到朋友圈");
	};

	// 复制分享链接
	const copyShareLink = () => {
		const shareText = `我在玩雀神棋牌记账，快来一起玩吧！用户ID: ${
    userInfo.value?.id || "000000"
  }`;

		// #ifdef H5
		if (navigator.clipboard) {
			navigator.clipboard.writeText(shareText).then(() => {
				proxy.$modal.msgSuccess("分享内容已复制到剪贴板");
			});
		} else {
			proxy.$modal.msg("请手动复制分享内容");
		}
		// #endif

		// #ifdef MP-WEIXIN
		uni.setClipboardData({
			data: shareText,
			success: () => {
				proxy.$modal.msgSuccess("分享内容已复制到剪贴板");
			},
			fail: () => {
				proxy.$modal.msgError("复制失败");
			},
		});
		// #endif
	};

	// 检查用户信息是否完整
	const checkUserInfo = (user) => {
		if (!user) return false;

		// 检查是否有默认头像或空头像
		const hasValidAvatar =
			user.avatar &&
			user.avatar !== "/static/default-avatar.png" &&
			!user.avatar.includes("default") &&
			!user.avatar.includes(
				"icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg"
			);

		// 检查是否有有效昵称
		const hasValidNickName =
			user.nickName &&
			user.nickName.trim() !== "" &&
			user.nickName !== "游客" &&
			user.nickName !== "匿名用户";

		return hasValidAvatar && hasValidNickName;
	};

	// 显示用户信息设置弹框
	const showUserInfoSetting = () => {
		tempUserInfo.value = {
			avatar: userInfo.value?.avatar || "",
			nickName: userInfo.value?.nickName || "",
		};
		showUserInfoDialog.value = true;
	};

	// 关闭用户信息设置弹框
	const closeUserInfoDialog = () => {
		showUserInfoDialog.value = false;
	};

	// 选择头像
	const onChooseAvatar = async (e) => {
		const {
			avatarUrl
		} = e.detail;
		tempUserInfo.value.avatar = await imgUpload(avatarUrl,'avatar')
	};

	// 保存用户信息
	const saveUserInfo = async () => {
		if (!tempUserInfo.value.nickName.trim()) {
			proxy.$modal.msgError("请输入昵称");
			return;
		}

		if (!tempUserInfo.value.avatar) {
			proxy.$modal.msgError("请选择头像");
			return;
		}

		try {
			await proxy.$request("mini/user/update", {
				id: userInfo.value.id,
				avatar: tempUserInfo.value.avatar,
				nickName: tempUserInfo.value.nickName.trim(),
			});

			// 更新本地用户信息
			userInfo.value.avatar = tempUserInfo.value.avatar;
			userInfo.value.nickName = tempUserInfo.value.nickName.trim();

			proxy.$modal.msg("用户信息更新成功");
			closeUserInfoDialog();
		} catch (error) {
			proxy.$modal.msgError("更新失败，请重试");
			console.error("更新用户信息失败:", error);
		}
	};

	onLoad(async (options) => {
		userInfo.value = await login();
		uni.setStorageSync("userId", userInfo.value.id);

		// 检查用户信息是否完整，如果不完整则显示设置弹框
		if (!checkUserInfo(userInfo.value)) {
			// 延迟显示弹框，确保页面已经渲染完成
			setTimeout(() => {
				showUserInfoSetting();
			}, 500);
		}

		// 检查是否通过二维码分享进入
		if (options.roomId && options.action === "join") {
			// 通过二维码扫描进入，直接加入房间
			try {
				await join(options.roomId);
				proxy.$modal.msgSuccess("成功加入房间");
				proxy.$tab.reLaunch("/pages/room");
				return;
			} catch (error) {
				proxy.$modal.msgError(error);
			}
		}

		//查询是否有正在开始的对局
		const hasGameRes = await hasGameFun(userInfo.value.id);
		if (!hasGameRes) return;
		//有则直接跳转到对局页面
		proxy.$tab.reLaunch("/pages/room");
	});

	// 微信小程序分享配置
	// #ifdef MP-WEIXIN
	// 分享给好友
	onShareAppMessage(() => {
		return {
			title: "十一棋牌记账 - 和朋友一起记录游戏收益",
			path: "/pages/home",
			imageUrl: "", // 分享图片，建议尺寸 5:4
			success: (res) => {
				console.log("分享成功", res);
				proxy.$modal.msgSuccess("分享成功");
			},
			fail: (err) => {
				console.error("分享失败", err);
				proxy.$modal.msgError("分享失败");
			},
		};
	});

	// 分享到朋友圈
	onShareTimeline(() => {
		return {
			title: "十一棋牌记账 - 和朋友一起记录游戏收益",
			query: `inviter=${userInfo.value?.id || ""}`,
			imageUrl: "",
			success: (res) => {
				console.log("分享到朋友圈成功", res);
				proxy.$modal.msgSuccess("分享成功");
			},
			fail: (err) => {
				console.error("分享到朋友圈失败", err);
				proxy.$modal.msgError("分享失败");
			},
		};
	});
	// #endif

	// 处理分享进入的用户
	onShow(() => {
		// 获取页面参数，检查是否是通过分享进入
		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 1];
		const options = currentPage.options;

		if (options.inviter) {
			console.log("通过用户分享进入，邀请者ID:", options.inviter);
			// 这里可以添加邀请奖励逻辑
			proxy.$modal.msg(`欢迎通过好友邀请进入游戏！`);
		}
	});
</script>
<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		position: relative;
		overflow: hidden;
	}

	/* 顶部背景装饰 */
	.header-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 400rpx;
		overflow: hidden;

		.bg-circle {
			position: absolute;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.1);

			&.circle-1 {
				width: 200rpx;
				height: 200rpx;
				top: -100rpx;
				right: -50rpx;
				animation: float 6s ease-in-out infinite;
			}

			&.circle-2 {
				width: 150rpx;
				height: 150rpx;
				top: 100rpx;
				left: -75rpx;
				animation: float 8s ease-in-out infinite reverse;
			}

			&.circle-3 {
				width: 100rpx;
				height: 100rpx;
				top: 200rpx;
				right: 100rpx;
				animation: float 10s ease-in-out infinite;
			}
		}
	}

	/* 用户信息卡片 */
	.user-card {
		margin: 150rpx 30rpx 40rpx;
		padding: 40rpx;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 24rpx;
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(10rpx);
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		transition: all 0.3s ease;

		&:active {
			transform: scale(0.98);
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
		}

		.user-info {
			display: flex;
			align-items: center;

			.avatar-wrapper {
				position: relative;
				margin-right: 30rpx;

				.avatar {
					width: 120rpx;
					height: 120rpx;
					border-radius: 60rpx;
					border: 4rpx solid #fff;
					box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
				}

				.online-dot {
					position: absolute;
					bottom: 8rpx;
					right: 8rpx;
					width: 24rpx;
					height: 24rpx;
					background: #2ed573;
					border-radius: 50%;
					border: 3rpx solid #fff;
				}
			}

			.user-details {
				.nick-name {
					font-size: 36rpx;
					font-weight: 600;
					color: #333;
					margin-bottom: 8rpx;
				}

				.user-id {
					font-size: 24rpx;
					color: #999;
				}
			}
		}

		.level-badge {
			background: linear-gradient(45deg, #ffd700, #ffed4e);
			padding: 12rpx 24rpx;
			border-radius: 20rpx;
			box-shadow: 0 4rpx 12rpx rgba(255, 215, 0, 0.3);

			.level-text {
				font-size: 24rpx;
				font-weight: 600;
				color: #333;
			}
		}

		.edit-hint {
			position: absolute;
			top: 16rpx;
			right: 16rpx;
			background: rgba(102, 126, 234, 0.1);
			padding: 8rpx 16rpx;
			border-radius: 12rpx;

			.edit-text {
				font-size: 20rpx;
				color: #667eea;
				font-weight: 500;
			}
		}
	}

	/* 统计数据卡片 */
	.stats-card {
		margin: 0 30rpx 40rpx;
		padding: 40rpx;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 24rpx;
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(10rpx);

		.stats-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 40rpx;

			.stats-title {
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
			}

			.stats-subtitle {
				font-size: 24rpx;
				color: #999;
			}
		}

		.stats-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 30rpx;

			.stat-item {
				text-align: center;
				padding: 30rpx 20rpx;
				border-radius: 16rpx;
				position: relative;
				overflow: hidden;

				&::before {
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					opacity: 0.1;
					border-radius: 16rpx;
				}

				&.income {
					background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);

					&::before {
						background: #ff6b6b;
					}
				}

				&.rate {
					background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);

					&::before {
						background: #00d2ff;
					}
				}

				&.games {
					background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);

					&::before {
						background: #ff8a80;
					}
				}

				&.wins {
					background: linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%);

					&::before {
						background: #4ecdc4;
					}
				}

				.stat-icon {
					font-size: 48rpx;
					margin-bottom: 16rpx;
				}

				.stat-value {
					font-size: 40rpx;
					font-weight: 700;
					color: #333;
					margin-bottom: 8rpx;
				}

				.stat-label {
					font-size: 24rpx;
					color: #666;
				}
			}
		}
	}

	/* 功能按钮区域 */
	.action-section {
		margin: 0 30rpx 60rpx;

		.section-title {
			font-size: 32rpx;
			font-weight: 600;
			color: #fff;
			margin-bottom: 30rpx;
			text-align: center;
		}

		.action-buttons {
			.action-btn {
				display: flex;
				align-items: center;
				padding: 30rpx;
				margin-bottom: 20rpx;
				background: rgba(255, 255, 255, 0.95);
				border-radius: 20rpx;
				box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
				backdrop-filter: blur(10rpx);
				transition: all 0.3s ease;
				position: relative;
				overflow: hidden;

				&::before {
					content: "";
					position: absolute;
					top: 0;
					left: -100%;
					width: 100%;
					height: 100%;
					background: linear-gradient(90deg,
							transparent,
							rgba(255, 255, 255, 0.4),
							transparent);
					transition: left 0.5s;
				}

				&:active {
					transform: scale(0.98);
					box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);

					&::before {
						left: 100%;
					}
				}

				.btn-icon {
					width: 80rpx;
					height: 80rpx;
					border-radius: 16rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 24rpx;

					.icon {
						font-size: 40rpx;
					}
				}

				.btn-content {
					flex: 1;

					.btn-title {
						display: block;
						font-size: 32rpx;
						font-weight: 600;
						color: #333;
						margin-bottom: 8rpx;
					}

					.btn-subtitle {
						display: block;
						font-size: 24rpx;
						color: #999;
					}
				}

				.btn-arrow {
					font-size: 32rpx;
					color: #ccc;
					font-weight: 600;
				}

				&.scan-btn {
					.btn-icon {
						background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

						.icon {
							filter: grayscale(1) brightness(10);
						}
					}
				}

				&.create-btn {
					.btn-icon {
						background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

						.icon {
							filter: grayscale(1) brightness(10);
						}
					}
				}

				&.history-btn {
					.btn-icon {
						background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);

						.icon {
							filter: grayscale(1) brightness(10);
						}
					}
				}
			}
		}
	}

	/* 底部装饰 */
	.footer-decoration {
		position: relative;
		height: 100rpx;

		.decoration-line {
			position: absolute;
			bottom: 40rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 100rpx;
			height: 6rpx;
			background: rgba(255, 255, 255, 0.3);
			border-radius: 3rpx;
		}
	}

	/* 用户信息设置弹框样式 */
	.user-info-modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;

		.modal-overlay {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.5);
			backdrop-filter: blur(5rpx);
		}

		.modal-content {
			position: relative;
			width: 600rpx;
			max-width: 90vw;
			background: #fff;
			border-radius: 24rpx;
			padding: 40rpx;
			box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
			animation: modalSlideIn 0.3s ease-out;
		}

		.modal-header {
			text-align: center;
			margin-bottom: 40rpx;

			.modal-title {
				display: block;
				font-size: 36rpx;
				font-weight: 600;
				color: #333;
				margin-bottom: 12rpx;
			}

			.modal-subtitle {
				display: block;
				font-size: 26rpx;
				color: #666;
				line-height: 1.4;
			}
		}

		.user-info-form {
			.form-item {
				margin-bottom: 40rpx;

				.form-label {
					display: block;
					font-size: 28rpx;
					font-weight: 500;
					color: #333;
					margin-bottom: 16rpx;
				}

				.avatar-setting {
					display: flex;
					justify-content: center;

					.avatar-btn {
						position: relative;
						width: 160rpx;
						height: 160rpx;
						border-radius: 80rpx;
						border: none;
						padding: 0;
						background: transparent;
						overflow: hidden;

						&::after {
							border: none;
						}

						.preview-avatar {
							width: 100%;
							height: 100%;
							border-radius: 80rpx;
							border: 4rpx solid #e6e6e6;
						}

						.avatar-overlay {
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							bottom: 0;
							background: rgba(0, 0, 0, 0.5);
							border-radius: 80rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							opacity: 0;
							transition: opacity 0.3s ease;

							.avatar-text {
								color: #fff;
								font-size: 24rpx;
								font-weight: 500;
							}
						}

						&:active .avatar-overlay {
							opacity: 1;
						}
					}
				}

				.nickname-input {
					width: 100%;
					height: 80rpx;
					padding: 0 20rpx;
					border: 2rpx solid #e6e6e6;
					border-radius: 12rpx;
					font-size: 28rpx;
					color: #333;
					background: #fafafa;
					box-sizing: border-box;
					transition: all 0.3s ease;

					&:focus {
						border-color: #667eea;
						background: #fff;
						box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
					}

					&::placeholder {
						color: #999;
					}
				}
			}
		}

		.modal-actions {
			display: flex;
			gap: 20rpx;
			margin-top: 40rpx;

			.action-btn {
				flex: 1;
				height: 80rpx;
				border-radius: 12rpx;
				font-size: 28rpx;
				font-weight: 500;
				border: none;
				transition: all 0.3s ease; 
				line-height: 80rpx;

				&::after {
					border: none;
				}

				&.cancel-btn {
					background: #f5f5f5;
					color: #666;

					&:active {
						background: #e6e6e6;
						transform: scale(0.98);
					}
				}

				&.confirm-btn {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					color: #fff;
					box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);

					&:active {
						transform: scale(0.98);
						box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.4);
					}
				}
			}
		}
	}

	@keyframes modalSlideIn {
		from {
			opacity: 0;
			transform: translateY(-50rpx) scale(0.9);
		}

		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	/* 动画效果 */
	@keyframes float {

		0%,
		100% {
			transform: translateY(0px);
		}

		50% {
			transform: translateY(-20px);
		}
	}

	/* 响应式设计 */
	@media (max-width: 750rpx) {
		.user-card {
			margin: 80rpx 20rpx 30rpx;
			padding: 30rpx;

			.user-info {
				.avatar-wrapper {
					margin-right: 20rpx;

					.avatar {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50rpx;
					}
				}

				.user-details {
					.nick-name {
						font-size: 32rpx;
					}

					.user-id {
						font-size: 22rpx;
					}
				}
			}
		}

		.stats-card {
			margin: 0 20rpx 30rpx;
			padding: 30rpx;

			.stats-grid {
				gap: 20rpx;

				.stat-item {
					padding: 24rpx 16rpx;

					.stat-icon {
						font-size: 40rpx;
					}

					.stat-value {
						font-size: 36rpx;
					}

					.stat-label {
						font-size: 22rpx;
					}
				}
			}
		}

		.action-section {
			margin: 0 20rpx 40rpx;

			.action-buttons {
				.action-btn {
					padding: 24rpx;

					.btn-icon {
						width: 70rpx;
						height: 70rpx;
						margin-right: 20rpx;

						.icon {
							font-size: 36rpx;
						}
					}

					.btn-content {
						.btn-title {
							font-size: 28rpx;
						}

						.btn-subtitle {
							font-size: 22rpx;
						}
					}
				}
			}
		}
	}
</style>