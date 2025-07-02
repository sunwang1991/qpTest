<template>
  <view class="container">
    <!-- 对局记录列表 -->
    <view class="game-records-container">
      <!-- 加载状态 -->
      <view
        v-if="loading && gameRecords.length === 0"
        class="loading-container">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 空状态 -->
      <view
        v-else-if="!loading && gameRecords.length === 0"
        class="empty-container">
        <view class="empty-icon">📋</view>
        <text class="empty-text">暂无对局记录</text>
        <text class="empty-subtitle">开始游戏后记录会显示在这里</text>
      </view>

      <!-- 记录列表 -->
      <view v-else class="records-list">
        <view v-for="item in gameRecords" :key="item.id" class="record-item">
          <!-- 房间基本信息 -->
          <view class="room-info">
            <view class="room-header">
              <text class="room-name">{{ item.roomName }}</text>
              <text
                class="status"
                :class="item.statusFlag === '1' ? 'active' : 'finished'">
                {{ item.statusText }}
              </text>
            </view>

            <view class="room-meta">
              <text class="time">{{ item.createTimeFormatted }}</text>
              <text class="member-count">{{ item.memberCount }}人参与</text>
              <text class="total-amount"
                >总交易: {{ item.totalTransactionAmount }}</text
              >
            </view>
          </view>

          <!-- 成员收入情况 -->
          <view class="members-income">
            <text class="section-title">成员收入情况</text>
            <view class="members-list">
              <view
                v-for="member in item.membersIncome"
                :key="member.userId"
                class="member-item">
                <view class="member-info">
                  <image
                    :src="member.avatar"
                    class="avatar"
                    mode="aspectFill"></image>
                  <text class="nickname">{{ member.nickName }}</text>
                </view>

                <view class="income-info">
                  <text
                    class="net-amount"
                    :class="member.netAmount >= 0 ? 'win' : 'lose'">
                    {{ member.netAmount >= 0 ? "+" : "" }}{{ member.netAmount }}
                  </text>
                  <view class="detail">
                    <text class="receive">收入: {{ member.totalReceive }}</text>
                    <text class="pay">支出: {{ member.totalPay }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 加载更多 -->
        <view v-if="pagination.hasNext" class="load-more" @click="loadMore">
          <text v-if="!loadingMore">加载更多</text>
          <text v-else>加载中...</text>
        </view>

        <view
          v-if="!pagination.hasNext && gameRecords.length > 0"
          class="no-more">
          <text>没有更多记录了</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();

// 响应式数据
const gameRecords = ref([]);
const pagination = ref({});
const loading = ref(false);
const loadingMore = ref(false);
const currentPage = ref(1);

// 返回上一页
const goBack = () => {
  proxy.$tab.navigateBack();
};

// 获取对局记录
const getGameRecords = async (params = {}) => {
  try {
    const response = await proxy.$request("mini/room/game-records", {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      userId: params.userId,
    });
    return response.data;
  } catch (error) {
    console.error("获取对局记录失败:", error);
    proxy.$modal.msgError("获取数据失败");
    return null;
  }
};

// 加载对局记录
const loadGameRecords = async (page = 1) => {
  if (page === 1) {
    loading.value = true;
  } else {
    loadingMore.value = true;
  }

  const result = await getGameRecords({
    page,
    pageSize: 10,
    userId: uni.getStorageSync("userId"),
  });

  if (result) {
    if (page === 1) {
      gameRecords.value = result.records;
    } else {
      gameRecords.value = [...gameRecords.value, ...result.records];
    }
    pagination.value = result.pagination;
    currentPage.value = page;
  }

  loading.value = false;
  loadingMore.value = false;
};

// 加载更多
const loadMore = () => {
  if (pagination.value.hasNext && !loadingMore.value) {
    loadGameRecords(currentPage.value + 1);
  }
};

// 页面加载时获取数据
onMounted(() => {
  loadGameRecords(1);
});
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

/* 自定义导航栏 */
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
  padding-top: var(--status-bar-height);

  .navbar-content {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32rpx;

    .navbar-left {
      width: 80rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .back-icon {
        font-size: 36rpx;
        color: #333;
        font-weight: 600;
      }
    }

    .navbar-title {
      flex: 1;
      text-align: center;

      .title-text {
        font-size: 36rpx;
        font-weight: 600;
        color: #333;
      }
    }

    .navbar-right {
      width: 80rpx;
    }
  }
}

.game-records-container {
  padding: 140rpx 32rpx 32rpx;
  min-height: 100vh;
}

/* 加载状态 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;

  .loading-text {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

/* 空状态 */
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400rpx;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 32rpx;
    opacity: 0.6;
  }

  .empty-text {
    font-size: 32rpx;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 16rpx;
    font-weight: 500;
  }

  .empty-subtitle {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.6);
  }
}

/* 记录列表 */
.records-list {
  .record-item {
    background: rgba(255, 255, 255, 0.95);
    margin-bottom: 32rpx;
    border-radius: 24rpx;
    padding: 32rpx;
    backdrop-filter: blur(10px);
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);

    &:last-child {
      margin-bottom: 0;
    }
  }

  .room-info {
    margin-bottom: 32rpx;

    .room-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .room-name {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        flex: 1;
      }

      .status {
        padding: 8rpx 16rpx;
        border-radius: 20rpx;
        font-size: 24rpx;
        color: white;
        font-weight: 500;

        &.active {
          background: #2ed573;
        }

        &.finished {
          background: #999;
        }
      }
    }

    .room-meta {
      display: flex;
      justify-content: space-between;
      font-size: 24rpx;
      color: #666;
      flex-wrap: wrap;
      gap: 16rpx;
    }
  }

  .members-income {
    border-top: 1rpx solid #eee;
    padding-top: 32rpx;

    .section-title {
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 24rpx;
      display: block;
    }

    .member-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .member-info {
        display: flex;
        align-items: center;
        flex: 1;

        .avatar {
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }

        .nickname {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
        }
      }

      .income-info {
        text-align: right;

        .net-amount {
          font-size: 32rpx;
          font-weight: 700;
          display: block;
          margin-bottom: 8rpx;

          &.win {
            color: #2ed573;
          }

          &.lose {
            color: #ff4757;
          }
        }

        .detail {
          font-size: 22rpx;
          color: #666;

          .receive,
          .pay {
            display: block;
            line-height: 1.4;
          }
        }
      }
    }
  }

  .load-more,
  .no-more {
    text-align: center;
    padding: 40rpx;
    color: rgba(255, 255, 255, 0.8);
    font-size: 28rpx;
    margin-top: 32rpx;
  }

  .load-more {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16rpx;
    transition: all 0.3s ease;

    &:active {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(0.98);
    }
  }
}
</style>
