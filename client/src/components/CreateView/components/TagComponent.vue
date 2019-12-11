<template>
  <div class="create_view_tag">
    <el-tag v-for="(tag, index) in model"
      :key="index"
      v-bind="config.attrs"
      @close="handleClose(tag)">
      {{tag}}
    </el-tag>
    <el-input class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm">
    </el-input>
    <el-button v-else
      class="button-new-tag"
      size="small"
      @click="showInput">{{ '+' + config.addName || '添加'}}</el-button>
  </div>
</template>
<script>
export default {
  name: 'Tag',
  props: {
    value: {
      type: Array,
    },
    config: {
      type: Object,
      default: () => {
        return {
          type: 'Tag',
          prop: 'tag',
          addName: '添加',
          formItemAttrs: {
            label: 'tag',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          attrs: {
            closable: true,
            'disable-transitions': false,
          },
        }
      },
    },
  },
  data() {
    return {
      inputVisible: false,
      inputValue: '',
    }
  },
  computed: {
    model: {
      get: function () {
        return this.value || []
      },
      set: function (val) {
        this.$emit('input', val)
      },
    },
  },
  mounted() {
    if (this.model.length === 0) {
      this.model = []
    }
  },
  methods: {
    handleClose(tag) {
      this.model.splice(this.model.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.model.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
  },
}
</script>
<style lang="scss">
.create_view_tag {
  .el-tag {
    margin-right: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
