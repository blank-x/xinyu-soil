import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'

// 创建axios实例

console.log(process.env.BASE_API)
const service = axios.create({
    baseURL: process.env.FINANCE_API,
    timeout: 6000000, //请求超时时间
    withCredentials: true,
})

// request拦截器
service.interceptors.request.use(config => {
    // Do something before request is sent
    store.dispatch('setSubmitLoading',true);
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
        store.dispatch('setSubmitLoading',false);
        if (res.status !== 200) {
            if (res.status === 401) {
                MessageBox.confirm(res.msg||'用户登录信息失效，可重新登录', '提示', {
                    confirmButtonText: '重新登录',
                    showCancelButton:false,
                    type: 'warning',
                    confirmButtonClass:'login-out'
                }).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                        location.reload();// 为了重新实例化vue-router对象 避免bug
                    });
                }).catch(()=>{})
                // Message({
                //   message: res.msg,
                //   type: 'error',
                //   duration: 5 * 1000
                // });
                return
            }
            if (response.status === 201) {
                // 下载文件
                return response;
            }
            if( res.type === 'multipart/form-data'){
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
        store.dispatch('setSubmitLoading',false);
        return Promise.reject(error)
    }
)

export default service
