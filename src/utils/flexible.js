import { PC_DEVICE_WIDTH } from '@/constants/index.js'
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()

export const isMobileTerminal = computed(() => {
  return width.value < PC_DEVICE_WIDTH
})

/**
 * 初始化 rem 基准值，最大为 40px
 */
export const useREM = () => {
  const MAX_FONT_SIZE = 40

  document.addEventListener('DOMContentLoaded',() => {
    const html = document.querySelector('html')
    // 获取根元素 fontsize 标准，屏幕宽度/10。(以 Iphone 为例 Iphone 6 屏幕宽度为 375, 则标准font-size为 37.5）
    let fontSize = window.innerWidth / 10
    fontSize = Math.min(MAX_FONT_SIZE,fontSize)
    html.style.fontSize = fontSize + 'px'
  })
}