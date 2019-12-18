import '@/assets/css/index.scss';
import Directive from '@/directive';
import '@/filters';
import { creatRouter } from "@/route";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import routers from './routers';
import store from './store';

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(Directive)
Vue.config.productionTip = false

let router = creatRouter(routers, store)
router.beforeEach(async (to, from, next) => {
    store.commit('SET_WEBSIT_TITLE', '灵众票务平台')
    next()
})

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
});