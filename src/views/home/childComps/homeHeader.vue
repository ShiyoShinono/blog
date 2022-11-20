<template>
  <div id="homeHeader">
    <div class="headerLeft">
      <img src="@/assets/img/logo.jpg" alt="" />
      <span>某不知名博客系统</span>
    </div>
    <el-button
      type="info"
      @click="login"
      class="quitBtn"
      v-if="getRole === '-1'"
      >登录</el-button
    >
    <el-button type="info" @click="logout" class="quitBtn" v-else
      >注销</el-button
    >
  </div>
</template>

<script>
export default {
  name: "homeHeader",
  computed: {
    getRole() {
      return sessionStorage.getItem("message").split(",")[1];
    },
  },
  methods: {
    logout() {
      sessionStorage.clear();
      this.$message.success("退出成功");
      this.$router.push("/signInUp");
    },
    login() {
      sessionStorage.clear();
      this.$router.push("/signInUp");
    },
  },
};
</script>

<style scoped>
#homeHeader {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#homeHeader .headerLeft {
  height: 100%;
  display: flex;
  align-content: center;
}
#homeHeader .headerLeft img {
  height: 60px;
  width: 60px;
  border-radius: 30px;
}
#homeHeader .headerLeft span {
  line-height: 60px;
  color: #fff;
  font-size: 15px;
}
</style>