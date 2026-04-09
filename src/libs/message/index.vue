<template>
  <transition name="down" @after-leave="destroy">
    <div
      v-show="isVisible"
      class="fixed top-[20px] left-1/2 -translate-x-1/2 z-50"
    >
      <div
        class="min-w-[420px] flex items-center px-3 py-1.5 rounded-sm border cursor-pointer"
        :class="styles[type].containerClass"
      >
        <m-svg-icon
          :name="styles[type].icon"
          :fillClass="styles[type].fillClass"
          class="h-1.5 w-1.5 mr-1.5"
        ></m-svg-icon>
        <span class="text-sm" :class="styles[type].textClass">{{
          content
        }}</span>
      </div>
    </div>
  </transition>
</template>

<script>
const SUCCESS = 'success'
const WARN = 'warn'
const ERROR = 'error'

const typeEnum = [SUCCESS, WARN, ERROR]
</script>

<script setup>
import mSvgIcon from '@/libs/svg-icon/index.vue'
import { onMounted, ref } from 'vue'

const props = defineProps({
  // 消息类型
  type: {
    type: String,
    required: true,
    validator(val) {
      const result = typeEnum.includes(val)
      if (!result) {
        throw new Error(`你的 type 必须是 ${typeEnum.join('、')} 中的一个`)
      }
      return result
    }
  },
  // 描述文本
  content: {
    type: String,
    required: true
  },
  // 展示时长
  duration: {
    type: Number,
    default: 2000
  },
  // 关闭时的回调
  destroy: Function
})

// 样式表数据
const styles = {
  warn: {
    icon: 'warn',
    fillClass: 'fill-warn-300',
    textClass: 'text-warn-300',
    containerClass:
      'bg-warn-100 border-warn-200 hover:shadow-lg hover:shadow-warn-100'
  },
  error: {
    icon: 'error',
    fillClass: 'fill-error-300',
    textClass: 'text-error-300',
    containerClass:
      'bg-error-100 border-error-200 hover:shadow-lg hover:shadow-error-100'
  },
  success: {
    icon: 'success',
    fillClass: 'fill-success-300',
    textClass: 'text-success-300',
    containerClass:
      'bg-success-100 border-success-200 hover:shadow-lg hover:shadow-success-100'
  }
}

const isVisible = ref(false)

onMounted(() => {
  isVisible.value = true
  setTimeout(() => {
    isVisible.value = false
  }, props.duration)
})
</script>

<style lang="scss" scoped>
.down-enter-active,
.down-leave-active {
  transition: all 0.5s;
}

.down-enter-from,
.down-leave-to {
  opacity: 0;
  transform: translateY(-100px);
}

.down-enter-to,
.down-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
