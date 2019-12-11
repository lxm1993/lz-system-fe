/**
 * 绑定多对一的Popover
 * 通过监听popover的show及hide，将实际要动态插入的dom/vm.$el插入到popover中
 * 以优化每个popover都创建一份弹窗的问题
 * 注意：动态插入的dom/vm.$el等需在绑定指令的节点前渲染
 * .popver-pro
 * popover中请以popver-pro为容器class
 * 配置项：
 * {
 *  ref: 'pop',
 * instance: 'resourceOperator',
 * onshow: Function,
 * onhide: Function,
 * }
 * ref: 实际绑定指令的节点
 * instance: 需动态插入的节点，可为HTMLElement / VueComponent实例 / ref(string) / domSelector(string)
 *
 * 实际弹出组件建议配合PopoverBase食用更佳。
 *
 */
import Vue from 'vue'

const PopoverPro = {
  name: 'popover-pro',
  bind(el, binding, vnode) {
    function _fDoHide() {
      vm.doClose()
      _fRemoveListener()
    }

    function _fRemoveListener() {
      if (target instanceof Vue) {
        target.$off('hide', _fDoHide)
      } else if (target instanceof HTMLElement) {
        target.removeEventListener('hide', _fDoHide)
      }
    }

    // vnode为包含指令的组件root，而非指令绑定对象的节点
    let target = binding.value.instance // HTMLElement / VueComponent实例 / ref(string) / domSelector(string)
    let ref = binding.value.ref
    let data = binding.value.data

    if (typeof target === 'string') {
      target =
        vnode.context.$refs[target] ||
        el.querySelector(target) ||
        document.body.querySelector(target)
    }

    let vm = vnode.context.$refs[ref] // popover vm
    if (Array.isArray(vm) && vm.length === 1) {
      vm = vm[0]
    }
    if (vm && target && vm.$refs.popper) {
      el.__data = data
      let onshow = binding.value.onshow || target.onshow
      let onhide = binding.value.onhide || target.onhide
      let dContainer = vm.$refs.popper.querySelector('.popver-pro') // dom
      vm.$on('show', function (e) {
        if (dContainer) {
          if (target instanceof Vue && target.$el) {
            target.model = el.__data // 可能会update
            dContainer.appendChild(target.$el)
            target.$on('hide', _fDoHide)
          } else if (target instanceof HTMLElement) {
            dContainer.appendChild(target)
            target.addEventListener('hide', _fDoHide)
          }

          if (typeof onshow === 'function') {
            onshow.call(target, el.__data)
          }
        }
      })

      if (target instanceof Vue) {
        target.$on('hide', _fDoHide)
      }

      vm.$on('hide', function (e) {
        if (typeof onhide === 'function') {
          onhide.call(target, data)
          _fRemoveListener()
        }
      })
    }
  },
  update(el, binding, vnode) {
    let data = binding.value.data

    if (el) {
      el.__data = data
    }
  },
}

export default PopoverPro
