<template>
  <div class="page-wraper order-view">
    <el-card class="info-card"
      shadow="hover">
      <div slot="header"><span>{{ '订单号 ' + order.id}}</span></div>
      <el-row class="info-row">
        <el-col class="info-col"
          :span="24">
          <div class="label">选座要求</div>
          <div class="value">
            <el-tag type="primary"
              class="seat-tag">{{order.seatRequirement}}</el-tag>
            <el-tag type="warning"
              class="seat-tag">{{order.isChangeStr + '无下铺转其他坐席'}}</el-tag>
          </div>
        </el-col>
        <el-col class="info-col"
          v-for="(item,index) in items"
          :key="index"
          v-bind="item.col_attrs"
          :span="24">
          <div class="label">{{ item.label }}</div>
          <div class="value">{{ order | render(item) }}</div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { getAgentOrderInfo } from "@/api/order";
export default {
  name: 'order-view',
  data() {
    return {
      order: {},
      items: [
        { label: '车次', prop: 'train_code' },
        { label: '始发站', prop: 'fromStation' },
        { label: '终点站', prop: 'toStation' },
        { label: '发车日期', prop: 'fromTime' },
        { label: '车票类型', prop: 'seat_type' },
        { label: '手机号码', prop: 'telephone' },
      ]
    }
  },
  created() {
    this.fGetOrder()
  },
  methods: {
    fGetOrder() {
      getAgentOrderInfo(this.$route.params.id).then(order => {
        this.order = order
      })
    }
  }
}
</script>
<style  lang="scss">
.info-card {
  margin-bottom: 20px;
  .seat-tag {
    margin-right: 20px;
  }
  .el-card__header {
    padding: 15px 12px;
    background-color: #5d9ad4;
    color: #fff;
    font-weight: 600;
  }
  .info-row {
    border: 1px solid #ebeef5;
  }
  .info-col {
    height: 53px;
    border-bottom: 1px solid #ebeef5;
    font-size: 14px;
    .label {
      display: inline-block;
      width: 15%;
      padding-left: 10px;
      line-height: 53px;
      font-weight: 800;
    }
    .value {
      display: inline-block;
      width: 80%;
      padding-left: 10px;
      line-height: 53px;
      border-left: 1px solid #ebeef5;
      color: #69676b;
    }
  }
}
</style>