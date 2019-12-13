import ButtonGroup from '@/components/ButtonGroup'
import PaginationPro from '@/components/PaginationPro'
import Search from '@/components/Search'
import Status from '@/components/Status'
import StatusTag from '@/components/StatusTag'
import { fScrollToFirstError } from '@/utils/index'
import * as clipboard from 'clipboard-polyfill'
import { get } from 'lodash'

// 全局混入
// 详情页需要用到的(如新增，修改页面)
export const detailMixins = {
    components: {
        ButtonGroup,
        StatusTag,
        Status,
    },
    data() {
        return {
            id: this.$route.params.id || null,
            action: this.$route.meta.action,
            bIsLoading: false,
        }
    },
    computed: {
        isView() {
            return this.action === 'view'
        },
        isEdit() {
            return this.action === 'edit'
        },
        isCreate() {
            return this.action === 'create'
        },
    },
    created() {
        this.getActionFromUrl()
    },
    methods: {
        getActionFromUrl() {
            this.action = get(this.$route, 'meta.action') || null
            if (!this.action) {
                // 2018-08-28修改   修改  /\/\d+(\/.*)*$/  为 /\/-?\d+(\/.*)*$/，处理id为负数的情况
                const _actionMatched = this.$route.path
                    .replace(/\/-?\d+(\/.*)*$/, '')
                    .match(/\/(\w*)(?=\s*)$/)
                this.action = _actionMatched ? _actionMatched[1] : void 0
            }
        },
        fBack() {
            this.$notify.close()
            this.$router.back()
        },
        /**
         * 验证form表单是否通过并提示
         * @param {ElFormComponent} form
         * @param {Function} onSuccess
         * @param {Function|Null} onFail
         * @param {String|Null} sTip
         * 提示文本，默认值： 验证未通过,请查看页面中的错误消息
         * @param {Bollean|true} bScroll2FirstError
         */
        fVelidateForm(
            form,
            onSuccess,
            onFail = null,
            sTip = '验证未通过,请查看页面中的错误消息',
            bScroll2FirstError = true,
        ) {
            if (form && typeof form.validate === 'function') {
                form.validate(valid => {
                    if (valid) {
                        if (typeof onSuccess === 'function') {
                            onSuccess.call(this)
                        }
                    } else {
                        if (typeof onFail === 'function') {
                            onFail.call(this)
                        }
                        if (sTip) {
                            this.$notify({
                                title: '提示',
                                message: sTip,
                                type: 'warning',
                                duration: 1500,
                            })
                        }

                        if (bScroll2FirstError) {
                            this.$nextTick(() => {
                                setTimeout(fScrollToFirstError, 0)
                            })
                        }
                    }
                })
            }
        },
    },
}
export const copyMixins = {
    methods: {
        fCopy(text) {
            clipboard.writeText(text)
            this.$notify({
                title: '提示',
                message: '已复制到剪贴板',
                type: 'success',
                duration: 1500,
            })
        },
    },
}

// 列表页需要用到的混入
export const listMixins = {
    mixins: [copyMixins],
    components: {
        PaginationPro,
        Search,
        StatusTag,
    },
    methods: {
        getValue(target, keys) {
            return get(target, keys, '')
        },
    },
}