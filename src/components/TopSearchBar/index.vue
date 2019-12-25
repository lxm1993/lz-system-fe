<template>
  <div class="top-search-bar">
    <el-card :shadow="config.cardShadow || 'never'">
      <operation-buttons class="before-btns"
        :buttons="topBtns"
        :isFloat="false"
        :align="'left'"
        @operate="fOperation">
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
              v-bind="item.formItemAttrs">
              <component :config="item"
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
import DataPicker from './components/DataPickerComponent.vue'
import Radio from './components/RadioComponent.vue'
import OperationButtons from '@/components/OperationButtons'
import { getNotNullValues } from '@/utils/index'
import { omit } from 'lodash'
import Vue from 'vue'
import { debounce } from "lodash";
export default {
  mixins: [detailMixins],
  components: {
    Search,
    Radio,
    DataPicker,
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
          cardShadow: 'always',
          labelWidth: '',
          topButtons: [],
          searchButtons: [],
          defaultSearch: {
            placeholder: '请输入',
            key: 'name', // 默认的搜索字段
          },
          searchItems: [],
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
        : []
    },
    searchBtns() {
      return this.config.searchButtons
        ? this.config.searchButtons
        : [{ name: '查询', type: 'primary' },
        { name: '清空', type: 'primary' }]
    },
    watchSearchObj() {
      return JSON.parse(JSON.stringify(this.searchObject))
    },
  },
  watch: {
    watchSearchObj: { // 深度监听
      handler: function (newVal, oldVal) {
        if (this.config.searchImmediate) {
          this.fSearch()
        }
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
      // this.formItems.forEach(item => {
      //   if (item.type === 'DataPicker') {
      //     let dates = emitSearchObject[item.prop]
      //     if (dates && dates.length === 2) {
      //       emitSearchObject = omit(emitSearchObject, item.prop)
      //       emitSearchObject[item.startTimeKey] = dates[0]
      //       emitSearchObject[item.endTimeKey] = dates[1]
      //     }
      //   }
      // })
      return getNotNullValues(emitSearchObject)
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
  margin-bottom: 10px;
  .el-card__body {
    padding: 10px 5px 0;
  }
  .op {
    display: inline-block;
    margin-top: 0px;
    vertical-align: bottom;
  }
  .before-btns {
    margin-bottom: 10px;
  }
  .search-detail-wrap {
    display: inline-block;
    .el-form--inline .el-form-item {
      vertical-align: bottom !important;
      margin-bottom: 10px;
    }
  }
  .add-btn-default {
    float: left;
  }
  .advance-btn {
    margin-right: 20px;
  }
  .advance-search {
    margin-bottom: 10px;
  }
  .operate-btn {
    margin-left: 20px;
  }
}
</style>
