<template>
  <el-date-picker v-model="model"
    :placeholder="config.placeholder"
    :size="config.size || 'medium'"
    :class="config.classStr || ''"
    :type="config.pickType || 'datetimerange'"
    :picker-options="config.pickerOptions || {}"
    :range-separator="config.rangeSeparator || '至'"
    :start-placeholder="config.startPlaceholder || '开始日期'"
    :end-placeholder="config.endPlaceholder || '结束日期'"
    :format="config.format || 'yyyy-MM-dd HH:mm:ss'"
    :value-format="config.valueFormat || 'yyyy-MM-dd HH:mm:ss'"
    :align="config.align || 'left'">
  </el-date-picker>
</template>
<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      },
    },
    config: {
      type: Object,
      default: () => {
        return {
          // 详细配置见代码同elementUI DataPick组件,目前未添加全部，需要可自行添加
          type: 'DateRange',
          startTimeKey: 'startTime', // 提交开始时间字段名
          endTimeKey: 'endTime', // 提交结束时间字段名
          pickType: 'datetimerange', // datetimerange/ daterange/monthrange /date
          prop: 'dataPicker',
          label: 'DataPicker',
          size: '',
          format: '',
          valueFormat: '',
          hidden: false,
          align: 'left',
          defaultVal: [],
        }
      },
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
  mounted() {
    this.model = this.config.defaultVal
  },
}
</script>
