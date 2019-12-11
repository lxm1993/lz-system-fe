<template>
  <el-container class="app-wrapper"
    :class="{ 'closebar-app-wrapper': opened }">
    <top-header class="app-header"></top-header>
    <div class="app-container">
      <side-bars class="app-aside"></side-bars>
      <page-main class="app-main"></page-main>
    </div>
  </el-container>
</template>
<script>
import SideBars from './components/sideBars'
import TopHeader from './components/header'
import PageMain from './components/pageMain'
import { mapGetters } from 'vuex'

export default {
  components: {
    SideBars,
    TopHeader,
    PageMain
  },
  computed: {
    ...mapGetters(['opened'])
  },
}
</script>
