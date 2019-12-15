<template>
  <div class="page-wraper">
    <create-dialog v-model="createModel"
      width="40%"
      :title="'新建用户'"
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
            width="160px"
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
          placeholder: '请输入用户名,按回车搜索',
          key: 'username', // 默认的搜索字段
        },
        searchButtons: [],
      },
      columns: [
        { prop: 'name', label: '用户Id', 'min-width': 120 },
        { prop: 'name3', label: '用户名', 'min-width': 120 },
        { prop: 'name1', label: '创建时间', 'min-width': 120 },
        { prop: 'name4', label: '修改时间', 'min-width': 120 },
      ],
      createItems: [
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
          prop: 'password',
          formItemAttrs: {
            label: '密码',
            rules: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
          },
          attrs: { placeholder: '用户名', clearable: true, style: 'width: 250px' },
        },
      ],
      createVisible: false,
      createModel: {},
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
