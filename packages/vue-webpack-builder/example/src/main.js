import Vue from 'vue'
import Particles from 'x-particles'

import App from "./App.vue";
import axios from "axios";
 
  
Vue.use(Particles);

// 全局注册公共头部组件

Vue.config.productionTip = false;
Vue.prototype.$_axios = axios;

 


new Vue({
    el: "#app",
    render: h => h(App)
});
