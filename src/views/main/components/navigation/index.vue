<!-- 控制移动端和PC端的 navigation 展示组件 -->
<template>
  <mobile-navigation-vue v-if="isMobileTerminal"></mobile-navigation-vue>
  <pc-navigation-vue v-else></pc-navigation-vue>
</template>

<script setup>
import { isMobileTerminal } from '@/utils/flexible'
import MobileNavigationVue from './mobile/index.vue'
import PcNavigationVue from './pc/index.vue'
import { useStore } from 'vuex'

const store = useStore()
store.dispatch('category/useCategoryData')
</script>

<style scoped></style>
