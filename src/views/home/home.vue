<template>
  <div id="home">
    <el-container class="bodyBox">
      <el-header>
        <home-header></home-header>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <home-aside></home-aside>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import HomeAside from '@/views/home/childComps/homeAside.vue'
  import homeHeader from '@/views/home/childComps/homeHeader.vue'
  export default {
    name: 'home',
    components: {
      homeHeader,
      HomeAside,
    }
  }
</script>

<style scoped>
  #home,
  #home .bodyBox{
    height: 100%;
    overflow: hidden;
  }

  #home .el-header {
    background-color: #373D41;
    padding-left: 0;
  }

  #home .el-aside {
    background-color: #333744;
  }

  #home .el-main {
    background-color: rgba(255, 255, 255, 0.877);
    height: 100%;
    overflow: auto;
    padding: 0;
  }
</style>