<template>
  <div class="page-wraper">
    <top-search-bar :config="searchItems"
      @fSearch="fSearch"></top-search-bar>
    <pagination-pro ref="pageRef"
      :loading.sync="blistLoading"
      :autoload="false"
      url="/system/users"
      method="get"
      :params="searchObject">
      <template slot-scope="{ data }">
        <el-table :data="data"
          v-loading="blistLoading"
          ref="usersTable"
          border
          header-cell-class-name="table-header">
          <el-table-column show-overflow-tooltip
            align="center"
            v-for="v in columns"
            v-bind="v"
            :key="v.prop">
            <template slot-scope="{ row }">
              {{ row | render(v) }}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </pagination-pro>
  </div>
</template>
<script>
import { listMixins } from '@/mixins/index'
import TopSearchBar from '@/components/TopSearchBar'
// import { fDeleteUser } from '@/api/system/users'
export default {
  mixins: [listMixins],
  name: 'user-index',
  components: { TopSearchBar },
  data() {
    return {
      blistLoading: false,
      allRoles: {},
      searchItems: {
        topButtons: [
          {
            name: '新建平台',
            type: 'primary',
            icon: 'el-icon-plus',
            routerLink: '/plat/create',
          },
        ],
        searchButtons: [],
      },
      columns: [
        { prop: 'name', label: '用户Id', 'min-width': 120 },
        { prop: 'name3', label: '用户名', 'min-width': 120 },
        { prop: 'name1', label: '创建时间', 'min-width': 120 },
        { prop: 'name4', label: '修改时间', 'min-width': 120 },
      ],
      searchObject: { name: null },
    }
  },
  methods: {
    fReload() {
      this.$nextTick(() => {
        this.$refs.pageRef.fReload()
      })
    },
    fSearch(val) {
      this.searchObject = { ...val }
      this.fReload()
    },
  },
}
</script>
<style lang="scss" scoped>
.user-index-wraper {
  min-width: 0px;
}
</style>
