<template>
  <div class="page-wraper fullsize-flex">
    <create-dialog v-model="createModel"
      width="40%"
      :title="isCreateMode ? '新建票务类型' : '修改票务类型'"
      :visible.sync="createVisible"
      :formItems="createItems"
      @submit="fSave"
      @hidden="createVisible=false"></create-dialog>
    <top-search-bar :config="searchItems"
      @fSearch="fSearch"
      @operate="fOperate"></top-search-bar>
    <pagination-pro ref="pageRef"
      url="/admin/ticket-types"
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
import { encrypt } from "@/utils/crypto";
import { saveTicketType, deleteTicketType } from "@/api/ticket";
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
        { prop: 'id', label: 'Id', 'min-width': 120 },
        { prop: 'name', label: '票务类型', 'min-width': 200 },
      ],
      createItems: [
        {
          type: 'Input',
          prop: 'name',
          formItemAttrs: {
            label: '票务类型',
            rules: [{ required: true, message: '票务类型不能为空', trigger: 'blur' }],
          },
          attrs: { placeholder: '票务类型', clearable: true, style: 'max-width: 250px' },
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
      let model = { ...this.createModel, }
      saveTicketType(model, this.createModel.id).then(res => {
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
      this.$confirm('确定要删除此票务类型？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteTicketType(id).then(res => {
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
