<template>
  <el-card class="info-card"
    v-bind="$attrs">
    <div slot="header">
      <span>{{title || 'title'}}</span>
    </div>
    <el-table v-if="type === 'table'"
      :data="model[tableKey]"
      border>
      <el-table-column v-for="item in items"
        align="center"
        v-bind="item"
        :key="item.prop">
      </el-table-column>
    </el-table>
    <el-row v-else>
      <el-col class="info-col"
        v-for="(item,index) in items"
        :key="index"
        v-bind="item.col_attrs">
        <div class="label"
          v-bind="item.label_attrs">{{ item.label }} :</div>
        <div class="value">{{ model | render(item) }}</div>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  props: {
    type: { type: String },
    tableKey: { type: String },
    title: { type: String },
    value: {
      type: [Object, Array],
    },
    items: {
      type: Array,
      default: () => {
        return [
          {
            label: 'AAA',
            prop: 'aa',
            col_attrs: {
              span: 8
            },
          },
        ]
      }
    }
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
<style  lang="scss">
.info-card {
  margin-bottom: 20px;
  .el-card__header {
    padding: 10px 12px;
    background-color: #5d9ad4;
    color: #fff;
    font-weight: 600;
  }
  .info-col {
    margin-bottom: 10px;
    font-size: 14px;
    .label {
      display: inline-block;
      margin-right: 10px;
      width: 80px;
      font-weight: 800;
    }
    .value {
      display: inline-block;
      color: #69676b;
    }
  }
}
</style>