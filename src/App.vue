<template>
  <div id="app">
  <router-view v-slot="{ Component }">
    <keep-alive include="homeAside">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  </div>
</template>

<style>
  @import url('~@/assets/css/base.css');
</style>
