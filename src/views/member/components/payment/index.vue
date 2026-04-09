<template>
  <div>
    <!-- pc端 支付 -->
    <pc-payment-vue v-if="!isMobileTerminal"></pc-payment-vue>
    <!-- 移动端支付 -->
    <mobile-payment-vue v-else></mobile-payment-vue>
  </div>
</template>

<script setup>
import { isMobileTerminal } from '@/utils/flexible'
import PcPaymentVue from './pc-payment/index.vue'
import MobilePaymentVue from './mobile-payment/index.vue'
</script>

<style scoped></style>
