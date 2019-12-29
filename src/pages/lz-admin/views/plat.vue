<template>
  <div class="page-wraper fullsize-flex">
    <create-dialog v-model="createModel"
      width="40%"
      :title="isCreateMode ? '新建平台' : '修改平台'"
      :visible.sync="createVisible"
      :formItems="createItems"
      @submit="fSave"
      @hidden="createVisible=false"></create-dialog>
    <top-search-bar :config="searchItems"
      @fSearch="fSearch"
      @operate="fOperate"></top-search-bar>
    <pagination-pro ref="pageRef"
      url="/admin/plats"
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
import { isvalidPhone } from "@/utils/validate";
import { savePlat, deletePlat } from "@/api/plat"
const validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('电话号码不能为空'))
  } else if (!isvalidPhone(value)) {
    callback(new Error('请输入正确的11位手机号码'))
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
        labelWidth: '90px',
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
            prop: 'platName',
            formItemAttrs: { label: '平台名称', },
            attrs: { clearable: true, style: 'width: 200px', placeholder: '请输入平台名称搜索' },
          },
        ],
      },
      columns: [
        { prop: 'id', label: 'ID', 'min-width': 60 },
        { prop: 'platName', label: '平台名称', 'min-width': 120 },
        { prop: 'manager', label: '联系人', 'min-width': 120 },
        { prop: 'tel', label: '联系电话', 'min-width': 120 },
        { prop: 'remark', label: '备注', 'min-width': 120 },
      ],
      createItems: [
        {
          type: 'Input',
          prop: 'platName',
          formItemAttrs: {
            label: '平台名称',
            rules: [{ required: true, message: '名称不能为空', trigger: 'blur' },
            { max: 30, message: '平台名称最多30个字符', trigger: 'blur' }],
          },
          attrs: { placeholder: '平台名称', clearable: true, style: 'max-width: 250px' },
        },
        {
          type: 'Input',
          prop: 'tel',
          formItemAttrs: {
            label: '电话',
            rules: [{ required: true, trigger: 'blur', validator: validPhone }],
          },
          attrs: { placeholder: '电话', clearable: true, style: 'max-width: 250px' },
        },
        {
          type: 'Input',
          prop: 'manager',
          formItemAttrs: {
            label: '联系人',
            rules: [{ required: true, message: '联系人不能为空', trigger: 'blur' },
            { max: 20, message: '联系人最多20个字符', trigger: 'blur' }],
          },
          attrs: { placeholder: '联系人', clearable: true, style: 'max-width: 250px' },
        },
        {
          type: 'Input',
          prop: 'remark',
          formItemAttrs: {
            label: '备注',
            rules: [{ max: 50, message: '备注最多50个字符', trigger: 'blur' }]
          },
          attrs: { type: 'textarea', placeholder: '备注', clearable: true, style: 'max-width: 300px', rows: 3 },
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
      }
    },
    fSave() {
      let account = { ...this.createModel }
      savePlat(account, this.createModel.id).then(res => {
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
      this.$confirm('确定要删除此平台？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deletePlat(id).then(res => {
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
