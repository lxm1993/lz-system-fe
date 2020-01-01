<template>
  <div>
    <create-view v-model="order"
      :formItems="formItems"
      :buttons="buttons"
      label-position="right"
      label-width="120px"
      @submit="fSubmit">
      <create-sub-order slot="subOrders"
        v-model="order.subOrders"></create-sub-order>
    </create-view>
  </div>
</template>
<script>
import CreateView from '@/components/CreateView'
import CreateSubOrder from './components/CreateSubOrder'
import { isvalidPhone } from "@/utils/validate"
import { saveOrder } from "@/api/order"
import { omit } from 'lodash'

export default {
  components: { CreateView, CreateSubOrder },
  data() {
    const validPhone = (rule, value, callback) => {
      if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      order: {
        subOrders: [],
      },
      formItems: [
        {
          type: 'Section',
          title: '新建订单',
          prop: 'section'
        },
        {
          type: 'Input',
          prop: 'pOrderId',
          span: 8,
          formItemAttrs: {
            label: '平台订单号',
            rules: [{ required: true, message: '请输入平台订单号', trigger: 'blur' }],
          },
          attrs: { placeholder: '请输入平台订单号', clearable: true, style: 'width: 200px' },
        },
        {
          type: 'Select',
          prop: 'agentId',
          span: 8,
          default: true,
          formItemAttrs: {
            label: '商家id',
            rules: [{ required: true, message: '请选择', trigger: 'blur' }],
          },
          attrs: { placeholder: '请选择商家id', clearable: true, style: 'width: 200px' },
          listGetter: {
            url: '/base/agents',
            params: {},
            keyMap: { list: 'data' },
            data: [],
          }
        },
        {
          type: 'Select',
          prop: 'platId',
          span: 8,
          default: true,
          formItemAttrs: {
            label: '平台',
            rules: [{ required: true, message: '请选择平台', trigger: 'blur' }],
          },
          attrs: { placeholder: '请选择平台名称', clearable: true, style: 'max-width:230px' },
          listGetter: {
            url: '/base/plats',
            params: {},
            keyMap: { list: 'data' },
            data: [],
          }
        },
        {
          type: 'Select',
          prop: 'ticketTypeId',
          default: true,
          span: 8,
          formItemAttrs: {
            label: '票务类型',
            rules: [{ required: true, message: '请选择票务类型', trigger: 'blur' }],
          },
          attrs: { placeholder: '请选择票务类型', clearable: true, style: 'max-width:230px' },
          listGetter: {
            url: '/base/ticket-types',
            params: {},
            keyMap: { list: 'data' },
            data: [],
          }
        },
        {
          type: 'Input',
          prop: 'ticketCount',
          span: 8,
          formItemAttrs: {
            label: '票数',
            rules: [{ required: true, message: '请输入票数', trigger: 'blur' }],
          },
          attrs: { type: 'number', placeholder: '请输入票数', clearable: true, style: 'width: 200px' },
        },
        {
          type: 'Input',
          prop: 'totalPrice',
          span: 8,
          formItemAttrs: {
            label: '订单总价',
            rules: [{ required: true, message: '请输入订单总价', trigger: 'blur' }],
          },
          attrs: { type: 'number', placeholder: '请输入订单总价', clearable: true, style: 'width: 200px' },
        },
        {
          type: 'Input',
          prop: 'serviceFee',
          span: 8,
          formItemAttrs: {
            label: '服务费',
            rules: [{ required: true, message: '请输入服务费', trigger: 'blur' }],
          },
          attrs: { type: 'number', placeholder: '请输入服务费', clearable: true, style: 'width: 200px' },
        },
        {
          type: 'Input',
          prop: 'postFee',
          span: 8,
          formItemAttrs: {
            label: '邮寄费',
            // rules: [{ required: true, message: '请输入邮寄费', trigger: 'blur' }],
          },
          attrs: { type: 'number', placeholder: '请输入邮寄费', clearable: true, style: 'width: 200px' },
        },
        {
          type: 'Section',
          title: '车次信息',
          prop: 'train_info'
        },
        {
          type: 'Input',
          prop: 'trainType',
          span: 8,
          formItemAttrs: {
            label: '车次类型',
            rules: [{ required: true, message: '请输入车次类型', trigger: 'blur' }],
          },
          attrs: { placeholder: '请输入车次类型', clearable: true, style: 'width: 200px' },
        },
        {
          type: 'Input',
          prop: 'trainCode',
          span: 8,
          formItemAttrs: {
            label: '车次',
            rules: [{ required: true, message: '请输入车次', trigger: 'blur' }],
          },
          attrs: { placeholder: '请输入车次', clearable: true, style: 'width: 200px' },
        },
        {
          type: 'Select',
          prop: 'seatType',
          default: true,
          span: 8,
          formItemAttrs: {
            label: '下单坐席名称',
            rules: [{ required: true, message: '请选择下单坐席', trigger: 'blur' }],
          },
          attrs: { placeholder: '下单坐席名称', clearable: true, style: 'max-width:230px' },
          listGetter: {
            url: '/base/seats',
            params: {},
            keyMap: { list: 'data' },
            data: [],
          }
        },
        {
          type: 'Input',
          prop: 'underCount',
          span: 8,
          ifRender(data) {
            return data.seatType && data.seatType.includes('卧')
          },
          formItemAttrs: {
            label: '指定下铺数量',
            rules: [{ required: true, message: '请输入指定下铺数量', trigger: 'blur' }],
          },
          attrs: { type: 'number', placeholder: '请输入指定下铺数量', clearable: true, style: 'width: 200px' },
        },
        {
          type: 'Radio',
          prop: 'isChange',
          span: 8,
          ifRender(data) {
            return data.seatType && data.seatType.includes('卧')
          },
          formItemAttrs: {
            label: '接受其他席位',
            rules: [{ required: true, message: '请选择', trigger: 'blur' }],
          },
          data: [
            { text: '是', value: 1 },
            { text: '否', value: 0 }
          ]
        },
        {
          type: 'Input',
          prop: 'startStationName',
          span: 8,
          formItemAttrs: {
            label: '出发车站',
            rules: [{ required: true, message: '请输入出发车站', trigger: 'blur' }],
          },
          attrs: { placeholder: '请输入出发车站', clearable: true, style: 'width: 200px' },
        },
        {
          type: 'DataPicker',
          prop: 'fromTime',
          span: 8,
          formItemAttrs: {
            label: '出发时间',
            rules: [{ required: true, message: '选择出发时间', trigger: 'blur' }],
          },
          attrs: { placeholder: '选择出发时间', clearable: true, type: 'datetime', format: 'yyyy-MM-dd HH:mm', 'value-format': 'yyyy-MM-dd HH:mm' },
        },
        {
          type: 'Input',
          prop: 'arriveStationName',
          span: 8,
          formItemAttrs: {
            label: '到达车站',
            rules: [{ required: true, message: '请输入到达车站', trigger: 'blur' }],
          },
          attrs: { placeholder: '请输入到达车站', clearable: true, style: 'width: 200px' },
        },
        {
          type: 'DataPicker',
          prop: 'arriveTime',
          span: 8,
          formItemAttrs: {
            label: '到达时间',
            rules: [{ required: true, message: '选择到达时间', trigger: 'blur' }],
          },
          attrs: { placeholder: '选择到达时间', clearable: true, type: 'datetime', format: 'yyyy-MM-dd HH:mm', 'value-format': 'yyyy-MM-dd HH:mm' },
        },
        {
          type: 'DataPicker',
          prop: 'limitTime',
          span: 8,
          formItemAttrs: {
            label: '出票截至时间',
            rules: [{ required: true, message: '选择出票截至时间', trigger: 'blur' }],
          },
          attrs: { placeholder: '出票截至时间', clearable: true, type: 'datetime', format: 'yyyy-MM-dd HH:mm', 'value-format': 'yyyy-MM-dd HH:mm' },
        },
        {
          type: 'Slot',
          prop: 'subOrders',
          label: '新建子订单',
          formItemAttrs: {
            rules: [{ required: true, message: '添加子订单', trigger: 'blur' }],
          },
          hidden: false,
        },
        {
          type: 'Section',
          title: '联系人信息',
          prop: 'contacts_info'
        },
        {
          type: 'Input',
          prop: 'contacts',
          span: 12,
          formItemAttrs: {
            label: '联系人姓名',
            rules: [{ required: true, message: '用户名不能为空', trigger: 'blur' },
            { max: 10, message: '联系人姓名最多10个字符', trigger: 'blur' }],
          },
          attrs: { placeholder: '联系人', clearable: true, style: 'max-width: 300px' },
        },
        {
          type: 'Input',
          prop: 'contactsTelephone',
          span: 12,
          formItemAttrs: {
            label: '联系人电话',
            rules: [{ required: true, trigger: 'blur', validator: validPhone }],
          },
          attrs: { placeholder: '电话', clearable: true, style: 'max-width: 300px' },
        },
        {
          type: 'Input',
          prop: 'contactsAddress',
          span: 12,
          formItemAttrs: {
            label: '联系人地址',
            rules: [{ required: false, message: '联系人地址不能为空', trigger: 'blur' },
            { max: 30, message: '联系人最多30个字符', trigger: 'blur' }],
          },
          attrs: { placeholder: '联系人地址', clearable: true, style: 'max-width: 300px' },
        },
        {
          type: 'Input',
          prop: 'contactsCompany',
          span: 12,
          formItemAttrs: {
            label: '联系人公司',
            rules: [{ required: false, message: '联系人公司不能为空', trigger: 'blur' },
            { max: 30, message: '联系人公司最多30个字符', trigger: 'blur' }],
          },
          attrs: { placeholder: '联系人公司', clearable: true, style: 'max-width: 300px' },
        },
        {
          type: 'Section',
          title: '发票信息',
          prop: 'receiptInfo'
        },
        {
          type: 'Radio',
          prop: 'isReceipt',
          span: 24,
          dafault: 1,
          formItemAttrs: {
            label: '是否开发票',
            rules: [{ required: true, message: '请选择', trigger: 'blur' }],
          },
          data: [
            { text: '是', value: 1 },
            { text: '否', value: 0 }
          ]
        },
        {
          type: 'Input',
          prop: 'receiptType',
          span: 12,
          ifRender(data) {
            return data.isReceipt
          },
          formItemAttrs: {
            label: '发票类型',
            rules: [{ required: false, message: '发票类型不能为空', trigger: 'blur' },
            { max: 50, message: '发票类型最多50个字符', trigger: 'blur' }],
          },
          attrs: { placeholder: '发票类型', clearable: true, style: 'max-width: 300px' },
        },
        {
          type: 'Input',
          prop: 'receiptNo',
          span: 12,
          ifRender(data) {
            return data.isReceipt
          },
          formItemAttrs: {
            label: '企业税号',
            rules: [{ required: true, message: '企业税号不能为空', trigger: 'blur' },
            { max: 50, message: '企业税号最多50个字符', trigger: 'blur' }],
          },
          attrs: { placeholder: '企业税号', clearable: true, style: 'max-width: 300px' },
        },
        {
          type: 'Input',
          prop: 'receiptName',
          span: 12,
          ifRender(data) {
            return data.isReceipt
          },
          formItemAttrs: {
            label: '发票抬头',
            rules: [{ required: true, message: '发票抬头不能为空', trigger: 'blur' },
            { max: 50, message: '发票抬头最多50个字符', trigger: 'blur' }],
          },
          attrs: { type: 'textarea', placeholder: '发票抬头', clearable: true, style: 'max-width: 300px' },
        },
        {
          type: 'Input',
          prop: 'receiptContent',
          span: 12,
          ifRender(data) {
            return data.isReceipt
          },
          formItemAttrs: {
            label: '发票内容',
            rules: [{ required: false, message: '发票内容不能为空', trigger: 'blur' },
            { max: 50, message: '发票内容最多50个字符', trigger: 'blur' }],
          },
          attrs: { type: 'textarea', placeholder: '发票内容', clearable: true, style: 'max-width: 300px' },
        },
        {
          type: 'Input',
          prop: 'receiptEmail',
          span: 12,
          ifRender(data) {
            return data.isReceipt
          },
          formItemAttrs: {
            label: '发票接收邮箱',
            rules: [{ required: false, message: '不能为空', trigger: 'blur' },
            { max: 50, message: '发票接收邮箱最多50个字符', trigger: 'blur' }],
          },
          attrs: { placeholder: '发票接收邮箱', clearable: true, style: 'max-width: 300px' },
        },
      ],
      buttons: [{
        name: '保存',
        type: 'primary',
      }],
    }
  },
  methods: {
    fSubmit() {
      let order = {
        ...omit(this.order, ['section', 'train_info', 'contacts_info', 'receipt_info']),
        subOrders: this.order.subOrders.map(subOrder => {
          return omit(subOrder, 'index')
        })
      }
      saveOrder(order).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        });
      })
    }
  }
}
</script>
