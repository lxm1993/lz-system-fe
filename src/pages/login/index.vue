<template>
  <div class="login-wraper">
    <el-form ref="loginForm"
      :model="loginObj"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left">
      <div class="plat-title">灵众票务平台</div>
      <div class="notice">{{ errMessage }}</div>
      <el-form-item prop="username">
        <span class="svg-container"><i class="el-icon-user-solid"></i></span>
        <el-input ref="username"
          v-model="loginObj.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container"><i class="el-icon-view"></i></span>
        <el-input :key="passwordType"
          ref="password"
          v-model="loginObj.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="fHandleLogin" />
        <span class="show-pwd"
          @click="showPwd">
          <i :class="passwordType === 'password' ? 'el-icon-lock' : 'el-icon-unlock'"></i>
        </span>
      </el-form-item>
      <el-button :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="fHandleLogin">登录</el-button>
    </el-form>
  </div>
</template>
<script>
import { detailMixins } from "@/mixins";
import { fLogin } from '@/api/login';
import { setToken } from '@/utils/token';
import { encrypt } from "@/utils/crypto";
export default {
  mixins: [detailMixins],
  name: "Login",
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码大于6位"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      errMessage: '',
      passwordType: "password",
      loginObj: { username: "", password: "", admin: this.$route.meta.admin },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入用户名" }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
    };
  },
  methods: {
    showPwd() {
      this.passwordType = this.passwordType === "" ? "password" : ""
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    fHandleLogin() {
      this.fVelidateForm(this.$refs.loginForm, async () => {
        this.errMessage = ''
        let user = {
          ...this.loginObj,
          password: encrypt(this.loginObj.password)
        }
        this.loading = false
        fLogin(user).then(res => {
          if (res.code === 200) {
            let data = res.data
            let systemType = this.$store.state.admin ? 'lzadmin' : 'lzplat'
            setToken(`${systemType}-token`, data.token)
            this.$store.commit('SET_USER', data.user)
            this.$router.push({ path: '/' })
          } else {
            this.errMessage = res.message
          }
        }).catch(() => {
          this.loading = false
        })
      });
    }
  }
};
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-wraper .el-input input {
    color: $cursor;
  }
}
.login-wraper {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>
<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-wraper {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 0;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
    .notice {
      height: 20px;
      font-size: 12px;
      color: #fc4343;
      margin-bottom: 5px;
      display: block;
      text-align: left;
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .plat-title {
    font-size: 20px;
    margin-bottom: 10px;
    color: #fff;
    font-weight: 600;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
