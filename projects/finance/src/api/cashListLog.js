import fetch from '@/utils/fetch'


// 通过兑现id获取审核日志列表  兑现清单
export function fetchInspectedLogCash(id) {
    return fetch({
        url: '/cash_audit/'+id+'/inspect_logs',
        method: 'get',
    })
}
// 兑现清单日志列表 分页
export function fetchCashAuditLogList(data,type) {
    return fetch({
        url: '/cash_audit/queries/inspected',
        method: 'post',
        data:data
    })
}
export let permission = {
}
