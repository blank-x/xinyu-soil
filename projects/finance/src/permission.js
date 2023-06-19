import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getToken } from '@/utils/auth' // 验权
import tableHeight from './mixins/tableHeight'
// permissiom judge
function hasPermission(roles, permissionRoles) {
    if (roles.indexOf('admin') >= 0) return true // admin权限 直接通过
    if (roles) return true
}

// register global progress.
const whiteList = ['/login', '/authredirect','/sso/']// 不重定向白名单
router.beforeEach((to, from, next) => {
    NProgress.start() // 开启Progress
    if (getToken()) { // 判断是否有token
        if (to.path === '/login') {
            next({ path: '/' })
        } else {
            if(store.getters.roles.length === 0 && to.path !='/sso/') { // 判断当前用户是否已拉取完user_info信息
                store.dispatch('getDicListActions');
                store.dispatch('getCpInfoActions');
                store.dispatch('GetUserInfo').then(res => { // 拉取user_info
                    if(store.getters.system.id){
                        store.dispatch('GetSysRources', store.getters.system.id).then((res) => {
                            if(res.data){
                                const rolesRouterMap = res.data.items;
                                store.dispatch('GenerateRoutes', { rolesRouterMap }).then(() => { // 生成可访问的路由表
                                    router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                                    next({ ...to })
                                })
                            }
                        })

                    }
                    next({ ...to })
                })/*.catch(() => {
            store.dispatch('FedLogOut').then(() => {
              next({ path: '/login' })
            })
          })*/
                store.dispatch('GetSystem',0); //获取用户系统列表
            } else {

                if(getToken() != store.getters.token){
                    location.reload();
                }
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
                if (hasPermission(store.getters.roles, to.meta.role)) {
                    next()//
                } else {
                    next({ path: '/401', query: { noGoBack: true }})
                }
        // 可删 ↑
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next()
        } else {
            next({
                path: '/login',
            })
      //query: { redirect: to.fullPath }
            NProgress.done() // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
        }
    }
})

router.afterEach(() => {
    NProgress.done() // 结束Progress
    tableHeight.setHeight();
})
