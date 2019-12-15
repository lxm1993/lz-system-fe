<template>
  <div class="page-wraper">
    <create-dialog v-model="createModel"
      :title="'飞猪平台票量分类'"
      :width="'45%'"
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
          placeholder: '请输入平台名,按回车搜索',
          key: 'username', // 默认的搜索字段
        },
        searchButtons: [],
      },
      columns: [
        { prop: 'name', label: '平台名称', 'min-width': 120 },
        { prop: 'name3', label: '分配比例', 'min-width': 260 },
      ],
      createItems: [
        {
          type: 'Select',
          prop: 'plat',
          formItemAttrs: {
            label: '平台',
            rules: [{ required: true, message: '请选择', trigger: 'blur' }],
          },
          attrs: { clearable: true, style: 'width: 200px' },
          listGetter: {
            url: '/basemappings',
            params: { datatype: 'plat' },
            keyMap: { list: 'data' },
            data: [],
            optionValue: 'map_value',
            optionName: 'map_name',
          }
        },
        {
          type: 'Select',
          prop: 'plat1',
          formItemAttrs: {
            label: '票务类型',
            rules: [{ required: true, message: '请选择', trigger: 'blur' }],
          },
          attrs: { clearable: true, style: 'width: 200px' },
          listGetter: {
            url: '/basemappings',
            params: { datatype: 'plat' },
            keyMap: { list: 'data' },
            data: [],
            optionValue: 'map_value',
            optionName: 'map_name',
          }
        },
        {
          type: 'MultiInput',
          prop: 'plat2',
          formItemAttrs: {
            label: '代售点',
            rules: [{ required: true, message: '请填写比例', trigger: 'blur' }],
          },
          attrs: { style: 'width: 380px', placeholder: '票量比例,请填写1-100数字', },
          select: {
            type: 'Select',
            prop: 'select',
            attrs: {
              placeholder: '代售点',
              clearable: true,
              style: 'width: 130px'
            },
            listGetter: {
              url: '/basemappings',
              params: { datatype: 'plat' },
              keyMap: { list: 'data' },
              data: [],
              optionValue: 'map_value',
              optionName: 'map_name',
            }
          }
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
