<template>
  <div class="h-screen">
    <!-- 需要在 tailwind 中定义 h-header 高度 -->
    <header-vue class="h-header"></header-vue>
    <div class="h-main">
      <main-vue></main-vue>
    </div>
    <floating-vue></floating-vue>
  </div>
</template>

<script setup>
import HeaderVue from './components/header/index.vue'
import MainVue from './components/main.vue'
import FloatingVue from './components/floating/index.vue'
</script>

<style scoped></style>
