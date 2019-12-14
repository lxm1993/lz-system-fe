<template>
  <div class="user-info-wraper">
    <span class="user-name">{{ user.account_name || '' }}</span>
    <a @click="fLogout"
      class="login-out">
      <i class="el-icon-switch-button"></i>退出
    </a>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    user() {
      return this.$store.state.user || {}
    }
  },
  methods: {
    fLogout() {
      this.$store.dispatch('LoginOut')
      this.$router.push({ path: '/login' })
    }
  }
}
</script>
<style lang="scss" scoped>
.user-info-wraper {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 1px;
  .user-name {
    margin: 0 20px;
    color: #3d95f1;
  }
  .login-out {
    margin-right: 20px;
    color: #606266;
    &:hover {
      color: #3d95f1;
    }
  }
}
</style>
