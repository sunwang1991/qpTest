<template>
	<view class="container">
		<!-- 顶部背景装饰 -->
		<view class="header-bg">
			<view class="bg-circle circle-1"></view>
			<view class="bg-circle circle-2"></view>
			<view class="bg-circle circle-3"></view>
		</view>

		<!-- 玩家列表 - 横向排列 -->
		<view class="players-horizontal" v-if="roomInfo">
			<scroll-view scroll-x="true" class="players-scroll">
				<view class="players-container">
					<view v-for="item in roomInfo.users" :key="item.id" class="player-item"
						:class="{ 'current-user': item.id == userId }" @click="handelPay(item)">
						<!-- 玩家头像 -->
						<view class="player-avatar-wrapper">
							<image :src="item.avatar" mode="aspectFill" class="player-avatar"></image>
						</view>

						<!-- 玩家信息 -->
						<view class="player-info">
							<view class="player-name">{{ item.nickName||item.id }}</view>
							<view :class="[
                  'player-amount',
                  item.netAmount > 0
                    ? 'profit'
                    : item.netAmount < 0
                    ? 'loss'
                    : 'neutral',
                ]">
								{{ item.netAmount > 0 ? "+" : "" }}{{ item.netAmount }}
							</view>
						</view>

						<!-- 当前用户标识 -->
						<view class="current-user-badge" v-if="item.id == userId">
							<text>我</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 交易记录面板 -->
		<view class="transaction-panel">
			<view class="panel-header">
				<view class="panel-title">
					<text class="title-text">交易记录</text>
					<text class="title-count"
						v-if="transactionRecords.length > 0">({{ transactionRecords.length }}笔)</text>
				</view>
			</view>

			<!-- 交易记录列表 -->
			<view class="transaction-list">
				<view v-if="transactionRecords.length === 0" class="empty-state">
					<text class="empty-icon">📝</text>
					<text class="empty-text">暂无交易记录</text>
				</view>

				<view v-for="(record, index) in transactionRecords" :key="record.id || index"
					class="transaction-record">
					<!-- 支付方信息 -->
					<view class="payer-section">
						<image :src="record.payUser.avatar" mode="aspectFill" class="user-avatar"></image>
						<view class="user-info">
							<text class="user-name">{{
                record.payUser.nickName || record.payUser.id
              }}</text>
						</view>
					</view>

					<!-- 箭头和金额 -->
					<view class="payment-info">
						<text class="arrow">→</text>
						<text class="amount">{{ record.payMoney }}</text>
					</view>

					<!-- 接收方信息 -->
					<view class="receiver-section">
						<image :src="record.receiveUser.avatar" mode="aspectFill" class="user-avatar"></image>
						<view class="user-info">
							<text class="user-name">{{
                record.receiveUser.nickName || record.receiveUser.id
              }}</text>
						</view>
					</view>

					<!-- 时间信息 -->
					<view class="time-info">
						<text class="time-text">{{ formatTime(record.createTime) }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 游戏操作按钮区域 -->
		<view class="game-actions">
			<view class="action-buttons">
				<!-- 结算按钮 -->
				<view class="game-btn settle-btn" @click="handleSettle">
					<view class="btn-icon">📊</view>
					<view class="btn-content">
						<text class="btn-title">结算</text>
						<text class="btn-subtitle">查看本局结果</text>
					</view>
				</view>

				<!-- 分享房间按钮 -->
				<view class="game-btn share-btn" @click="handleShareRoom">
					<view class="btn-icon">�</view>
					<view class="btn-content">
						<text class="btn-title">分享房间</text>
						<text class="btn-subtitle">邀请好友加入</text>
					</view>
				</view>
			</view>

			<!-- 退出房间按钮 -->
			<!-- <view class="exit-btn" @click="handleExit">
        <text class="exit-text">退出房间</text>
      </view> -->
		</view>

		<!-- 结算弹框 -->
		<Dialog v-model="showSettleDialog" title="本局结算" :show-cancel-button="false" confirm-text="确定"
			@confirm="handleSettleConfirm">
			<view class="settle-content">
				<!-- 		<view class="settle-summary">
					<view class="summary-item">
						<text class="summary-label">游戏时长：</text>
						<text class="summary-value">{{ getGameDuration() }}</text>
					</view>
					<view class="summary-item">
						<text class="summary-label">总局数：</text>
						<text class="summary-value">{{ getCurrentRound() }}</text>
					</view>
				</view> -->

				<view class="settle-players" v-if="roomInfo?.users">
					<!-- <view class="settle-title">玩家结算</view> -->
					<view v-for="player in getSortedPlayers()" :key="player.id" class="settle-player-item">
						<view class="settle-player-info">
							<image :src="player.avatar" mode="aspectFill" class="settle-avatar"></image>
							<text class="settle-name">{{ player.nickName||player.id }}</text>
						</view>
						<view :class="[
                'settle-amount',
                player.netAmount > 0
                  ? 'profit'
                  : player.netAmount < 0
                  ? 'loss'
                  : 'neutral',
              ]">
							{{ player.netAmount > 0 ? "+" : "" }}{{ player.netAmount }}
						</view>
					</view>
				</view>
				<view v-else>未进行交易</view>
			</view>
		</Dialog>

		<!-- 退出房间确认弹框 -->
		<Dialog v-model="showExitDialog" title="退出房间" confirm-text="确定退出" cancel-text="取消" @confirm="handleExitConfirm"
			@cancel="handleExitCancel">
			<view class="exit-content">
				<view class="exit-warning">🚪 确定要退出房间吗？</view>
				<view class="exit-desc">退出后需要重新扫码或创建房间才能继续游戏。</view>
			</view>
		</Dialog>

		<!-- 分享房间弹框 -->
		<Dialog v-model="showShareRoomDialog" title="分享房间" :show-footer="false">
			<view class="share-room-content">
				<!-- 房间ID区域 -->
				<view class="room-id-section">
					<view class="room-id-title">房间ID</view>
					<view class="room-id-container">
						<view class="room-id-display">{{ roomInfo?.id }}</view>
					</view>
					<view class="room-id-tip">好友输入房间ID即可加入</view>
				</view>

				<!-- 二维码区域 -->
				<view class="qrcode-section">
					<view class="qrcode-title">扫描二维码加入房间</view>
					<view class="qrcode-container">
						<image :src="qrUrl" mode="widthFix" v-if="showQRCode"></image>
						<view v-else class="qrcode-loading">
							<text class="loading-text">生成中...</text>
						</view>
					</view>
					<view class="qrcode-tip">好友扫码即可快速加入房间</view>
				</view>

				<!-- 分享好友按钮 -->
				<view class="share-close-btn">
					<button open-type="share" class="share-friend-btn">
						<text class="share-btn-text">🚀 分享给好友</text>
					</button>
				</view>
			</view>
		</Dialog>

		<!-- 支付弹框 -->
		<Dialog v-model="showBasicDialog" title="确认支付" @confirm="handlePayConfirm" @cancel="handlePayCancel">
			<view class="pay-pop">
				<input class="pay-input" type="number" placeholder="请输入支付金额" v-model="amount" />
			</view>
		</Dialog>
	</view>
