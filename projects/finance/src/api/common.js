import fetch from "@/utils/fetch";
import {parseTime} from '@/utils';
import { Message } from 'element-ui';
/**
 获取字典类型列表
 @params dicName 字典类型数组
 **/
export function fetchDicList(dicName) {
    return fetch({
        url: "/dics?types=" + dicName,
        method: "get"
    });
}
/**
 获取所有字典类型列表
 **/
export function fetchAllDicList() {
    return fetch({
        url: "/dics",
        method: "get"
    });
}

/**
 * 文件导出
 * @param url
 * @param data
 * @param fileName 导出文件名称
 * @param type 导出文件类型
 **/
export function exportFileToLocation(url, data, fileName,method='post') {
    let uploadLoading = Message({
        iconClass:'el-icon-loading',
        customClass:'uploadLoading',
        message: '正在下载'+fileName+'，请稍等.......',
        duration:60000, //与超时时间一致
        type: 'success'
    });
    fetch({
        url:url,
        method: method,
        data:data,
        timeout:600000
    }).then((res)=>{
        uploadLoading.close();
        const elink = document.createElement('a')
    //elink.download = fileName+(parseTime(new Date().getTime(),'{y}{m}{d}'))+'.'+type;
        elink.style.display = 'none'
        elink.href = fetch.defaults.baseURL+res.data.items;
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
    }).catch(err=>{
        Message({
            message: '下载数据量过大，无法完成导出，请联系技术部门协助',
            duration:5000, //与超时时间一致
            type: 'warning'
        });
    })
}

/**
 * 文件导出
 * @param url
 * @param data
 * @param fileName 导出文件名称
 * @param type 导出文件类型
 **/
export function exportFile(url, data, fileName,method='post',type='xls') {
    let uploadLoading = Message({
        iconClass:'el-icon-loading',
        customClass:'uploadLoading',
        message: '正在下载'+fileName+'，请稍等.......',
        duration:6000000, //与超时时间一致
        type: 'success'
    });
    fetch({
        url:url,
        method: method,
        data:data,
        responseType:'blob',
        timeout:6000000
    }).then((res)=>{
        uploadLoading.close();
        const content = res.data
        const fileTypeLists = { 'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.ms-excel',
            'zip': 'application/x-zip-compressed',
            'rar': 'application/octet-stream',
            'pdf':'application/pdf',
            'txt': 'text/plain',
            'world':'application/msword'}
        const elink = document.createElement('a')
        elink.download = fileName+(parseTime(new Date().getTime(),'{y}{m}{d}'))+'.'+type;
        elink.style.display = 'none'
        const blob = new Blob([content], {type: fileTypeLists[type.toLowerCase()]})
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
    })
}

/**
 获取登录用户cp信息
 **/
export function fetchUserCpInfo() {
    return fetch({
        url: "/finance/logonuser/cp" ,
        method: "get"
    });
}
/**
 获取cp下的分类
 **/
export function getCpCategories(cpId) {
    return fetch({
        url: "/dics/cp/"+cpId+"/categories",
        method: "get"
    });
}
/**
 获取cp下责编
 **/
export function getCpEditors(cpId) {
    return fetch({
        url: "/dics/cp/"+cpId+"/editors",
        method: "get"
    });
}
/*
 * 通过id或者书名搜索书籍
 * */
export function searchBookFuzzy(data) {
    return fetch({
        url:'/books/fuzzy',
        method:'post',
        data
    })
}

//查询合作方列表
export function fetchPartnerList(query) {
    return fetch({
        url: process.env.CONTENT_API+'/partners/names',
        method: 'get',
        params: query
    })
}

// 根据id搜索书本信息
export function searchBookInfoById(id) {
    return fetch({
        url: process.env.CONTENT_API+'/books/'+id+'/book_author',
        method: 'get'
    })
}

// 充值通道查询列表
export function getChannelTopupList() {
    return fetch({
        url: '/channel_topup/items',
        method: 'get'
    })
}

//查询外购合作方列表
export function fetchPartnerOutsourcingList() {
    return fetch({
        url: process.env.CONTENT_API+'/partners_outsourcing/names',
        method: 'get',
    })
}

// 获取公司列表  该列表下有对应公司的cp 以及 合作方式
export function fetchAuditCompanyDetail() {
    return fetch({
        url: '/audit/companys/detail',
        method: 'get',
    })
}

// 获取cp列表   该列表下有对应公司的合作方式 ，稿费类型
export function fetchAuditCpsDetail() {
    return fetch({
        url: '/audit/cps/detail',
        method: 'get',
    })
}

// 获取责编列表，获取到的数据在后台已根据权限做过筛选
export function fetchEditorList() {
    return fetch({
        url: '/audit/editors',
        method: 'get',
    })
}