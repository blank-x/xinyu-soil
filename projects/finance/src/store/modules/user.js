import { loginByUsername, logout, getUserInfo, getCaptcha,getSystems,getSystemResource} from '@/api/login'
import { getToken, setToken, removeToken,checkDisguisePwd,setSystem,getSystem} from '@/utils/auth'
import Cookies from 'js-cookie'
const user = {
    state: {
        user: '',
        status: '',
        code: '',
        token: getToken(),
        name: '',
        avatar: '',
        introduction: '',
        roles: [],
        setting: {
            articlePlatform: []
        },
        captcha:'',
        systems:[],
        resources:[],
        currentUser:{},
        currentSystem: getSystem() ? getSystem() : {},
        isDefaultPass:false
    },
    mutations: {
        SET_CODE: (state, code) => {
            state.code = code
        },
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_INTRODUCTION: (state, introduction) => {
            state.introduction = introduction
        },
        SET_SETTING: (state, setting) => {
            state.setting = setting
        },
        SET_STATUS: (state, status) => {
            state.status = status
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_CAPTCHA:(state,captcha) =>{
            state.captcha = captcha
        },
        SET_SYSTEM:(state,system)=>{
            state.systems = system
        },
        SET_RESOURCE:(state,resource)=>{
            'use strict'   //    /logonuser/systems/{id}/resources
            state.resources = resource
        },
        SETSET_USER:(state,resource)=>{
            'use strict'   //    /logonuser/systems/{id}/resources
            state.currentUser = resource
        },
        SET_CURRENTSYSYTEM: (state, data) => {
            state.currentSystem = data;
        },
        SET_DEFAULTPASS:(state,data)=>{
            'use strict'
            state.isDefaultPass = data;
        }
    },
    actions: {
    // 用户名登录
        LoginByUsername({ commit }, userInfo) {
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                loginByUsername(username, userInfo.password,userInfo.code).then(response => {
                    const data = response.data;
                    if(data.items ===  true){
                        setToken(data.header['_s_u_i_d'])
                        commit('SET_TOKEN', data.header['_s_u_i_d'])
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
    // 获取用户信息
        GetUserInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getUserInfo().then(response => {
                    const data = response.data;
                    commit('SETSET_USER', data.items)
                    commit('SET_ROLES', !data.items.roles?['admin']:data.items.roles)
                    commit('SET_NAME', data.items.realName)
                    commit('SET_AVATAR', 'https://img2.bosszhipin.com/boss/avatar/avatar_14.png')
                    commit('SET_INTRODUCTION', data.items.realName)
                    commit('SET_DEFAULTPASS', checkDisguisePwd(data.items.disguisePwd))
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
    //获取验证码
        GetCaptCha({commit,state}){
            return new Promise((resolve, reject) => {
                getCaptcha().then(response =>{
                    commit('SET_CAPTCHA', response.data)
                })
            })
        },
        GetSystem({commit,state},systemID){
            return new Promise((resolve, reject) => {
                getSystems().then(response =>{
                    commit('SET_SYSTEM', response.data.items)
                    if(systemID!=0){
                        for (let i of response.data.items){
                            if(i.id == systemID){
                                setSystem(JSON.stringify(i))
                                commit('SET_CURRENTSYSYTEM', i)
                            }
                        }
                    }
                })
            })
        },
        GetSysRources({ commit },systemID){
            return new Promise((resolve, reject) => {
                getSystemResource(systemID).then(response => {
                    const data = response.data;
          /* if(data.status ===  200){
           setToken(data.header['_s_u_i_d'])
           commit('SET_TOKEN', data.header['_s_u_i_d'])
           }*/
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })

        },
    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

    // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        },

    // 动态修改权限
        ChangeRole({ commit }, token) {
            return new Promise(resolve => {
                commit('SET_TOKEN', token)
                setToken(token)
                getUserInfo(token).then(response => {
                    const data = response.data
                    commit('SET_ROLES', data.role)
                    commit('SET_NAME', data.name)
                    commit('SET_AVATAR', data.avatar)
                    commit('SET_INTRODUCTION', data.introduction)
                    resolve()
                })
            })
        },
        setCurrentSystem({commit, state}, data) {
            return new Promise((resolve) => {
                setSystem(JSON.stringify(data));
                commit('SET_CURRENTSYSYTEM', data)
            })
        },
        setDefaultPass({commit, state}, data) {
            commit('SET_DEFAULTPASS', data)
        },
    }
}
export default user