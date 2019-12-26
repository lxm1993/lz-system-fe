<template>
  <div class="page-wraper fullsize-flex">
    <create-dialog v-model="createModel"
      width="40%"
      :title="isCreateMode ? '新建票量配置' : '修改票量配置'"
      :visible.sync="createVisible"
      :formItems="createItems"
      @submit="fSave"
      @hidden="createVisible=false"></create-dialog>
    <top-search-bar :config="searchItems"
      @fSearch="fSearch"
      @operate="fOperate"></top-search-bar>
    <pagination-pro ref="pageRef"
      url="/admin/ticket-assigns"
      method="get"
      :loading.sync="blistLoading"
      :autoload="false"
      :fullsize="true"
      :params="searchObject">
      <template slot-scope="{ data, height }">
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
          <el-table-column fixed="right"
            align="center"
            width="200px"
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
import { encrypt } from "@/utils/crypto"
import { isvalidPhone } from "@/utils/validate";
import { saveTicketAssign, deleteTicketAssign } from "@/api/ticket-assign"
const validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入电话号码'))
  } else if (!isvalidPhone(value)) {
    callback(new Error('请输入正确的11位手机号码'))
  } else {
    callback()
  }
}
const validTicketRate = function (rule, value, callback) {
  if (!value) return
  let total = 0
  let inputs = value.map(item => {
    total += Number(item.value)
    return item.value
  }).join('')
  if (total != 100) {
    callback(new Error('票量比例总和必须为100'))
  }
  if (!inputs) {
    callback(new Error(rule.text))
  } else {
    callback()
  }
}
export default {
  mixins: [listMixins],
  name: 'plat',
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
        { prop: 'platName', label: '平台名称', 'min-width': 120 },
        { prop: 'ticketTypeName', label: '票务类型', 'min-width': 120 },
        { prop: 'configStr', label: '分配比例', 'min-width': 260 },
      ],
      createItems: [
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
          type: 'MultiInput',
          prop: 'config',
          formItemAttrs: {
            label: '代售点',
            rules: [{ required: true, trigger: 'blur', validator: validTicketRate, text: '票量比例必填', }],
          },
          attrs: { type: 'number', placeholder: '票量比例填写1-100数字', },
          select: {
            type: 'Select',
            prop: 'select',
            default: true,
            attrs: {
              placeholder: '代售点',
              clearable: true,
              style: 'width: 130px'
            },
            listGetter: {
              url: '/base/agents',
              params: {},
              keyMap: { list: 'data' },
              data: [],
            }
          }
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
      let account = { ...this.createModel }
      saveTicketAssign(account, this.createModel.id).then(res => {
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
      this.$confirm('确定要删除此配置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteTicketAssign(id).then(res => {
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
