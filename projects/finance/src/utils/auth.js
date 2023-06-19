import Cookies from 'js-cookie'

const TokenKey = '_s_u_i_d'
const rememberKey = '_r_u'
const currentSysKey = '_c_s_f' //区分不同子系統

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function  setRemeberUser(user) {
    return Cookies.set(rememberKey, user)
}

export function  getRemeberUser() {
    return Cookies.getJSON(rememberKey)
}

export function  removeRemeberUser() {
    return Cookies.remove(rememberKey)
}
export function  checkDisguisePwd(pwd) {
    return pwd.substr(Math.floor(pwd.length /2),1)== "T"
}
export function  setSystem(system) {
    return Cookies.set(currentSysKey, system)
}
export function getSystem() {
    return Cookies.getJSON(currentSysKey)
}