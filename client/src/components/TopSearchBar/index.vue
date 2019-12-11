<template>
  <div class="top-search-bar">
    <el-card :shadow="config.cardShadow || 'never'">
      <operation-buttons v-if="!config.hideenSearchBtn"
        :buttons="topBtns"
        :isFloat="false"
        :align="'left'"
        @operate="fOperation">
        <!-- slot -->
        <div v-for="(slot, index) in slotList"
          :key="index"
          :slot="slot">
          <slot :name="slot"></slot>
        </div>
      </operation-buttons>

      <search v-if="config.defaultSearch"
        :isAdvanceSearch="searchBtns.length > 0"
        class="advance-search"
        v-model="searchObject[config.defaultSearch.key]"
        ref="search"
        :placeholder="config.defaultSearch.placeholder"
        @on-search="fSearch"
        @on-push-down="bIsShowMoreSearch = !bIsShowMoreSearch"></search>

      <transition name="el-fade-in-linear">
        <!-- 输入区 -->
        <div class="search-detail-wrap"
          v-show="bIsShowMoreSearch">
          <el-form :model="searchObject"
            :label-width="config.labelWidth || '120px'"
            label-position="right"
            ref="searchForm"
            :inline="true"
            size="small">
            <el-form-item v-for="(item, index) in formItems || []"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :rules="item.rules ? item.rules : [{ required: false }]">
              <component :ref="item.prop + 'Ref'"
                :config="item"
                :style="item | formItemStyle"
                v-model="searchObject[item.prop]"
                :is="item.type" />
            </el-form-item>
            <!-- 操作按钮 -->
            <el-form-item>
              <operation-buttons :buttons="searchBtns"
                :isFloat="false"
                :align="'center'"
                @operate="fOperation"></operation-buttons>
            </el-form-item>
          </el-form>
        </div>
      </transition>
    </el-card>
  </div>
</template>
<script>
import { detailMixins } from '@/mixins'
import Search from '../Search'
import Input from './components/InputComponent.vue'
import Select from './components/SelectComponent.vue'
import DateRange from './components/DateRangeComponent.vue'
import Date from './components/DateComponent.vue'
import Radio from './components/RadioComponent.vue'
import OperationButtons from '@/components/OperationButtons'
import { getNotNullValues } from '@/utils/index'
import { omit } from 'lodash'
import Vue from 'vue'

