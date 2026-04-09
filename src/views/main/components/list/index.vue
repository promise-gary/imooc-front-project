<template>
  <div>
    <m-infinite
      v-model="loading"
      :isFinished="isFinished"
      @onload="getPexelsData"
    >
      <m-waterfall
        :data="pexelsList"
        nodeKey="id"
        :column="isMobileTerminal ? 2 : 5"
        :picturePreReading="false"
      >
        <template v-slot="{ item, width }">
          <item-vue :data="item" :width="width" @click="onToPins"></item-vue>
        </template>
      </m-waterfall>
    </m-infinite>

    <!-- 详情内容展示 -->
    <transition
      :css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <pins-vue v-if="isVisiblePins" :id="currentPins.id"></pins-vue>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getPexelsList } from '@/api/pexels'
import ItemVue from './item.vue'
import { isMobileTerminal } from '@/utils/flexible'
import { useStore } from 'vuex'
import PinsVue from '@/views/pins/components/pins.vue'
import gsap from 'gsap'
import { useEventListener } from '@vueuse/core'

const store = useStore()

let query = {
  page: 1,
  size: 10
}
// 数据是否在加载中
const loading = ref(false)
// 数据是否全部加载完成
const isFinished = ref(false)
// 数据源
const pexelsList = ref([])
/**
 * 数据加载方法
 */
const getPexelsData = async () => {
  // 数据全部加载完成 return
  if (isFinished.value) return
  // 当完成了第一次请求之后，后续的请求让 page 自增
  if (pexelsList.value.length) query.page += 1
  const res = await getPexelsList(query)
  if (query.page === 1) {
    pexelsList.value = res.list
  } else {
    pexelsList.value.push(...res.list)
  }
  if (pexelsList.value.length === res.total) {
    isFinished.value = true
  }
  loading.value = false
}

/**
 * 通过此方法修改 query，重新发起请求
 */
const resetQuery = (newQuery) => {
  query = { ...query, ...newQuery }
  // 重置状态
  isFinished.value = false
  pexelsList.value = []
}

watch(
  () => store.getters.currentCategory,
  (currentCategory) => {
    resetQuery({
      page: 1,
      categoryId: currentCategory.id
    })
  }
)

watch(
  () => store.getters.searchText,
  (val) => {
    resetQuery({
      page: 1,
      searchText: val
    })
  }
)

// 控制 pins 展示
const isVisiblePins = ref(false)
// 当前选中的 pins 属性
const currentPins = ref({})

/**
 * 监听浏览器后退按钮事件
 */
useEventListener(window, 'popstate', () => {
  isVisiblePins.value = false
})

/**
 * 进入 pins
 */
const onToPins = (item) => {
  // 修改浏览器的 url
  history.pushState(null, null, `/pins/${item.id}`)
  isVisiblePins.value = true
  currentPins.value = item
}

const beforeEnter = (el) => {
  gsap.set(el, {
    scaleX: 0,
    scaleY: 0,
    transformOrigin: '0 0',
    translateX: currentPins.value.location?.translateX,
    translateY: currentPins.value.location?.translateY,
    opacity: 0
  })
}
const enter = (el, done) => {
  gsap.to(el, {
    duration: 0.3,
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    translateY: 0,
    opacity: 1,
    onComplete: done
  })
}
const leave = (el, done) => {
  gsap.to(el, {
    duration: 0.3,
    scaleX: 0,
    scaleY: 0,
    translateX: currentPins.value.location?.translateX,
    translateY: currentPins.value.location?.translateY,
    opacity: 0,
    onComplete: done
  })
}
</script>

<style scoped></style>
