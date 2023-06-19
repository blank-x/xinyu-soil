import fetch from '@/utils/fetchAuth'

export function loginByUsername(username, password,code) {
    const data = {
        username,
        password,
        code
    }
    return fetch({
        url: '/users/login',
        method: 'post',
        data
    })
}
/**
 * 用戶登出
 */
export function logout() {
    return fetch({
        url: '/users/logout',
        method: 'get'
    })
}

export function getUserInfo() {
    return fetch({
        url: '/logonuser',
        method: 'get',
    })
}

export function putUserInfo(data) {
    return fetch({
        url: '/logonuser',
        method: 'put',
        data
    })
}

export function postUserpwd(data) {
    return fetch({
        url: '/logonuser/pwd',
        method: 'post',
        data
    })
}

export function getCaptcha() {
    return fetch({
        url: '/users/captcha',
        method: 'get',
        params: {rand:new Date().getTime()}
    })
}


export function getSystems() {
    return fetch({
        url: '/logonuser/systems',
        method: 'get',
    })
}

export function  getSystemResource(systemID) {
    return fetch({
        url:'/logonuser/systems/'+systemID+'/resources',
        method:'get',
    })
}
