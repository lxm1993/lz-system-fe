<template>
  <div class="side-item">
    <el-submenu v-if="childItems.length > 0 && !childItem"
      :index="resolvePath(item.path)"
      popper-append-to-body>
      <template slot="title">
        <i :class="item.meta && item.meta.icon || ''"></i>
        <span>{{ item.meta && item.meta.title || ''}}</span>
      </template>
      <sidebar-item v-for="child in childItems"
        :key="child.path"
        :item="child"
        :basePath="resolvePath(child.path)"></sidebar-item>
    </el-submenu>
    <template v-else>
      <page-link v-if="childItem.meta"
        :to="resolvePath(childItem.path)">
        <el-menu-item :index="childItem.meta.activeMenu || resolvePath(childItem.path)">
          <i :class="childItem.meta.icon || ''"></i>
          <span slot="title">{{ childItem.meta.title || '' }}</span>
        </el-menu-item>
      </page-link>
    </template>
  </div>
</template>

<script>
import PageLink from './link'
import { isAbsolutePath } from '@/utils/validate'
import path from 'path'
export default {
  name: 'SidebarItem',
  components: {
    PageLink
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  computed: {
    childItems() {
      let allChilds = this.item.children || []
      let childs = []
      allChilds.forEach(route => {
        if (!route.hidden) {
          childs.push(route)
        }
      })
      return childs
    },
    childItem() {
      if (this.childItems.length === 1 && !this.item.meta) {
        return this.childItems[0]
      }
      if (this.childItems.length === 0) {
        return { ...this.item, path: '', noChild: true }
      }
      return ''
    }
  },
  methods: {
    resolvePath(router) {
      if (isAbsolutePath(router)) {
        return router
      }
      if (isAbsolutePath(this.basePath)) {
        return this.basePath
      }
      return path.join(this.basePath, router)
    }
  },
}
</script>
<style lang="scss" scoped>
.side-item {
  width: 180px;
}
</style>