import Vue from 'vue'
// import { watch } from 'fs';

/**
 * 设置两个组件或DOM相关，处理级联需求，
 * 如B实例依赖于A实例值变化的需求，即B watch A
 * 设置在B组件上
 * 配置项如下：
 * {
 *  watch: String | required, // 观察的目标字段
 *  ref: String | required, // 组件的ref引用或选择器，可为Vue实例ref值或DOM选择器
 *  reloadEvent: String | optional, // ref对象上主动抛出的重加载事件名，默认为reload
 *  onchange: Function | optional, // 改变回调钩子
 * }
 *
    配置实例
    v-relate="{
                watch: 'province',
                ref: 'city'
            }"
 */
const RelatedComponents = {
  name: 'relate',
  bind(el, binding, vnode) {
    let o = binding.value
    let watch = o.watch
    let ref = o.ref
    let sReloadEvent = o.reloadEvent || 'reload'
    let onchange = o.onchange
    let context = vnode.context

    context.$nextTick(() => {
      let vm = context.$refs[ref] || document.querySelector(ref)
      if (watch && vm) {
        el.unwatch = context.$watch(watch, (newVal, oldVal) => {
          if (typeof onchange === 'function') {
            onchange.call(context, newVal)
          }
          if (vm instanceof Vue) {
            vm.$emit(sReloadEvent, newVal)
          } else {
            let event = new Event(sReloadEvent)
            event.data = newVal
            vm.dispatchEvent(event)
          }
        })
      }
    })
  },
  unbind(el, binding, vnode) {
    if (el.unwatch && typeof el.unbind === 'function') {
      el.unwatch()
    }
    el.unwatch = null
  },
}

export default RelatedComponents
