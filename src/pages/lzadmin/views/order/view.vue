<template>
  <div class="page-wraper order-view">
    <div v-loading="!order.id">
      <div class="info-list">
        <info-card v-for="(one, index) in infoList"
          :type="one.type || ''"
          :tableKey="one.key"
          :key="index"
          :title="one.title"
          :items="one.items"
          v-model="order"
          shadow="hover"></info-card>
      </div>
      <operation-buttons :buttons="buttons"
        :align="'center'"
        @operate="fOperation"></operation-buttons>
    </div>
  </div>
</template>
<script>
import InfoCard from '@/components/InfoCard'
import OperationButtons from '@/components/OperationButtons'
import { getOrderInfo, dealOrder, orderReceipt } from "@/api/order";
export default {
  name: 'order-view',
  components: { InfoCard, OperationButtons },
  data() {
    return {
      order: {},
      infoList: [
        {
          title: '平台信息',
          items: [
            {
              label: '平台名称',
              prop: 'plat_name',
              col_attrs: { span: 6 },
            },
            {
              label: '平台订单ID',
              prop: 'p_order_id',
              col_attrs: { span: 6 },
            },
            {
              label: '总票价',
              prop: 'total_price',
              col_attrs: { span: 6 },
            },
            {
              label: '订单状态',
              prop: 'orderStatusStr',
              col_attrs: { span: 6 },
            },
            {
              label: '票务类型',
              prop: 'tickettype_name',
              col_attrs: { span: 6 },
            },
            {
              label: '票张数',
              prop: 'ticket_count',
              col_attrs: { span: 6 },
            },
            {
              label: '总价格',
              prop: 'total_money',
              col_attrs: { span: 6 },
            },
            {
              label: '结算状态',
              prop: 'payStatusStr',
              col_attrs: { span: 6 },
            },
            {
              label: '创建时间',
              prop: 'gmt_create',
              col_attrs: { span: 6 },
            },
            {
              label: '完成时间',
              prop: 'close_time',
              col_attrs: { span: 6 },
            },
            {
              label: '选座要求',
              prop: 'seatRequirement',
              col_attrs: { span: 6 },
            },
            {
              label: '接受其他坐席',
              prop: 'isChangeStr',
              label_attrs: { style: 'width: 100px' },
              col_attrs: { span: 6 },
            },
          ]
        },
        {
          title: '售票点信息',
          items: [
            {
              label: '售票点名称',
              prop: 'agent_name',
              col_attrs: { span: 6 },
            },
            {
              label: '订单ID',
              prop: 'id',
              col_attrs: { span: 6 },
            },
            {
              label: '操作账号',
              prop: 'operator',
              col_attrs: { span: 6 },
            },
            {
              label: '处理时间',
              prop: 'close_time',
              col_attrs: { span: 6 },
            },
          ]
        },
        {
          title: '车次信息',
          items: [
            {
              label: '车次',
              prop: 'train_code',
              col_attrs: { span: 6 },
            },
            {
              label: '车次类型',
              prop: 'train_code',
              col_attrs: { span: 6 },
            },
            {
              label: '坐席',
              prop: 'seat_type',
              col_attrs: { span: 6 },
            },
            {
              label: '发车站',
              prop: 'start_station_name',
              col_attrs: { span: 6 },
            },
            {
              label: '到达站',
              prop: 'arrive_station_name',
              col_attrs: { span: 6 },
            },
            {
              label: '发车时间',
              prop: 'from_time',
              col_attrs: { span: 6 },
            },
            {
              label: '到达时间',
              prop: 'arrive_time',
              col_attrs: { span: 6 },
            },
            {
              label: '运行时长',
              prop: 'tranDiffTime',
              col_attrs: { span: 6 },
            },
          ]
        },
        {
          type: 'table',
          key: 'subOrders',
          title: '车票信息',
          items: [
            {
              label: '子订单号',
              prop: 'sub_order_id',
              'min-width': 120
            },
            {
              label: '乘客名',
              prop: 'passenger_name',
              'min-width': 120
            },
            {
              label: '乘客类型',
              prop: 'passenger_type',
              'min-width': 120
            },
            {
              label: '证件类型',
              prop: 'cert_type',
              'min-width': 120
            },
            {
              label: '证件号码',
              prop: 'cert_no',
              'min-width': 180
            },
            {
              label: '票价',
              prop: 'real_ticket_price',
              'min-width': 120
            },
            {
              label: '座席',
              prop: 'real_seat_type',
              'min-width': 120
            },
            {
              label: '座位',
              prop: 'seatStr',
              'min-width': 120
            },
          ]
        },
        {
          title: '联系人信息',
          items: [
            {
              label: '姓名',
              prop: 'contacts',
              col_attrs: { span: 6 },
            },
            {
              label: '手机号码',
              prop: 'contacts_telephone',
              col_attrs: { span: 6 },
            },
            {
              label: '公司',
              prop: 'contacts_company',
              col_attrs: { span: 6 },
            },
            {
              label: '地址',
              prop: 'contacts_address',
              col_attrs: { span: 6 },
            },
          ]
        },
        {
          title: '发票信息',
          items: [
            {
              label: '抬头',
              prop: 'receipt_name',
              col_attrs: { span: 6 },
            },
            {
              label: '发票内容',
              prop: 'receipt_content',
              col_attrs: { span: 6 },
            },
            {
              label: '发票税号',
              prop: 'receipt_no',
              col_attrs: { span: 6 },
            },
            {
              label: '邮箱',
              prop: 'receipt_email',
              col_attrs: { span: 6 },
            },
            {
              label: '开票时间',
              prop: 'receipt_time',
              col_attrs: { span: 6 },
            },
            {
              label: '发票状态',
              prop: 'receiptStatusStr',
              col_attrs: { span: 6 },
            },
          ]
        },
      ],
    }
  },
  computed: {
    buttons: function () {
      let hiddenReceipt = this.order.receiptStatusStr === '不开发票' // 不开发票
        || this.order.status === 1 // 未处理
        || (this.order.is_receipt === 1 && this.order.receipt_time) // 开发票已开
      return [
        { name: '返回', type: 'info', size: 'small' },
        { name: '开发票', type: 'primary', size: 'small', hidden: hiddenReceipt },
        { name: '出票失败', type: 'primary', size: 'small', hidden: this.order.status != 1 },
      ]
    }
  },
  created() {
    this.fGetOrder()
  },
  methods: {
    fGetOrder() {
      getOrderInfo(this.$route.params.id).then(order => {
        this.order = order
      })
    },
    fOperation(item) {
      let curOrderId = this.$route.params.id
      if (item.name === '返回') {
        this.$router.back()
      } else if (item.name === '开发票') {
        this.fOrderReceipt(curOrderId)
      } else if (item.name === '出票失败') {
        this.fOderFail(curOrderId)
      }
    },
    fOrderReceipt(orderId) {
      this.$confirm('确定开发票', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        orderReceipt(orderId).then(res => {
          this.$message({
            message: res.message,
            type: 'success'
          });
          this.fGetOrder()
        })
      })
    },
    fOderFail(orderId) {
      this.$confirm('确定出票失败？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        dealOrder(orderId, 'failed', true).then(res => {
          this.$message({
            message: res.message,
            type: 'success'
          });
          this.fGetOrder()
        })
      })
    }
  }
}
</script>
<style lang="scss" >
.order-view {
  .el-loading-spinner {
    top: 300px;
  }
}
</style>