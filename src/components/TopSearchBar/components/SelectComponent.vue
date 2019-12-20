<template>
  <el-select v-model="model"
    v-bind="config.attrs"
    :ref="config.prop"
    v-list-getter="listGetterConfig"
    class="top_search_select">
    <el-option v-for="(item, index) in dataList"
      :key="index"
      :label="config.listGetter && config.listGetter.optionName
        ? item[config.listGetter.optionName]
        : item.dataname"
      :value="config.listGetter && config.listGetter.optionValue
        ? item[config.listGetter.optionValue]
        : item.datavalue">
    </el-option>
  </el-select>
</template>
<script>
export default {
  name: 'Select',
  props: {
    value: {
      type: [Array, String, Number]
    },
    config: {
      type: Object,
      default: () => {
        return {
          type: 'Select',
          prop: 'select',
          formItemAttrs: {
            label: 'select',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          attrs: {
            placeholder: '请输入',
            clearable: true,
          },
          listGetter: {
            url: '/basemappings',
            params: { datatype: 'plat' },
            keyMap: { list: 'data' },
            data: [],
            optionValue: 'map_value',
            optionName: 'map_name',
          }
          // data: [
          //   {
          //     datavalue: '1',
          //     dataname: '搜狐视频',
          //   }
          // ]
        }
      }
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
  methods: {
    Ffilter(arr) {
      arr = this.config.listGetter && this.config.listGetter.filter
        ? this.config.listGetter.filter(arr)
        : arr
      // 全部
      let listKey = (this.listGetterConfig && this.listGetterConfig.optionName) || 'dataname'
      let listValue = (this.listGetterConfig && this.listGetterConfig.optionValue) || 'datavalue'
      let defaultObj = {}
      defaultObj[listValue] = ''
      defaultObj[listKey] = '全部'
      arr.unshift(defaultObj)

      // 默认值
      let defaultVal = arr[0] && arr[0][listValue]
      this.model = this.config.default ? defaultVal : this.model
      return arr
    }
  }
}
</script>
<style lang="scss">
.top_search_select {
  width: 300px;
}
</style>
