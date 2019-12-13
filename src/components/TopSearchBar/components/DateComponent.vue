<template>
  <el-date-picker v-model="model"
    :placeholder="config.placeholder"
    :size="config.size || 'medium'"
    :class="config.classStr || ''"
    :type="config.pickType || 'date'"
    :picker-options="config.pickerOption || {}"
    :format="config.format || 'yyyy-MM-dd'"
    :value-format="config.valueFormat || 'yyyy-MM-dd'"
    :align="config.align || 'left'">
  </el-date-picker>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    config: {
      type: Object,
      default: () => {
        return {
          // 详细配置见代码同elementUI DataPick组件,目前未添加全部，需要可自行添加
          type: 'Date',
          pickType: 'date', // week/ month/year /date
          prop: 'datePicker',
          label: 'Date',
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
