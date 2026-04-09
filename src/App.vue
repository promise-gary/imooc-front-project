<template>
  <div class="h-screen fixed top-0 left-0 w-screen">
    <!-- 一级路由出口 -->
    <!-- <router-view></router-view> -->

    <m-transition-router-view
      :routerType="$store.getters.routerType"
      mainComponentName="home"
    ></m-transition-router-view>
  </div>
</template>

<script setup></script>

<script lang="scss" scoped></script>
