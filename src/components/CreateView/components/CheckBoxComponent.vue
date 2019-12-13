<template>
  <!-- 接口请求 -->
  <el-checkbox-group v-model="model"
    v-bind="config.attrs"
    :ref="config.prop"
    v-list-getter="listGetterConfig"
    class="create_view_checkbox">
    <el-checkbox v-for="(item, index) in dataList"
      :key="index "
      :label="config.listGetter && config.listGetter.optionName
        ? item[config.listGetter.optionName]
        : item.dataname">
    </el-checkbox>
  </el-checkbox-group>
</template>
<script>
// 返回 key value的对象
import {
  getkeyValueObjFromDataList, reverseObjectKeyValue,
} from '@/utils/index'
import { isObject } from 'lodash'

export default {
  name: 'CheckBox',
  data() {
    return { listKeyMap: {} }
  },
  props: {
    value: {
      type: [Object, Array],
      default() {
        return []
      },
    },
    config: {
      type: Object,
      default: () => {
        return {
          type: 'CheckBox',
          prop: 'checkBox',
          needKeyValue: true,
          formItemAttrs: {
            label: 'checkBox',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          attrs: {
            placeholder: '请输入',
            clearable: true,
            separator: '/',
            props: { multiple: true },
            //  style: 'width: 400px'
          },
          listGetter: {
            url: '/basemappings',
            params: { datatype: 'plat' },
            keyMap: { list: 'data' },
            data: [],
            optionValue: 'map_value',
            optionName: 'map_name',
            optionValueUseIndex: true,
          }
        }
      },
    },
  },
  computed: {
    model: {
      get: function () {
        return isObject(this.value) ? Object.values(this.value || {}) : this.value
      },
      set: function (newVal) {
        let realValue = {}
        newVal.forEach(val => {
          if (Object.keys(this.listKeyMap).includes(val)) {
            realValue[this.listKeyMap[val]] = val
          }
        })
        this.$emit('input', realValue)
      },
    },
    dataList() {
      let listGetter = this.config.listGetter
      return listGetter ? listGetter.data : this.config.data
    },
    listGetterConfig() {
      let listGetter = this.config.listGetter
      return listGetter
        ? {
          ...listGetter,
          ref: this.config.prop,
          filter: this.Ffilter,
        }
        : null
    },
  },
  watch: {
    model(val) {
      // 重置数据 ,todo: 想到更好的还需要优化
      if (this.config.defaultValue &&
        (val.join() === this.config.defaultValue.join())) {
        this.fRestModel()
      }
    },
  },
  created() {
    if (this.config.data) {
      this.Ffilter(this.config.data)
    }
  },
  methods: {
    Ffilter(arr) {
      let newArr = this.config.listGetter && this.config.listGetter.filter
        ? this.config.listGetter.filter(arr)
        : arr

      this.listKeyMap = getkeyValueObjFromDataList({
        list: newArr,
        keyname: this.config.listGetter && this.config.listGetter.optionName
          ? this.config.listGetter.optionName
          : 'dataname',
        valueName: this.config.listGetter && this.config.listGetter.optionValue
          ? this.config.listGetter.optionValue
          : 'datavalue',
      })
      this.fRestModel()
      return newArr
    },
    fRestModel() {
      if (Object.keys(this.listKeyMap).length === 0) {
        return
      }
      // 加延迟防止数据还未获取到展示为空
      setTimeout(() => {
        if (this.config.directVal) {
          return
        }
        let reverseObject = reverseObjectKeyValue(this.listKeyMap)
        let newModel = this.model.map(key => {
          return reverseObject[key]
        }).filter(item => {
          return !!item
        })
        this.model = [...newModel]
      }, 200)
    },
  },
}
</script>

