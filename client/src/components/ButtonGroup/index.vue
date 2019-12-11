<template>
  <!-- 主要是为详情页底部按钮提供统一的容器，方便统一控制样式 -->
  <div :class="classObject">
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    // align 按钮对齐方式: left ,center, right
    align: {
      type: String,
      default: 'center',
    },
    // isFloat 是否浮动， 如果不浮动，则固定在页面底部
    isFloat: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    classObject() {
      return {
        op: true,
        float: this.isFloat,
        [this.align]: true,
      }
    },
  },
  methods: {},
}
</script>
<style lang="scss" scoped>
.op {
  z-index: 99;
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.6);
  &.float {
    position: sticky;
    bottom: 20px;
  }
  &.left {
    text-align: left;
  }
  &.center {
    text-align: center;
  }
  &.right {
    text-align: right;
  }
}
</style>
