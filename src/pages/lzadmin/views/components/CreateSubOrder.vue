<template>
  <div>
    <el-button type="primary"
      icon="el-icon-plus"
      size="mini"
      @click="fAddParam"
      class="add-btn">新建子订单</el-button>
    <el-table class="create-param-table"
      header-row-class-name="table-header"
      cell-class-name="table-cell"
      border
      :data="dataList">
      <el-table-column align="center"
        show-overflow-tooltip
        v-for="column in columns"
        v-bind="column"
        :key="column.prop">
        <template slot-scope="{row}">
          <el-button v-if="column.prop === 'delete'"
            size="mini"
            icon="el-icon-delete"
            type="danger"
            @click="fDelete(row.index)">
            删除
          </el-button>
          <el-input v-else
            :type="column.type || ''"
            size="small"
            v-model="row[column.prop]">
          </el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
  <script>
export default {
  props: {
    value: {
      type: Array,
      default: () => { return [] },
    }
  },
  computed: {
    dataList: {
      get: function () {
        return this.value
      },
      set: function (val) {
        this.$emit('input', val)
      },
    },
  },
  data() {
    return {
      columns: [
        {
          prop: 'passengerName', label: '乘客姓名', 'min-width': 100,
        },
        {
          prop: 'passengerType', label: '乘客类型', 'min-width': 100,
        },
        {
          prop: 'certType', label: '证件类型', 'min-width': 120,
        },
        {
          prop: 'certNo', label: '证件号码', 'min-width': 160,
        },
        {
          prop: 'ticketPrice', label: '订单票价', type: 'number', 'min-width': 80,
        },
        {
          prop: 'delete', label: '删除', 'min-width': 80,
        },
      ],
    }
  },
  methods: {
    fAddParam() {
      let index = this.dataList.length
      this.dataList.push({
        passengerName: '',
        passengerType: '',
        certType: '',
        certNo: '',
        index: index,
      })
    },
    fDelete(index) {
      this.dataList.splice(index, 1)
    }
  }
}
</script>
<style lang="scss">
.add-btn {
  margin-left: -60px;
}
.create-param-table {
  top: 10px;
  left: -60px;
  margin-bottom: 0px;
  .table-header {
    color: #409eff;
    th {
      line-height: 23px;
      padding: 10px 0;
    }
  }
  .table-cell {
    padding: 5px 0;
  }
}
</style>
