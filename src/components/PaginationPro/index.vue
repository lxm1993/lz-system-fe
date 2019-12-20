<template>
  <div class="list pagination-table-conainer grow-1"
    :class="oClass">
    <slot :data="aList"
      :height="height" />
    <el-pagination :ref="root"
      :current-page.sync="currentPage"
      class="pagination-conainer"
      :class="oPaginationClass"
      v-bind.sync="attrs"
      :total="total"
      :page-size="nPageSize"
      v-on="$listeners"
      @size-change="fOnSizeChange"
      @current-change="fOnPageChange">
      <template slot="slot-name">
        <slot name="slot-name" />
      </template>
    </el-pagination>
  </div>
</template>
<script>
import ExtendsBase from '@/components/ExtendsBase'
import request from '@/api/request'
import { get, debounce } from 'lodash'
const DefaultConfig = {}

/**
 * 翻页组件，继承自el-pagination
 * 实现功能：
 * 1. 统一设置翻页默认样式
 * 2. 根据配置自动请求数据，并监听翻页事件、pageSize事件请求数据
 * 3. 控制loading状态
 * 配置如下：
 *  v-model="list"
    :loading.sync="bIsSearching"
    url="/customers/advers/list"
    autoload
    :params="searchObject"

    配置参数
    {
      list: Array, // 控制的数据源
      loading.sync: Boolean, // loading状态，支持sync更新
      url: String, // 接口地址,
      dataType：String, // 请求数据格式,
      autoload: Boolean | true, //是否自动请求，默认为true,会在created周期请求数据
      params: Object, // 请求参数，如搜索参数等
      method: String | 'get', //请求method，默认为get
      keyMap: Object, // 请求及返回中的keymap，包括： page, pageSize, total, data字段，默认值
        // {
        //   page: 'page', // 请求的页数
        //   pageSize: 'page_size', //每一页的size
        //   total: 'total',//返回的总数的字段
        //   data: 'data',//返回的数据的字段
        // }
      filter: Funtion, //返回数据过滤器
      beforeSend: Function, //发送数据前钩子函数
      onResponse: Function, //请求返回的钩子函数,参数为response
    }
 */

const sTotalNumberKey = 'total'
const sPageSizeKey = 'pageSize'
const sDataKey = 'rows'
const sPageKey = 'pageNum'

export default {
  extends: ExtendsBase,
  props: {
    url: {
      type: String,
      required: true,
    },
    dataType: {
      type: String,
      default: '',
    },
    autoload: {
      type: Boolean,
      default: true,
    },
    params: Object,
    keyMap: {
      type: Object,
      default() {
        return {
          page: sPageKey,
          pageSize: sPageSizeKey,
          total: sTotalNumberKey, // response中总数的key
          data: sDataKey, // response中，列表数据的key
        }
      },
    },
    list: {
      type: Array,
      // required: true,
      default: () => [],
    },
    filter: Function,
    beforeSend: Function,
    onResponse: Function,
    loading: Boolean,
    pageSize: Number,
    method: String,
    useBody: {
      type: Boolean,
      default: false,
    },
    fullsize: {
      type: Boolean,
      default: false,
    },
    paginationClassName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentPage: 1,
      total: 0,
      nPageSize: this.pageSize || 20,
      aList: [],
      height: 100,
    }
  },
  computed: {
    attrs() {
      return Object.assign({}, DefaultConfig, this.$attrs)
    },
    oClass() {
      return { 'overflow-hidden': this.fullsize }
    },
    oPaginationClass() {
      const { paginationClassName = '' } = this
      const o = {}
      paginationClassName.split(' ').forEach(v => {
        o[v] = true
      })
      return {
        ...o,
        'pagination-conainer-sticky': !this.fullsize,
      }
    },
  },
  watch: {
    fullsize() {
      this.fCheckFullSize()
    },
  },
  created() {
    if (this.autoload) {
      this.fLoadList()
    }

    this._fOnResize = debounce(() => {
      this.fCheckHeight()
    }, 200)
  },
  mounted() {
    this.fCheckFullSize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this._fOnResize)
  },

  methods: {
    fOnSizeChange(size) {
      this.nPageSize = size
      this.fOnPageChange()
    },
    fOnPageChange() {
      this.fLoadList()
    },
    async fLoadList() {
      let o = {}
      let keyMap = this.keyMap
      o[keyMap.page || sPageKey] = this.currentPage
      o[keyMap.pageSize || sPageSizeKey] = this.nPageSize
      this.$emit('update:loading', true)
      if (typeof this.beforeSend === 'function') {
        this.beforeSend()
      }
      let _bIsOk = true
      let oRequest = {
        url: this.url,
        method: this.method || 'get',
      }
      if (this.dataType) {
        oRequest.dataType = this.dataType
      }
      let params = Object.assign(o, this.params)
      if (this.useBody) {
        oRequest.data = params
      } else {
        oRequest.params = params
      }

      await request(oRequest)
        .then(response => {
          let sListKey = this.keyMap.data || sDataKey
          let sTotalKey = this.keyMap.total || sTotalNumberKey
          let arr = get(response, sListKey, [])
          if (typeof this.filter === 'function') {
            arr = this.filter(arr)
          }
          this.total = +get(response, sTotalKey) || 0
          if (typeof this.onResponse === 'function') {
            this.onResponse.call(this.$parent, response)
          }
          this.aList = arr
          this.$emit('input', arr)
        })
        .catch(error => {
          console.log(error)
          _bIsOk = false
        })
      this.$emit('update:loading', false)
      this.$emit('load-finish', _bIsOk)
    },
    fReload(b2Page1 = true) {
      // todo, 是否需要重置params。
      if (b2Page1) {
        this.currentPage = 1
      }
      this.fLoadList()
    },
    fCheckHeight() {
      if (this.fullsize) {
        console.log(this.$el)
        const h = this.$el.offsetHeight - 52
        this.height = Math.max(100, h)
      }
    },
    fCheckFullSize() {
      if (this.fullsize) {
        window.addEventListener('resize', this._fOnResize)
        this._fOnResize()
      } else {
        window.removeEventListener('resize', this._fOnResize)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.pagination-conainer {
  margin: 15px 0 0 0;
  text-align: center;
}
.pagination-conainer-sticky {
  position: sticky;
  bottom: 20px;
  z-index: 999; // 这是一个精心设定的值，不可高于此值，否则el-dialog的遮罩无法盖住分页条
  background-color: rgba(255, 255, 255, 0.6);
}
</style>
