import ListGetter from '@/directive/ListGetter'
import RelatedComponents from '@/directive/RelatedComponents'

const install = function(Vue, options) {
    Vue.directive(ListGetter.name, ListGetter)
    Vue.directive(RelatedComponents.name, RelatedComponents)
}

export default { install }