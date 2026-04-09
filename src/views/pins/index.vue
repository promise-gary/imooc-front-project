<template>
  <div class="w-full h-full bg-zinc-200 dark:bg-zinc-800">
    <pins-vue :id="$route.params.id"></pins-vue>
  </div>
</template>

<script setup>
defineOptions({
  name: 'pins'
})

import PinsVue from '@/views/pins/components/pins.vue'
</script>

<style scoped></style>
