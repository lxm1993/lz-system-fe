<template>
  <el-cascader v-model="model"
    :ref="config.prop"
    :options="dataList"
    v-bind="config.attrs"
    v-list-getter="listGetterConfig"
    class="create_view_cascader">
  </el-cascader>
</template>
<script>

export default {
  name: 'Cascader',
  props: {
    value: {
      type: [Object, String, Array],
    },
    config: {
      type: Object,
      default: () => {
        return {
          type: 'Cascader',
          prop: 'cascader',
          formItemAttrs: {
            label: 'cascader',
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
        return this.value
      },
      set: function (newVal) {
        this.$emit('input', newVal)
      },
    },
    dataList() {
      let listGetter = this.config.listGetter
      return listGetter ? listGetter.data : this.config.data || []
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
  methods: {
    Ffilter(arr) {
      // 处理后端返回数据格式
      let listGetter = this.config.listGetter
      let dealArrFun = (arr, parentVal = '') => {
        return arr.map((item, index) => {
          let curValue = item[listGetter.optionValue || 'datavalue']
          if (listGetter.optionValueUseIndex) {
            let curIndex = ++index
            curValue = item.index ? item.index : `${curIndex < 10 ? `0${curIndex}` : curIndex}`
          }
          let value = parentVal ? `${parentVal}-${curValue}` : curValue
          return {
            value: value,
            label: item[listGetter.optionName || 'dataname'],
            children: item.child ? dealArrFun(item.child, value) : null,
          }
        })
      }
      let filterArr = listGetter && listGetter.filter
        ? listGetter.filter(arr)
        : arr
      let newArr = dealArrFun(filterArr)
      return newArr
    },
  },
}
</script>
<style lang="scss">
.create_view_cascader {
  width: 300px;
  .el-cascader__label {
    display: none;
  }
}
</style>
