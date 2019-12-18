import request from '@/api/request'
import { fWarn } from '@/utils'
import { setProporty } from '@/utils/index'
import { get } from 'lodash'
import Vue from 'vue'

/**
 * 注意：此指令目前不支持ref数组，即ref相同的情况
 * todo, 考虑使用一个额外的类实现该功能，Vue的指令则只对该功能做调用，一则解耦，二则能响应式根据最新值改动
 * todo，考虑缓存接口数据，优化页面跳转后再次请求的问题？
 * todo, 处理update的问题
 * todo, 处理设置value为Object时，keymap设置值的问题，比如直接prams = Object.assign(params, value)?
 * todo，现在aData不是响应式的，目前使用filter方法解决，回头看看Vue对v-if的实现。
 * 修改日志：
 * 2019-04-10 新增，增加默认选中值配置，selectdefault ，可用于配置默认选中返回列表的某项
 * 2019-04-09 新增，keyMap中的list值增加null处理，用于处理接口直接返回数据的情况。
 * 2018-08-30 修复:ref="abc"方式赋值时，$refs.abc为数组的问题
 *
 * 获取数组类型数据指令,可方便数组类型的Vue实例获取数据，配置项如下
 * {
 *  data: [] | required, // 操作的数组
 *  url: '' | required, //后端接口地址
 *  ref: '' | required, //组件实例的ref，必须
 *  params: {} | required, // 请求参数，如 {id: ''}
 *  keyMap: {value: '', list: 'data'} | optional, //keymap，如 {value: 'id', list: 'data'}，指定value的键名，用于当有值输入时设置到params中。以及指定返回值的list的键名，支持链式或者数组
 *  beforeSend: function (params) {} | optional, //发送请求前钩子，参数为params对象
 *  filter: function(array) {} | optional, //返回数据的过滤器
 *  needvalue: false | optional, //是否需要值，默认为false，即是否依赖于其他组件的值，用于处理级联的需求
 *  delay: false | optional, //是否延迟请求，默认为false，为true时则在组件被激活（如focus）时发起请求
 *  activeEvent: 'focus' | optional, //组件激活事件，默认为 focus
 *  clear: Function | optional, //清空函数，用于清空数组及选中的值，
 *  value: Object | optional, //needvalue时，可通过value赋值，用于默认发送请求
 *  dfrc: Boolean, // false，disableFirstReloadClearValue 第一次reload变动时是否清除已有value
 * selectdefault: {  //设置默认选中项
 *                  disabled: false, //是否禁用，编辑时应禁用默认赋值
                    target: 'info', //设置值的对象，必填
                    keymap: {
                      valuekey: 'id', //值的key，若不传则使用列表返回的值
                      key: '', //具体更新字段，必填
                    },
                    index: 0, // 选中项
                    event: 'change', // 是否抛出事件，data为设置的值
                  },
 * }

    配置实例：
     v-list-getter="{
                  url: '/area',
                  data: aCityList,
                  params: {
                    id: '',
                  },
                  keymap: {
                    value: 'id',
                    list: 'data.rows'
                  },
                  selectdefault: {
                    target: info,
                    disabled: isEdit,
                    keymap: {
                      valuekey: 'id',
                      key: '',
                    },
                    index: 0,
                    event: 'change',
                  },
                  needvalue: true,
                  value: userInfo.province,
                  delay: true,
                  clear: fClearCity,
                  reloadEvent: 'reload',
                  ref:'city',
                  dfrc: false,
                }"
 */
