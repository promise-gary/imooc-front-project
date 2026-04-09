<template>
  <div>
    <!-- 蒙版 -->
    <transition name="fade">
      <div
        v-if="isVisible"
        class="w-screen h-screen bg-zinc-900/80 z-40 fixed top-0 left-0"
        @click="close"
      ></div>
    </transition>
    <!-- 内容 -->
    <transition name="up">
      <div
        v-if="isVisible"
        class="w-[80%] fixed top-1/3 left-1/2 -translate-x-1/2 z-50 xl:w-[35%]"
      >
        <div
          class="px-2 py-1.5 rounded-sm border dark:border-zinc-600 cursor-pointer bg-white dark:bg-zinc-800"
        >
          <!-- 标题 -->
          <div class="text-lg font-bold text-zinc-900 dark:text-zinc-200 mb-2">
            {{ title }}
          </div>

          <!-- 文本 -->
          <div class="text-base text-zinc-900 dark:text-zinc-200 mb-2">
            {{ content }}
          </div>

          <!-- 按钮 -->
          <div class="flex justify-end">
            <m-button type="info" class="mr-2" @click="onCancelClick">
              {{ cancelText }}
            </m-button>
            <m-button type="primary" @click="onConfirmClick">
              {{ confirmText }}
            </m-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import mButton from '../button/index.vue'

const props = defineProps({
  // 标题
  title: String,
  // 描述
  content: {
    type: String,
    required: true
  },
  // 取消按钮文本
  cancelText: {
    type: String,
    default: '取消'
  },
  // 确定按钮文本
  confirmText: {
    type: String,
    default: '确定'
  },
  // 取消按钮事件
  cancelHandler: Function,
  // 确定按钮事件
  confirmHandler: Function,
  // 关闭 confirm 的回调
  close: Function
})

const close = () => {
  isVisible.value = false
  setTimeout(
    () => {
      if (props.close) props.close()
    },
    parseInt(duration.replace('0.', '').replace('s', '') * 100)
  )
}

const onCancelClick = () => {
  if (props.cancelHandler) props.cancelHandler()
  close()
}

const onConfirmClick = () => {
  if (props.confirmHandler) props.confirmHandler()
  close()
}

const isVisible = ref(false)

const show = () => {
  isVisible.value = true
}

const duration = '0.5s'

onMounted(() => {
  show()
})
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all v-bind(duration);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.up-enter-active,
.up-leave-active {
  transition: all v-bind(duration);
}

.up-enter-from,
.up-leave-to {
  opacity: 0;
  transform: translateY(100px);
}

.up-enter-to,
.up-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
