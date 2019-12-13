<template>
  <div>
    <div class="link"
      v-if="fCheckHasPermission(object.pemissionUrl)"
      @click="fGoto">
      {{object.val}}
    </div>
    <div v-else
      class="link">{{object.val}}</div>
  </div>
</template>
<script>
export default {
  props: {
    object: {
      type: Object,
      default: () => { },
    },
  },
  methods: {
    fGoto() {
      this.$router.push({ path: this.object.link })
    },
  },
}
</script>
<style scoped lang="scss">
.link {
  color: #409eff;
  -webkit-transition: color 0.1s;
  transition: color 0.1s;
}
</style>