<template>
  <div class="side-collapse">
    <i :class="{ 'el-icon-s-unfold': opened, 'el-icon-s-fold': !opened }"
      @click="toggleOpen()"></i>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    opened() {
      return this.$store.state.opened
    }
  },
  methods: {
    toggleOpen() {
      this.$store.commit('SET_OPENED', !this.opened)
    }
  }
}
</script>
<style lang="scss" scoped>
.side-collapse {
  float: left;
  margin-top: 16px;
  i {
    font-size: 18px;
    color: #363f44;
    cursor: pointer;
  }
}
</style>
