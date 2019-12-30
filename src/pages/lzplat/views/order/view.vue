<template>
  <div class="page-wraper order-view">
    <div v-loading="!order.id">
      <el-card class="info-card"
        shadow="hover">
        <div slot="header"
          class="header">
          订单号<span>{{ order.id }}</span>订单创建时间<span>{{ order.gmt_create }}</span>
          <div class="order-time"
            v-if="order.status === 1">订单关闭时间<span>{{ remainTime }}</span></div>
          <div class="order-time"
            v-else>出票时间<span>{{ order.close_time }}</span></div>
        </div>
        <el-row class="info-row">
          <el-col v-if="order.seatRequirement"
            class="info-col"
            :span="24">
            <div class="label">选座要求</div>
            <div class="value">
              <el-tag type="primary"
                class="seat-tag">{{order.seatRequirement || ''}}</el-tag>
              <el-tag type="warning"
                class="seat-tag">{{order.changeStr + '无下铺转其他坐席'}}</el-tag>
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
          <el-col class="info-col passenger-col"
            v-for="(item,index) in order.subOrders"
            :key="item.passenger_name"
            :span="24">
            <div class="value">
              <div class="info">
                <span class="passenger-index">{{ '乘客' + (index + 1) }}</span>
                姓名: <span>{{ item.passenger_name }}</span>
                身份证号: <span>{{ item.cert_no }}</span>
              </div>
              <el-form :ref="'subOrderForm' + index"
                :disabled="(order.status !== 1)"
                :inline="true"
                :model="subOrders[index]"
                :rules="rules"
                size="small"
                class="seat-form">
                <el-form-item v-if="hasRealSeats.includes(item.seat_type)"
                  label="坐席:"
                  prop="real_seat_type">
                  <el-select v-model="subOrders[index].real_seat_type"
                    :disabled="true"
                    ref="real_seat_type"
                    v-list-getter="{
                      url: `/order/sub-seats/${order.seat_type}`,
                      params: { },
                      keyMap: { list: 'data' },
                      data: realSeatTypes,
                      onResponse: (data)=>{fSeatonResponse(data)},
                      ref:'real_seat_type',
                  }">
                    <el-option v-for="seat in realSeatTypes"
                      :key="seat.name"
                      :label="seat.name"
                      :value="seat.name"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车厢:"
                  prop="coach_no">
                  <el-input v-model="subOrders[index].coach_no"></el-input>
                </el-form-item>
                <el-form-item v-if="item.real_seat_type !== '无座'"
                  label="座位号:"
                  prop="seat_no">
                  <el-input v-model="subOrders[index].seat_no"></el-input>
                </el-form-item>
                <el-form-item label="价格:"
                  prop="real_ticket_price"
                  :disabled="order.seat_type.includes('卧')"
                  :rules="[
                  { required: true, trigger: 'blur',max: subOrders[index].ticket_price,validator: validRealPrice}]">
                  <el-input type="number"
                    v-model="subOrders[index].real_ticket_price"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <operation-buttons :buttons="buttons"
        :align="'center'"
        @operate="fOperation"></operation-buttons>
    </div>
  </div>
