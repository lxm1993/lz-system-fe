<template>
  <div class="page-wraper">
    <create-dialog v-model="createModel"
      :title="'新建平台'"
      :visible.sync="createVisible"
      :formItems="createItems"
      @submit="fSave"></create-dialog>
    <top-search-bar :config="searchItems"
      @fSearch="fSearch"
      @operate="fOperate"></top-search-bar>
    <pagination-pro ref="pageRef"
      :loading.sync="blistLoading"
      :autoload="false"
      url="/system/users"
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
            width="200px"
            label="操作">
            <template slot-scope="{row}">
              <el-button size="mini"
                class="inline-block"
                type="primary"
                @click="fEdit(row.id)">编辑</el-button>
              <el-button size="mini"
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

export default {
  mixins: [listMixins],
  name: 'user-index',
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
        defaultSearch: {
          placeholder: '请输入平台名称,按回车搜索',
          key: 'name',
        },
        searchButtons: [],
      },
      columns: [
        { prop: 'name', label: 'ID', 'min-width': 60 },
        { prop: 'name3', label: '平台名称', 'min-width': 120 },
        { prop: 'name1', label: '联系人', 'min-width': 120 },
        { prop: 'name4', label: '联系电话', 'min-width': 120 },
        { prop: 'name5', label: '备注', 'min-width': 120 },
      ],
      createItems: [
        {
          type: 'Input',
          prop: 'platName',
          formItemAttrs: {
            label: '平台名称',
            rules: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          },
          attrs: { placeholder: '用户名', clearable: true, style: 'width: 250px' },
        },
        {
          type: 'Input',
          prop: 'tel',
          formItemAttrs: {
            label: '电话',
            rules: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
          },
          attrs: { placeholder: '电话', clearable: true, style: 'width: 250px' },
        },
        {
          type: 'Input',
          prop: 'tel',
          formItemAttrs: {
            label: '联系人',
            rules: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
          },
          attrs: { placeholder: '联系人', clearable: true, style: 'width: 250px' },
        },
      ],
      createVisible: false,
      createModel: { password: '' },
    }
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
        this.createVisible = true
      }
    },
    fSave() {
      console.log(this.createModel)
    },
    fEdit(id) {

    },
    fDelete(id) {

    },
  },
}
</script>
<style lang="scss" scoped>
</style>
