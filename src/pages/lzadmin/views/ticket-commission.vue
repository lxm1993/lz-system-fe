<template>
  <div class="page-wraper fullsize-flex commission-wraper">
    <create-dialog v-model="createModel"
      width="40%"
      :title="isCreateMode ? '新建分佣配置' : '修改分佣配置'"
      :visible.sync="createVisible"
      :formItems="createItems"
      @submit="fSave"
      @hidden="createVisible=false"></create-dialog>
    <top-search-bar :config="searchItems"
      @fSearch="fSearch"
      @operate="fOperate"></top-search-bar>
    <pagination-pro ref="pageRef"
      url="/admin/ticket-commissions"
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
import { saveTicketCommission } from "@/api/ticket";
const validateNumber = (rule, value, callback) => {
  if (value < 1 || value > 100) {
    callback(new Error('比例在1-100之间'))
  } else {
    callback()
  }
}
const validTicketRate = function (rule, value, callback) {
  if (!value) return
  let inputs = value.map(item => {
    return item.value
  }).filter(val => { return !val })
  if (inputs.length > 0) {
    callback(new Error(rule.text))
  } else {
    callback()
  }
}
export default {
  mixins: [listMixins],
  name: 'account',
  components: { TopSearchBar, CreateDialog },
  data() {
    return {
      blistLoading: false,
      searchObject: { name: null },
      searchItems: {
        topButtons: [
          { name: '新建', type: 'primary', isPlain: true, size: 'small', icon: 'el-icon-plus', },
          { name: '导出', type: 'primary', isPlain: true, size: 'small', icon: 'el-icon-download' },
        ],
        searchButtons: [],
      },
      columns: [
        { prop: 'id', label: 'ID', 'width': 80 },
        { prop: 'ticketTypeName', label: '票务类型', 'min-width': 150 },
        { prop: 'platName', label: '平台名称', 'min-width': 150 },
        { prop: 'configStr', label: '分佣配置', 'min-width': 300 },
      ],
      createItems: [
        {
          type: 'Select',
          prop: 'ticketTypeId',
          default: true,
          formItemAttrs: {
            label: '票务类型',
            rules: [{ required: true, message: '请选择票务类型', trigger: 'blur' }],
          },
          attrs: { placeholder: '请选择票务类型', clearable: true, style: 'max-width:230px' },
          listGetter: {
            url: '/base/ticket-types',
            params: {},
            keyMap: { list: 'data' },
            data: [],
          }
        },
        {
          type: 'Select',
          prop: 'platId',
          default: true,
          formItemAttrs: {
            label: '平台',
            rules: [{ required: true, message: '请选择平台', trigger: 'blur' }],
          },
          attrs: { placeholder: '请选择平台名称', clearable: true, style: 'max-width:230px' },
          listGetter: {
            url: '/base/plats',
            params: {},
            keyMap: { list: 'data' },
            data: [],
          }
        },
        {
          type: 'MultiInput',
          prop: 'config',
          formItemAttrs: {
            label: '分佣比例',
            rules: [{ required: true, trigger: 'blur', validator: validTicketRate, text: '分佣比例不能为空', }],
          },
          attrs: { type: 'number', placeholder: '1-100', clearable: true, style: 'width:420px' },
          append: { type: 'TimePicker' }
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
      ],
      createVisible: false,
      createModel: {},
      isCreateMode: true
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
        this.fExportExcel('/admin/export-excel/ticket-commissions', this.searchObject, 'ticket-commissions')
      }
    },
    fSave() {
      let model = { ...this.createModel }
      saveTicketCommission(model, this.createModel.id).then(res => {
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
.commission-wraper {
  .el-dialog {
    min-width: 600px;
  }
}
</style>
