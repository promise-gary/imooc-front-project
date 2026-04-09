<template>
  <div
    class="relative"
    ref="containerTarget"
    :style="{ height: containerHeight + 'px' }"
    :class="isMobileTerminal ? 'px-2' : 'px-6'"
  >
    <!-- 因为列数不确定，所以需要根据列数计算每列的宽度，所以等待列宽计算完成，并且有了数据源之后进行渲染 -->
    <template v-if="columnWidth && data.length">
      <div
        class="m-waterfall-item absolute"
        :class="{ 'duration-300': layoutReady }"
        :style="getItemStyle(item)"
        v-for="(item, index) in data"
        :key="nodeKey ? item[nodeKey] : index"
      >
        <slot :item="item" :width="columnWidth" :index="index"></slot>
      </div>
    </template>
    <div v-else>加载中...</div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  getImgElements,
  getAllImg,
  onCompleteImgs,
  getMinHeightColumn,
  getMinHeight,
  getMaxHeight
} from './utils'
import { isMobileTerminal } from '@/utils/flexible'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  nodeKey: String,
  column: {
    type: Number,
    default: 2
  },
  columnSpacing: {
    type: Number,
    default: 20
  },
  rowSpacing: {
    type: Number,
    default: 20
  },
  picturePreReading: {
    type: Boolean,
    default: true
  }
})

// 容器总高度
const containerHeight = ref(0)
// item 布局是否完成
const layoutReady = ref(false)
// 记录每列高度：key - 所在列  val - 列高
const columnHeightObj = ref({})
/**
 * 构建记录各列的高度的对象
 */
const useColumnHeightObj = () => {
  columnHeightObj.value = {}
  for (let i = 0; i < props.column; i++) {
    columnHeightObj.value[i] = 0
  }
}

// 容器实例
const containerTarget = ref(null)
// 容器总宽度（不含 padding、margin、border）
const containerWidth = ref(0)
// 容器左边距
const containerLeft = ref(0)
/**
 * 计算容器宽度
 */
const useContainerWidth = () => {
  const { paddingLeft, paddingRight } = getComputedStyle(
    containerTarget.value,
    null
  )
  containerLeft.value = parseFloat(paddingLeft)
  containerWidth.value =
    containerTarget.value.offsetWidth -
    parseFloat(paddingLeft) -
    parseFloat(paddingRight)
}

// 列宽
const columnWidth = ref(0)
// 列间距合计
const columnSpacingTotal = computed(() => {
  return (props.column - 1) * props.columnSpacing
})
/**
 * 开始计算
 */
const useColumnWidth = () => {
  useContainerWidth()
  columnWidth.value =
    (containerWidth.value - columnSpacingTotal.value) / props.column
}

onMounted(() => {
  useColumnWidth()
})

// item 高度集合
let itemHeights = []
/**
 * 监听图片加载完成 (图片需要预加载的情况)
 */
const waitImgComplete = () => {
  layoutReady.value = false
  itemHeights = []
  let itemElements = [...document.getElementsByClassName('m-waterfall-item')]
  const imgElements = getImgElements(itemElements)
  const allImgs = getAllImg(imgElements)
  onCompleteImgs(allImgs).then(() => {
    itemElements.forEach((el) => {
      itemHeights.push(el.offsetHeight)
    })
    // 渲染位置
    useItemLocation()
  })
}

/**
 * 图片不需要预加载时，计算 item 高度
 */
const useItemHeight = () => {
  layoutReady.value = false
  itemHeights = []
  let itemElements = [...document.getElementsByClassName('m-waterfall-item')]
  itemElements.forEach((el) => {
    itemHeights.push(el.offsetHeight)
  })
  // 渲染位置
  useItemLocation()
}

/**
 * 为每个 item 生成位置属性
 */
const useItemLocation = () => {
  props.data.forEach((item, index) => {
    if (item._style) return
    item._style = {}
    item._style.left = getItemLeft()
    item._style.top = getItemTop()
    increasingHeight(index)
  })

  containerHeight.value = getMaxHeight(columnHeightObj.value)
  layoutReady.value = true
}

const getItemStyle = (item) => {
  const style = {
    width: columnWidth.value + 'px'
  }

  if (!layoutReady.value) {
    style.visibility = 'hidden'
  }

  if (item._style) {
    style.left = item._style.left + 'px'
    style.top = item._style.top + 'px'
  }

  return style
}

/**
 * 返回下一个 item 的left
 */
const getItemLeft = () => {
  const column = getMinHeightColumn(columnHeightObj.value)
  return (
    column * (columnWidth.value + props.columnSpacing) + containerLeft.value
  )
}

const getItemTop = () => {
  return getMinHeight(columnHeightObj.value)
}

const increasingHeight = (index) => {
  const minHeightColumn = getMinHeightColumn(columnHeightObj.value)
  columnHeightObj.value[minHeightColumn] +=
    itemHeights[index] + props.rowSpacing
}

// 触发计算
watch(
  () => props.data,
  (newVal) => {
    nextTick(() => {
      layoutReady.value = false
      const resetColumnHeight = newVal.every((item) => !item._style)
      if (resetColumnHeight) {
        useColumnHeightObj()
      }
      if (props.picturePreReading) {
        waitImgComplete()
      } else {
        useItemHeight()
      }
    })
  },
  {
    immediate: true,
    deep: true
  }
)

const reset = () => {
  setTimeout(() => {
    useColumnWidth()
    props.data.forEach((item) => {
      item._style = null
    })
  }, 100)
}

watch(
  () => props.column,
  () => {
    if (props.picturePreReading) {
      columnWidth.value = 0
    }
    reset()
  }
)

onUnmounted(() => {
  props.data.forEach((item) => {
    delete item._style
  })
})
</script>

<style scoped></style>
