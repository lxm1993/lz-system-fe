<template>
  <el-select v-model="model"
    v-bind="config.attrs"
    :ref="config.prop"
    v-list-getter="listGetterConfig"
    class="create_view_select">
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
      // 默认值
      let listValue = (this.listGetterConfig && this.listGetterConfig.optionValue) || 'datavalue'
      let defaultVal = arr[0] && arr[0][listValue]
      if (this.config.default) {
        this.model = this.config.attrs && this.config.attrs.multiple ? [defaultVal] : defaultVal
      }
      return arr
    }
  }
}
</script>
<style lang="scss">
.create_view_select {
  max-width: 300px;
}
</style>
