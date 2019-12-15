<template>
  <div class="page-wraper lzadmin-order-wraper">
    <top-search-bar :config="searchConfig"
      @fSearch="fSearch"></top-search-bar>
    <pagination-pro :loading.sync="bIsLoading"
      ref="pageRef"
      url="/system/roles"
      :autoload="false">
      <template slot-scope="{ data }">
        <el-table :data="data"
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
              {{ row | render(v) }}
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
      orderImg: require('@/assets/img/order.png'),
      columns: [
        { prop: 'date', label: '订单ID', 'min-width': 150, },
        { prop: 'total', label: '订单类型', 'min-width': 150, },
        { prop: 'name1', label: '车次', 'min-width': 150, },
        { prop: 'name2', label: '始发站', 'min-width': 150, },
        { prop: 'name3', label: '终点站', 'min-width': 150, },
        { prop: 'name4', label: '车票类型', 'min-width': 150, },
        { prop: 'name5', label: '车票数量', 'min-width': 150, },
        { prop: 'name6', label: '创建时间', 'min-width': 150, },
        { prop: 'name7', label: '完成时间', 'min-width': 150, },
        { prop: 'name8', label: '操作人', 'min-width': 150, },
        { prop: 'name9', label: '订单状态', 'min-width': 150, },
        { prop: 'name10', label: '打款状态', 'min-width': 150, },
      ],
      searchConfig: {
        labelWidth: '80px',
        searchButtons: [
          { name: '查询', isPlain: true, icon: 'el-icon-search', type: 'primary' },
        ],
        searchItems: [
          {
            type: 'DataPicker',
            prop: 'dataPicker',
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
            prop: 'select',
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
            prop: 'input',
            formItemAttrs: { label: '订单ID', },
            attrs: { clearable: true, style: 'width: 120px' },
          },
          {
            type: 'Input',
            prop: 'input1',
            formItemAttrs: { label: '车次', },
            attrs: { clearable: true, style: 'width: 150px' },
          },
          {
            type: 'Input',
            prop: 'input1',
            formItemAttrs: { label: '始发站', },
            attrs: { clearable: true, style: 'width: 150px' },
          },
          {
            type: 'Input',
            prop: 'input1',
            formItemAttrs: { label: '终点站', },
            attrs: { clearable: true, style: 'width: 150px' },
          },
          {
            type: 'Input',
            prop: 'input1',
            formItemAttrs: { label: '姓名', },
            attrs: { clearable: true, style: 'width: 150px' },
          },
          {
            type: 'Input',
            prop: 'input1',
            formItemAttrs: { label: '手机号码', },
            attrs: { clearable: true, style: 'width: 150px' },
          },
        ]
      },
    }
  },
  methods: {
    fSearch() {

    }
  }
}
</script>
<style  lang="scss">
.lzadmin-order-wraper {
  min-width: 1100px;
  .pagination-table-conainer {
    .el-table {
      min-height: 300px;
    }
  }
}
</style>