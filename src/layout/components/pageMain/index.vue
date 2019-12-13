<template>
  <div>
    <transition name="fade-page"
      mode="out-in">
      <router-view :key="key"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  computed: {
    key() {
      const { meta } = this.$route
      const title = meta ? meta.title : null
      return this.$route.name || title || this.$route.path
    },
  },
}
</script>
