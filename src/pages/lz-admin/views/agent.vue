<template>
  <div class="page-wraper fullsize-flex agent-wraper">
    <create-dialog v-model="createModel"
      width="60%"
      :title="isCreateMode ? '新建代售点' : '修改代售点'"
      :visible.sync="createVisible"
      :formItems="createItems"
      @submit="fSave"
      @hidden="createVisible=false"></create-dialog>
    <top-search-bar :config="searchItems"
      @fSearch="fSearch"
      @operate="fOperate"></top-search-bar>
    <pagination-pro ref="pageRef"
      url="/admin/agents"
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
              <el-tag :type="row.onlineStr === '启用' ? 'success': 'danger'">
                {{ row.onlineStr }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right"
            align="center"
            width="250px"
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
              <el-button size="mini"
                type="info"
                class="inline-block"
                @click="$router.push('/agent/account/' + row.id)">账户管理</el-button>
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
import { isvalidPhone, isValidBankNum } from "@/utils/validate";
import { saveAgent, deleteAgent } from "@/api/agent";
const validPhone = (rule, value, callback) => {
  if (!isvalidPhone(value)) {
    callback(new Error('请输入正确的11位手机号码'))
  } else {
    callback()
  }
}
const validBankCard = (rule, value, callback) => {
  if (value && value.length > 20) {
    callback(new Error('银行卡号最多20个数字'))
  } else if (!/^[0-9]+$/.test(value)) {
    callback(new Error('银行卡号全为数字'))
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
      searchObject: { name: null, serviceTime: [] },
      searchItems: {
        labelWidth: '100px',
        searchImmediate: true,
        topButtons: [
          {
            name: '新建',
            type: 'primary',
            icon: 'el-icon-plus',
          },
        ],
        searchButtons: [
          { name: '查询', size: 'small', isPlain: true, icon: 'el-icon-search', type: 'primary' },
        ],
        searchItems: [
          {
            type: 'Input',
            prop: 'agentName',
            formItemAttrs: { label: '代售点名称', },
            attrs: { clearable: true, style: 'width: 200px', placeholder: '请输入代售点名称搜索' },
          },
        ],
      },
      columns: [
        { prop: 'id', label: 'Id', 'width': 80 },
        { prop: 'agentName', label: '代售点名称', 'min-width': 150 },
        { prop: 'manager', label: '联系人', 'min-width': 100 },
        { prop: 'tel', label: '联系电话', 'min-width': 150 },
        { prop: 'address', label: '商家地址', 'min-width': 200 },
        { prop: 'serviceTypeIdsStr', label: '支持票务类型', 'min-width': 150 },
        { prop: 'serviceTimeStr', label: '出票时间段', 'min-width': 150 },
      ],
      createItems: [
        {
          type: 'Section',
          title: '代售点信息',
          prop: 'section',
          span: 24
        },
        {
          type: 'Input',
          prop: 'agentName',
          span: 12,
          formItemAttrs: {
            label: '代售点名称',
            rules: [{ required: true, message: '用户名不能为空', trigger: 'blur' },
            { min: 2, max: 20, message: '代售点名称为2-20个字符', trigger: 'blur' }],
          },
          attrs: { placeholder: '代售点名称', clearable: true, style: 'max-width: 200px' },
        },
        {
          type: 'Input',
          prop: 'manager',
          span: 12,
          formItemAttrs: {
            label: '联系人姓名',
            rules: [{ max: 10, message: '联系人姓名最多10个字符', trigger: 'blur' }],
          },
          attrs: { placeholder: '联系人', clearable: true, style: 'max-width: 200px' },
        },
        {
          type: 'Input',
          prop: 'tel',
          span: 12,
          formItemAttrs: {
            label: '联系人电话',
            rules: [{ required: true, trigger: 'blur', validator: validPhone }],
          },
          attrs: { placeholder: '电话', clearable: true, style: 'max-width: 200px' },
        },
        {
          type: 'Input',
          prop: 'address',
          span: 12,
          formItemAttrs: {
            label: '商家地址',
            rules: [{ max: 30, message: '商家地址最多30个字符', trigger: 'blur' }],
          },
          attrs: { placeholder: '商家地址', clearable: true, style: 'max-width: 200px' },
        },
        {
          type: 'Select',
          prop: 'serviceTypeIds',
          span: 12,
          default: true,
          formItemAttrs: {
            label: '支持票务类型',
            rules: [{ required: true, message: '请选择票务类型', trigger: 'blur' }],
          },
          attrs: { multiple: true, placeholder: '请选择票务类型', clearable: true, style: 'max-width:230px' },
          listGetter: {
            url: '/base/ticket-types',
            params: {},
            keyMap: { list: 'data' },
            data: [],
          }
        },
        {
          type: 'TimePicker',
          prop: 'serviceTime',
          span: 12,
          formItemAttrs: {
            label: '出票时间段',
            rules: [{ required: true, message: '请选择出票时间段', trigger: 'blur' }],
          },
          attrs: {
            clearable: true,
            placeholder: '请选出票时间段',
            'is-range': true,
            'start-placeholder': '开始时间',
            'end-placeholder': '结束时间',
            format: 'HH:mm',
            'value-format': 'HH:mm',
            style: 'max-width:230px'
          },
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
        {
          type: 'Section',
          title: '财务信息',
          prop: 'section',
          span: 24
        },
        {
          type: 'Input',
          prop: 'alipayAccount',
          span: 12,
          formItemAttrs: {
            label: '支付宝账户',
            rules: [{ max: 10, message: '支付宝账户最多20个字符', trigger: 'blur' }],
          },
          attrs: { placeholder: '支付宝账户', clearable: true, style: 'max-width: 200px' },
        },
        {
          type: 'Input',
          prop: 'bankNumber',
          span: 12,
          formItemAttrs: {
            label: '银行卡号',
            rules: [{ required: false, trigger: 'blur', validator: validBankCard }],
          },
          attrs: { placeholder: '6124850689306613', clearable: true, style: 'max-width: 200px' },
        },
        {
          type: 'Input',
          prop: 'bankName',
          span: 12,
          formItemAttrs: {
            label: '开户银行',
            rules: [{ max: 10, message: '开户银行最多30个字符', trigger: 'blur' }],
          },
          attrs: { placeholder: '望京支行', clearable: true, style: 'max-width: 200px' },
        },
        {
          type: 'Input',
          prop: 'company',
          span: 12,
          formItemAttrs: {
            label: '企业名称',
            rules: [{ max: 10, message: '企业名称最多30个字符', trigger: 'blur' }],
          },
          attrs: { placeholder: '', clearable: true, style: 'max-width: 200px' },
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
      saveAgent(model, this.createModel.id).then(res => {
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
      this.$confirm('确定要删除此代售点以及此代售点下的所有账号？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteAgent(id).then(res => {
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
<style lang="scss">
.agent-wraper {
  .el-dialog {
    min-width: 720px;
  }
}
</style>
