<script>
/**
 * Vue中继承组件的基础mixin配置，封装了基础render方法及通过proxy代理了属性/方法
 * 用法：
   import ExtendsBase from "./ExtendsBase"
   子组件中配置，
   extends: ExtendsBase,
   默认有一个基础的render方法，会传递监听器及属性。
   若使用基础render方法，请通过props传入as值
   as: String, Base组件名，需提前注册（全局/局部皆可）。
   若有复杂组件，请自定义render或者使用template，并配置ref(必须)、$attrs、$listeners。附带插槽插入Base组件示例。
   <my-component
   :ref="root"
   v-bind="$attrs"
   v-on="$listeners"
   >
    <template slot="slot-name">
        <slot name="slot-name"></slot>
    </template>
   </my-component>
 */

export default {
  props: {
    as: {
      type: String,
      default: 'div',
    },
  },
  data() {
    return {
      root: '_root_',
      proxy: null,
    }
  },
  mounted() {
    let vm = this.$refs[this.root]
    let _this = this
    const Handler = {
      get(target, property, receiver) {
        if (property in target) {
          return target[property]
        } else if (vm && property in vm) {
          return vm[property]
        }
        return null
      },
      set(target, property, value) {
        // todo test,may be need $set
        let t = null
        if (property in target) {
          t = target
        } else if (vm && property in vm) {
          t = vm
        }

        if (t) {
          try {
            _this.$set(t, property, value)
          } catch (error) {
            console.log(error)
          }
        }
      },
    }
    this.proxy = new Proxy(this, Handler)
  },
  render(h) {
    return h(this.as || 'div', {
      attrs: this.$attrs,
      on: this.$listeners,
      ref: this.root,
    })
  },
}
</script>
