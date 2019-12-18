<template>
  <div class="page-wraper">
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
      :loading.sync="blistLoading"
      :autoload="false"
      url="/admin/ticket-commissions"
      method="get"
      :params="searchObject">
      <template slot-scope="{ data }">
        <el-table :data="data"
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
          <el-table-column fixed="right"
            align="center"
            width="230px"
            label="操作">
            <template slot-scope="{row}">
              <el-button size="mini"
                class="inline-block"
                type="primary"
                @click="fEdit(row)">编辑</el-button>
              <el-button size="mini"
                type="danger"
                class="inline-block"
                @click="fDelete(row.id)">删除</el-button>
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
import { saveTicketCommission, deleteTicketCommission } from "@/api/ticket";
const validateNumber = (rule, value, callback) => {
  if (value < 1 || value > 100) {
    callback(new Error('比例在1-100之间'))
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
          {
            name: '新建',
            type: 'primary',
            icon: 'el-icon-plus',
          },
        ],
        searchButtons: [],
      },
      columns: [
        { prop: 'id', label: 'Id', 'width': 80 },
        { prop: 'ticketTypeName', label: '票务类型', 'min-width': 150 },
        { prop: 'platName', label: '平台名称', 'min-width': 150 },
        { prop: 'serviceTimeStr', label: '服务时间', 'min-width': 200 },
        { prop: 'percentStr', label: '分佣比例', 'min-width': 100 },
        { prop: 'commision', label: '服务费', 'min-width': 100 },
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
          attrs: { placeholder: '请选择票务类型', clearable: true, style: 'width:230px' },
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
          attrs: { placeholder: '请选择平台名称', clearable: true, style: 'width:230px' },
          listGetter: {
            url: '/base/plats',
            params: {},
            keyMap: { list: 'data' },
            data: [],
          }
        },
        {
          type: 'TimePicker',
          prop: 'serviceTime',
          formItemAttrs: {
            label: '服务时间',
            rules: [{ required: true, message: '请选择服务时间', trigger: 'blur' }],
          },
          attrs: {
            clearable: true,
            placeholder: '请选择服务时间',
            'is-range': true,
            'start-placeholder': '开始时间',
            'end-placeholder': '结束时间',
            format: 'HH:mm',
            'value-format': 'HH:mm',
            style: 'width:230px'
          },
        },
        {
          type: 'Input',
          prop: 'percent',
          formItemAttrs: {
            label: '分佣比例',
            rules: [{ required: true, message: '分佣比例不能为空', trigger: 'blur' },
            { validator: validateNumber, trigger: 'blur' }],
          },
          attrs: { type: 'number', placeholder: '1-100', clearable: true, style: 'width: 130px' },
        },
        {
          type: 'Input',
          prop: 'commision',
          formItemAttrs: {
            label: '服务费',
            rules: [{ required: true, message: '服务费不能为空', trigger: 'blur' }],
          },
          attrs: { type: 'number', placeholder: '15', clearable: true, style: 'width: 130px' },
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
    fDelete(id) {
      deleteTicketCommission(id).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        });
        this.fReload()
      })
    },
  },
}
</script>
<style lang="scss" scoped>
</style>
