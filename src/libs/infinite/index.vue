<template>
  <div>
    <!-- 内容 -->
    <slot></slot>
    <!-- 内容底部的元素 -->
    <div ref="loadingTarget" class="h-6 py-4">
      <!-- 加载更多 -->
      <m-svg-icon
        v-show="loading"
        class="w-4 h-4 mx-auto animate-spin"
        name="infinite-load"
      ></m-svg-icon>
      <!-- 没有更多数据 -->
      <p v-if="isFinished" class="text-center text-base text-zinc-400">
        已经没有更多数据了！
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useVModel, useIntersectionObserver } from '@vueuse/core'

const props = defineProps({
  // 是否处于加载状态
  modelValue: {
    type: Boolean,
    required: true
  },
  // 数据是否全部加载完成
  isFinished: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['onload', 'update:modelValue'])

// 处理 loading 状态
const loading = useVModel(props)

// 内容底部的元素
const loadingTarget = ref(null)
// 记录当前是否在底部
const targetIsIntersecting = ref(false)
useIntersectionObserver(loadingTarget, ([{ isIntersecting }]) => {
  targetIsIntersecting.value = isIntersecting
  emitLoad()
})

/**
 * 触发 load 事件
 */
const emitLoad = () => {
  setTimeout(() => {
    // 当加载更多的视图可见时，处理加载更多的逻辑
    if (targetIsIntersecting.value && !loading.value && !props.isFinished) {
      // 修改加载数据标记
      loading.value = true
      // 触发加载更多的行为
      emits('onload')
    }
  }, 100)
}

/**
 * 监听 loading 的变化，解决数据加载完成之后，首屏未铺满的问题
 */
watch(loading, emitLoad)
</script>

<style scoped></style>
