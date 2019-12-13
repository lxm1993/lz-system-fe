<template>
  <el-input v-model.trim="model"
    :size="config.size || 'medium'"
    :class="config.classStr || ''"
    :placeholder="config.placeholder"
    clearable>
  </el-input>
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
          type: 'Input',
          prop: 'input',
          label: 'input类型',
          placeholder: 'input类型',
          hidden: false,
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
}
</script>
