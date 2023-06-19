import Mock from 'mockjs'
import loginAPI from './login'
import financeAPI from './finance'
import contractAPI from './contract'
import partnersAPI from './partners'
import remoteSearchAPI from './remoteSearch'
import manageAPI from './manage'
Mock.setup({
    timeout: '350-600'
})

// 登录相关
Mock.mock(/\/user\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

//选择后台
Mock.mock(/\/manage\/guide/, 'get', manageAPI.manageGuide)

// 财务相关
Mock.mock(/\/finance\/list/, 'get', financeAPI.getMothRankList)
Mock.mock(/\/finance\/FeePayMentlist/, 'get', financeAPI.getFeePayMentlist)

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

// 合同 权利相关
Mock.mock(/\/contract\/list/, 'get', contractAPI.getList)

// 合作方相关
// =Mock.mock(/\/partners\/idAndName/,'get',partnersAPI.getNameList)
// Mock.mock(/\/partners\/queries/,'get',partnersAPI.getParterDetailList)
export default Mock
