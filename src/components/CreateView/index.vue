<template>
  <div class="create-view-wrap">
    <el-form ref="form"
      :model="data"
      :disabled="action === 'view'"
      v-bind="$attrs">
      <el-row>
        <el-col v-for="(item, index) in _formItems || []"
          :span="item.span || 24"
          :key="index">
          <el-form-item v-bind="item.formItemAttrs"
            :prop="item.prop">
            <slot v-if="item.type === 'Slot'"
              :name="item.prop"></slot>
            <component v-else
              :is="item.type"
              :config="item"
              v-model="data[item.prop]" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 操作区 -->
    <operation-buttons :buttons="operationBtns"
      :align="'center'"
      @operate="fOperation"></operation-buttons>
  </div>
</template>
<script>
import Cascader from './components/CascaderComponent.vue'
import Input from './components/InputComponent.vue'
import MultiInput from './components/MultiInputComponent.vue'
import Select from './components/SelectComponent.vue'
import Radio from './components/RadioComponent.vue'
import CheckBox from './components/CheckBoxComponent.vue'
import DataPicker from './components/DataPickerComponent.vue'
import FileUpload from './components/FileUploadComponent.vue'
import Table from './components/TableComponent.vue'
import Area from './components/AreaComponent.vue'
import Section from './components/Section.vue'
import Tag from './components/TagComponent.vue'
import OperationButtons from '@/components/OperationButtons'
import { toString, isObject } from 'lodash'
import { detailMixins } from '@/mixins'
export default {
  name: 'createView',
  mixins: [detailMixins],
  components: {
    Cascader, // 及联选择
    Input,
    MultiInput,
    Select,
    Radio,
    CheckBox,
    DataPicker, // 日期选择器
    FileUpload, // 单文件上传
    Table,
    Area,
    Section,
    Tag,
    OperationButtons,
  },
  props: {
    value: { type: Object },
    formItems: { type: Array },
    buttons: { type: Array },
    showSaveLoding: { type: Boolean },
    hiddenButtons: { type: Boolean },
  },
  data() {
    return {
      action: this.$route.meta.action,
    }
  },
  computed: {
    data: {
      get: function () {
        return this.value
      },
      set: function (val) {
        this.$emit('input', val)
      },
    },
    // 根据formItem计算出实际需要让页面渲染的真正的_formItem数据
    _formItems() {
      let formItem = this.formItems.filter(item => { return !item.hidden })
      return formItem
        .map(item => {
          return this.computeFormItem(item, this.data)
        })
        .filter(item => item._ifRender)
    },
    operationBtns() {
      if (this.hiddenButtons) {
        return []
      }
      return this.buttons
        ? this.buttons
        : [
          { name: '返回', type: 'info', isPlain: true },
          { name: '保存', type: 'primary', isPlain: true },
          { name: '修改', type: 'success', isPlain: true, hidden: this.action !== 'view' || !this.editLink },
          // { name: '重置', type: 'info', isPlain: true, hidden: this.action !== 'create' },
        ]
    },
  },
  methods: {
    computeFormItem(formItem, data) {
      const item = { ...formItem }
      // 获取动态 Attributes
      if (item.getAttrs) {
        item.attrs = Object.assign(item.attrs, item.getAttrs(data))
      }
      // 条件渲染
      item._ifRender = item.ifRender ? item.ifRender(data) : true
      return item
    },
    fOperation(btn) {
      switch (btn.name) {
        case '返回':
          this.$router.back()
          break
          break
        case '保存':
          this.fSubmit()
          break
        case '修改':
          this.$router.push(this.editLink || '')
          break
        case '重置':
          this.fClear()
        default:
          // 特殊操作处理
          this.$emit('operate', btn.name)
          break
      }
    },
    fSubmit() {
      if (!this.showSaveLoding) {
        this.fVelidateForm(this.$refs.form, () => {
          this.$emit('submit')
        })
        return
      }
      let btnIndex = ''
      let addBtn = ''
      this.operationBtns.forEach((btn, index) => {
        if (btn.name === '保存') {
          btnIndex = index
          addBtn = btn
        }
      })
      const fResetBtn = (disabled, icon = '') => {
        addBtn.disabled = disabled
        addBtn.icon = icon
        this.operationBtns.splice(btnIndex, 1, addBtn)
      }
      this.fVelidateForm(this.$refs.form, () => {
        fResetBtn(true, 'el-icon-loading')
        this.$emit('submit', () => {
          fResetBtn(false)
        })
      })
    },
    // 重置操作
    fClear() {
      let newObj = {}
      this.config.formItems.forEach(item => {
        if (item.noReset) {
          return false
        }
        let realVal = ''
        switch (item.type) {
          case 'Cascader':
          case 'CheckBox':
          case 'Table':
          case 'Tag':
            realVal = item.defaultValue || []
            break
          case 'Area':
            realVal = item.defaultValue || {
              includeList: [],
              excludeList: [],
            }
            break
          case 'Radio':
            realVal = item.defaultValue || 0
            break
          case 'Select':
            // 没有默认值时设置默认值为第一个
            realVal = this.fGetSelectDefaultValue(item)
            break
          case 'MultiInput':
            realVal = [{
              value: item.defaultValue || '',
              select: item.select.defaultValue || '',
            }]
            break
          default:
            realVal = item.defaultValue || ''
            break
        }
        let editVal = this.data[item.prop]
        if (this.action !== 'create') {
          newObj[item.prop] = (editVal === null || editVal === '') ? realVal : editVal
        } else {
          newObj[item.prop] = realVal
        }
      })
      this.data = { ...newObj }
    },
    // 设置默认值
    fGetSelectDefaultValue(item) {
      let dataList = item.listGetter
        ? item.listGetter.dataList
        : item.dataList || []
      let listValue = (item.listGetter && item.listGetter.optionValue) || 'datavalue'
      let defaultVal = dataList[0] && dataList[0][listValue]
      return item.defaultValue
        ? item.defaultValue
        : item.autoDefault && dataList.length > 0 // 是否自动设置默认值
          ? item.multiple ? [defaultVal] : defaultVal
          : item.multiple ? [] : ''
    },
  },
}
</script>
<style lang="scss">
.create-view-wrap {
  width: 1000px;
  .operate-btn {
    margin-right: 40px;
  }
  .el-form-item {
    margin-bottom: 18px;
  }
  .el-form-item__content .el-input > .el-input__inner {
    height: 40px;
  }
}
</style>
