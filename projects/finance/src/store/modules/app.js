import Cookies from 'js-cookie'
import {fetchAllDicList, fetchUserCpInfo, fetchAuditCompanyDetail, fetchAuditCpsDetail,fetchEditorList} from '@/api/common'

const app = {
    state: {
        sidebar: {
            opened: Cookies.get('sidebarStatus') ? !+Cookies.get('sidebarStatus') : !(window.innerWidth < 1366)
        },
        visitedViews: [],
        dicList: [],
        cpInfo: [],
        pagination: {
            pageSize: parseInt(Cookies.get('pageSize')) || 40
        },
        tableMaxHeight: 0,
        auditCompanyDetail:[],
        auditCpsDetail:[],
        editorList:[]
    },
    mutations: {
        SET_DICLIST: (state, lists) => {
            state.dicList = lists;
        },
        SET_CPINFO: (state, lists) => {
            state.cpInfo = lists;
        },
        TOGGLE_SIDEBAR: state => {
            if (state.sidebar.opened) {
                Cookies.set('sidebarStatus', 1)
            } else {
                Cookies.set('sidebarStatus', 0)
            }
            state.sidebar.opened = !state.sidebar.opened
        },
        ADD_VISITED_VIEWS: (state, view) => {
            if(!view) return;
            if (state.visitedViews.some(v => v.key === (view.matched ? view.matched[view.matched.length - 1].path : view.path))) return
            // 首页不显示在快捷栏
            if (view.name === '首页') return
            state.visitedViews.push({
                name: view.name,
                path: view.path,
                key: view.matched ? view.matched[view.matched.length - 1].path : view.path,
                meta: view.meta
            })
        },
        DEL_VISITED_VIEWS: (state, view) => {
            let index
            for (const [i, v] of state.visitedViews.entries()) {
                if (v.key === view.key) {
                    index = i
                    break
                }
            }
            state.visitedViews.splice(index, 1)
        },
        CLEAR_VISITED_VIEWS: (state) => {
            state.visitedViews = []
        },
        SET_MAXHEIGHT: (state, height) => {
            state.tableMaxHeight = height
        },
        SET_PAGESIZE: (state, data) => {
            state.pagination.pageSize = data;
            Cookies.set('pageSize', data)
        },
        SET_AUDITCOMPANYDETAIL: (state, data) => {
            let temp = data
            let json = {
                payTypeId:'value',
                payTypeDesc:'text',
                cpId:'value',
                cpName:'text',
                payLogTypeId:'value',
                payLogTypeDesc:'text',
                companyId:'value',
                companyName:'text'
            }
            temp.forEach(item=>{
                for(let key in item){
                    if(json[key]){
                        item[json[key]] = item[key]
                    }

                    if(typeof item[key] === 'object'){
                        item[key].forEach(item1=>{
                            for(let key1 in item1){
                                if(json[key1]){
                                    item1[json[key1]] = item1[key1]
                                }
                            }
                        })
                    }
                }
            })

            state.auditCompanyDetail = temp
        },
        SET_AUDITCPSDETAIL:(state,data)=>{

            let temp = data
            let json = {
                payTypeId:'value',
                payTypeDesc:'text',
                cpId:'value',
                cpName:'text',
                payLogTypeId:'value',
                payLogTypeDesc:'text',
                companyId:'value',
                companyName:'text',

            }
            temp.forEach(item=>{
                for(let key in item){
                    if(json[key]){
                        item[json[key]] = item[key]
                    }

                    if(typeof item[key] === 'object'){

                        if(item[key].length){
                            item[key].forEach(item1=>{
                                for(let key1 in item1){
                                    if(json[key1]){
                                        item1[json[key1]] = item1[key1]
                                    }
                                }
                            })
                        }else{
                            for(let key2 in item[key]){
                                if(json[key2]){
                                    item[key][json[key2]] = item[key][key2]
                                }
                            }
                        }

                    }
                }
            })

            state.auditCpsDetail = temp
        },
        // 保存 责编列表
        SET_EDITORLIST:(state,data)=>{
            state.editorList = data
        }
    },

    actions: {
        getDicListActions({commit}) {
            return new Promise((resolve, reject) => {
                fetchAllDicList().then(response => {
                    const data = response.data;
                    if (data.status === 200) {
                        commit('SET_DICLIST', data.items);
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getCpInfoActions({commit}) {
            return new Promise((resolve, reject) => {
                fetchUserCpInfo().then(response => {
                    const data = response.data;
                    if (data.status === 200) {
                        commit('SET_CPINFO', data.items);
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        ToggleSideBar({commit}) {
            commit('TOGGLE_SIDEBAR')
        },
        addVisitedViews({commit}, view) {
            commit('ADD_VISITED_VIEWS', view)
        },
        delVisitedViews({commit, state}, view) {
            return new Promise((resolve) => {
                commit('DEL_VISITED_VIEWS', view)
                resolve([...state.visitedViews])
            })
        },
        clearVisitedViews({commit}) {
            commit('CLEAR_VISITED_VIEWS')
        },
        setPageSize({commit, state}, data) {
            commit('SET_PAGESIZE', data)
        },
        setMaxHeight({commit}, height) {
            // 异步改变maxHeight
            setTimeout(()=>{
                commit('SET_MAXHEIGHT', height)
            },0)
        },
        // 获取公司列表  该列表下有对应公司的cp 以及 合作方式
        getAuditCompanyDetail({commit, state}) {
            if(state.auditCompanyDetail.length ===0){
                return fetchAuditCompanyDetail().then(response=>{
                    commit('SET_AUDITCOMPANYDETAIL',response.data.items)
                    return response.data.items
                })
            }else{
                return new Promise((resolve ,reject)=>{
                    resolve(state.auditCompanyDetail)
                })
            }
        },
        // 获取cp列表   该列表下有对应公司的合作方式 ，稿费类型
        getAuditCpsDetail({commit, state}) {
            if(state.auditCpsDetail.length ===0){
                return fetchAuditCpsDetail().then(response=>{
                    commit('SET_AUDITCPSDETAIL',response.data.items)
                    return response.data.items
                })
            }else{
                return new Promise((resolve ,reject)=>{
                    resolve(state.auditCpsDetail)
                })
            }
        },
        // 获取责编列表
        getEditorList({commit,state}){
            if(state.editorList.length ===0){
                return fetchEditorList().then(response=>{
                    commit('SET_EDITORLIST',response.data.items)
                    return response.data.items
                })
            }else{
                return new Promise((resolve ,reject)=>{
                    resolve(state.editorList)
                })
            }
        }

    }
}
export default app
