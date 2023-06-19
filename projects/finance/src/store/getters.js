const getters = {
    sidebar: state => state.app.sidebar,
    visitedViews: state => state.app.visitedViews,
    dicList:state => state.app.dicList,
    cpInfo:state => state.app.cpInfo,
    pagination:state => state.app.pagination,
    auditCompanyDetail:state => state.app.auditCompanyDetail,
    auditCpsDetail:state=>state.app.auditCpsDetail,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    systems: state => state.user.systems,
    system: state => state.user.currentSystem,
    name: state => state.user.name,
    introduction: state => state.user.introduction,
    status: state => state.user.status,
    roles: state => state.user.roles,
    setting: state => state.user.setting,
    resource:state => state.user.resource,
    currentUser:state => state.user.currentUser,
    isDefaultPass:state => state.user.isDefaultPass,
    permission_routers: state => state.permission.routers, //动态router数据
    addRouters: state => state.permission.addRouters, //更具权限过滤之后的router
    resourcePermission:state => state.permission.resourcePermission, //资源权限
    submitLoading:state => state.progress.submitLoading,
}
export default getters
