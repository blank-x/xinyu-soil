import fetch from '@/utils/fetch'
// 分页查询稿费审核日志
export function fetchInspectedLog(data) {
    return fetch({
        url: '/paylogs_audit/queries/inspected',
        method: 'post',
        data:data
    })
}
// 通过稿费id获取审核日志列表   稿费审核
export function fetchInspectedLogPay(id) {
    return fetch({
        url: '/paylogs_audit/'+id+'/inspect_logs',
        method: 'get',
    })
}
export let permission = {


}