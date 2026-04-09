<template>
  <div class="bg-white sticky top-0 left-0 z-10 dark:bg-zinc-900 duration-500">
    <ul
      ref="ulTarget"
      class="relative flex overflow-x-auto p-1 text-xs text-zinc-600 overflow-hidden"
    >
      <!-- 汉堡按钮 -->
      <li
        class="z-20 fixed top-0 -right-px h-4 px-1 flex items-center bg-white shadow-l-white dark:bg-zinc-900 dark:shadow-l-zinc"
        @click="isOpenPopup = !isOpenPopup"
      >
        <m-svg-icon class="w-1.5 h-1.5" name="hamburger"></m-svg-icon>
      </li>
      <!-- 滑块 -->
      <li
        ref="sliderTarget"
        class="absolute h-[22px] bg-zinc-900 rounded-lg duration-200 dark:bg-zinc-800"
        :style="sliderStyle"
      ></li>
      <li
        :ref="setItemRef"
        v-for="(item, index) in $store.getters.categorys"
        :key="item.id"
        class="shrink-0 px-1.5 py-0.5 z-10 duration-200 last:mr-4"
        :class="{
          'text-zinc-100': $store.getters.currentCategoryIndex === index
        }"
        @click="onItemClick(item)"
      >
        {{ item.name }}
      </li>
    </ul>
    <m-popup v-model="isOpenPopup">
      <menu-vue @onItemClick="onItemClick"></menu-vue>
    </m-popup>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUpdate } from 'vue'
import { useScroll } from '@vueuse/core'
import MenuVue from '../../menu/index.vue'
import { useStore } from 'vuex'

// 滑块
const sliderStyle = ref({
  transform: 'translateX(0px)',
  width: '52px'
})

const store = useStore()

// 获取填充的所有 item 元素
let itemRefs = []
const setItemRef = (el) => {
  if (el) {
    itemRefs.push(el)
  }
}
onBeforeUpdate(() => {
  itemRefs = []
})
// 获取 ul 元素，以计算偏移位置
const ulTarget = ref(null)
const { x: ulScrollLeft } = useScroll(ulTarget)

watch(
  () => store.getters.currentCategoryIndex,
  (val) => {
    // 获取选中元素的 left、width
    const { left, width } = itemRefs[val].getBoundingClientRect()
    sliderStyle.value = {
      transform: `translateX(${ulScrollLeft.value + left - 10 + 'px'})`,
      width: width + 'px'
    }
  }
)

const onItemClick = (item) => {
  store.commit('app/changeCurrentCategory', item)
  isOpenPopup.value = false
}

// 控制 popup
const isOpenPopup = ref(false)
</script>

<style scoped></style>
