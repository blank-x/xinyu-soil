import Vue from "vue";
import {affix} from 'vue-beauty'
import ElementUI from "element-ui";
import Particles from 'x-particles'
import "element-ui/lib/theme-chalk/index.css";
import "./assets/element-variables.scss";
import 'vue-beauty/package/style/vue-beauty.min.css'

import App from "./App";
import axios from "axios";
 

/*import "./mock"; // 该项目所有请求使用mockjs模拟*/
import Icon from 'vue-awesome'

 

 


Vue.use(ElementUI, {size:"small"});
Vue.use(affix);
Vue.use(Particles);

// 全局注册公共头部组件
Vue.component('icon', Icon)

Vue.config.productionTip = false;
Vue.prototype.$_axios = axios;

let vm = new Vue({
    el: "#app",
    template: "<App/>",
    components: { App }
});
