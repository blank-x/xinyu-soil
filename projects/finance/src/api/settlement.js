import fetch from '@/utils/fetch'
export let permission = {
    force:['post,/guarantees/{id}/force'],
    calculate:['post,/batch_jobs/calculate'],//计算
    author_cash:['post,/batch_jobs/author_cash'],//兑现
    viewDetails:['get,/job_detail/batch/{batchId}'],
    recalculate:['post,/batch_jobs/job_logs/{id}/recalculate'],
    re_author_cash:['post,/batch_jobs/job_logs/{id}/re_author_cash'],
}
export let permissionCal = {
  calculate:['post,/batch_jobs/calculate'],//计算
  author_cash:['post,/batch_jobs/author_cash'],//兑现
  viewDetails:['get,/job_detail/batch/{batchId}'],
  recalculate:['post,/batch_jobs/job_logs/{id}/recalculate'],
  re_author_cash:['post,/batch_jobs/job_logs/{id}/re_author_cash'],
}
//稿费记录查询
export function royaltiesSearchList(query) {
    return fetch({
        url: '/paylog/record/queries',
        method: 'POST',
        data: query
    })
}
// 批量稿费列表
export function royaltiesList(query) {
    return fetch({
        url: '/batch_jobs/queries',
        method: 'post',
        data: query
    })
}


//是否可以计算
export function calculateData() {
    return fetch({
        url: '/batch_jobs/calculate/validate',
        method: 'get',
    })
}
//是否可以兑现
export function cashData() {
    return fetch({
        url: '/batch_jobs/author_cash/validate',
        method: 'get',
    })
}
//是否可以重算
export function re_calculateData() {
    return fetch({
        url: '/batch_jobs/calculate/recompute',
        method: 'get',
    })
}
//是否可以重新兑现
export function re_cashData() {
    return fetch({
        url: '/batch_jobs/author_cash/recompute',
        method: 'get',
    })
}
//计算稿费，重算稿费--按钮
export function calculateSubmit(query) {
    return fetch({
        url: '/batch_jobs/calculate',
        method: 'post',
        data: query
    })
}

//兑现稿费，重算兑现--按钮
export function cashSubmit(query) {
    return fetch({
        url: '/batch_jobs/author_cash',
        method: 'post',
        data: query
    })
}

//校验重算的书籍
export function checkBookid(bookId,companyId) {
    return fetch({
        url: '/batch_jobs/validate_book/'+bookId+'/'+companyId,
        method: 'get',
    })
}

//校验重新兑现的作者
export function checkAuthorid(userId,companyIds) {
    return fetch({
        url: '/batch_jobs/validate_author/'+userId+'/company/'+companyIds,
        method: 'get',
    })
}

//查看详情
export function viewDetailsList(id) {
    return fetch({
        url: '/job_detail/batch/'+id,
        method: 'get',
    })
}
//查看失败详情
export function fail_detailList(type,id) {
    return fetch({
        url: '/job_detail/fail_detail/'+type+'/'+id,
        method: 'get',
    })
}

//继续计算兑现失败记录
export function re_author_cashData(id ) {
    return fetch({
        url: '/batch_jobs/job_logs/'+id+'/re_author_cash',
        method: 'post',
        data:{}
    })
}
//查看签约信息
export function fetchSignDetail(query) {
    return fetch({
        url:'/job_detail/signatory_detail/'+query.id,
        method:'get',
    })
}

//计算失败继续计算稿费
export function recalculateData(id) {
    return fetch({
        url: '/batch_jobs/job_logs/'+id+'/recalculate',
        method: 'post',
        data:{}
    })
}


//获取不同cp的稿费类型
export function paylogtypeData(cps) {
    return fetch({
        url: '/batch_jobs/get_paylogtype_by_cps/'+cps,
        method: 'get',
    })
}

//校验重算稿费的书籍/月份/稿费类型是否可以重算稿费
export function validate_book_paymentData(id,month,type) {
    return fetch({
        url: '/batch_jobs/validate_book_payment/'+id+'/'+month+'/'+type,
        method: 'get',
    })
}

//校验作者是否可以进行校验
export function validate_author_cashData(id,companyIds) {
    return fetch({
        url: '/batch_jobs/validate_author_cash/'+id+'/'+companyIds,
        method: 'get',
    })
}
