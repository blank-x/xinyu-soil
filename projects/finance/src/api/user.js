/**
 * Created by zhengqiang.liu on 2017/11/9.
 * 用户管理相关接口
 */
import fetch from '@/utils/fetchAuth'

/*
 获取系统用户列表
 */
export function fetchUserList(data) {
    return fetch({
        url: '/users/queries',
        method: 'post',
        data
    })
}

/*
 多条件分页查询用户-角色分配列表
 */
export function fetchUserRoleList(data) {
    return fetch({
        url: '/user_roles/queries',
        method: 'post',
        data
    })
}

/**
 * 根据id查看用户-角色分配信息
 * @param query
 */
export function fetchRoleAllotList(id) {
    return fetch({
        url: '/user_roles/'+id,
        method: 'get',
    })
}


/**
 * 添加
 * @param query
 */
export function createUsersShow(query) {
    return fetch({
        url: '/users',
        method: 'post',
        data: query
    })
}

/**
 * 修改
 * @param query
 */
export function updateUsersShow(query) {
    return fetch({
        url: '/users/'+query.id,
        method: 'put',
        data: query.params
    })
}


/**
 * 删除
 * @param id
 */
export function deleteUsersShow(id) {
    return fetch({
        url: '/users/'+id,
        method: 'delete',
    })
}
/**
 * 状态恢复
 * @param id
 */
export function updateUserStatus(id) {
    return fetch({
        url: '/users/'+id+'/recover',
        method: 'put',
    })
}

/**
 * 根据用户ID 获取角色列表
 * @param id
 */
export function getUserRoleById(id) {
    return fetch({
        url: 'users/'+id+'/roles',
        method: 'get',
    })
}

/**
 * 保存用户角色
 * @param id
 */
export function saveUserRole(data) {
    return fetch({
        url: 'user_roles',
        method: 'post',
        data
    })
}

/**
 * 删除用户角色
 * @param id
 */
export function deleteUserRole(id) {
    return fetch({
        url: '/user_roles/'+id,
        method: 'delete',
    })
}
/**
 * 删除用户角色
 * @param id
 */
export function validateExistEmail(email) {
    return fetch({
        url: '/users/email/'+email+'/exist',
        method: 'get',
    })
}