const ListGetter = {
    name: 'list-getter',
    bind(el, binding, vnode) {
        // const maxTryTimes = 3
        let o = binding.value
        if (!o) {
            return
        }
        let aData = o.data
        // let retry = 0
        let method = o.method || 'get'
        let url = o.url
        let oParams = o.params || {}
        let oKeyMap = o.keyMap ||
            o.keymap || {
                value: 'datavalue',
                list: 'data.rows',
            }
        const { list } = oKeyMap
        let sListKey = list === null ? null : oKeyMap.list || 'data.rows'
        let beforeSend = o.beforeSend
        let onResponse = o.onResponse
        let filter = o.filter
        let bNeedValue = o.needvalue || false
        let delay = o.delay || false // 是否立即初始化,默认为否，监听focus事件
        let sActiveEvent = o.activeEvent || 'focus'
        let oValue = o.value || null
        let fClear = o.clear
        let ref = o.ref
        let dfrc = o.dfrc || false
        let selectdefault = o.selectdefault || null
        let vm = vnode.context.$refs[ref] // 绑定的组件实例

        // 修改于2018-08-30,处理通过 :ref="abc"时$refs[ref]为数组的问题
        if (Array.isArray(vm) && vm[0] instanceof Vue) {
            vm = vm[0]
        }

        if (!vm) {
            fWarn(`找不到vm实例，请检查是否配置ref。ref=${ref}， url=${url}`)
        }
        if (!url) {
            fWarn(`请配置接口URL。ref=${ref}`)
        }
        if (!aData) {
            fWarn(`请配置数据数组,数据数组不能为假值。ref=${ref}`, `data=${aData}`)
        }
        if (!(vm instanceof Vue)) {
            fWarn(`ref需为Vue实例。ref=${ref}`)
        }
        if (!vm || !url || !aData || !(vm instanceof Vue)) {
            return
        }

        function fSend() {
            if (typeof beforeSend === 'function') {
                if (beforeSend(oParams) === false) {
                    return
                }
            }
            request({
                    url,
                    params: oParams,
                    method,
                })
                .then(response => {
                    let arr
                    if (sListKey !== null) {
                        arr = get(response, sListKey, [])
                    } else {
                        arr = Array.isArray(response) ? response : []
                    }
                    if (typeof filter === 'function') {
                        arr = filter.call(vnode.context, arr)
                    }

                    // 2019-04-10新增 增加选中默认值的选项
                    if (selectdefault) {
                        const { disabled } = selectdefault
                        let {
                            target,
                            keymap,
                            index = 0,
                            event = '',
                        } = selectdefault
                        if (target && keymap && keymap.key && !disabled) {
                            if (index >= arr.length) {
                                index = arr.length - 1
                            }
                            let data = arr[index]
                            if (keymap.valuekey !== null) {
                                data = get(data, keymap.valuekey || 'id')
                            }
                            setProporty(target, keymap.key, data, Vue.$set)
                            if (event) {
                                vm.$emit(event, data)
                            }
                        }
                    }
                    if (arr && aData.length === 0) {
                        aData.push(...arr)
                    }
                    // arr && aData.push(...arr)
                    if (typeof onResponse === 'function') {
                        onResponse.call(vnode.context, response)
                    }
                })
                .catch(error => {
                    console.log(error)
                    // retry++
                    // if (retry < maxTryTimes) {
                    //   fSend()
                    // } else {
                    //   console.log('RequestErrorTooManyTimes', url)
                    // }
                })
        }

        function fCheckNeedSend() {
            if (delay) {
                vm.$once(sActiveEvent, fSend)
            } else {
                fSend()
            }
        }

        // 检查是否发送请求，
        // 考虑到部分组件needvalue但已有value，故以此方式
        if (!bNeedValue) {
            fCheckNeedSend()
        } else {
            if (oValue) {
                fSetValue(oValue)
                fCheckNeedSend()
            }
        }

        /**
         * 设置value，并且检查是否发送请求
         * @param {Object} value
         */
        function fSetValue(value) {
            if (oKeyMap) {
                if (['string', 'number'].includes(typeof value)) {
                    oParams[oKeyMap.value] = value
                } else {
                    for (let key in oKeyMap) {
                        if (value[key]) {
                            oParams[key] = value[key]
                        }
                    }
                }
            }
        }

        vm.$on('reload', value => {
            aData.splice(0)

            // dfrc disableFirstReloadClear
            if (!dfrc) {
                if (typeof fClear === 'function') {
                    fClear.call(vm)
                }
            } else {
                dfrc = false
            }
            fSetValue(value)
            fCheckNeedSend()
        })
    },
    update(el, binding, vnode) {
        // todo
        // if (binding.ref === 'catogary') {
        //     console.log('update', binding)
        // }
    },
    unbind(el, binding, vnode) {
        let o = binding.value
        if (!o) {
            return
        }
        let sActiveEvent = o.activeEvent || 'focus'
        let ref = o.ref
        let vm = vnode.context.$refs[ref] // 绑定的组件实例

        // 修改于2018-08-30,处理通过 :ref="abc"时$refs[ref]为数组的问题
        if (Array.isArray(vm) && vm[0] instanceof Vue) {
            vm = vm[0]
        }

        if (vm && vm.$off) {
            vm.$off(sActiveEvent)
        }
    },
}

export default ListGetter