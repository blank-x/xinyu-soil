import fetch from '@/utils/fetch'

export let permission_fail = {
    reject:['put,/cash_audit/reject']
}
export let permission_waitCash = {
    unlock:['put,/locks/companys/{id}/unlock'],
    export:['post,/cash_audit/export'],
    pass:['put,/cash_audit/to_success'],
    reject:['put,/cash_audit/{id}/fail']
}
//需兑现清单  支付失败列表
export function waitCashAndFail(data,type) {
    return fetch({
        url: '/cash_audit/'+type+'/queries',
        method: 'post',
        data:data
    })
}
//驳回待兑现(reject), 结算(to_success)
export function updateCash(data,type) {
    return fetch({
        url: '/cash_audit/'+type,
        method: 'put',
        data:data
    })
}
// 通过id驳回到支付失败列表
export function updateCashAudit(id,type,data) {
    return fetch({
        url: '/cash_audit/'+id+'/'+type,
        method: 'put',
        data:data
    })
}
// 解锁  id 公司id
export function doUnlockByCompanyId(id) {
    return fetch({
        url:'/locks/companys/'+id+'/unlock',
        method:'put',
    })
}