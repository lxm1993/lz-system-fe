<template>
  <div>
    <div class="header-left">
      <a href="javascript:;"
        class="logo-link">
        <img src="./logo.png"
          alt="logo" />
        {{ appName }}
      </a>
    </div>
    <div class="header-right">
      <div class="header-right-bread">
        <side-collapse></side-collapse>
        <bread-crumb></bread-crumb>
      </div>
      <div class="header-right-info">
        <user-info></user-info>
      </div>
    </div>
  </div>
</template>
<script>
import SideCollapse from './components/sideCollapse'
import BreadCrumb from './components/breadCrumb'
import userInfo from './components/userInfo'
import systemConfig from '@/utils/config';
export default {
  components: {
    SideCollapse,
    BreadCrumb,
    userInfo
  },
  data() {
    return {
      appName: systemConfig.systemName
    }
  }
}
</script>
