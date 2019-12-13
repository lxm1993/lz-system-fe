<template>
  <div class="area-controller flex vertical"
    :style="{height: config.height || '400px'}">
    <el-row :gutter="30"
      class="grow-1 overflow-hidden flex">
      <el-col :span="config.left"
        class="flex vertical overflow-hidden grow-1">
        <div class="left-wrapper grow-1 flex vertical overflow-hidden">
          <el-input clearable
            v-model="searchName"
            v-if="config.canSearch"
            class="w-100p"
            :disabled="config.disabled"
            @change="fSearch"
            placeholder="输入内容回车搜索"></el-input>
          <div class="grow-1 overflow-auto">
            <v-tree ref="tree"
              :tpl="tpl"
              :data='list'
              :multiple='false'
              @node-check='fOnNodeChecked'
              @async-load-nodes='fLoadList' />
          </div>
        </div>
      </el-col>
      <el-col :span="24 - config.left || 12"
        class="dash-left grow-1 overflow-hidden flex">
        <div class="right-wrapper grow-1 overflow-auto">
          <div class="tag-container">
            <header class="section-title">已包含</header>
            <el-tag v-for="tag in aIncludes"
              :key="tag.title"
              class="eltag"
              @close="fOnIncludeClose(tag)"
              :closable="!config.disabled">
              {{tag.cname || tag.pname}}
            </el-tag>
          </div>
          <div class="tag-container">
            <header class="section-title"
              style="color: #F56C6C;">已排除</header>
            <el-tag v-for="tag in aExcludes"
              :key="tag.title"
              class="eltag"
              type="danger"
              @close="fOnExcludeClose(tag)"
              :closable="!config.disabled">
              {{tag.cname || tag.pname}}
            </el-tag>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import 'vue-tree-halower/dist/halower-tree.min.css'
