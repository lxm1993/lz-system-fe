<template>
  <div class="page-wraper fullsize-flex">
    <create-dialog v-model="createModel"
      width="40%"
      :title="isCreateMode ? '新建用户' : '修改用户'"
      :visible.sync="createVisible"
      :formItems="createItems"
      @submit="fSave"
      @hidden="createVisible=false"></create-dialog>
    <top-search-bar :config="searchItems"
      @fSearch="fSearch"
      @operate="fOperate"></top-search-bar>
    <pagination-pro ref="pageRef"
      url="/admin/accounts"
      method="get"
      :loading.sync="blistLoading"
      :autoload="false"
      :params="searchObject"
      :fullsize="true">
      <template slot-scope="{ data , height}">
        <el-table :data="data"
          :height="height"
          v-loading="blistLoading"
          border
          header-cell-class-name="table-header">
          <el-table-column show-overflow-tooltip
            align="center"
            v-for="v in columns"
            v-bind="v"
            :key="v.prop">
            <template slot-scope="{ row }">
              {{ row | render(v) }}
            </template>
          </el-table-column>
          <el-table-column align="center"
            width="100px"
            label="状态">
            <template slot-scope="{row}">
              <el-tag :type="row.online === 1 ? 'success': 'danger'">
                {{ row.online === 1 ? '启用': '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right"
            align="center"
            width="100px"
            label="操作">
            <template slot-scope="{row}">
              <el-button size="mini"
                class="inline-block"
                type="primary"
                @click="fEdit(row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </pagination-pro>
  </div>
</template>
<script>
import { listMixins } from '@/mixins/index'
import TopSearchBar from '@/components/TopSearchBar'
import CreateDialog from '@/components/CreateDialog'
import { encrypt } from "@/utils/crypto";
import { saveManageAccount, deleteAccount } from "@/api/account";
export default {
  mixins: [listMixins],
  name: 'account',
  components: { TopSearchBar, CreateDialog },
  data() {
    return {
      blistLoading: false,
      searchObject: { name: null },
      searchItems: {
        labelWidth: '80px',
        searchImmediate: true,
        topButtons: [
          { name: '新建', type: 'primary', icon: 'el-icon-plus', },
        ],
        searchButtons: [
          { name: '查询', size: 'small', isPlain: true, icon: 'el-icon-search', type: 'primary' },
        ],
        searchItems: [
          {
            type: 'Input',
            prop: 'accountName',
            formItemAttrs: { label: '用户名', },
            attrs: { clearable: true, style: 'width: 200px', placeholder: '请输入用户名搜索' },
          },
        ],
      },
      columns: [
        { prop: 'id', label: '用户ID', 'min-width': 80 },
        { prop: 'accountName', label: '用户名', 'min-width': 120 },
        { prop: 'createTime', label: '创建时间', 'min-width': 120 },
        { prop: 'modifyTime', label: '修改时间', 'min-width': 120 },
      ],
      createVisible: false,
      createModel: {},
      isCreateMode: true
    }
  },
  computed: {
    createItems: function () {
      return [
        {
          type: 'Input',
          prop: 'accountName',
          formItemAttrs: {
            label: '用户名',
            rules: [{ required: true, message: '用户名不能为空', trigger: 'blur' },
            { min: 2, max: 20, message: '用户名为2-20个字符', trigger: 'blur' }],
          },
          attrs: { placeholder: '用户名', clearable: true, style: 'max-width: 250px' },
        },
        {
          type: 'Input',
          prop: 'password',
          formItemAttrs: {
            label: '密码',
            rules: [{ required: this.isCreateMode, message: '密码不能为空', trigger: 'blur' },
            { min: 6, max: 16, message: '密码为6-16位数字字母下划线', trigger: 'blur' }],
          },
          attrs: { placeholder: '密码', 'show-password': true, clearable: true, style: 'max-width: 250px' },
        },
        {
          type: 'Radio',
          prop: 'online',
          dafault: 1,
          formItemAttrs: {
            label: '状态',
            rules: [{ required: true, message: '请选择', trigger: 'blur' }],
          },
          data: [{ text: '启用', value: 1 },
          { text: '禁用', value: 0 }],
        },
      ]
    }
  },
  created() {
    this.fReload()
  },
  methods: {
    fReload() {
      this.$nextTick(() => {
        this.$refs.pageRef.fReload()
      })
    },
    fSearch(val) {
      this.searchObject = { ...val }
      this.fReload()
    },
    fOperate(btn) {
      if (btn.name === '新建') {
        this.isCreateMode = true
        this.createVisible = true
      }
    },
    fSave() {
      let account = {
        ...this.createModel,
        password: this.createModel.password ? encrypt(this.createModel.password) : '',
        isManage: 1
      }
      saveManageAccount(account, this.createModel.id).then(res => {
        this.createVisible = false
        this.createModel = {}
        this.$message({
          message: res.message,
          type: 'success'
        });
        this.fReload()
      }).catch(e => { })
    },
    fEdit(model) {
      this.isCreateMode = false
      this.createModel = { ...model }
      this.createVisible = true
    },
    fDelete(row) {
      this.$confirm('确定要此用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteAccount(id).then(res => {
          this.$message({
            message: res.message,
            type: 'success'
          });
          this.fReload()
        })
      })
    },
  },
}
</script>
<style lang="scss" scoped>
</style>
