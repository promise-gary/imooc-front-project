<template>
  <div>
    <slot>
      <p class="text-sm">
        {{ showTime }}
      </p>
    </slot>
  </div>
</template>

<script>
// 倒计时结束
const EMITS_FINISH = 'finish'
// 倒计时改变
const EMITS_CHANGE = 'change'
// 倒计时的事件间隔
const INTERVAL_COUNT = 1000
</script>

<script setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import dayjs from './utils'

const props = defineProps({
  // 毫秒
  time: {
    type: Number,
    required: true
  },
  // 遵循 dayjs format 标准
  format: {
    type: String,
    default: 'HH:mm:ss'
  }
})

const emits = defineEmits([EMITS_FINISH, EMITS_CHANGE])

// 倒计时的时长
const duration = ref(0)

/**
 * 开始倒计时
 */
let interval
const start = () => {
  close()
  interval = setInterval(() => {
    durationFn()
  }, INTERVAL_COUNT)
}

/**
 * 倒计时的执行行为
 */
const durationFn = () => {
  duration.value -= INTERVAL_COUNT
  emits(EMITS_CHANGE)
  // 监听结束的行为
  if (duration.value <= 0) {
    duration.value = 0
    emits(EMITS_FINISH)
    close()
  }
}

/**
 * 倒计时结束
 */
const close = () => {
  if (interval) {
    clearInterval(interval)
  }
}
watch(
  () => props.time,
  (val) => {
    duration.value = val
    start()
  },
  {
    immediate: true
  }
)

// 处理显示时间
const showTime = computed(() => {
  return dayjs.duration(duration.value).format(props.format)
})

onUnmounted(() => {
  close()
})
</script>

<style scoped></style>