import { VTree } from 'vue-tree-halower'
import request from '@/utils/request'
import Vue from 'vue'
import { get } from 'lodash'
Vue.use(VTree)
export default {
  components: {},
  data() {
    return {
      bIsLoading: false,
      list: [],
      searchName: '',
      aIncludes: this.value.includeList,
      aExcludes: this.value.excludeList,
    }
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          excludeList: [],
          includeList: [],
        }
      },
    },
    config: {
      type: Object,
      default: () => {
        return {
          type: 'Area',
          classStr: '', // 特殊样式可配置自己的类名
          prop: 'area', // 请求对应参数名
          label: 'Area类型', // 标签名称
          rules: [ // 检验规则
            {
              required: true, message: '请输入input类型', trigger: 'blur',
            },
          ],
          async: false,
          url: '',
          params: {},
          dataType: '',
          autoload: false,
          filter: () => { },
          left: 12,
          height: '400px',
          paramsSet: () => { },
          keyMap: { data: 'data' },
          include: {
            type: [Boolean, Function, Object, String],
            default: true,
          },
          exclude: {
            type: [Boolean, Function, Object, String],
            default: true,
          },
          method: '',
          loading: false,
          beforeSend: () => { },
          onResponse: () => { },
          canSearch: true,
          onInclude: () => { },
          onExclude: () => { },
          hidden: false, // 时候隐藏
          disabled: false, // 是否可用
        }
      },
    },
  },
  created() {
    if (this.config.autoload) {
      this.fLoadList()
    }
  },
  computed: {
    model: {
      get: function () {
        return this.value
      },
      set: function (val) {
        this.$emit('input', val)
      },
    },
    includeStr() {
      const include = this.config.include
      const defualtStr = '包含'
      if (typeof include === 'string') {
        return include
      }
      if (typeof include === 'object') {
        return include.text || defualtStr
      }
      return defualtStr
    },
    excludeStr() {
      const exclude = this.config.exclude
      const defualtStr = '排除'
      if (typeof exclude === 'string') {
        return exclude
      }
      if (typeof exclude === 'object') {
        return exclude.text || defualtStr
      }
      return defualtStr
    },
  },
  watch: {
    'model.includeList'() {
      let hash = {}
      this.aIncludes = this.model.includeList || [].reduce((pre, cur) => {
        (hash[cur.id] ? '' : hash[cur.id] = true) && pre.push(cur)
        return pre
      }, [])
    },
    'model.excludeList'() {
      let hash = {}
      this.aExcludes = this.model.excludeList.reduce((pre, cur) => {
        (hash[cur.id] ? '' : hash[cur.id] = true) && pre.push(cur)
        return pre
      }, [])
    },
  },
  methods: {
    fSearch() {
      this.$nextTick(() => {
        const { tree } = this.$refs
        if (tree) {
          tree.searchNodes(this.searchName)
        }
      })
    },
    // tpl (node, ctx, parent, index, props) {
    tpl(...args) {
      let {
        0: node,
        //  1: ctx, 2: parent, 3: index,
      } = args
      let includeBtn = ''
      let excludeBtn = ''
      if (this.fCheckRenderInclude(args)) {
        includeBtn = <el-button size="mini" disabled={this.config.disabled} type="primary" class="x-mini-button" onClick={() => this.fAddIncludes(node)}>{this.includeStr}</el-button>
      }
      if (this.fCheckRenderExclude(args)) {
        excludeBtn = <el-button size="mini" disabled={this.config.disabled} type="danger" class="x-mini-button" onClick={() => this.fAddExcludes(node)}>{this.excludeStr}</el-button>
      }
      return <div class="tree-node-container grow-1 flex overflow-hidden">
        <div class='node-title grow-1 overflow-hidden' >
          <div class="ellipsis" domPropsInnerHTML={node.title}></div>
        </div>
        {includeBtn}
        {excludeBtn}
      </div>
    },
    fCheckRenderInclude(node, ctx, parent, index, props) {
      if (typeof this.config.include === 'boolean') {
        return this.config.include
      }
      if (typeof this.config.include === 'function') {
        return this.config.include(node, ctx, parent, index, props)
      }
      if (typeof this.config.include === 'object') {
        let { check } = this.config.include
        if (typeof check === 'function') {
          return check(node, ctx, parent, index, props)
        }
      }
      return true
    },
    fCheckRenderExclude(node, ctx, parent, index, props) {
      if (typeof this.config.exclude === 'boolean') {
        return this.config.exclude
      }
      if (typeof this.config.exclude === 'function') {
        return this.config.exclude(node, ctx, parent, index, props)
      }
      if (typeof this.config.exclude === 'object') {
        let { check } = this.config.exclude
        if (typeof check === 'function') {
          return check(node, ctx, parent, index, props)
        }
      }
      return true
    },
    fOnNodeChecked() {
    },
    fFilter(list) {
      // const f = v => {
      //   v.selDisabled = true
      //   if (v.children) {
      //     this.fFilter(v.children)
      //   }
      // }
      // list.forEach(v => f(v))
      return list
    },
    async fLoadList(node = null) {
      let o = {}
      if (typeof this.config.beforeSend === 'function' && !this.config.beforeSend()) {
        return
      }
      if (!node) this.bIsLoading = true
      let oRequest = {
        url: this.config.url,
        method: this.config.method || 'get',
      }
      if (this.config.dataType) {
        oRequest.dataType = this.config.dataType
      }

      let params = o
      if (!this.node) {
        params = Object.assign(o, this.config.params)
      } else {
        if (typeof this.config.paramsSet === 'function') {
          params = Object.assign(o, this.config.paramsSet(node))
        }
      }
      if (this.config.useBody) {
        oRequest.data = params
      } else {
        oRequest.params = params
      }

      await request(oRequest).then(response => {
        if (response.code === 200 && response.data) {
          let sListKey = (this.config.keyMap && this.config.keyMap.data) || 'data'
          let arr = get(response, sListKey, [])
          if (typeof this.config.filter === 'function') {
            arr = this.config.filter(arr)
          }
          arr = this.fFilter(arr)
          if (node) {
            if (!node.hasOwnProperty('children')) {
              this.$set(node, 'children', [])
            }
            node.children.push(...arr)
          } else {
            this.list.push(...arr)
          }
          if (typeof this.config.onResponse === 'function') {
            this.config.onResponse.call(this.$parent, response)
          }
        } else {
          console.log(response.message)
        }
      }).catch(error => {
        console.log(error)
      })
      if (!node) this.bIsLoading = false
    },
    fAddIncludes(node) {
      if (this.aIncludes.map(item => {
        return item.allCode
      }).includes(node.allCode)) {
        return
      }
      if (typeof this.config.onInclude === 'function') {
        if (!this.config.onInclude(node, this.aIncludes, this.aExcludes)) {
          return
        }
      }

      this.fOnExcludeClose(node, false)
      this.aIncludes.push(node)
      this.model.includeList = this.aIncludes
      // this.$emit('update:model.includeList', this.aIncludes)
    },
    fAddExcludes(node) {
      if (this.aExcludes.map(item => {
        return item.allCode
      }).includes(node.allCode)) {
        return
      }
      if (typeof this.onExclude === 'function') {
        if (!this.onExclude(node, this.aIncludes, this.aExcludes)) {
          return
        }
      }
      this.fOnIncludeClose(node, false)
      this.aExcludes.push(node)
      this.model.excludeList = this.aExcludes
      // this.$emit('update:model.excludeList', this.aExcludes)
    },
    fOnIncludeClose(node, bEmitChange = true) {
      let index = 0
      let isInclude = this.aIncludes.map((item, nodeIndex) => {
        if (item.allCode === node.allCode) {
          index = nodeIndex
        }
        return item.allCode
      }).includes(node.allCode)
      if (isInclude) {
        this.aIncludes.splice(index, 1)
      }
      this.model.includeList = this.aIncludes
      if (bEmitChange) {
        this.$emit('change', 'include', node)
      }
    },
    fOnExcludeClose(node, bEmitChange = true) {
      let index = 0
      let isInclude = this.aExcludes.map((item, nodeIndex) => {
        if (item.allCode === node.allCode) {
          index = nodeIndex
        }
        return item.allCode
      }).includes(node.allCode)
      if (isInclude) {
        this.aExcludes.splice(index, 1)
      }
      this.model.excludeList = this.aExcludes
      if (bEmitChange) {
        this.$emit('change', 'exlucde', node)
      }
    },
  },
  mounted() { },
}
</script>

<style lang="scss">
.area-controller .halo-tree li {
  padding-top: 0;
  padding-bottom: 0;
  padding-right: 0;
}
.area-controller .halo-tree ul {
  padding-top: 0;
}

.area-controller .tree-node-el {
  display: flex;
  align-items: center;
}

.area-controller .tree-node-el {
  line-height: 28px;
}
</style>

<style lang="scss" scoped>
.area-controller {
  overflow: hidden;
  width: 1000px;
  .tag-container {
    min-height: 150px;
  }
}

.left-wrapper {
  min-width: 400px;
}
.right-wrapper {
  min-width: 400px;
}
</style>
