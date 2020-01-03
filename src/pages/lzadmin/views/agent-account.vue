<template>
  <div class="page-wraper fullsize-flex">
    <create-dialog v-model="createModel"
      width="40%"
      :title="isCreateMode ? '新建账号' : '修改账号'"
      :visible.sync="createVisible"
      :formItems="createItems"
      @submit="fSave"
      @hidden="createVisible=false"></create-dialog>
    <top-search-bar :config="searchItems"
      @fSearch="fSearch"
      @operate="fOperate"></top-search-bar>
    <pagination-pro ref="pageRef"
      url="/admin/agent-accounts"
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
import { saveAgentAccount } from "@/api/agent";
export default {
  mixins: [listMixins],
  name: 'account',
  components: { TopSearchBar, CreateDialog },
  data() {
    let agentId = this.$route.params.id
    return {
      agentId: agentId,
      blistLoading: false,
      searchObject: { agentId: agentId },
      searchItems: {
        topButtons: [
          { name: '新建', type: 'primary', isPlain: true, size: 'small', icon: 'el-icon-plus' },
          { name: '导出', type: 'primary', isPlain: true, size: 'small', icon: 'el-icon-download' },
        ],
        searchButtons: [],
      },
      columns: [
        { prop: 'id', label: '用户ID', 'min-width': 80 },
        { prop: 'accountName', label: '用户名', 'min-width': 120 },
        { prop: 'agentName', label: '所属商家', 'min-width': 120 },
        { prop: 'createTime', label: '创建时间', 'min-width': 160 },
        { prop: 'modifyTime', label: '修改时间', 'min-width': 160 },
      ],
      createVisible: false,
      createModel: {},
      isCreateMode: true,
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
      } else if (btn.name === '导出') {
        this.fExportExcel('/admin/export-excel/agent-accounts', this.searchObject, 'agent-accounts')
      }
    },
    fSave() {
      let account = {
        ...this.createModel,
        password: this.createModel.password ? encrypt(this.createModel.password) : '',
        isManage: 0,
        agentId: this.agentId
      }
      saveAgentAccount(account, this.createModel.id).then(res => {
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
  },
}
</script>
<style lang="scss">
.agent-wraper {
  .el-dialog {
    //min-width: 720px;
  }
}
</style>
