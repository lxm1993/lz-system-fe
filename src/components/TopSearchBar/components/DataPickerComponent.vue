<template>
  <el-date-picker v-model="model"
    v-bind="config.attrs"
    class="top_search_datapick">
  </el-date-picker>
</template>
<script>
export default {
  name: 'DataPicker',
  props: {
    value: {
      type: [String, Array],
      default: '',
    },
    config: {
      type: Object,
      default: () => {
        return {
          type: 'DataPicker',
          prop: 'dataPicker',
          formItemAttrs: {
            label: 'dataPicker',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          attrs: {
            clearable: true,
            // type: 'date',
            // format: 'yyyy-MM-dd',
            // 'value-format': 'yyyy-MM-dd'
            type: 'datetimerange',
            'start-placeholder': '开始日期',
            'end-placeholder': '结束日期',
            format: 'yyyy-MM-dd HH:mm:ss',
            'value-format': 'yyyy-MM-dd HH:mm:ss'

          },
        }
      }
    },
  },
  computed: {
    model: {
      get: function () {
        return this.value
      },
      set: function (val) {
        this.$emit('input', val)
      },
    },
  },
  created() {
    this.model = this.config.default
  },
}
</script>
<style lang="scss">
.top_search_datapick {
  // width: 300px !important;
}
</style>