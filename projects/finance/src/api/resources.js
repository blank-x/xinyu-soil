/**
 * Created by zhengqiang.liu on 2017/11/15.
 */
import fetch from '@/utils/fetchAuth'
export let permission = {
    add:['post,/resources'],
}
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
 * 根据角色id，查询已授权的资源列表
 */
export function fetchSelectedResources(id) {
    return fetch({
        url: '/roles/'+id+'/resources',
        method: 'get',
    })
}


/**
 * 保存角色对应的资源
 */
export function fetchSaveRoleResources(data) {
    return fetch({
        url: '/permissions',
        method: 'post',
        data
    })
}
/**
 *  新增资源
 */
export function createResource(data) {
    return fetch({
        url: '/resources',
        method: 'post',
        data
    })
}

/**
 * 更新资源
 */
export function updateResource(data) {
    return fetch({
        url: '/resources/'+data.id,
        method: 'put',
        data
    })
}

/**
 * 根据id查看资源信息
 */
export function fetchResource(id) {
    return fetch({
        url: '/resources/'+id,
        method: 'get',
    })
}
/**
 *  逻辑删除资源
 * @param id
 */
export function  deleteRes(id) {
    return fetch({
        url:'/resources/'+id,
        method:'DELETE'
    })
}
/**
 *  状态恢复
 * @param id
 */
export function  resumeStatus(id) {
    return fetch({
        url:'/resources/'+id+'/recover',
        method:'put'
    })
}


/**
 *  获取级联资源数据
 */
export function  getCascadeRes() {
    return fetch({
        url:'/resources/cascade',
        method:'get'
    })
}
/**
 * 判断一二三级资源名称是否重复
 * 传参：name,type,parentId（一级资源传0）;添加的时候不传id，修改的时候传id
 * @param data
 */
export function  existName(data) {
    return fetch({
        url:'/resources/name/exist',
        method:'post',
        data
    })
}

/**
 *判断四级资源URL+Http方法是否重复
 * 传参：name,type,parentId（一级资源传0）;添加的时候不传id，修改的时候传id
 * @param data
 **/
export function  existPathOrMethods(data) {
    return fetch({
        url:'/resources/path/exist',
        method:'post',
        data
    })
}