</template>
<script setup>
	import Dialog from "@/components/Dialog.vue";
	const {
		proxy
	} = getCurrentInstance();
	let roomInfo = ref(null);
	let amount = ref(null);
	let userId = ref(null);
	let gameOver = ref(false)

	userId.value = uni.getStorageSync("userId");

	// 弹框控制状态
	const showBasicDialog = ref(false);
	const showCustomDialog = ref(false);
	const showSettleDialog = ref(false);
	const showExitDialog = ref(false);
	const showShareRoomDialog = ref(false);
	const selectedUser = ref(null);

	// 交易记录相关状态
	const transactionRecords = ref([]);

	// 二维码相关状态
	const showQRCode = ref(false);
	const qrCodeSize = ref(200);

	// 游戏状态
	const gameStartTime = ref(Date.now());

	function getRoomInfo() {
		return new Promise((resolve, reject) => {
			proxy
				.$request("mini/room/active-room", {
					userId: userId.value,
				})
				.then((res) => {
					if (res.data?.id) {
						roomInfo.value = res.data;
						gameOver.value = false
						resolve(res.data);
					} else {
						proxy.$modal.msg("房间不存在或者已结束");
						clearInterval(timer)
						gameOver.value = true
						showSettleDialog.value = true
						reject("房间不存在或者已结束");
					}
				})
				.catch((error) => {
					proxy.$modal.msg("请刷新重试");
					clearInterval(timer)
					reject(error);
				});
		});
	}

	async function handelPay(item) {
		if (item.id == userId.value) return;
		// 显示确认支付弹框
		selectedUser.value = item;
		showBasicDialog.value = true;
	}

	// 弹框事件处理方法
	const handlePayConfirm = async () => {
		if (selectedUser.value) {
			await pay(selectedUser.value.id);
			amount.value = null;
			getRoomInfo();
			// 刷新交易记录
			loadTransactionStats();
			proxy.$modal.msg("操作成功");
		}
	};

	const handlePayCancel = () => {
		selectedUser.value = null;
	};

	const handleBackHome = () => {
		proxy.$tab.navigateTo("/pages/home");
	};

	// 辅助方法
	const getCurrentRound = () => {
		// 这里可以根据实际业务逻辑计算当前局数
		return roomInfo.value?.currentRound || 1;
	};

	const getTotalAmount = () => {
		// 计算总金额
		if (!roomInfo.value?.users) return 0;
		return roomInfo.value.users.reduce(
			(total, user) => total + Math.abs(user.netAmount),
			0
		);
	};

	const getPlayerRank = (player) => {
		// 根据净收益排名
		if (!roomInfo.value?.users) return 1;
		const sortedUsers = [...roomInfo.value.users].sort(
			(a, b) => b.netAmount - a.netAmount
		);
		return sortedUsers.findIndex((user) => user.id === player.id) + 1;
	};

	// 新增的游戏操作方法
	const handleSettle = () => {
		showSettleDialog.value = true;
	};

	const handleExit = () => {
		showExitDialog.value = true;
	};

	// 结算相关方法
	const handleSettleConfirm = async () => {
		if (!gameOver.value) {
			await finishGame();
		}
		showSettleDialog.value = false;
		proxy.$tab.redirectTo("/pages/home");
	};

	const finishGame = () => {
		return new Promise((resolve, reject) => {
			try {
				proxy
					.$request("mini/room/finish", {
						roomId: roomInfo.value.id,
						userId: userId.value,
					})
					.then((res) => {
						resolve(res.data);
					});
			} catch (error) {
				reject(error);
			}
		});
	};

	const getSortedPlayers = () => {
		if (!roomInfo.value?.users) return [];
		return [...roomInfo.value.users].sort((a, b) => b.netAmount - a.netAmount);
	};

	const getGameDuration = () => {
		const duration = Date.now() - gameStartTime.value;
		const minutes = Math.floor(duration / 60000);
		const seconds = Math.floor((duration % 60000) / 1000);
		return `${minutes}分${seconds}秒`;
	};

	// 退出房间相关方法
	const handleExitConfirm = async () => {
		try {
			await exitRoom();
			proxy.$modal.msgSuccess("已退出房间");
			clearInterval(timer);
			proxy.$tab.navigateTo("/pages/home");
		} catch (error) {
			proxy.$modal.msgError("退出失败，请重试");
		}
	};

	const handleExitCancel = () => {
		console.log("取消退出");
	};

	const exitRoom = () => {
		return new Promise((resolve, reject) => {
			try {
				proxy
					.$request("mini/room/exit", {
						roomId: roomInfo.value.id,
						userId: userId.value,
					})
					.then((res) => {
						resolve(res.data);
					});
			} catch (error) {
				reject(error);
			}
		});
	};

	let qrUrl = ref(null);

	// 分享房间相关方法
	const handleShareRoom = async () => {
		showShareRoomDialog.value = true;
		showQRCode.value = false;
		qrUrl.value = await getQrCode();
		showQRCode.value = true;
	};

	// 生成房间二维码
	const generateQRCode = () => {
		generateQRCodeLocally(roomPath);
	};

	function getQrCode() {
		return new Promise((resolve, reject) => {
			proxy
				.$request("mini/room/generate-qrcode", {
					roomId: roomInfo.value.id,
					path: "pages/home",
					width: 200,
				})
				.then((res) => {
					resolve(res.data.qrcode);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	// 交易记录相关方法
	const loadTransactionStats = async () => {
		try {
			const res = await proxy.$request("mini/room/transaction-stats", {
				roomId: roomInfo.value?.id,
			});

			if (res.data && Array.isArray(res.data.transactions)) {
				// 将用户统计数据转换为交易记录格式
				transactionRecords.value = res.data.transactions;
			}
		} catch (error) {
			console.error("加载交易记录失败:", error);
			proxy.$modal.msgError("加载交易记录失败");
		}
	};

	// 格式化时间
	const formatTime = (timestamp) => {
		if (!timestamp) return "";

		const date = new Date(timestamp);
		const now = new Date();
		const diff = now.getTime() - date.getTime();

		// 小于1分钟
		if (diff < 60000) {
			return "刚刚";
		}

		// 小于1小时
		if (diff < 3600000) {
			return `${Math.floor(diff / 60000)}分钟前`;
		}

		// 小于1天
		if (diff < 86400000) {
			return `${Math.floor(diff / 3600000)}小时前`;
		}

		// 大于1天，显示具体日期
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");

		return `${month}月${day}日 ${hours}:${minutes}`;
	};

	function pay(receiveUserId) {
		return new Promise((resolve, reject) => {
			try {
				proxy
					.$request("mini/room/pay", {
						roomId: roomInfo.value.id,
						payUserId: userId.value,
						receiveUserId: receiveUserId,
						amount: amount.value,
					})
					.then((res) => {
						resolve(res.data);
					});
			} catch (error) {
				reject(error);
			}
		});
	}

	// 检查并执行自动结算
	async function checkAndAutoSettle() {
		if (!roomInfo.value) return;

		try {
			const res = await proxy.$request("mini/room/transaction-stats", {
				roomId: roomInfo.value.id,
			});

			if (
				res.data &&
				Array.isArray(res.data.transactions) &&
				res.data.transactions.length > 0
			) {
				// 获取最后一条交易记录
				const lastTransaction = res.data.transactions[0];
				const lastTransactionTime = new Date(lastTransaction.createTime);
				const currentTime = new Date();
				const timeDiff = currentTime.getTime() - lastTransactionTime.getTime();
				const thirtyMinutes = 30 * 60 * 1000; // 30分钟的毫秒数

				console.log("房间内检查 - 最后交易时间:", lastTransactionTime);
				console.log("房间内检查 - 当前时间:", currentTime);
				console.log(
					"房间内检查 - 时间差(分钟):",
					Math.floor(timeDiff / (60 * 1000))
				);

				// 如果超过30分钟，自动结算
				if (timeDiff > thirtyMinutes) {
					await finishGame();
					proxy.$modal.msgSuccess("房间已自动结算（超过30分钟无活动）");
					proxy.$tab.navigateBack();
				}
			}
		} catch (error) {
			console.error("自动结算检查失败:", error);
		}
	}

	onLoad(async () => {
		await getRoomInfo();
		// 自动加载交易记录
		loadTransactionStats();
		// 检查是否需要自动结算
		await checkAndAutoSettle();
	});

	let timer = setInterval(() => {
		getRoomInfo();
		// 同时刷新交易记录
		loadTransactionStats();
	}, 2000);

	onUnload(() => {
		clearInterval(timer);
	});

	// 微信小程序分享配置
	// #ifdef MP-WEIXIN
	// 分享给好友
	onShareAppMessage(() => {
		return {
			title: `${roomInfo.value?.name||'棋牌对战'} - 房间ID: ${
      roomInfo.value?.id
    }`,
			desc: `当前${roomInfo.value?.users?.length || 0}人在线，快来一起玩吧！`,
			path: `/pages/home?roomId=${roomInfo.value?.id}&action=join`,
			success: (res) => {
				console.log("房间分享成功", res);
				proxy.$modal.msgSuccess("分享成功");
			},
			fail: (err) => {
				console.error("房间分享失败", err);
				proxy.$modal.msgError("分享失败");
			},
		};
	});

	// 分享到朋友圈
	onShareTimeline(() => {
		return {
			title: `${roomInfo.value?.name || "雀神对战"} - 邀请你一起玩棋牌记账`,
			query: `roomId=${roomInfo.value?.id}&action=join`,
			imageUrl: "/src/static/logo/logo.png",
			success: (res) => {
				console.log("房间分享到朋友圈成功", res);
				proxy.$modal.msgSuccess("分享成功");
			},
			fail: (err) => {
				console.error("房间分享到朋友圈失败", err);
				proxy.$modal.msgError("分享失败");
			},
		};
	});
	// #endif
</script>
<style lang="scss" scoped>
	.container {
		height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		padding-top: 140rpx;
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

	/* 房间信息卡片 */
	.room-card {
		margin: 100rpx 30rpx 40rpx;
		padding: 40rpx;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 24rpx;
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(10rpx);

		.room-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 30rpx;

			.room-icon {
				font-size: 48rpx;
				margin-right: 20rpx;
			}

			.room-info {
				flex: 1;

				.room-title {
					font-size: 36rpx;
					font-weight: 600;
					color: #333;
					margin-bottom: 8rpx;
				}

				.room-subtitle {
					font-size: 24rpx;
					color: #999;
				}
			}

			.room-status {
				display: flex;
				align-items: center;

				.status-dot {
					width: 16rpx;
					height: 16rpx;
					background: #2ed573;
					border-radius: 50%;
					margin-right: 12rpx;
					animation: pulse 2s infinite;
				}

				.status-text {
					font-size: 24rpx;
					color: #2ed573;
					font-weight: 500;
				}
			}

			.share-btn {
				width: 60rpx;
				height: 60rpx;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				border-radius: 30rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left: 16rpx;
				box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
				transition: all 0.3s ease;

				&:active {
					transform: scale(0.9);
				}

				.share-icon {
					font-size: 28rpx;
					color: #fff;
				}
			}
		}

		.room-stats-simple {
			padding: 16rpx 0;
			text-align: center;

			.stats-text {
				font-size: 24rpx;
				color: rgba(255, 255, 255, 0.8);
				background: rgba(255, 255, 255, 0.1);
				padding: 8rpx 16rpx;
				border-radius: 20rpx;
				display: inline-block;
			}
		}
	}

	/* 横向玩家列表 */
	.players-horizontal {
		margin: 20rpx 0;

		.players-scroll {
			white-space: nowrap;

			.players-container {
				display: flex;
				padding: 0 30rpx;
				gap: 20rpx;

				.player-item {
					flex-shrink: 0;
					width: 160rpx;
					background: rgba(255, 255, 255, 0.95);
					border-radius: 20rpx;
					padding: 24rpx 16rpx;
					text-align: center;
					box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
					backdrop-filter: blur(10rpx);
					transition: all 0.3s ease;
					position: relative;

					&:active {
						transform: scale(0.95);
					}

					&.current-user {
						border: 3rpx solid #667eea;
						background: linear-gradient(135deg,
								rgba(102, 126, 234, 0.1) 0%,
								rgba(255, 255, 255, 0.95) 100%);
					}

					.player-avatar-wrapper {
						position: relative;
						margin-bottom: 16rpx;

						.player-avatar {
							width: 80rpx;
							height: 80rpx;
							border-radius: 40rpx;
							border: 3rpx solid #fff;
							box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
						}

						.player-rank {
							position: absolute;
							top: -8rpx;
							right: -8rpx;
							width: 28rpx;
							height: 28rpx;
							background: linear-gradient(45deg, #ffd700, #ffed4e);
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 18rpx;
							font-weight: 700;
							color: #333;
							border: 2rpx solid #fff;
							box-shadow: 0 2rpx 6rpx rgba(255, 215, 0, 0.3);
						}
					}

					.player-info {
						.player-name {
							font-size: 24rpx;
							font-weight: 600;
							color: #333;
							margin-bottom: 8rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}

						.player-amount {
							font-size: 22rpx;
							font-weight: 600;

							&.profit {
								color: #2ed573;
							}

							&.loss {
								color: #ff4757;
							}

							&.neutral {
								color: #666;
							}
						}
					}

					.current-user-badge {
						position: absolute;
						top: 8rpx;
						right: 8rpx;
						background: linear-gradient(45deg, #667eea, #764ba2);
						color: #fff;
						padding: 4rpx 8rpx;
						border-radius: 10rpx;
						font-size: 18rpx;
						font-weight: 600;
						box-shadow: 0 2rpx 6rpx rgba(102, 126, 234, 0.3);
					}
				}
			}
		}
	}

	/* 交易记录面板 */
	.transaction-panel {
		margin: 20rpx 30rpx 20rpx;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 24rpx;
		box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(10rpx);
		overflow: hidden;
		flex: 1;
		display: flex;
		flex-direction: column;

		.panel-header {
			padding: 30rpx;
			border-bottom: 2rpx solid #f0f0f0;

			.panel-title {
				display: flex;
				align-items: center;

				.title-text {
					font-size: 32rpx;
					font-weight: 600;
					color: #333;
					margin-right: 12rpx;
				}

				.title-count {
					font-size: 24rpx;
					color: #999;
				}
			}
		}

		.transaction-list {
			flex: 1;
			overflow-y: auto;

			.empty-state {
				text-align: center;
				padding: 80rpx 20rpx;

				.empty-icon {
					display: block;
					font-size: 64rpx;
					margin-bottom: 20rpx;
					opacity: 0.5;
				}

				.empty-text {
					font-size: 28rpx;
					color: #999;
				}
			}

			.transaction-record {
				display: flex;
				align-items: center;
				padding: 24rpx 30rpx;
				border-bottom: 2rpx solid #f8f9fa;
				transition: background-color 0.3s ease;

				&:last-child {
					border-bottom: none;
				}

				&:active {
					background-color: #f8f9fa;
				}

				.payer-section,
				.receiver-section {
					display: flex;
					align-items: center;
					min-width: 140rpx;

					.user-avatar {
						width: 50rpx;
						height: 50rpx;
						border-radius: 25rpx;
						margin-right: 12rpx;
						border: 2rpx solid #fff;
						box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
					}

					.user-info {
						.user-name {
							font-size: 26rpx;
							color: #333;
							font-weight: 500;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							max-width: 80rpx;
						}
					}
				}

				.payment-info {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					margin: 0 20rpx;

					.arrow {
						font-size: 24rpx;
						color: #667eea;
						margin-right: 12rpx;
					}

					.amount {
						font-size: 32rpx;
						font-weight: 700;
						color: #667eea;
						background: rgba(102, 126, 234, 0.1);
						padding: 8rpx 16rpx;
						border-radius: 20rpx;
					}
				}

				.time-info {
					min-width: 100rpx;
					text-align: right;

					.time-text {
						font-size: 22rpx;
						color: #999;
					}
				}
			}
		}
	}

	/* 游戏操作按钮区域 */
	.game-actions {
		margin: 20rpx 30rpx 60rpx;

		.action-buttons {
			display: flex;
			flex-wrap: wrap;
			gap: 20rpx;
			margin-bottom: 30rpx;

			.game-btn {
				flex: 1;
				min-width: 200rpx;
				display: flex;
				align-items: center;
				padding: 30rpx 24rpx;
				border-radius: 20rpx;
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
							rgba(255, 255, 255, 0.3),
							transparent);
					transition: left 0.5s;
				}

				&:active {
					transform: scale(0.98);

					&::before {
						left: 100%;
					}
				}

				.btn-icon {
					font-size: 40rpx;
					margin-right: 20rpx;
				}

				.btn-content {
					flex: 1;

					.btn-title {
						display: block;
						font-size: 32rpx;
						font-weight: 600;
						margin-bottom: 6rpx;
					}

					.btn-subtitle {
						display: block;
						font-size: 24rpx;
						opacity: 0.8;
					}
				}

				&.settle-btn {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					color: #fff;
					box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.3);
				}

				&.share-btn {
					background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
					color: #333;
					box-shadow: 0 8rpx 32rpx rgba(168, 237, 234, 0.3);
				}

				&.history-btn {
					background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
					color: #333;
					box-shadow: 0 8rpx 32rpx rgba(168, 237, 234, 0.3);
				}
			}
		}

		.exit-btn {
			width: 100%;
			padding: 24rpx;
			background: rgba(255, 255, 255, 0.1);
			border: 2rpx solid rgba(255, 255, 255, 0.3);
			border-radius: 16rpx;
			text-align: center;
			transition: all 0.3s ease;

			&:active {
				transform: scale(0.98);
				background: rgba(255, 255, 255, 0.2);
			}

			.exit-text {
				font-size: 28rpx;
				color: rgba(255, 255, 255, 0.9);
				font-weight: 500;
			}
		}
	}

	/* 弹框内容样式 */
	.settle-content {
		.settle-summary {
			margin-bottom: 30rpx;
			padding: 20rpx;
			background: #f8f9fa;
			border-radius: 12rpx;

			.summary-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 12rpx;

				&:last-child {
					margin-bottom: 0;
				}

				.summary-label {
					font-size: 28rpx;
					color: #666;
				}

				.summary-value {
					font-size: 28rpx;
					font-weight: 600;
					color: #333;
				}
			}
		}

		.settle-players {
			.settle-title {
				font-size: 30rpx;
				font-weight: 600;
				color: #333;
				margin-bottom: 20rpx;
				text-align: center;
			}

			.settle-player-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 20rpx;
				margin-bottom: 16rpx;
				background: #f8f9fa;
				border-radius: 12rpx;

				&:last-child {
					margin-bottom: 0;
				}

				.settle-player-info {
					display: flex;
					align-items: center;

					.settle-avatar {
						width: 60rpx;
						height: 60rpx;
						border-radius: 30rpx;
						margin-right: 16rpx;
					}

					.settle-name {
						font-size: 28rpx;
						color: #333;
						font-weight: 500;
					}
				}

				.settle-amount {
					font-size: 32rpx;
					font-weight: 700;

					&.profit {
						color: #2ed573;
					}

					&.loss {
						color: #ff4757;
					}

					&.neutral {
						color: #666;
					}
				}
			}
		}
	}

	.exit-content {
		text-align: center;

		.exit-warning {
			font-size: 32rpx;
			margin-bottom: 20rpx;
			color: #ff6b6b;
			font-weight: 600;
		}

		.exit-desc {
			font-size: 28rpx;
			color: #666;
			line-height: 1.6;
		}
	}

	/* 输入框样式 */
	.pay-pop {
		:deep(input) {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			padding: 0 30rpx;
			border: 2rpx solid #e6e6e6;
			border-radius: 16rpx;
			font-size: 32rpx;
			color: #333;
			background-color: #fafafa;
			box-sizing: border-box;
			transition: all 0.3s ease;

			/* 聚焦状态 */
			&:focus {
				border-color: #667eea;
				background-color: #fff;
				box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
				outline: none;
			}

			/* 占位符样式 */
			&::placeholder {
				color: #999;
				font-size: 30rpx;
			}
		}
	}

	/* 分享房间弹框样式 */
	.share-room-content {
		text-align: center;

		.share-room-info {
			margin-bottom: 30rpx;
			padding: 20rpx;
			background: #f8f9fa;
			border-radius: 12rpx;

			.share-room-title {
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
				margin-bottom: 12rpx;
			}

			.share-room-players {
				font-size: 24rpx;
				color: #999;
			}
		}

		.room-id-section {
			margin-bottom: 30rpx;

			.room-id-title {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 16rpx;
				font-weight: 500;
			}

			.room-id-container {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 16rpx;
				margin-bottom: 12rpx;

				.room-id-display {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					color: #fff;
					padding: 16rpx 32rpx;
					border-radius: 12rpx;
					font-size: 32rpx;
					font-weight: 700;
					letter-spacing: 2rpx;
					box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
				}

				.copy-id-btn {
					background: #f0f0f0;
					padding: 16rpx 24rpx;
					border-radius: 12rpx;
					transition: all 0.3s ease;

					&:active {
						background: #e0e0e0;
						transform: scale(0.95);
					}

					.copy-text {
						font-size: 26rpx;
						color: #666;
						font-weight: 500;
					}
				}
			}

			.room-id-tip {
				font-size: 22rpx;
				color: #999;
				line-height: 1.4;
			}
		}

		.qrcode-section {
			margin-bottom: 30rpx;

			.qrcode-title {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 20rpx;
				font-weight: 500;
			}

			.qrcode-container {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 16rpx;

				image {
					width: 400rpx;
					height: 400rpx;
				}

				.qrcode-loading {
					width: 400rpx;
					height: 400rpx;
					border: 2rpx solid #e6e6e6;
					border-radius: 12rpx;
					background: #f8f9fa;
					display: flex;
					align-items: center;
					justify-content: center;

					.loading-text {
						font-size: 24rpx;
						color: #999;
					}
				}
			}

			.qrcode-tip {
				font-size: 24rpx;
				color: #999;
				line-height: 1.4;
			}
		}

		.share-actions {
			display: flex;
			justify-content: space-around;
			margin-bottom: 30rpx;

			.share-action-btn {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 20rpx 16rpx;
				border-radius: 12rpx;
				transition: all 0.3s ease;
				min-width: 120rpx;

				&:active {
					transform: scale(0.95);
				}

				.action-icon {
					font-size: 32rpx;
					margin-bottom: 8rpx;
				}

				.action-text {
					font-size: 22rpx;
					color: #666;
				}

				&.copy-btn {
					background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);

					.action-icon {
						color: #00d2ff;
					}
				}

				&.save-btn {
					background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);

					.action-icon {
						color: #ff8a80;
					}
				}

				&.wechat-btn {
					background: linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%);

					.action-icon {
						color: #4ecdc4;
					}
				}
			}
		}

		.share-close-btn {
			width: 100%;
			padding: 0;
			background: transparent;
			border-radius: 20rpx;

			.share-friend-btn {
				width: 100%;
				padding: 0;
				margin: 0;
				border: none;
				outline: none;
				background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
				border-radius: 20rpx;
				box-shadow: 0 8rpx 32rpx rgba(168, 237, 234, 0.3);
				transition: all 0.3s ease;

				&::after {
					border: none;
				}

				&:active {
					transform: scale(0.95);
					opacity: 0.8;
				}

				.share-btn-text {
					display: block;
					width: 100%;
					padding: 24rpx 0;
					font-size: 32rpx;
					font-weight: 600;
					color: #333;
					text-align: center;
					line-height: 1;
				}
			}
		}

		// 添加脉冲动画
		@keyframes pulse {

			0%,
			100% {
				transform: scale(1);
			}

			50% {
				transform: scale(1.1);
			}
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

	@keyframes pulse {
		0% {
			transform: scale(1);
			opacity: 1;
		}

		50% {
			transform: scale(1.2);
			opacity: 0.7;
		}

		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	/* 响应式设计 */
	@media (max-width: 750rpx) {
		.room-card {
			margin: 80rpx 20rpx 30rpx;
			padding: 30rpx;

			.room-header {
				.room-icon {
					font-size: 40rpx;
				}

				.room-info {
					.room-title {
						font-size: 32rpx;
					}

					.room-subtitle {
						font-size: 22rpx;
					}
				}

				.room-status {
					.status-text {
						font-size: 22rpx;
					}
				}
			}

			.room-stats {
				.stat-item {
					.stat-value {
						font-size: 28rpx;
					}

					.stat-label {
						font-size: 22rpx;
					}
				}
			}
		}

		.players-section {
			margin: 0 20rpx 40rpx;

			.section-title {
				.title-text {
					font-size: 28rpx;
				}

				.title-count {
					font-size: 22rpx;
				}
			}

			.players-grid {
				gap: 16rpx;

				.player-card {
					padding: 24rpx;

					.player-avatar-wrapper {
						margin-right: 20rpx;

						.player-avatar {
							width: 80rpx;
							height: 80rpx;
							border-radius: 40rpx;
						}

						.player-rank {
							width: 28rpx;
							height: 28rpx;
							font-size: 18rpx;
						}

						.crown-icon {
							font-size: 28rpx;
						}
					}

					.player-info {
						.player-name {
							font-size: 28rpx;
						}

						.player-id {
							font-size: 22rpx;
						}
					}

					.player-earnings {
						.earnings-amount {
							font-size: 32rpx;
						}

						.earnings-label {
							font-size: 20rpx;
						}
					}

					.player-actions {
						.action-btn {
							width: 50rpx;
							height: 50rpx;
							border-radius: 25rpx;

							.btn-icon {
								font-size: 24rpx;
							}
						}
					}

					.current-user-badge {
						padding: 6rpx 12rpx;
						font-size: 18rpx;
					}
				}
			}
		}
	}
</style>