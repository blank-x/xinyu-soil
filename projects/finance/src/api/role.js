import fetch from '@/utils/fetchAuth'
export let permission = {
    addRole:['post,/roles']
}
/**
 * 获取角色列表
 * @param data
 */
export function fetchList(data) {
    return fetch({
        url: '/roles/queries',
        method: 'post',
        data,
    })
}

/**
 * 获取级联角色列表
 * @param data
 */
export function cascadeRoleList(query) {
    return fetch({
        url: '/roles/cascade',
        method: 'get',
        params: query
    })
}

/**
 * 禁用角色
 * @param id
 */
export function  deleteRole(id) {
    return fetch({
        url: '/roles/'+id,
        method: 'delete',
    })
}

/**
 * 启用角色
 * @param id
 */
export function  enableRole(id) {
    return fetch({
        url: '/roles/'+id+'/recover',
        method: 'put',
    })
}

/**
 * 新增角色
 * @param rowId  当前合同ID
 * @param data
 */
export function fetchAddRole(data) {
    return fetch({
        url: '/roles',
        method: 'post',
        data
    })
}

/**
 * 修改角色
 * @param id
 */
export function  updateRole(data) {
    return fetch({
        url: '/roles/'+data.id,
        method: 'put',
        data
    })
}
/**
 * 检测角色名称是否已存在
 * @param data
 */
export function  existRoleName(data) {
    return fetch({
        url: '/roles/name/'+data+'/exist',
        method: 'get',
    })
}


