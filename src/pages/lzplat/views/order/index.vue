<template>
  <div class="page-wraper fullsize-flex">
    <top-search-bar :config="searchConfig"
      @fSearch="fSearch"
      @operate="fOperate"></top-search-bar>
    <pagination-pro :loading.sync="bIsLoading"
      ref="pageRef"
      url="/orders"
      :autoload="false"
      :fullsize="true"
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
                :type="v.tagType[row[v.prop]]">
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
                @click="$router.push('/order/view/' + row.id)">
                {{ row.status === 1 ? '处理订单' : '查看' }}
              </el-button>
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
        { prop: 'contacts_telephone', label: '联系电话', 'min-width': 120 },
        { prop: 'start_station_name', label: '始发站', 'min-width': 150 },
        { prop: 'arrive_station_name', label: '终点站', 'min-width': 150 },
        { prop: 'ticket_count', label: '车票数量', 'min-width': 150 },
        { prop: 'gmt_create', label: '创建时间', 'min-width': 160 },
        { prop: 'close_time', label: '完成时间', 'min-width': 160 },
        { prop: 'operator', label: '操作人', 'min-width': 160 },
        {
          prop: 'orderStatusStr', label: '订单状态', 'min-width': 110, type: 'tag',
          tagType: { '出票成功': 'success', '出票失败': 'danger', '待处理': 'primary' }
        },
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
      this.searchObject = { ...val, gmt_create: JSON.stringify(val.gmt_create) }
      this.fReload()
    }
  }
}
</script>
<style  lang="scss">
</style>