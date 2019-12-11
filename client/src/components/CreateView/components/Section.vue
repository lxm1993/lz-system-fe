<template>
  <header class="section-title">{{ config.title }}</header>
</template>
<script>
export default {
  name: 'Section',
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          type: 'Section',
          title: '第一部分', // 部分标题
        }
      },
    },
  },
}
</script>
<style lang="scss" scoped>
.section-title {
  margin-left: -100px;
  letter-spacing: 1.5px;
  font-size: 16px;
  font-weight: 700;
  height: 30px;
  color: #409eff;
}
</style>
