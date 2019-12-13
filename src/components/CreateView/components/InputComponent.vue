<template>
  <el-input v-model.trim="model"
    v-bind="config.attrs"
    class="create_view_input">
    <template v-if="config.attrs && config.attrs.append"
      slot="append">{{ config.attrs.append }}</template>
  </el-input>
</template>
<script>
export default {
  name: 'Input',
  props: {
    value: {
      type: String,
      default: '',
    },
    config: {
      type: Object,
      default() {
        return {
          type: 'Input',
          prop: 'input',
          append: '', // 后缀,
          formItemAttrs: {
            label: 'input',
            rules: [
              {
                required: true, message: '请输入input类型', trigger: 'blur',
              },
            ],
          },
          attrs: {
            placeholder: '请输入',
            clearable: true,
          },
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
<style scoped lang="css">
.create_view_input {
  max-width: 400px;
}
</style>
