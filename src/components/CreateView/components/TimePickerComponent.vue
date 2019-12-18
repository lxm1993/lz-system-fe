<template>
  <div class="create_view_timepick">
    <el-time-picker v-if="config.attrs['is-range']"
      v-model="model"
      v-bind="config.attrs">
    </el-time-picker>
    <el-time-select v-else
      v-model="model"
      v-bind="config.attrs">
    </el-time-select>
  </div>
</template>
<script>
export default {
  name: 'TimePicker',
  props: {
    value: {
      type: [String, Array],
      default: '',
    },
    config: {
      type: Object,
      default: () => {
        return {
          type: 'TimePicker',
          prop: 'timePicker',
          formItemAttrs: {
            label: 'timePicker',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          attrs: {
            clearable: true,
            'start-placeholder': '开始日期',
            'end-placeholder': '结束日期',
            format: 'HH:mm:ss',
            'value-format': 'HH:mm:ss'
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
}
</script>
