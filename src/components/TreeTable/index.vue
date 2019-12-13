<template>
  <el-table ref="table"
    :data="formatData"
    :row-class-name="showRow"
    @selection-change="fSelectionChange"
    @select="fSelectRow"
    v-bind="$attrs"
    v-on="$listeners">
    <slot name="selection"></slot>
    <slot v-if="!columns || columns.length===0"></slot>
    <el-table-column v-else
      v-for="(column, index) in columns"
      :key="column.value"
      :label="column.text"
      :width="column.width">
      <template slot-scope="scope">
        <span v-if="index === 0">
          <span v-for="space in scope.row._level"
            class="ms-tree-space"
            :key="space"></span>
        </span>
        <span class="tree-ctrl"
          v-if="iconShow(index,scope.row)"
          @click.stop="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded"
            class="el-icon-plus"></i>
          <i v-else
            class="el-icon-minus"></i>
        </span>
        {{scope.row[column.value]}}

        <!-- 增加全选反选的按钮 -->
        <span class="op"
          v-if="$slots.selection && iconShow(index,scope.row)">
          <el-button size="mini"
            type="primary"
            @click="fSelectChildren(scope.row)">全选</el-button>
          <el-button size="mini"
            @click="fReverseChildren(scope.row)">反选</el-button>
        </span>
      </template>

    </el-table-column>
  </el-table>
</template>

<script>
import treeToArray from './eval'
export default {
  name: 'treeTable',
  props: {
    defaultValue: {
      type: Array,
      default: () => [],
    },
    data: {
      type: [Array, Object],
      required: true,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    noLevelData(val) {
      this.fSetDefaultValue()
    },
    defaultValue() {
      this.fSetDefaultValue()
    },
  },
  data() {
    return { aSelections: [] }
  },
  computed: {
    // 格式化数据源
    formatData: function () {
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
      return func.apply(null, args)
    },
    noLevelData: function () {
      let _tmp = {}
      const _fGetObj = (obj) => {
        if (obj && obj.id) {
          _tmp[obj.id] = obj
          // if (obj.children) {
          //   obj.children.forEach(v => {
          //     _tmp[v.id] = v
          //     _fGetObj(v)
          //   })
          // }
        }
      }

      this.formatData.forEach(v => {
        _fGetObj(v)
      })

      return _tmp
    },
  },
  methods: {
    fSetDefaultValue() {
      // console.log('treetable default value', this.defaultValue)
      this.$nextTick(() => {
        if (this.defaultValue.length && Object.keys(this.noLevelData).length) {
          this.defaultValue.forEach(v => {
            // const _data = this.noLevelData[v]
            if (this.noLevelData[v]) {
              this.toggleRowSelection(this.noLevelData[v], true)
            }
          })
        }
      })
    },
    fSelectRow(selection, row) {
      // 在选择时判断，如果选中了一行，则同时自动递归选中该行的所有父级和子级
      // 如果取消了一行选中，则取消其所有子级的选中,并且如果没有相同兄弟节点被选中，则取消父级的选中
      const _bChecked = this.fIsChecked(row)
      // console.log(this.noLevelData)
      if (_bChecked) {
        this.fCheck(row)
      } else {
        // if (this.fIsChecked(row.children, false)) {
        this.fUncheck(row)
        // }
      }
    },
    fSelectionChange(val) {
      this.aSelections = val
    },
    showRow: function (row) {
      const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
      row.row._show = show
      return show ? 'tree-show' : 'tree-hidden'
    },
    // 切换下级是否展开
    toggleExpanded: function (trIndex) {
      const record = this.formatData[trIndex]
      record._expanded = !record._expanded
    },
    toggleExpandedAll(status = false) {
      for (let _key in this.noLevelData) {
        if (this.noLevelData[_key]._expanded !== status) {
          this.noLevelData[_key]._expanded = status
        }
      }
    },
    // 图标显示
    iconShow(index, record) {
      return (index === 0 && record.children && record.children.length > 0)
    },
    toggleRowSelection(row, selected) {
      this.$refs.table.toggleRowSelection(row, selected)
    },
    fGetSelection() {
      return this.aSelections
    },
    // 判断一个对象(一行)是否被选中 / 未选中
    fIsChecked(obj, status = true) {
      if (!obj) {
        return false
      }
      if (!Array.isArray(obj)) {
        obj = [obj]
      }
      let _bChecked = obj.every(v => {
        return this.aSelections.includes(v) === status
      })

      return _bChecked
    },
    // 全选所有子节点
    fSelectChildren(row) {
      // console.log(row.children)

      // 在有子节点的情况下，如果点击了全选，就选中自身和所有一级子节点
      if (row.children && row.children.length) {
        if (!this.fIsChecked(row)) {
          this.toggleRowSelection(row, true)

          // 递归选中父节点
        }
        row.children.forEach(v => {
          if (!this.fIsChecked(v)) {
            this.toggleRowSelection(v, true)
          }
        })
      }
    },
    // 反转选择子节点
    fReverseChildren(row) {
      let _nCheckedCount = 0

      // 在有子节点的情况下，如果点击了反选，就反选所有下级子节点,
      // 对于递归节点， 如果下级子节点下有选择的节点，当这个下级节点取消选择时，同时取消该节点下所有的已选择节点
      if (row.children && row.children.length) {
        row.children.forEach(v => {
          this.toggleRowSelection(v)
          if (this.fIsChecked(v)) {
            _nCheckedCount++
          } else {
            this.fUncheck(v)
          }
        })
        if (!_nCheckedCount) {
          this.fUncheck(row, true)
        } else {
          // 如果是全选的情况下,将自身选中
          if (_nCheckedCount === row.children.length) {
            !this.fIsChecked(row) && this.toggleRowSelection(row, true)
          }
        }
      }
    },
    // 取消一个选择框选中状态，根据参数onlySelf看是否取消掉其所有递归子级的选中状态
    fUncheck(obj, onlySelf = false) {
      if (!obj) return
      this.toggleRowSelection(obj, false)
      //  取消掉自己之后，需要看一下与自己同级的是否还有选中，如果没有的话，需要将父级取消选中
      // 依此类推直到最顶级
      const _parent = obj.pid && this.noLevelData[obj.pid]
      const _children = _parent && _parent.children
      if (_children && this.fIsChecked(_children, false)) {
        this.fUncheck(_parent, true)
      }
      if (!onlySelf) {
        if (obj.children && obj.children.length) {
          obj.children.forEach(v => {
            this.fUncheck(v)
          })
        }
      }
    },
    // 选中一个选择框，递归选中其所有上级，直到最顶级
    fCheck(obj, onlySelf = false) {
      if (!obj) return
      if (!this.fIsChecked(obj)) {
        this.toggleRowSelection(obj, true)
      }
      if (!onlySelf) {
        if (obj.pid && this.noLevelData[obj.pid]) {
          this.fCheck(this.noLevelData[obj.pid])
        }
      }
    },
    fReset() {
      const _dTable = this.$refs.table
      _dTable.clearSelection()
      this.toggleExpandedAll(false)
    },

  },
}
</script>
<style rel="stylesheet/css">
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.tree-show {
  animation: treeTableShow 1s;
  -webkit-animation: treeTableShow 1s;
}
.tree-hidden {
  display: none;
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
$color-blue: #2196f3;
$space-width: 18px;
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: $space-width;
  height: 14px;
  &::before {
    content: "";
  }
}
.processContainer {
  width: 100%;
  height: 100%;
}
table td {
  line-height: 26px;
}
.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: $color-blue;
  margin-left: -$space-width;
}
.op {
  margin-left: 10px;
}
</style>