export default {
  mixins: [detailMixins],
  components: {
    Search,
    Radio,
    Date,
    DateRange,
    Select,
    Input,
    OperationButtons,
  },
  data() {
    return {
      bIsShowMoreSearch: false,
      searchObject: { ...this.search },
    }
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          searchNoImmediate: true, // 不实时搜索
          cardShadow: 'always',
          hideenSearchBtn: false, // 隐藏全部按钮
          isHiddenOutData: false, // 隐藏导出数据
          labelWidth: '',
          topButtons: [],
          searchButtons: [
            {
              name: '查询',
              type: 'primary',
            },
          ],
          defaultSearch: {
            placeholder: '请输入',
            key: 'name', // 默认的搜索字段
          },
          searchItems: [
            {
              type: 'Input',
              prop: 'input',
              label: 'input类型',
              placeholder: 'input类型',
              hidden: false,
              noReset: true,
              defaultValue: '',
            },
            {
              type: 'DateRange',
              pickType: 'datetimerange', // datetimerange/ daterange/monthrange
              prop: 'dataPicker',
              label: 'DataPicker',
              size: '',
              format: '',
              valueFormat: '',
              hidden: false,
              align: 'left',
              startTimeKey: 'startTime', // 提交开始时间字段名
              endTimeKey: 'endTime', // 提交结束时间字段名
            },
            {
              label: '审核状态',
              type: 'Select',
              prop: 'status',
              placeholder: '',
              classStr: '',
              selectConfig: {
                reqUrl: '',
                reqParma: { datatype: '' },
                keyMap: { list: 'data' },
                filter: null,
                dataList: [],
              },
              // 本地数据
              dataList: [
                {
                  datavalue: '0',
                  dataname: '全部',
                },
              ],
              relate: {
                watch: 'type',
                ref: 'reason',
                type: 'reload',
              },
            },
          ],
        }
      },
    },
    search: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  filters: {
    formItemStyle: function (item) {
      return { width: `${item.width || 180}px` }
    },
  },
  computed: {
    formItems() {
      return (this.config.searchItems ? this.config.searchItems : []).filter(
        v => !v.hidden,
      )
    },
    // 收集页面中的所有slot
    slotList() {
      return this.topBtns
        .map(item => {
          return item.popover && item.popover.slotName
        })
        .filter(item => !!item)
    },
    topBtns() {
      return this.config.topButtons
        ? this.config.topButtons
        : [
          {
            name: '搜索区',
            type: 'info',
          },
        ]
    },
    searchBtns() {
      return this.config.searchButtons
        ? this.config.searchButtons
        : [
          {
            name: '查询',
            type: 'primary',
          },
          {
            name: '清空',
            type: 'primary',
          },
        ]
    },
    // 关联列表
    relateList() {
      return this.formItems
        .map((item, index) => {
          return item.relate
        })
        .filter(item => {
          return !!item
        })
    },
    watchSearchObj() {
      return JSON.parse(JSON.stringify(this.searchObject))
    },
  },
  watch: {
    watchSearchObj: {
      // 深度监听
      handler: function (newVal, oldVal) {
        if (!this.config.searchNoImmediate) {
          this.fSearch()
        } else {
          // 用来在非实时请求情况下根据搜索条件做判断
          this.$emit('fGetEmitSearchObj', this.fGetEmitSearchObj())
        }
        this.fRelate(newVal, oldVal)
      },
      deep: true,
    },
  },
  created() {
    this.fResetData()
    this.bIsShowMoreSearch = !this.config.defaultSearch
  },
  methods: {
    fOperation(item) {
      if (item.name === '查询') {
        this.fSearch()
      } else if (item.name === '清空') {
        this.fResetData()
      } else if (item.routerLink) {
        this.$router.push(item.routerLink)
      } else {
        this.$emit('operate', item)
      }
    },
    fSearch() {
      this.fVelidateForm(this.$refs.searchForm, () => {
        this.$emit('fSearch', this.fGetEmitSearchObj())
      })
    },
    fGetEmitSearchObj() {
      let emitSearchObject = { ...this.searchObject }
      // DateRange 数据处理
      this.formItems.forEach(item => {
        if (item.type === 'DateRange') {
          let dates = emitSearchObject[item.prop]
          if (dates && dates.length === 2) {
            emitSearchObject = omit(emitSearchObject, item.prop)
            emitSearchObject[item.startTimeKey] = dates[0]
            emitSearchObject[item.endTimeKey] = dates[1]
          }
        }
      })
      return getNotNullValues(emitSearchObject)
    },
    fRelate(searchObjNew, searchObjOld) {
      this.relateList.forEach(relate => {
        // 判断监听的元素是否改变
        let watchKey = relate.watch
        if (searchObjNew[watchKey] !== searchObjOld[watchKey]) {
          switch (relate.type) {
            case 'reload':
              this.$emit('fReateReload', relate, () => {
                this.$refs[`${relate.ref}Ref`][0].fReload()
              })
              break
            default:
              break
          }
        }
      })
    },
    fSetSearchVal(key, val) {
      this.searchObject[key] = val
    },
    fSetSearchItemAttr(prop, attr, val) {
      let formItemIndex = -1
      this.config.searchItems.forEach((item, index) => {
        if (item.prop === prop) {
          formItemIndex = index
        }
      })
      let newItem = this.config.searchItems[formItemIndex]
      if (newItem) {
        newItem[attr] = val
        Vue.set(this.config.searchItems, formItemIndex, newItem)
      }
    },
    fResetData() {
      const defaultValueMap = {
        Select: '',
        DataRange: [],
        Input: '',
        Radio: 0,
      }
      let newObj = { ...this.searchObject }
      this.formItems.forEach(item => {
        if (!item.noReset) {
          newObj[item.prop] = item.defaultValue || defaultValueMap[item.type]
        }
      })
      this.searchObject = newObj
    },
  },
}
</script>
<style lang="scss">
.top-search-bar {
  .el-card__body {
    padding: 15px 5px 0;
  }
  .op {
    float: left;
    margin-top: 0;
  }
  .el-form--inline .el-form-item {
    vertical-align: bottom !important;
  }
  .add-btn-default {
    float: left;
  }
  .advance-btn {
    margin-right: 20px;
  }
  .advance-search {
    margin-bottom: 15px;
  }
  .operate-btn {
    margin-left: 20px;
  }
}
</style>
