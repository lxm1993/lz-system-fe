<template>
  <div class="create_view_multiinput">
    <el-input v-for="(item, index) in model"
      :key="index"
      v-model="item.value"
      v-bind="config.attrs">
      <select-component v-if="config.select"
        :config="config.select | selectFilter(index)"
        v-model="item.select"
        slot="prepend"></select-component>
      <el-button @click="fAddNew(index)"
        :icon="index === 0 ? 'el-icon-circle-plus-outline' : 'el-icon-delete'"
        slot="append"
        type="danger"
        circle></el-button>
    </el-input>
  </div>
</template>
<script>
import SelectComponent from './SelectComponent.vue'
export default {
  name: 'MultiInput',
  components: { SelectComponent },
  data() {
    return {}
  },
  props: {
    value: {
      type: Array,
    },
    config: {
      type: Object,
      default: () => {
        return {
          type: 'MultiInput',
          prop: 'multiInput',
          formItemAttrs: {
            label: 'multiInput',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          attrs: {
            style: 'width: 550px'
          },
          select: {
            type: 'Select',
            prop: 'select',
            formItemAttrs: {
              label: 'select',
              rules: [
                {
                  required: true, message: '请输入', trigger: 'blur',
                },
              ],
            },
            attrs: {
              placeholder: '请输入',
              clearable: true,
              style: 'width: 150px'
            },
            listGetter: {
              url: '/basemappings',
              params: { datatype: 'plat' },
              keyMap: { list: 'data' },
              data: [],
              optionValue: 'map_value',
              optionName: 'map_name',
            }
          }
        }
      },
    },
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
  filters: {
    selectFilter(val, index) {
      return {
        ...val,
        prop: val.prop + index,
      }
    },
  },
  mounted() {
    if (this.model.length === 0) {
      this.fAddNew(0)
    }
  },
  methods: {
    fAddNew(index) {
      if (index === 0) {
        // 限制可增加个数
        if (this.model.length >= (this.config.length || 5)) {
          return
        }
        // 新增
        this.model = [
          ...this.model,
          {
            value: this.config.defaultValue || '',
            select: this.config.select
              && this.config.select.defaultValue || '',
          },
        ]
      } else { // 删除
        this.model.splice(index, 1)
        this.model = [...this.model]
      }
    },
  },
}
</script>
<style lang="scss">
.create_view_multiinput {
  max-width: 400px;
  .el-input-group--append {
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 0px;
    }
  }
  .el-input-group {
    .el-input__inner {
      display: inline-block;
    }
  }
  .el-input-group__append {
    background-color: #fff;
    color: #409eff;
    border: 0px !important;
  }
}
</style>
