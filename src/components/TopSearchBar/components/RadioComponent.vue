<template>
  <div :class="config.classStr || ''"
    :ref="config.prop">
    <el-radio v-for="radio in config.radioList"
      v-model="model"
      :disabled="config.disabled"
      :key="radio.value"
      :label="radio.value">{{radio.text}}</el-radio>
  </div>
</template>
<script>
export default {
  name: 'Radio',
  props: {
    value: {
      type: Number,
      default: null,
    },
    config: {
      type: Object,
      default: () => {
        return {
          type: 'Radio',
          prop: 'radio',
          label: 'radio类型',
          radioList: [
            {
              text: '是',
              value: 0,
            },
            {
              text: '否',
              value: 1,
            },
          ],
          hidden: false,
          disabled: false,
        }
      },
    },
  },
  computed: {
    model: {
      get: function () {
        return this.value || this.config.defaultValue || 0
      },
      set: function (val) {
        this.$emit('input', val)
      },
    },
  },
}
</script>