</template>
<script>
import { getAgentOrderInfo, getUnDealOrders, dealOrder } from "@/api/order";
import { getDiffTime } from "@/utils/index";
import OperationButtons from '@/components/OperationButtons'
export default {
  name: 'order-view',
  components: { OperationButtons },
  data() {
    const validRealPrice = (rule, value, callback) => {
      if (!value) {
        callback(new Error('填写价格'))
      } else if (value > rule.max) {
        callback(new Error(`价格最大为${rule.max}`))
      } else {
        callback()
      }
    }
    return {
      order: {},
      subOrders: [],
      hasRealSeats: ['硬座', '硬卧', '软卧', '高级软卧'],
      realSeatTypes: [],
      validRealPrice: validRealPrice,
      rules: {
        coach_no: [{ required: true, message: '填写车厢', trigger: 'blur' }],
        seat_type: [{ required: true, message: '请选择坐席', trigger: 'change' }],
        real_seat_type: [{ required: true, message: '请选择坐席', trigger: 'change' }],
        seat_no: [{ required: true, message: '填写座位号', trigger: 'blur' }],
        //real_ticket_price: [{ required: true, trigger: 'blur', max: 400, validator: validRealPrice }],
      },
      items: [
        { label: '车次', prop: 'train_code' },
        { label: '始发站', prop: 'fromStation' },
        { label: '终点站', prop: 'toStation' },
        { label: '发车日期', prop: 'fromTime' },
        { label: '坐席', prop: 'seat_type' },
        { label: '车票类型', prop: 'tickettype_name' },
        { label: '手机号码', prop: 'contacts_telephone' },
      ],
      remainTime: '',
    }
  },
  computed: {
    buttons: function () {
      let hidden = this.order.status !== 1
      return [
        { name: '返回', type: 'info', size: 'small' },
        { name: '出票失败', type: 'danger', size: 'small', hidden: hidden },
        { name: '出票成功', type: 'success', size: 'small', hidden: hidden },
        { name: '跳过', type: 'primary', size: 'small', hidden: hidden }
      ]
    }
  },
  async created() {
    await this.fGetOrder()
  },
  methods: {
    fOperation(item) {
      let curOrderId = this.$route.params.id
      if (item.name === '返回') {
        this.$router.back()
      } else if (item.name === '出票失败') {
        this.fDealOder(curOrderId, 3)
      } else if (item.name === '出票成功') {
        this.fDealOder(curOrderId, 2, this.subOrders)
      } else if (item.name === '跳过') {
        this.fNextOrder()
      }
    },
    fDealOder(curOrderId, status, subOrders = []) {
      let vailds = []
      this.order.subOrders.forEach((item, index) => {
        let ref = `subOrderForm${index}`
        this.$refs[ref][0].validate((valid) => {
          if (!valid) { vailds.push('0') }
        })
      })
      if (vailds.length === 0) {
        dealOrder(curOrderId, {
          status: status,
          subOrders: subOrders
        }).then(res => {
          this.$message({
            message: '订单已更新～',
            type: 'success'
          });
          this.order.status = status
          this.fNextOrder()
        })
      }
    },
    async fNextOrder() {
      let undealOrders = await getUnDealOrders()
      // let currOrderIndex = undealOrders.indexOf(parseInt(curOrderId))
      let nextOrder = undealOrders[0]
      if (nextOrder) {
        this.$router.replace({ path: `/order/view/${nextOrder}` })
        await this.fGetOrder()
      } else {
        this.$message({
          message: '无待处理订单',
          type: 'warning'
        });
      }
    },
    fGetRemainTime() {
      setTimeout(() => {
        this.fGetRemainTime()
      }, 1000 * 60);
      let time = getDiffTime(new Date(), new Date(this.order.limit_time))
      this.remainTime = time ? time : '已关闭'
    },
    fGetOrder() {
      getAgentOrderInfo(this.$route.params.id).then(order => {
        this.order = order
        this.subOrders = order.subOrders.map(item => {
          let order = { ...item }
          if (!this.hasRealSeats.includes(item.seat_type)) {
            order.real_seat_type = item.seat_type
            order.real_ticket_price = item.ticket_price
          }
          return order
        })
        this.fGetRemainTime()
      })
    }
  }
}
</script>
<style lang="scss">
.info-card {
  margin-bottom: 20px;
  .header span {
    margin: 0 10px;
    color: #e6a246;
  }
  .seat-tag {
    margin-right: 20px;
  }
  .order-time {
    display: inline-block;
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
      width: 10%;
      padding-left: 10px;
      line-height: 53px;
      font-weight: 800;
    }
    .value {
      display: inline-block;
      width: 85%;
      padding-left: 10px;
      line-height: 53px;
      border-left: 1px solid #ebeef5;
      color: #69676b;
    }
  }
  .passenger-col {
    min-height: 106px;
    .value {
      height: 110px;
      width: 100%;
      .info {
        line-height: 30px;
        padding-top: 15px;
        .passenger-index {
          font-weight: 600;
          font-size: 16px;
          color: #69676b;
        }
        span {
          color: #e6a246;
          margin-right: 10px;
        }
      }
      .seat-form {
        height: 60px;
        .el-form-item__content {
          width: 120px;
          vertical-align: -2px;
        }
      }
    }
  }
}
</style>