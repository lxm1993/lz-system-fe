<template>
  <div class="create_view_radio">
    <el-radio v-for="radio in config.data"
      v-model="model"
      v-bind="config.attrs"
      :key="radio.value"
      :label="radio.value">{{radio.text}}</el-radio>
  </div>
</template>
<script>
export default {
  name: 'Radio',
  props: {
    value: {
      type: [Number, Boolean, String],
      default: null,
    },
    config: {
      type: Object,
      default: () => {
        return {
          type: 'Radio',
          prop: 'radio',
          formItemAttrs: {
            label: 'radio',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          data: [
            {
              text: '是',
              value: 0,
            },
            {
              text: '否',
              value: 1,
            },
          ],
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
<style lang="scss">
.create_view_radio {
  font-size: 14px;
}
</style>
