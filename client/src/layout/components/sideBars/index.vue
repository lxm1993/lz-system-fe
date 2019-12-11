<template>
  <el-scrollbar>
    <el-menu :default-active="activeMenu"
      class="el-menu-vertical"
      background-color="#3a3f51"
      text-color="#b5b6bd"
      active-text-color="rgb(79, 148, 212)"
      mode="vertical"
      :collapse-transition="false"
      :collapse="opened">
      <sidebar-item v-for="item in pageRoutes || []"
        :key="item.path"
        :item="item"
        :basePath="item.path"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import SidebarItem from './components/sideBarItem'
import { mapGetters } from 'vuex'
import store from '@/store';
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['opened']),
    activeMenu() {
      const { meta, path } = this.$route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    pageRoutes() {
      let routes = []
      store.getters.routes.forEach(route => {
        if (!route.hidden) {
          routes.push(route)
        }
      })
      return routes
    },
  },
  created() {
  },
}
</script>
