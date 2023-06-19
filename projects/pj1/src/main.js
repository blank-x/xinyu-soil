// import pkg1 from '@blank/pkg1'

// pkg1()

import Vue from "vue";
import {affix} from 'vue-beauty'
import ElementUI from "element-ui";
import Particles from 'x-particles'
import "./assets/element-variables.scss";
import 'vue-beauty/package/style/vue-beauty.min.css'

import App from "./App";
import router from "./router";
import store from "./store";
import axios from "axios";
import * as filters from "./filters"; // 全局filter
import has from "./directive/has"; // 全局权限检查directive
import "./icons"; // icon
import "./errorLog"; // error log
import "./permission"; // 权限
import configs from './utils/config'
/*import "./mock"; // 该项目所有请求使用mockjs模拟*/
import Icon from 'vue-awesome'


//全局组件
import noData from '@/views/errorPage/noData'
import contentTitle from '@/views/components/contentTitle.vue'
import search from '@/views/components/btnCommon/search.vue'
import reset from '@/views/components/btnCommon/reset.vue'
import pagination from '@/views/components/pagination.vue'
import notEnabled from '@/views/components/notEnabled.vue'
import textEllipsis from '@/views/components/textEllipsis.vue'
import nullValue from '@/views/components/nullValue.vue'

Vue.component('no-data', noData)
Vue.component('contentTitle',contentTitle)
Vue.component('search',search)
Vue.component('reset',reset)
Vue.component('pagination',pagination)
Vue.component('notEnabled',notEnabled)
Vue.component('textEllipsis',textEllipsis)
Vue.component('nullValue',nullValue)


Vue.use(ElementUI, {size:"small"});
Vue.use(affix);
Vue.use(Particles);
Vue.use(configs);
// 全局注册公共头部组件
Vue.component('icon', Icon)
// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});


Vue.config.productionTip = false;
Vue.prototype.$_axios = axios;

let vm = new Vue({
    el: "#app",
    router,
    store,
    template: "<App/>",
    components: { App }
});
