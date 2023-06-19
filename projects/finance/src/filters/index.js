// import accounting from 'accounting'
import {createCrossPlatformUrl} from '@/utils/crossPlatform'
var runtime = require('art-template/lib/runtime');
runtime.createPeopleLink = function(value){
    return createPeopleLink(value)
};
runtime.createToBooKUrl = function(value){
    return createToBooKUrl(value)
};
runtime.createBookLink = function(value){
    return createBookLink(value)
};
runtime.createCopyrightUrl = function(value){
    return createCopyrightUrl(value)
};
runtime.monthFilter = function(value){
    return MonthsFilter(value)
};
runtime.authorInfoFilter = function(value){
    return authorInfo(value)
};

function pluralize(time, label) {
    if (time === 1) {
        return time + label
    }
    return time + label + 's'
}
export function timeAgo(time) {
    const between = Date.now() / 1000 - Number(time)
    if (between < 3600) {
        return pluralize(~~(between / 60), ' minute')
    } else if (between < 86400) {
        return pluralize(~~(between / 3600), ' hour')
    } else {
        return pluralize(~~(between / 86400), ' day')
    }
}

export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }

    if ((time + '').length === 10) {
        time = +time * 1000
    }

    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        date = new Date(parseInt(time))
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

export function formatTime(time, option) {
    time = +time * 1000
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d) / 1000

    if (diff < 30) {
        return '刚刚'
    } else if (diff < 3600) { // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
        return '1天前'
    }
    if (option) {
        return parseTime(time, option)
    } else {
        return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
    }
}

/* 数字 格式化*/
export function nFormatter(num, digits) {
    const si = [
        { value: 1E18, symbol: 'E' },
        { value: 1E15, symbol: 'P' },
        { value: 1E12, symbol: 'T' },
        { value: 1E9, symbol: 'G' },
        { value: 1E6, symbol: 'M' },
        { value: 1E3, symbol: 'k' }
    ]
    for (let i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
        }
    }
    return num.toString()
}

export function html2Text(val) {
    const div = document.createElement('div')
    div.innerHTML = val
    return div.textContent || div.innerText
}

export function toThousandslsFilter(num) {
    return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function createBookLink(bookID){
    return process.env.PAGE_CONFIG.WEBSITE_URL+process.env.PAGE_CONFIG.BOOK_PATH+bookID;
}

export function createPeopleLink(authorID){
    return process.env.PAGE_CONFIG.WEBSITE_URL+process.env.PAGE_CONFIG.PEOPLE_PATH+authorID;
}


// 旧版管理后台作者地址
export function createManagePeopleLink(authorID){
    return "javaScript:showDialog();"/*process.env.PAGE_CONFIG.WEBSITE_URL+process.env.PAGE_CONFIG.MANAGE_PEOPLE_PATH+authorID;*/
}
//字数转化
export function words_Filter(value){
    if (value > 9999) {
        let words = ''
        words = value / 10000 + "w"
        return words
    }
    return value
}

/*摘要缩略*/
export function briefFilter(value){
    if(value){
        if( value.length>28){
            return value.substr(0,24)+'...'
        }else if(value.length>0 && value.length<=28){
            return value
        }
    }else{
        return '------'
    }
}
/*N字后换行*/
export function lineBreak(value,num){
    if(value.length > num){
        return value.replace(/[^\x00-\xff]/g,"$&\x01").replace(/.{10}\x01?/g,"$&\n").replace(/\x01/g,"")
    }else {
        return num;
    }
}

/*货币转换*/
export function currency(value, symbol="", precision="2"){
  /*var options = {
    symbol : "$",
    precision : 2,
   decimal : ".",
    thousand: ",",
    format: "%s%v"
  };*/
    return accounting.formatMoney(value,symbol,precision)
}
//月份
export function MonthsFilter(value){

    if (value && (value.length < 7)) {

        let before=value.substring(0,4)
        let after=value.substring(4)
        value = before+'-'+after
        return value
    }else{
        return value
    }

}
export function createToBooKUrl(value){
    return createCrossPlatformUrl(process.env.PAGE_CONFIG.BOOKINFO_PATH,value)
}
export function createCopyrightUrl(value){
    return createCrossPlatformUrl(process.env.PAGE_CONFIG.COPYRIGHT_PATH,value)
}

export function  authorInfo(value) {
    let tempArry = [],jsonObject=value
    if(typeof value !== 'object'){
        jsonObject = JSON.parse(value);
    }
    tempArry.push('<p><label>真实姓名:</label> <span>'+jsonObject.realName+'</span></p>')
    tempArry.push('<p><label>证件类型:</label> <span>'+jsonObject.idTypeDesc || jsonObject.idTypeStr+'</span></p>')
    tempArry.push('<p><label>证件号码:</label> <span>'+jsonObject.idNo+'</span></p>')
    tempArry.push('<p><label>开户行:</label> <span title="'+jsonObject.bankBranch+'">'+jsonObject.bankBranch+'</span></p>')
    tempArry.push('<p><label>银行账号:</label> <span>'+jsonObject.bankAccount+'</span></p>')
    if(jsonObject.mobile){
        tempArry.push('<p><label>手机号码:</label> <span>'+jsonObject.mobile+'</span></p>')
    }
    return tempArry.join('');
}

/**
 * 格式化月份
 * @param value
 * @returns {*}
 */
export  function formatMonth(value){
    'use strict'
    let dateStr = value.toString();
    return parseTime(new Date(dateStr.substr(0,4),parseInt(dateStr.substr(4,2)))-1,'{yyyy}-{mm}');
}
