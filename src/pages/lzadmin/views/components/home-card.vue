<template>
  <div class="order-home">
    <top-search-bar :config="searchConfig"
      @fSearch="fSearch"></top-search-bar>
    <pagination-pro :loading.sync="bIsLoading"
      ref="pageRef"
      url="/admin/orders/week"
      :autoload="false"
      :fullsize="true"
      :params="searchObject">
      <template slot-scope="{ data , height}">
        <el-table :data="data"
          :height="height"
          v-loading="bIsLoading"
          ref="rolesTable"
          border
          header-cell-class-name="table-header">
          <el-table-column show-overflow-tooltip
            align="center"
            v-for="v in columns"
            v-bind="v"
            :key="v.prop">
            <template slot-scope="{ row }">
              <div v-if="v.type === 'list'"
                type="warning">
                <div v-for="(item, index) in row[v.prop]"
                  :key="index">
                  {{item}}
                </div>
              </div>
              <el-tag v-else-if="v.type === 'tag'"
                type="warning">
                {{ row | render(v) }}
              </el-tag>
              <span v-else>
                {{ row | render(v) }}
              </span>
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
import moment from 'moment';

export default {
  mixins: [listMixins],
  components: { TopSearchBar },
  props: {
    tabName: { type: String }
  },
  data() {
    let now = moment().format('YYYY-MM-DD')
    var last7 = moment().subtract('days', 6).format('YYYY-MM-DD')
    return {
      bIsLoading: false,
      searchObject: {
        gmt_create: JSON.stringify([last7, now])
      },
      searchConfig: {
        labelWidth: '60px',
        searchButtons: [
          { name: '查询', isPlain: true, icon: 'el-icon-search', type: 'primary', size: 'small' },
        ],
        searchItems: [
          {
            type: 'DataPicker',
            prop: 'gmt_create',
            default: [last7, now],
            formItemAttrs: { label: '日期' },
            attrs: {
              clearable: true,
              type: 'daterange',
              'start-placeholder': '开始日期',
              'end-placeholder': '结束日期',
              format: 'yyyy-MM-dd',
              'value-format': 'yyyy-MM-dd',
            },
          },
          {
            type: 'Select',
            prop: 'plat_id',
            formItemAttrs: { label: '平台' },
            hidden: true,
            attrs: { clearable: true, style: 'width: 150px' },
            listGetter: {
              url: '/base/plats',
              params: {},
              keyMap: { list: 'data' },
              data: [],
            }
          },
          {
            type: 'Select',
            prop: 'agent_id',
            hidden: true,
            formItemAttrs: { label: '销售点' },
            attrs: { clearable: true, style: 'width: 150px' },
            listGetter: {
              url: '/base/agents',
              params: {},
              keyMap: { list: 'data' },
              data: [],
            }
          },
        ]
      },
      columns: [
        { prop: 'date', label: '日期', 'min-width': 150, },
        { prop: 'total', label: '全部', 'min-width': 150, },
        { prop: 'deal', label: '待出票', 'min-width': 150, },
        { prop: 'success', label: '出票成功', 'min-width': 150, },
        { prop: 'faild', label: '出票失败', 'min-width': 150, },
        { prop: 'successRate', label: '出票成功率', 'min-width': 150, },
        { prop: 'payMoneys', label: '结算金额', 'min-width': 150, },
      ],
    }
  },
  watch: {
    tabName(name) {
      if(name === '整体')
      this.searchConfig.searchItems[1] = {
        type: 'Select',
        prop: 'plat_id',
        formItemAttrs: { label: '平台' },
        // hidden: true,
        attrs: { clearable: true, style: 'width: 150px' },
        listGetter: {
          url: '/base/plats',
          params: {},
          keyMap: { list: 'data' },
          data: [],
        }
      }

    },
  },
  created() {
    this.fReload()
  },
  methods: {
    fReload() {
      this.$nextTick(() => {
        this.$refs.pageRef.fReload()
      })
    },
    fSearch(val) {
      this.searchObject = {
        ...val,
        gmt_create: JSON.stringify(val.gmt_create)
      }
      this.fReload()
    }
  }
}
</script>