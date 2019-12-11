<template>
  <div v-if="update">
    <el-select v-model="model"
      clearable
      :disabled="config.disabled"
      :multiple="config.multiple"
      :collapse-tags="config.collapseTags"
      :ref="config.prop"
      :size="config.size || 'medium'"
      :class="config.classStr || ''"
      :placeholder="config.placeholder"
      v-list-getter="listGetterConfig">
      <el-option v-for="(item, index) in dataList"
        :key="index"
        :label="config.listGetter && config.listGetter.optionName
        ? item[config.listGetter.optionName]
        : item.dataname"
        :value="config.listGetter && config.listGetter.optionValue
        ? item[config.listGetter.optionValue]
        : item.datavalue">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: [String, Array],
      default: '',
    },
    config: {
      type: Object,
      default: () => {
        return {
          label: '审核状态',
          type: 'Select',
          prop: 'status',
          placeholder: '',
          classStr: '',
          multiple: false, // 是否多选
          collapseTags: false,
          autoDefault: false,
          listGetter: {
            reqUrl: '',
            reqParma: { datatype: '' },
            keyMap: { list: 'data' },
            filter: null,
            dataList: [],
          },
          // 本地数据
          dataList: [
            {
              datavalue: '0',
              dataname: '全部',
            },
          ],
        }
      },
    },
  },
  data() {
    return {
      update: true, dataList: [],
    }
  },
  mounted() {
    if (this.config.dataList) {
      this.dataList = this.config.dataList
    }
  },
  watch: {
    'config.dataList': {
      handler: function (newList, oldVal) {
        this.dataList = newList
      },
    }
  },
  computed: {
    model: {
      get: function () {
        return this.value || this.config.defaultValue
      },
      set: function (val) {
        this.$emit('input', val)
      },
    },
    listGetterConfig() {
      return this.config.listGetter
        ? {
          url: this.config.listGetter.reqUrl,
          params: this.config.listGetter.reqParma,
          data: this.config.listGetter.dataList,
          keyMap: this.config.listGetter.keyMap || { list: 'data' },
          ref: this.config.prop,
          filter: this.fFilter,
        }
        : null
    },
  },
  methods: {
    fFilter(arr) {
      let newArr = this.config.listGetter && this.config.listGetter.filter
        ? this.config.listGetter.filter(arr)
        : arr
      if (this.config.autoDefault) {
        this.model = newArr[0] && newArr[0][this.config.listGetter.optionValue]
      }
      this.dataList = newArr
      return newArr
    },
    fReload() {
      // 移除组件
      this.update = false
      this.config.listGetter.dataList = []
      this.model = this.config.multiple ? [] : ''
      // 在组件移除后，重新渲染组件
      // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
      this.$nextTick(() => {
        this.update = true
      })
    },
  },
}
</script>
