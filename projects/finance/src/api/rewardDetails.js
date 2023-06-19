import fetch from "@/utils/fetch";

// 打赏明细
export function rewardDetailsList(data) {
    return fetch({
        url: '/donates/queries',
        method: 'post',
        data:data
    })
}

export let permission = {

}