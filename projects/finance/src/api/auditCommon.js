import fetch from '@/utils/fetch'
import fetchAuth from '@/utils/fetchAuth'

// 获取列表
export function fetchList(query,type) {
    return fetch({
        url: '/paylogs_audit/'+type+'/queries',
        method: 'post',
        data: query
    })
}

// 驳回  删除  恢复
export function update(id,type,data) {
    return fetch({
        url: '/paylogs_audit/'+id+'/'+type,
        method: 'put',
        data: data
    })
}

// 通过
export function pass(data,type) {
    return fetch({
        url: '/paylogs_audit/'+type,
        method: 'put',
        data: data
    })
}

// 通过的时候用户密码验证
export function validatePassword(data) {
    return fetchAuth({
        url: '/logonuser/pwd',
        method: 'put',
        data: data
    })
}

//  查看驳回记录
export function inspectLog(id) {
    return fetch({
        url: '/inspect_logs/'+id,
        method: 'get'
    })
}

// 通过兑现id查询稿费明细  兑现清单
export function fetchCashDetailById(id) {
    return fetch({
        url: '/cash_audit/'+id+'/paylogs',
        method: 'get',
    })
}

export function addAudit(data) {
    return fetch({
        url: '/paylogs_audit',
        method: 'post',
        data:data
    })
}

/**
 * companyId 对应是否锁定
 */
export function getCompanyLockInfo() {
    return fetch({
        url:'/locks/companys',
        method:'get',
    })
}

/**
 * 获取cpId 对应是否锁定
 */
export function getLockInfo() {
    return fetch({
        url:'/locks/cps/',
        method:'get',
    })
}
// 锁定  id 公司id
export function doLockByCompanyId(id) {
    return fetch({
        url:'/locks/companys/'+id+'/lock',
        method:'put',
    })
}

// 自有稿费一审 添加稿费 筛选责编列表
export function filteEditors() {
    return fetch({
        url:'/audit/paylog_type/capacity_add_all',
        method:'get',
    })
}
// 自有稿费一审 校验失败的作者的数量
export function checkAuthorNumber(data){
    return fetch({
        url:'/paylogs_audit/author/validate',
        method:'put',
        data:data
    })
}

// 自有稿费一审 校验失败的作者列表
export function checkAuthorFailed(data){
    return fetch({
        url:'/paylogs_audit/author/validate/query',
        method:'post',
        data:data
    })
}


//  自有一审权限权限控制
export let permission_ownFirst = {
    add:['post,/paylogs_audit'],
    pass:['put,/paylogs_audit/pass_first_own'],
    reject:['put,/paylogs_audit/{id}/to_reject_own'],
    delete:['put,/paylogs_audit/{id}/to_delete_own']
}
// 自有二审权限
export let permission_ownSecond= {
    pass:['put,/paylogs_audit/pass_second_own'],
    reject:['put,/paylogs_audit/{id}/to_first_own'],
    export:['post,/paylogs_export/own_second'],
}
//  三审 权限控制
export let permission_third = {
    lock:['put,/locks/companys/{id}/lock'],
    reject:['put,/paylogs_audit/{id}/to_second'],
    pass:['put,/paylogs_audit/pass_third']
}
// 待兑现稿费
export let permission_waitPay= {
    reject:['put,/paylogs_audit/to_third']
}

//合作方一审权限
export let permission_partnersFirst= {
    pass:['put,/paylogs_audit/pass_first_partner'],
    reject:['put,/paylogs_audit/{id}/to_reject_partner']

}
// 合作方二审权限
export let permission_partnersSecond= {
    pass:['put,/paylogs_audit/pass_second_partner'],
    reject:['put,/paylogs_audit/{id}/to_first_partner']

}





