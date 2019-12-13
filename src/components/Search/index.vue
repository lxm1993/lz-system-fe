<template>
  <div ref="container"
    :class="['search-container', {'focus':!bIsBlur}]">
    <i class="el-icon-search search-icon"></i>
    <input ref="searchInput"
      v-model.trim="sSearchVal"
      type="text"
      class="search-input"
      :placeholder="placeholder"
      @keyup.enter="fToSearch"
      @focus="fToFocus"
      @blur="fToBlur">
    <i v-if="advanceSearch"
      :class="['el-icon-arrow-up', 'cart', {'is-reverse': bIsPushDown}]"
      @click="fToPushDown" />
  </div>
</template>
<script>

// todo 使用el-input重写
export default {
  name: 'Search',
  model: {
    prop: 'searchval',
    event: 'change',
  },
  props: {
    width: String,
    isPushdown: Boolean,
    searchval: String,
    isAdvanceSearch: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请输入内容后，按回车搜索',
    },
  },
  data() {
    return {
      bIsBlur: true,
      bIsPushDown: false,
      sSearchVal: null,
    }
  },
  computed: {
    advanceSearch() {
      let _r = true
      if (typeof this.isAdvanceSearch !== 'undefined') {
        _r = this.isAdvanceSearch
      }
      return _r
    },
  },
  watch: {
    sSearchVal(val) {
      this.$emit('change', val)
    },
    searchval(val) {
      this.sSearchVal = val
    },
    isPushdown(val) {
      this.fTriggerPushDown(val)
    },
    bIsPushDown(val) {
      this.$emit('update:isPushDown', val)
    },
  },
  mounted() {
    if (this.width) {
      this.$refs.container.style.width = this.width
    }
  },
  methods: {
    fToSearch() {
      this.$emit('on-search', this.sSearchVal)
    },
    fToFocus() {
      this.bIsBlur = false
      this.$refs.searchInput.select()
      this.bIsPushDown = false
      this.$emit('on-focus')
    },
    fToBlur() {
      this.bIsBlur = true
    },
    fToPushDown() {
      this.bIsPushDown = !this.bIsPushDown

      if (this.bIsPushDown) {
        this.sSearchVal = null
      }

      this.$emit('on-push-down', this.bIsPushDown)
    },
    fClearInput() {
      this.sSearchVal = null
    },
    fTriggerPushDown(bIsPushDown) {
      if (bIsPushDown == null) {
        return false
      }
      this.bIsPushDown = bIsPushDown
      this.$emit('on-push-down', this.bIsPushDown)
    },
  },
}
</script>
<style lang="scss" scoped>
$search_color: #c0c4cc;
.search-container {
  &:not(:first-child) {
    margin-left: 10px;
  }
  display: inline-block;
  width: 30%;
  height: 40px;
  color: #dcdfe6;
  position: relative;
  font-size: 14px;
  border-radius: 20px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  padding: 0 32px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  &:hover {
    border-color: $search_color;
  }
  .search-input {
    border: none;
    color: #606266;
    height: 100%;
    line-height: 1;
    outline: none;
    transition: inherit;
    margin-top: 0;
    width: 100%;
    &::placeholder {
      color: $search_color;
    }
  }
  .search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
  &.focus {
    border-color: #409eff;
  }
  .cart {
    color: $search_color;
    font-size: 14px;
    transition: transform 0.3s;
    transform: rotate(180deg);
    line-height: 16px;
    width: 25px;
    height: 100%;
    text-align: center;
    position: absolute;
    right: 5px;
    top: 0;
    cursor: pointer;
    &::before {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &.is-reverse {
      transform: rotate(0);
    }
  }
}
</style>
