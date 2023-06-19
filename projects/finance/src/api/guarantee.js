import fetch from '@/utils/fetch'
export let permission = {
  force:['post,/guarantees/{id}/force'],
  compareStatus:['post,/guarantee_pay_logs/{id}/comparison'],
  add:['post, /guarantee_pay_logs/add']
}
//保底作品列表
export function guaranteeList(query) {
  return fetch({
    url: '/guarantees/queries',
    method: 'POST',
    data: query
  })
}
// 强制、取消强制
export function fetchForce(query) {
  return fetch({
    url: '/guarantees/'+query.id+'/force',
    method: 'post',
    data: query
  })
}
//非保底作品稿费列表
export function guarantee_pay_logsList(query) {
  return fetch({
    url: '/guarantee_pay_logs/queries',
    method: 'POST',
    data: query
  })
}
// 对比
export function fetchComparison(query) {
  return fetch({
    url: '/guarantee_pay_logs/'+query.id+'/comparison',
    method: 'post',
    data: query
  })
}
//非保底添加稿费
export function guaranteeAdd(query) {
  return fetch({
    url: '/guarantee_pay_logs/add',
    method: 'post',
    data: query
  })
}

