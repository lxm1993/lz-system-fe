<template>
  <el-table :ref="config.prop"
    :data="dataList"
    border
    @selection-change="handleSelectionChange"
    v-list-getter="listGetterConfig"
    class="create_view_tablebox">
    <el-table-column v-if="config.attrs.showSelection"
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column align="center"
      show-overflow-tooltip
      v-for="column in config.columns"
      v-bind="column"
      :key="column.prop">
      <template slot-scope="{row}">
        {{row | render(column)}}
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
// 返回 key value的对象
export default {
  name: 'CheckBox',
  data() {
    return { listKeyMap: {} }
  },
  props: {
    value: {
      type: Array,
      default() {
        return []
      },
    },
    config: {
      type: Object,
      default: () => {
        return {
          type: 'Table',
          prop: 'table',
          formItemAttrs: {
            label: 'table',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          attrs: {
            showSelection: true,
          },
          columns: [
            {
              prop: 'map_name', label: 'DSP名称', 'min-width': 120,
            },
            {
              prop: 'map_value', label: '可用流量百分比', 'min-width': 120,
            },
          ],
          listGetter: {
            url: '/basemappings',
            params: { datatype: 'plat' },
            keyMap: { list: 'data' },
            data: [],
            optionValue: 'map_value',
            optionName: 'map_name',
            optionValueUseIndex: true,
          }
        }
      },
    },
  },
  computed: {
    model: {
      get: function () {
        return this.value
      },
      set: function (newVal) {
        this.$emit('input', newVal)
      },
    },
    dataList() {
      let listGetter = this.config.listGetter
      return listGetter ? listGetter.data : this.config.data
    },
    listGetterConfig() {
      let listGetter = this.config.listGetter
      return listGetter
        ? {
          ...listGetter,
          ref: this.config.prop,
          filter: this.Ffilter,
        }
        : null
    },
  },
  watch: {
    model(val) {
      // 重置数据
      if (this.config.defaultValue &&
        (val.join() === this.config.defaultValue.join())) {
        this.$refs[this.config.prop].clearSelection()
      }
    },
  },
  created() {
    if (this.config.dataList) {
      this.Ffilter(this.config.dataList)
    }
  },
  methods: {
    handleSelectionChange(newArr) {
      let arr = this.config.handleSelectFilter ? this.config.handleSelectFilter(newArr) : newArr
      arr = arr.map(item => {
        return item[this.config.listGetter.optionValue]
      })
      this.model = arr
    },
    Ffilter(arr) {
      let newArr = this.config.listGetter && this.config.listGetter.filter
        ? this.config.listGetter.filter(arr)
        : arr
      newArr.forEach(item => {
        let key = item[this.config.listGetter.optionValue]
        this.listKeyMap[key] = item
      })
      setTimeout(() => {
        this.value.forEach(item => {
          let selectVal = this.listKeyMap[item]
          selectVal && this.$refs[this.config.prop].toggleRowSelection(selectVal, true)
        })
      }, 200)
      return newArr
    },
  },
}
</script>
<style scoped lang="css">
</style>
