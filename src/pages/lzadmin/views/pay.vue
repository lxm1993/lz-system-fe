<template>
  <div class="page-wraper fullsize-flex">
    <top-search-bar :config="searchItems"
      @fSearch="fSearch"></top-search-bar>
    <pagination-pro ref="pageRef"
      url="/admin/pays"
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
            label="结算状态">
            <template slot-scope="{row}">
              <el-tag :type="row.isPay? 'success': 'danger'">
                {{ row.isPay? '已结算': '未结算' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right"
            align="center"
            width="230px"
            label="操作">
            <template slot-scope="{row}">
              <el-button v-if="!row.isPay"
                size="mini"
                class="inline-block"
                type="primary"
                @click="fPay(row)">确认结算</el-button>
              <el-button size="mini"
                class="inline-block"
                type="primary"
                @click="fEdit(row)">添加备注</el-button>
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
import { payOders } from "@/api/pay";
export default {
  mixins: [listMixins],
  name: 'account',
  components: { TopSearchBar },
  data() {
    return {
      blistLoading: false,
      searchObject: { name: null },
      searchItems: {
        labelWidth: '80px',
        searchImmediate: true,
        topButtons: [],
        searchButtons: [
          { name: '查询', size: 'small', isPlain: true, icon: 'el-icon-search', type: 'primary' },
        ],
        searchItems: [
          {
            type: 'Select',
            prop: 'payStatus',
            formItemAttrs: { label: '结算状态' },
            attrs: { clearable: true, style: 'width: 150px' },
            data: [
              { datavalue: '', dataname: '全部' },
              { datavalue: '1', dataname: '已结算' },
              { datavalue: '2', dataname: '未结算' }],
          },
          {
            type: 'Select',
            prop: 'agent_id',
            formItemAttrs: { label: '售票点' },
            attrs: { clearable: true, style: 'width: 150px' },
            listGetter: {
              url: '/base/agents',
              params: {},
              keyMap: { list: 'data' },
              data: [],
            }
          },
          {
            type: 'DataPicker',
            prop: 'gmt_create',
            formItemAttrs: {
              label: '订单日期',
            },
            attrs: {
              clearable: true,
              type: 'daterange',
              'start-placeholder': '开始日期',
              'end-placeholder': '结束日期',
              format: 'yyyy-MM-dd',
              'value-format': 'yyyy-MM-dd',
              style: 'width: 300px'
            },
          },
        ],
      },
      columns: [
        { prop: 'date', label: '日期', 'min-width': 120 },
        { prop: 'agentName', label: '代售点名称', 'min-width': 100 },
        { prop: 'payMoneys', label: '结算金额', 'min-width': 120 },
      ],
    }
  },
  created() {
    //  this.fReload()
  },
  methods: {
    fReload() {
      this.$nextTick(() => {
        this.$refs.pageRef.fReload()
      })
    },
    fSearch(val) {
      this.searchObject = { ...val, gmt_create: JSON.stringify(val.gmt_create) }
      this.fReload()
    },
    fPay(row) {
      this.$confirm('确定结算？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        payOders({
          date: row.date,
          agentId: row.agentId
        }).then(res => {
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
