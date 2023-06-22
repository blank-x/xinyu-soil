import { createApp, ref } from 'vue'
import Particles from 'x-particles'

import App from "./App.vue";
import axios from "axios";
 

/*import "./mock"; // 该项目所有请求使用mockjs模拟*/
import Icon from 'vue-awesome'

 

  
Vue.use(Particles);

// 全局注册公共头部组件
Vue.component('icon', Icon)

Vue.config.productionTip = false;
Vue.prototype.$_axios = axios;

createApp({
    setup() {
      return {
        count: ref(0)
      }
    }
  }).mount('#app')


let vm = new Vue({
    el: "#app",
    template: "<App/>",
    components: { App }
});
