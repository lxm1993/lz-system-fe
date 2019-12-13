<template>
  <div class="user-info-wraper">
    <span class="user-name">{{ userName || '刘晓敏' }}</span>
    <a @click="fLoginOut()"
      class="login-out">
      <i class="el-icon-switch-button"></i>退出登陆
    </a>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['userName']),
  },
  methods: {
    fLoginOut() {
      this.$store.dispatch('user/LoginOut')
    }
  },
}
</script>
<style lang="scss" scoped>
.user-info-wraper {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  letter-spacing: 1px;
  .user-name {
    margin: 0 20px;
    color: #3d95f1;
    font-weight: 600;
  }
  .login-out {
    margin-right: 20px;
    color: #606266;
  }
}
</style>
