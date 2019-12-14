<template>
  <div class="user-info-wraper">
    <span class="user-name">{{ user.account_name || '刘晓敏' }}</span>
    <a href="/logout"
      class="login-out">
      <i class="el-icon-switch-button"></i>退出
    </a>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { fLogout } from '@/api/login'

export default {
  computed: {
    ...mapGetters(['user']),
  },
  data() {
    return {
    }
  },
  mounted() {
  },
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
