import { asyncRouterMap, constantRouterMap } from '@/router'
import Cookies from 'js-cookie'
import {getSystem} from '@/utils/auth'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(hashMenus, route) {
    return  hashMenus[route.path] || hashMenus['/'+route.path] || route.path == "*" ;
}
function  hasTcPermission(route) {
    return getSystem().id == 4 && route.path=='/permissionTest'
}
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param rolesRouterMap
 */
function filterAsyncRouter(asyncRouterMap, rolesRouterMap) {
    let hashMenus = {};
    let setMenu2Hash = function(array, base) {
        array.map(key => {
      //获取非按钮级资源
            if (key.path && key.type < 4) {
                let hashKey = ((base ? base + '/' : '') + key.path).replace(/^\//, '');
                hashMenus['/' + hashKey] = true;
            }
        });
    };
    if(Array.isArray(rolesRouterMap)){
        setMenu2Hash(rolesRouterMap);
    }
    const accessedRouters = asyncRouterMap.filter(route => {
        if (hasPermission(hashMenus, route) || hasTcPermission(route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, rolesRouterMap)
            }
            return true
        }
        return false
    })
    return accessedRouters
}

const permission = {
    state: {
        routers: constantRouterMap, //初始化路由 例如:登录, 404,
        addRouters: [], //动态路由,
        resourcePermission:[],//资源权限 例如按钮权限控制
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers
            state.routers = constantRouterMap.concat(routers)
        },
        SET_PERMISSION:(state,permission)=>{
            if(permission && typeof permission != 'undefined' ){
                let resourcePermission = {};
                let filterPermission = permission.filter(i=>{return i.type>3}) //过滤状态为4的按钮级列表
                if (Array.isArray(filterPermission)) {
                    filterPermission.forEach(function(e, i) {
                        let key = e.httpMethod.toLowerCase() + ',' + e.path;
                        resourcePermission[key] = true;
                    });
                }
                state.resourcePermission = resourcePermission;
            }
        }
    },
    actions: {
        GenerateRoutes({ commit }, data) {
            return new Promise(resolve => {
                const { rolesRouterMap } = data
                let accessedRouters
                accessedRouters = filterAsyncRouter(asyncRouterMap, rolesRouterMap)
                commit('SET_ROUTERS', accessedRouters);
                commit('SET_PERMISSION', rolesRouterMap);
                resolve()
            })
        }
    }
}

export default permission
