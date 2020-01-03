<template>
  <el-container class="lzadmin-home-wraper"
    v-loading="bIsLoading">
    <el-header class="home-header">
      <el-card class="box-card">
        <el-image class="box-image"
          :src="orderImg"
          fit="cover"></el-image>
        <div class="box-info">
          <div class="count"><span>{{ orderInfo.unpay }}</span></div>
          <div class="title">未结算金额</div>
        </div>
      </el-card>
      <el-card class="box-card">
        <el-image class="box-image"
          :src="orderImg"
          fit="cover"></el-image>
        <div class="box-info">
          <div class="count count2">
            待处理<span>{{orderInfo.unDeal}}</span>
            未结算<span>{{orderInfo.unPay}}</span>
          </div>
          <div class="title">订单统计</div>
        </div>
      </el-card>
    </el-header>
    <el-main class="page-wraper fullsize-flex ">
      <top-search-bar :config="searchConfig"
        @fSearch="fSearch"
        @operate="fOperate"></top-search-bar>
      <pagination-pro :loading.sync="bIsLoading"
        ref="pageRef"
        url="/orders/week"
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
                {{ row | render(v) }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </pagination-pro>
    </el-main>
  </el-container>
</template>
<script>
import { listMixins } from '@/mixins/index'
import { getCurrentTime, getDate } from '@/utils/index'
import { homeOrderInfo } from "@/api/order"
import moment from 'moment';

export default {
  mixins: [listMixins],
  data() {
    let now = moment().format('YYYY-MM-DD')
    var last7 = moment().subtract('days', 6).format('YYYY-MM-DD')
    return {
      bIsLoading: false,
      searchObject: {
        gmt_create: JSON.stringify([last7, now])
      },
      orderInfo: {},
      orderImg: require('@/assets/img/order.png'),
      columns: [
        { prop: 'date', label: '日期', 'min-width': 150, },
        { prop: 'total', label: '全部', 'min-width': 150, },
        { prop: 'deal', label: '待出票', 'min-width': 150, },
        { prop: 'success', label: '出票成功', 'min-width': 150, },
        { prop: 'faild', label: '出票失败', 'min-width': 150, },
        { prop: 'successRate', label: '出票成功率', 'min-width': 150, },
        { prop: 'payMoneys', label: '结算金额', 'min-width': 150, },
      ],
      searchConfig: {
        labelWidth: '60px',
        searchImmediate: true,
        searchButtons: [
          { name: '查询', isPlain: true, icon: 'el-icon-search', type: 'primary', size: 'small' },
          { name: '导出', isPlain: true, icon: 'el-icon-download', type: 'primary', size: 'small' },
        ],
        searchItems: [
          {
            type: 'DataPicker',
            prop: 'gmt_create',
            default: [last7, now],
            formItemAttrs: { label: '日期' },
            attrs: {
              clearable: true,
              type: 'daterange',
              'start-placeholder': '开始日期',
              'end-placeholder': '结束日期',
              format: 'yyyy-MM-dd',
              'value-format': 'yyyy-MM-dd',
            },
          }
        ]
      },
    }
  },
  async created() {
    await this.fReload()
    await this.fGetOrderInfo()
  },
  methods: {
    fReload() {
      this.$nextTick(() => {
        this.$refs.pageRef.fReload()
      })
    },
    fGetOrderInfo() {
      homeOrderInfo(true).then(orderInfo => {
        this.orderInfo = orderInfo
      })
    },
    fSearch(val) {
      this.searchObject = {
        ...val,
        gmt_create: JSON.stringify(val.gmt_create)
      }
      this.fReload()
    },
    fOperate(item) {
      if (item.name === '导出') {
        this.fExportExcel('/admin/export-excel/orders/week', this.searchObject, 'total')
      }
    },
  }
}
</script>
<style  lang="scss">
.lzadmin-home-wraper {
  padding: 15px;
  .el-loading-spinner {
    top: 300px;
  }
  .el-table {
    min-height: 300px;
  }
  .fullsize-flex {
    top: 150px !important;
  }
  .home-header {
    height: 110px !important;
    .box-card {
      display: inline-block;
      width: 44%;
      .el-card__body {
        height: 110px;
        padding: 10px;
        box-sizing: border-box;
      }
      &:first-child {
        width: 35%;
        margin-right: 100px;
      }
      .box-image {
        float: left;
        width: 90px;
        height: 90px;
        img {
          opacity: 0.7;
        }
      }
      .box-info {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        float: left;
        margin-left: 30px;
        font-size: 16px;
        font-weight: 400;
        .count {
          margin-bottom: 10px;
          span {
            color: #f3a328;
          }
        }
        .count2 span {
          margin: 10px;
        }
      }
    }
  }
}
</style>