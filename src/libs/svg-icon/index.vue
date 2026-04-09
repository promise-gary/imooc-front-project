<template>
  <svg aria-hidden="true">
    <use :class="fillClass" :href="symbolId" :xlink:href="symbolId" :fill="color"></use>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  color: String,
  fillClass: String
})

// 真实显示的svg图表名（拼接 #icon-）
const symbolId = computed(() => `#icon-${props.name}`)
</script>

<style scoped>

</style>
