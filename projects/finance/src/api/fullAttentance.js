import fetch from "@/utils/fetch";


//查询合作方列表  分页查询 全勤奖明细
export function fullAttentance(query) {
    return fetch({
        url: '/rewards/month_pays/queries',
        method: 'post',
        data: query
    })
}


// 全勤奖管理   查询 每月全勤明细
export function fullAttentanceMonth(data) {
    return fetch({
        url: '/rewards/chapter_records/queries',
        method: 'post',
        data:data
    })
}

// 全勤信息
export function fullAttentanceInfo(bookId,dealMobth) {
  return fetch({
    url: `/rewards/${bookId}/${dealMobth}`,
    method: 'get',

  })
}

export let permission = {

}
