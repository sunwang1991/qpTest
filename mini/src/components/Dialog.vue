<!-- 通用弹框组件 -->
<template>
  <view class="dialog" v-if="modelValue" @click="handleMaskClick">
    <view class="dialog-mask"></view>
    <view class="dialog-box" @click.stop>
      <!-- 标题区域 -->
      <view class="dialog-title" v-if="title || $slots.title">
        <slot name="title">{{ title }}</slot>
      </view>

      <!-- 内容区域 -->
      <view class="dialog-content">
        <slot></slot>
      </view>

      <!-- 底部按钮区域 -->
      <view class="dialog-footer" v-if="showFooter">
        <slot name="footer">
          <view
            v-if="showCancelButton"
            class="dialog-btn cancel-btn"
            @click="handleCancel">
            {{ cancelText }}
          </view>
          <view
            v-if="showConfirmButton"
            class="dialog-btn confirm-btn"
            @click="handleConfirm">
            {{ confirmText }}
          </view>
        </slot>
      </view>
    </view>
  </view>
</template>

<script setup>
// 定义组件名称
defineOptions({
  name: "Dialog",
});

// 定义 props
const props = defineProps({
  // 控制弹框显示/隐藏，支持 v-model
  modelValue: {
    type: Boolean,
    default: false,
  },
  // 弹框标题
  title: {
    type: String,
    default: "提示",
  },
  // 是否显示底部按钮区域
  showFooter: {
    type: Boolean,
    default: true,
  },
  // 是否显示取消按钮
  showCancelButton: {
    type: Boolean,
    default: true,
  },
  // 是否显示确认按钮
  showConfirmButton: {
    type: Boolean,
    default: true,
  },
  // 取消按钮文字
  cancelText: {
    type: String,
    default: "取消",
  },
  // 确认按钮文字
  confirmText: {
    type: String,
    default: "确定",
  },
  // 是否可以通过点击遮罩层关闭
  closeOnClickMask: {
    type: Boolean,
    default: true,
  },
  // 弹框宽度
  width: {
    type: String,
    default: "auto",
  },
});

// 定义 emits
const emit = defineEmits(["update:modelValue", "confirm", "cancel", "close"]);

// 处理取消操作
const handleCancel = () => {
  emit("update:modelValue", false);
  emit("cancel");
  emit("close", "cancel");
};

// 处理确认操作
const handleConfirm = () => {
  emit("update:modelValue", false);
  emit("confirm");
  emit("close", "confirm");
};

// 处理遮罩层点击
const handleMaskClick = () => {
  if (props.closeOnClickMask) {
    handleCancel();
  }
};
</script>

<style scoped lang="scss">
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.dialog-box {
  position: relative;
  background: #fff;
  border-radius: 12rpx;
  min-width: 500rpx;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: dialogShow 0.3s ease-out;
}

.dialog-title {
  padding: 40rpx 40rpx 20rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.dialog-content {
  padding: 40rpx;
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  text-align: center;
  min-height: 80rpx;
}

.dialog-footer {
  display: flex;
  border-top: 1px solid #f0f0f0;
}

.dialog-btn {
  flex: 1;
  height: 88rpx;
  border: none;
  background: none;
  font-size: 32rpx;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-btn {
  color: #666;
  border-right: 1px solid #f0f0f0;
}

.cancel-btn:hover {
  background-color: #f8f8f8;
}

.confirm-btn {
  color: #007aff;
  font-weight: 600;
}

.confirm-btn:hover {
  background-color: #f0f8ff;
}

/* 动画效果 */
@keyframes dialogShow {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 750rpx) {
  .dialog-box {
    min-width: 80%;
    margin: 0 20rpx;
  }

  .dialog-title {
    padding: 30rpx 30rpx 15rpx;
    font-size: 30rpx;
  }

  .dialog-content {
    padding: 30rpx;
    font-size: 26rpx;
  }

  .dialog-btn {
    height: 80rpx;
    font-size: 30rpx;
  }
}
</style>
