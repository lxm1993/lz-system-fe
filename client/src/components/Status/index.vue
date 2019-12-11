<template>
  <el-select v-model="st">
    <el-option v-for="(v,k) in status"
      :key="k"
      :label="v"
      :value="+k" />
  </el-select>
</template>
<script>
const status = {
  1: '启用',
  2: '停用',
}
export default {
  model: {
    prop: 'statu',
    event: 'change',
  },
  props: ['statu'],
  data() {
    return {
      status,
      st: this.statu || 1,
    }
  },
  watch: {
    st(val) {
      this.$emit('change', val)
    },
    statu(val) {
      this.st = val
    },
  },
}
</script>
