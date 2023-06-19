import Vue from 'vue'
import Router from 'vue-router'

const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router)

/* layout */
import Layout from '../views/layout/Layout'

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will no redirct in the levelbar
 * noDropdown : if `noDropdown:true` will has no submenu
 * meta : { finance: ['admin'] }  will control the page finance
 **/
export const constantRouterMap = [
    {path: '/login', component: _import('login/index'), hidden: true},
    {path: '/authredirect', component: _import('login/authredirect'), hidden: true},
    {path: '/404', component: _import('errorPage/404'), hidden: true},
    {path: '/401', component: _import('errorPage/401'), hidden: true},
    {path: '/manage', component: _import('manage/guide'), name: '管理后台选择', hidden: true},
    {path: '/sso', component: _import('login/sso'), hidden: true},
    {
        path: '/',
        component: Layout,
        redirect: '/manage',
        name: '首页',
        hidden: true,
        children: [{path: 'home', component: _import('home/index')}]
    }
]
export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})

export const asyncRouterMap = [
    {
        path: '/guarantee',
        name: '保底作品',
        component: Layout,
        icon: 'inbox',
        children: [
            {path: 'guaranteeManage', component: _import('guarantee/guaranteeList'), name: '保底作品列表'},
            {path: 'paymentRecord', component: _import('guarantee/paymentRecord'), name: '非保底稿费记录'},
        ]
    },
    {
        path: '/remuneration',
        name: '稿费结算审核',
        icon: 'money',
        redirect: '/remuneration/partnersAudit/partnersAuditLog',
        component: Layout,
        children: [
            {
                path: '/partnersAudit',
                component: _import('remuneration/index'),
                name: '合作方稿费审核',
                icon: 'caret-right',
                parent: '/remuneration',
                children: [{
                    path: 'partnersFirst',
                    component: _import('remuneration/partnersAudit/firstAudit'),
                    name: '合作方稿费一审'
                }, {
                    path: 'partnersSecond',
                    component: _import('remuneration/partnersAudit/secondAudit'),
                    name: '合作方稿费二审'
                }]
            },
            {
                path: '/ownAudit',
                component: _import('remuneration/index'),
                name: '自有稿费审核',
                icon: 'caret-right',
                parent: '/remuneration',
                children: [{
                    path: 'ownFirst',
                    component: _import('remuneration/ownAudit/ownFirst'),
                    name: '自有稿费一审'
                }, {
                    path: 'ownSecond',
                    component: _import('remuneration/ownAudit/ownSecond'),
                    name: '自有稿费二审'
                }]
            },
            {
                path: 'auditThird',
                component: _import('remuneration/auditThird'),
                name: '稿费三审',
                parent: '/remuneration',
            },
            {
                path: 'waitPay',
                component: _import('remuneration/waitPay'),
                name: '待兑现稿费',
                parent: '/remuneration',
            },
            {
                path: 'waitCash',
                component: _import('remuneration/waitCash'),
                name: '需兑现清单',
                parent: '/remuneration',
            },
            {
                path: 'payFailed',
                component: _import('remuneration/payFailed'),
                name: '支付失败列表',
                parent: '/remuneration',
            },
            {
                path: 'cashFail',
                component: _import('remuneration/cashFail'),
                name: '兑现失败列表',
                parent: '/remuneration',
            },
            {
                path: 'rejected',
                component: _import('remuneration/rejected'),
                name: '不予支付列表',
                parent: '/remuneration',
            },

            {
                path: 'checkFailed',
                component: _import('remuneration/checkFailed'),
                name: '作者校验失败记录',
                parent: '/remuneration',
            },
            {
                path: 'auditLog',
                component: _import('remuneration/auditLog'),
                name: '稿费审核日志',
                parent: '/remuneration',
            },
            {
                path: 'cashListLog',
                component: _import('remuneration/cashListLog'),
                name: '兑现清单日志',
                parent: '/remuneration',

            },
            {
                path: 'cashDetail/:dealMonth/:id',
                component: _import('remuneration/cashDetail'),
                name: '稿费明细',
                parent: '/remuneration',
                hidden: true
            },
            {
                path: 'rewardMonthDetail/:bookId/:dealMonth',
                component: _import('remuneration/rewardMonthDetail'),
                name: '作品每月打赏明细',
                parent: '/remuneration',
                hidden: true
            },
            {
                path: 'fulltteAndance/:id',
                component: _import('remuneration/fulltteAndance'),
                name: '查看全勤明细',
                parent: '/remuneration',
                hidden: true
            },
            {
                path: 'fulltteAndanceMonth/:bookId/:dealMonth/:info',
                component: _import('remuneration/fulltteAndanceMonth'),
                name: '每月全勤明细',
                parent: '/remuneration',
                hidden: true
            },

        ]
    },
    {
        path: '/settlement',
        name: '结算管理',
        icon: 'calculator',
        component: Layout,
        children: [
            {
                path: 'royaltiesCount',
                component: _import('settlement/royaltiesList'),
                name: '计算稿费',
                meta: {type: '1'}
            },
            {
                path: 'royaltiesReturn',
                component: _import('settlement/royaltiesList'),
                name: '重算稿费',
                meta: {type: '-1'}
            },
            {
                path: 'royaltiesCash',
                component: _import('settlement/royaltiesList'),
                name: '兑现稿费',
                meta: {type: '2'}
            },
            {
                path: 'royaltiesNew_cash',
                component: _import('settlement/royaltiesList'),
                name: '重新兑现',
                meta: {type: '-2'}
            },
            {path: 'viewDetails/:id', component: _import('settlement/viewDetails'), name: '查看详情', hidden:true},
            {path: 'royaltiesSearch', component: _import('settlement/royaltiesSearch'), name: '稿费记录查询'},
        ]
    },
    {
        path: '/finance',
        name: '财务管理',
        icon: 'folder-open',
        component: Layout,
        children: [
            {path: 'monthRankList', component: _import('finance/monthRankList'), name: '月度榜单排行'},
            {path: 'feePaymentRecords', component: _import('finance/feePayment/feePaymentRecords'), name: '稿费支付记录'},
            {
                path: 'monthFeePaymentDetaile/:month/:company',
                component: _import('finance/feePayment/monthFeePaymentDetaile'),
                name: '月度稿费支付明细',
                hidden: true,
            },
            {
                path: 'signFeePaymentDetaile/:createMonth/:company/:realName/:id',
                component: _import('finance/feePayment/signFeePaymentDetaile'),
                name: '稿费支付明细',
                hidden: true
            },
            {path: 'channelRecharge', component: _import('finance/channelRecharge'), name: '渠道充值查看'},
            {
                path: 'channelRechargeDetaile/:month/:type',
                component: _import('finance/channelRechargeDetaile'),
                name: '充值明细',
                hidden: true,
                meta: {dynamic: 'month'}
            },
            {path: 'buyoutShareList', component: _import('finance/buyoutShareList'), name: '买断分摊列表'},
            {path: 'buyoutShareItem/:bookId', component: _import('finance/buyoutShareItem'), name: '买断分摊明细',hidden: true},
            {path: 'contractAuthor', component: _import('finance/contractAuthor'), name: '签约作者列表'},
            {path: 'donatesStatistisList', component: _import('finance/donates/donatesStatistisList'), name: '打赏记录'},
            {path: 'donatesMonthList/:month', component: _import('finance/donates/donatesMonthList'), name: '月度打赏记录',hidden: true},
            {path: 'donatesItem/:donateDay/:bookName/:bookId', component: _import('finance/donates/donatesItem'), name: '打赏明细',hidden: true},
            {path: 'partnerPayLog', component: _import('finance/partnerPayLog'), name: '合作方稿费记录'},
            {path: 'purchaseConsumption', component: _import('finance/purchaseConsumption'), name: '外购作品消费记录'},
            {path: 'donatesItem', component: _import('finance/donates/donatesItem'), name: '作品天数打赏记录', hidden: true},
        ]
    },
    {path: '*', redirect: '/404', hidden: true}
]

