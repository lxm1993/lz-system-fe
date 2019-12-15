<template>
  <div class="create-user-container">
    <create-view v-model="userInfo"
      :formItems="formItems"
      label-position="right"
      label-width="120px"
      @submit="fSaveUser"></create-view>
  </div>
</template>
<script>
import { detailMixins } from '@/mixins/index'
// import { fSaveUser, fGetUserInfo } from '@/api/system/users'
import { toString, omit } from 'lodash'
import CreateView from '@/components/CreateView'

export default {
  mixins: [detailMixins],
  components: { CreateView },
  data() {
    let isEdit = this.$route.meta.action === 'edit'
    return {
      userInfo: {}, // 1 代表内部用户
      allRoles: [],
      formItems: [
        {
          type: 'Section',
          title: '用户信息', // 部分标题
          prop: 'baseInfo',
        },
        {
          type: 'Input',
          prop: 'username',
          formItemAttrs: {
            label: '用户名',
            rules: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
          },
          attrs: { placeholder: '用户名', clearable: true, style: 'width: 250px' },
        },
        {
          type: 'Input',
          prop: 'username',
          formItemAttrs: {
            label: '密码',
            rules: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
          },
          attrs: { placeholder: '用户名', clearable: true, style: 'width: 250px' },
        },
      ],
    }
  },
  created() {
    if (!this.isCreate) {
      this.fGetUserInfo()
    }
  },
  methods: {
    fGetUserInfo() {
      fGetUserInfo(this.$route.params.id).then(response => {
        let user = response.data
        this.userInfo = {
          ...user,
          username: user.username.split('@')[0],
          status: toString(user.status),
          roleList: user.roleList ? user.roleList.split(',') : [],
        }
        console.log(this.userInfo)
      })
    },
    fSaveUser() {
      let emailSub = '@sohu-inc.com'
      let saveUser = {
        ...omit(this.userInfo, 'creator'),
        username: !this.userInfo.username.includes(emailSub)
          ? `${this.userInfo.username}${emailSub}`
          : this.userInfo.username,
        roleList: Object.keys(this.userInfo.roleList).join(),
        roleNameList: Object.values(this.userInfo.roleList).join(),
        status: this.isCreate ? '1' : this.userInfo.status,
      }
      if (this.isEdit) {
        saveUser.id = this.$route.params.id
      }
      fSaveUser(saveUser, this.isCreate).then(response => {
        if (response.code === 200) {
          this.$message({
            message: response.msg,
            type: "success"
          });
          this.$router.back()
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.user-form >>> .el-input--suffix .el-input__inner {
  width: 400px;
}
</style>
