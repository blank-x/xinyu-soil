import fetch from '@/utils/fetch'
export let permission ={
    export:['post,/paylogs_outsourcing/export'],
    actual_time_export:['post,/channel_topup/actual_time/statistics/export'],
    fixed_time_export:['post,/channel_topup/fixed_time/statistics/export'],
    actual_time_item_export:['post,/channel_topup/actual_time/items/export'],
    fixed_time_item_export:['post,/channel_topup/fixed_time/items/export'],
    payout_avg_logs_export:['post,/payout_avg_logs/export'],
    partner_pay_pass_all:['put,/partner_paylogs/pass_all'],
    partner_pay_pass:['put,/partner_paylogs/pass'],
    donates_month_export:['post,/donates/month/items/export']
}
/**
 * 获取月度榜单排行
 * @param query
 */
export function fetchList(query) {
    return fetch({
        url: '/finance/list',
        method: 'get',
        params: query
    })
}
/**
 * 稿费支付记录列表
 * @param query
 */
export function fetchFeePayMentList(query) {
    return fetch({
        url: '/finance/FeePayMentlist',
        method: 'get',
        params: query
    })
}
/**
 * 签约作家分页列表
 * @param query
 */
export function fetchSignedAuthors(query) {
    return fetch({
        url: '/signedauthors/queries',
        method: 'post',
        data: query
    })
}

/**
 * 稿费月度支付记录分页查询
 * @param query
 */
export function fetchAuthorCashItems(query) {
    return fetch({
        url: '/author_cash/items',
        method: 'post',
        data: query
    })
}
/**
 * 公司月度稿费类型合计
 * @param query
 */
export function fetchAuthorCashTypeMonthSum(query) {
    return fetch({
        url: '/author_cash/month/items/sum/type',
        method: 'post',
        data: query
    })
}

/**
 * 稿费兑现列表分页查询
 * @param query
 */
export function fetchAuthorCashStatistics(query) {
    return fetch({
        url: '/author_cash/statistics',
        method: 'post',
        data: query
    })
}

/**
 * 稿费兑现汇总
 * @param query
 */
export function fetchAuthorCashStatisticsSum(query) {
    return fetch({
        url: '/author_cash/statistics/sum',
        method: 'post',
        data: query
    })
}

/**
 * 分页查询外购作品消费记录列表
 * @param query
 */
export function fetchPayLogsOutsourcing(query) {
    return fetch({
        url: '/paylogs_outsourcing/queries',
        method: 'post',
        data: query
    })
}
/**
 * 通过id更新合作方书籍
 * @param query
 */
export function fetchSettlementPaylogsOutsourcing(query) {
    return fetch({
        url: '/paylogs_outsourcing',
        method: 'put',
        data: query
    })
}

/**
 * 签署人稿费月度支付记录查询
 * @param query
 **/
export function fetchAuthorCashMonthList(query) {
    return fetch({
        url: '/author_cash/month/items',
        method: 'post',
        data: query
    })
}


/**
 * 签署人稿费月度支付记录汇总查询
 * @param query
 **/
export function fetchAuthorCashMonthSum(query) {
    return fetch({
        url: '/author_cash/month/items/sum',
        method: 'post',
        data: query
    })
}

/**
 * 实时收入汇总分页查询列表
 * @param query
 **/
export function fetchActualTimeList(query) {
    return fetch({
        url: '/channel_topup/actual_time/statistics',
        method: 'post',
        data: query,
    })
}

/**
 * 实时收入合计
 * @param query
 **/
export function fetchActualTimeSum(query) {
    return fetch({
        url: '/channel_topup/actual_time/sum',
        method: 'post',
        data: query,
    })
}


/**
 * 实时收入明细分页查询列表
 * @param query
 **/
export function fetchActualTimeItemList(query) {
    return fetch({
        url: '/channel_topup/actual_time/items',
        method: 'post',
        data: query,
    })
}


/**
 * 固化收入汇总分页查询列表
 * @param query
 **/
export function fetchFixedTimeList(query) {
    return fetch({
        url: '/channel_topup/fixed_time/statistics',
        method: 'post',
        data: query,
    })
}

/**
 * 固化收入合计
 * @param query
 **/
export function fetchFixedTimeSum(query) {
    return fetch({
        url: '/channel_topup/fixed_time/statistics/sum',
        method: 'post',
        data: query,
    })
}


/**
 * 固化收入明细分页查询列表
 * @param query
 **/
export function fetchFixedTimeItemList(query) {
    return fetch({
        url: '/channel_topup/fixed_time/items',
        method: 'post',
        data: query,
    })
}



/**
 * 作品月度排行
 * @param query
 **/
export function fetchBookMonthRankList(query) {
    return fetch({
        url: '/book_month_rank/queries',
        method: 'post',
        data: query,
    })
}
/**
 * 买断分摊列表
 * @param query
 **/
export function fetchPayOutAvgList(query) {
    return fetch({
        url: '/payout_avg_logs/queries',
        method: 'post',
        data: query,
    })
}

/**
 * 买断分摊明细
 * @param query
 **/
export function fetchPayOutAvgItem(query) {
    return fetch({
        url: '/payout_avg_logs/queries/items',
        method: 'post',
        data: query,
    })
}


/**
 * 打赏记录统计分页查询
 * @param query
 **/
export function fetchDonateslist(query) {
    return fetch({
        url: '/donates/statistics',
        method: 'post',
        data: query,
    })
}
/**
 * 打赏记录统计月度合计
 * @param query
 */
export function fetchDonatesSum(query) {
    return fetch({
        url: '/donates/statistics/sum',
        method: 'post',
        data: query,
    })
}

/**
 * 合作方稿费记录管理
 * @param query
 */
export function fetchPartnerPayLogs(query) {
    return fetch({
        url: '/partner_paylogs/queries',
        method: 'post',
        data: query,
    })
}


/**
 *打赏记录月度统计分页查询
 * @param query
 */
export function fetchDonatesMonthList(query) {
    return fetch({
        url: '/donates/month/items',
        method: 'post',
        data: query,
    })
}

/**
 *打赏记录合计
 * @param query
 */
export function fetchDonatesMonthSum(query) {
    return fetch({
        url: '/donates/items/sum',
        method: 'post',
        data: query,
    })
}

/**
 *打赏记录按天统计分页查询
 * @param query
 */
export function fetchDonatesUserItem(query) {
    return fetch({
        url: '/donates/user/items',
        method: 'post',
        data: query,
    })
}

/**
 * 通过id列表批量通过合作方稿费审核记录
 * @param query
 */
export function fetchPartnerPayLogsPass(query) {
    return fetch({
        url: '/partner_paylogs/pass',
        method: 'put',
        data: query,
    })
}


/**
 * 批量通过合作方稿费审核记录
 * @param query
 */
export function fetchPartnerPayLogsPassAll(query) {
    return fetch({
        url: '/partner_paylogs/pass_all',
        method: 'put',
        data: query,
    })
}

/**
 *合计应结算金额
 * @param query
 */
export function fetchPayLogSumPayMent(query) {
    return fetch({
        url: '/partner_paylogs/sum_payment',
        method: 'post',
        data: query,
    })
}

