import fetch from '@/utils/fetch'
export let permission = {
    recover:['put,/paylogs_audit/{id}/recover_first']
}
//不予支付列表查询
export function rejectedList(query) {
    return fetch({
        url: '/paylogs_audit/queries/rejected',
        method: 'POST',
        data: query
    })
}

//恢复一审
export function recover_first(id) {
    return fetch({
        url: '/paylogs_audit/'+id+'/recover_first',
        method: 'put',
        data:{}
    })
}

//审核记录
export function inspectLog(id) {
    return fetch({
        url: '/inspect_logs/'+id,
        method: 'get',

    })
}
