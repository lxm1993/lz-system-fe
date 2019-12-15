<template>
  <el-container class="page-wraper lzadmin-home-wraper">
    <el-header class="home-header">
      <el-card class="box-card">
        <el-image class="box-image"
          :src="orderImg"
          fit="cover"></el-image>
        <div class="box-info">
          <div class="count"><span>333333</span></div>
          <div class="title">昨日收入</div>
        </div>
      </el-card>
      <el-card class="box-card">
        <el-image class="box-image"
          :src="orderImg"
          fit="cover"></el-image>
        <div class="box-info">
          <div class="count count2">待处理<span>123</span>未结算<span>123</span></div>
          <div class="title">订单统计</div>
        </div>
      </el-card>
    </el-header>
    <el-main>
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
    </el-main>
  </el-container>
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
        { prop: 'date', label: '日期', 'min-width': 150, },
        { prop: 'total', label: '全部', 'min-width': 150, },
        { prop: 'name1', label: '待出票', 'min-width': 150, },
        { prop: 'name2', label: '出票成功', 'min-width': 150, },
        { prop: 'name3', label: '出票失败', 'min-width': 150, },
        { prop: 'name4', label: '出票成功率', 'min-width': 150, },
        { prop: 'name5', label: '结算金额', 'min-width': 150, },
      ],
      searchConfig: {
        labelWidth: '60px',
        searchButtons: [
          { name: '查询', isPlain: true, icon: 'el-icon-search', type: 'primary', size: 'small' },
        ],
        searchItems: [
          {
            type: 'DataPicker',
            prop: 'dataPicker',
            formItemAttrs: {
              label: '日期',
            },
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
  methods: {
    fSearch() {

    }
  }
}
</script>
<style  lang="scss">
.lzadmin-home-wraper {
  min-width: 1000px;
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
  .pagination-table-conainer {
    .el-table {
      min-height: 300px;
    }
  }
}
</style>