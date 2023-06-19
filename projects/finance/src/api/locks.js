import fetch from '@/utils/fetch'
export let permission = {
    force:['post,/guarantees/{id}/force'],
    compareStatus:['post,/guarantee_pay_logs/{id}/comparison']
}
//锁定
export function locksList() {
    return fetch({
        url: '/locks/cps/paylog_calculate_lock',
        method: 'get',
    })
}
