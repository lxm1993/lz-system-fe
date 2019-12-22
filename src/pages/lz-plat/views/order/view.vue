<template>
  <div class="page-wraper order-view">
    <el-card class="info-card"
      shadow="hover">
      <div slot="header"
        class="header">
        订单号<span>{{ order.id }}</span>订单创建时间<span>{{ order.gmt_create | time }}</span>
        订单关闭时间<span>{{ remainTime }}</span>
      </div>
      <el-row class="info-row">
        <el-col class="info-col"
          :span="24">
          <div class="label">选座要求</div>
          <div class="value">
            <el-tag type="primary"
              class="seat-tag">{{order.seatRequirement || ''}}</el-tag>
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
        <el-col class="info-col passenger-col"
          v-for="(item,index) in order.subOrders"
          :key="item.cert_no"
          :span="24">
          <div class="label">{{ '乘客' + (index + 1) }}</div>
          <div class="value">
            <div class="info">
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
              <el-form-item label="车厢:"
                prop="coach_no">
                <el-input v-model="subOrders[index].coach_no"></el-input>
              </el-form-item>
              <el-form-item label="坐席类型:"
                prop="real_seat_type">
                <el-select v-model="subOrders[index].real_seat_type">
                  <el-option v-for="seat in seatTypes"
                    :key="seat.value"
                    :label="seat.name"
                    :value="seat.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="subOrders[index].real_seat_type !== 0"
                label="号:"
                prop="seat_no">
                <el-input v-model="subOrders[index].seat_no"></el-input>
              </el-form-item>
              <el-form-item label="价格:"
                prop="real_ticket_price">
                <el-input v-model="subOrders[index].real_ticket_price"></el-input>
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
</template>
<script>
import { getAgentOrderInfo, getUnDealOrders, dealOrder } from "@/api/order";
import { getDiffTime } from "@/utils/index";
import OperationButtons from '@/components/OperationButtons'

export default {
  name: 'order-view',
  components: { OperationButtons },
  data() {
    return {
      order: {},
      subOrders: [],
      seatTypes: [
        { name: '无座', value: 0 },
        { name: '硬座', value: 1 },
        { name: '下铺', value: 2 },
        { name: '中铺', value: 3 },
        { name: '上铺', value: 4 }
      ],
      rules: {
        coach_no: [{ required: true, message: '填写车厢', trigger: 'blur' }],
        real_seat_type: [{ required: true, message: '请选择坐席', trigger: 'change' }],
        seat_no: [{ required: true, message: '填写座位号', trigger: 'blur' }],
        real_ticket_price: [{ required: true, message: '填写价格', trigger: 'blur' }],
      },
      items: [
        { label: '车次', prop: 'train_code' },
        { label: '始发站', prop: 'fromStation' },
        { label: '终点站', prop: 'toStation' },
        { label: '发车日期', prop: 'fromTime' },
        { label: '车票类型', prop: 'seat_type' },
        { label: '手机号码', prop: 'telephone' },
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
        this.fNextOrder(curOrderId)
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
      console.log(vailds)
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
        })
      }
    },
    async fNextOrder(curOrderId) {
      let undealOrders = await getUnDealOrders()
      let currOrderIndex = undealOrders.indexOf(parseInt(curOrderId))
      let nextOrder = undealOrders[currOrderIndex + 1]
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
        this.subOrders = order.subOrders.map(order => {
          return {
            ...order,
            real_seat_type: order.real_seat_type || 1
          }
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
  .passenger-col {
    height: 106px;
    .label {
      vertical-align: 18px;
    }
    .value {
      height: 110px;
      .info {
        line-height: 30px;
        padding-top: 15px;
        span {
          color: #e6a246;
          margin-right: 10px;
        }
      }
      .seat-form {
        height: 60px;
        .el-form-item__content {
          width: 100px;
          vertical-align: -2px;
        }
      }
    }
  }
}
</style>