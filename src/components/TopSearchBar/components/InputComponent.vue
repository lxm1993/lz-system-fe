<template>
  <el-input v-model.trim="model"
    v-bind="config.attrs"
    class="top_search_input">
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
<style >
.input-search {
  width: 140px !important;
}
</style>
