/**
 * Created by zhengqiang.liu on 2017/11/15.
 */
import fetch from '@/utils/fetchAuth'

/**
 * 查询资源
 * @param data
 */
export function fetchResourcesList(data) {
    return fetch({
        url: '/resources/queries',
        method: 'post',
        data
    })
}
/**
 * 获取所有资源
 */
export function fetchAllResources() {
    return fetch({
        url: '/resources',
        method: 'get',
    })
}

/**
 * 获取角色对应的资源
 */
export function fetchSelectedResources(id) {
    return fetch({
        url: '/roles/'+id+'/resources',
        method: 'get',
    })
}
