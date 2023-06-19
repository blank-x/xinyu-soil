import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import router from '../router'
import store from '@/store'
import {getToken} from '@/utils/auth'

// 创建axios实例

const service = axios.create({
    baseURL: process.env.AUTH_API, // api的base_url
    timeout: 20000,                  // 请求超时时间
    withCredentials: true,
})

// request拦截器
service.interceptors.request.use(config => {
    // Do something before request is sent
    if (getToken()) {
        config.headers['x-access-token'] = getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    }
    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.status !== 200) {
            if (res.status === 401) {
                MessageBox.confirm(res.msg||'用户登录信息失效', '提示', {
                    confirmButtonText: '重新登录',
                    showCancelButton:false,
                    type: 'warning',
                    confirmButtonClass:'login-out'
                }).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                        router.push({
                            path: 'login',
                            query: {redirect: router.currentRoute.fullPath}
                        })
                      //location.reload();// 为了重新实例化vue-router对象 避免bug
                    });
                })
                return
            }
            if (res.status === 201) {
                // 下载文件
                return response;
            }
            //  登录 可以通过
            if(res.status === 450){
                return response;
            }
            if (res.msg) {
                Message({
                    message: res.msg,
                    type: 'error',
                    duration: 5 * 1000
                });
                return response;
            }
            return Promise.reject('error');
        }
        return response;
    },
    error => {
        console.log('err' + error)// for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
