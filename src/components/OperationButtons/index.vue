<template>
  <div :class="classObject">
    <div v-for="(item, index) in buttons"
      :key="index"
      class="op-btn">
      <div v-if="!item.hidden">
        <!-- popover -->
        <el-popover v-if="item.popover"
          v-model="item.popover.isVisible"
          :width="item.popover.width || 400"
          :trigger="item.popover.trigger || 'hover'"
          :placement="item.popover.placement || 'top'">
          <div v-if="item.popover.info">
            {{ item.popover.info }}</div>
          <slot v-if="item.popover.slotName"
            :name="item.popover.slotName"></slot>
          <el-button slot="reference"
            :icon="item.icon"
            :disabled="item.disabled"
            :type="item.type || 'primary'"
            :size="item.size || 'medium'"
            :plain="item.isPlain">{{item.name}}</el-button>
        </el-popover>
        <!-- 普通 -->
        <el-button v-else
          :disabled="item.disabled"
          :icon="item.icon"
          :type="item.type || 'primary'"
          @click="fOperate(item,index)"
          :size="item.size || 'medium'"
          :plain="item.isPlain">{{item.name}}</el-button>
      </div>
    </div>
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
    buttons: {
      type: Array,
      default: () => {
        return [
          {
            name: 'test',
            disabled: false,
            type: 'success',
            icon: '',
            hidden: true,
            popover: {
              info: '', // 仅仅用于展示文字，不可和slotName同时使用
              slotName: '',
              isVisible: false,
              width: '400',
              trigger: 'hover',
              placement: 'top',
            },
          },
        ]
      },
    },
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
  methods: {
    fOperate(item, index) {
      let btn = {
        ...item,
        index: index,
      }
      this.$emit('operate', btn)
    },
  },
}
</script>
<style lang="scss" scoped>
.op {
  z-index: 99;
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
  .op-btn {
    display: inline-block;
    margin-right: 15px;
  }
}
</style>
