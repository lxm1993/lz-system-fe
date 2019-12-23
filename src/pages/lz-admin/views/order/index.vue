<template>
  <div class="page-wraper fullsize-flex">
    <top-search-bar :config="searchConfig"
      @fSearch="fSearch"
      @operate="fOperate"></top-search-bar>
    <pagination-pro :loading.sync="bIsLoading"
      ref="pageRef"
      url="/admin/orders"
      :fullsize="true"
      :autoload="false"
      :params="searchObject">
      <template slot-scope="{ data , height}">
        <el-table :data="data"
          :height="height"
          v-loading="bIsLoading"
          ref="rolesTable"
          border
          header-cell-class-name="table-header">
          <el-table-column show-overflow-tooltip
            align="center"
            v-for="v in columns"
            v-bind="v"
            :key="v.prop">
            <template slot-scope="{ row }">
              <div v-if="v.type === 'list'"
                type="warning">
                <div v-for="(item, index) in row[v.prop]"
                  :key="index">
                  {{item}}
                </div>
              </div>
              <el-tag v-else-if="v.type === 'tag'"
                type="warning">
                {{ row | render(v) }}
              </el-tag>
              <span v-else>
                {{ row | render(v) }}
              </span>
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
                @click="$router.push('/order/view/' + row.id)">查看</el-button>
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
import { getCurrentTime, getDate } from '@/utils/index'
export default {
  mixins: [listMixins],
  components: { TopSearchBar },
  data() {
    let currentDate = new Date()
    return {
      bIsLoading: false,
      searchObject: {},
      orderImg: require('@/assets/img/order.png'),
      columns: [
        { prop: 'id', label: '订单ID', 'min-width': 150 },
        { prop: 'tickettype_name', label: '订单类型', 'min-width': 120 },
        { prop: 'plat_name', label: '平台', 'min-width': 120 },
        { prop: 'agent_name', label: '售票点', 'min-width': 150 },
        { prop: 'telephone', label: '联系电话', 'min-width': 120 },
        { prop: 'passengers', label: '乘客信息', 'min-width': 200, type: 'list' },
        { prop: 'train_code', label: '车次', 'min-width': 100 },
        { prop: 'start_station_name', label: '始发站', 'min-width': 120 },
        { prop: 'arrive_station_name', label: '终点站', 'min-width': 120 },
        { prop: 'ticket_count', label: '车票数量', 'min-width': 100 },
        { prop: 'total_price', label: '价格', 'min-width': 150 },
        { prop: 'system_commision', label: '系统佣金', 'min-width': 100 },
        { prop: 'plat_commision', label: '平台佣金', 'min-width': 100 },
        { prop: 'gmt_create', label: '创建时间', 'min-width': 160, filter: 'time' },
        { prop: 'operator', label: '操作人', 'min-width': 160 },
        { prop: 'limit_time', label: '出票时间', 'min-width': 160, filter: 'time' },
        { prop: 'receiptStr', label: '是否开发票', 'min-width': 120, type: 'tag' },
        //{ prop: 'receipt_status', label: '发票状态', 'min-width': 150, type: 'tag' },
        { prop: 'orderStatusStr', label: '订单状态', 'min-width': 110, type: 'tag' },
        { prop: 'payStatusStr', label: '打款状态', 'min-width': 110, type: 'tag' },
      ],
      searchConfig: {
        labelWidth: '80px',
        searchButtons: [
          { name: '查询', size: 'small', isPlain: true, icon: 'el-icon-search', type: 'primary' },
          { name: '刷新', size: 'small', isPlain: true, icon: 'el-icon-refresh', type: 'primary' },
        ],
        searchItems: [
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
          {
            type: 'Select',
            prop: 'status',
            formItemAttrs: { label: '订单状态' },
            attrs: { clearable: true, style: 'width: 150px' },
            data: [
              { datavalue: '', dataname: '全部订单' },
              { datavalue: '1', dataname: '待处理' },
              { datavalue: '2', dataname: '出票成功' },
              { datavalue: '3', dataname: '出票失败' }],
          },
          {
            type: 'Select',
            prop: 'plat_id',
            formItemAttrs: { label: '平台' },
            attrs: { clearable: true, style: 'width: 150px' },
            listGetter: {
              url: '/base/plats',
              params: {},
              keyMap: { list: 'data' },
              data: [],
            }
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
            type: 'Input',
            prop: 'id',
            formItemAttrs: { label: '订单ID', },
            attrs: { clearable: true, style: 'width: 150px' },
          },
          {
            type: 'Input',
            prop: 'train_code',
            formItemAttrs: { label: '车次', },
            attrs: { clearable: true, style: 'width: 120px' },
          },
          {
            type: 'Input',
            prop: 'start_station_name',
            formItemAttrs: { label: '始发站', },
            attrs: { clearable: true, style: 'width: 120px' },
          },
          {
            type: 'Input',
            prop: 'arrive_station_name',
            formItemAttrs: { label: '终点站', },
            attrs: { clearable: true, style: 'width: 120px' },
          },
          {
            type: 'Input',
            prop: 'passenger_name',
            formItemAttrs: { label: '乘客姓名', },
            attrs: { clearable: true, style: 'width: 150px' },
          },
          {
            type: 'Input',
            prop: 'telephone',
            formItemAttrs: { label: '联系电话', },
            attrs: { clearable: true, style: 'width: 150px' },
          },
        ]
      },
    }
  },
  created() {
    this.fReload()
  },
  methods: {
    fOperate(item) {
      if (item.name === '刷新') {
        this.fReload()
      }
    },
    fReload() {
      this.$nextTick(() => {
        this.$refs.pageRef.fReload()
      })
    },
    fSearch(val) {
      console.log(val)
      this.searchObject = { ...val, gmt_create: JSON.stringify(val.gmt_create) }
      this.fReload()
    }
  }
}
</script>
<style  lang="scss">
</style>