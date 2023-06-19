
 
import accounting from 'accounting'

export function createUniqueString() {
    const timestamp = +new Date() + ''
    const randomNum = parseInt((1 + Math.random()) * 65536) + ''
    return (+(randomNum + timestamp)).toString(32)
}


 

export function parseTime (time, cFormat) {
    if (arguments.length === 0) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if (('' + time).length === 10) time = parseInt(time) * 1000
      date = new Date(time)
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
  
  export function formatTime (time, option) {
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
  
  // 格式化时间
  export function getQueryObject (url) {
    url = url == null ? window.location.href : url
    const search = url.substring(url.lastIndexOf('?') + 1)
    const obj = {}
    const reg = /([^?&=]+)=([^?&=]*)/g
    search.replace(reg, (rs, $1, $2) => {
      const name = decodeURIComponent($1)
      let val = decodeURIComponent($2)
      val = String(val)
      obj[name] = val
      return rs
    })
    return obj
  }
  
  /**
   *get getByteLen
   * @param {Sting} val input value
   * @returns {number} output valuea
   */
  export function getByteLen (val) {
    let len = 0
    for (let i = 0; i < val.length; i++) {
      if (val[i].match(/[^\x00-\xff]/ig) != null) {
        len += 1
      } else {
        len += 0.5
      }
    }
    return Math.floor(len)
  }
  
  export function cleanArray (actual) {
    const newArray = []
    for (let i = 0; i < actual.length; i++) {
      if (actual[i]) {
        newArray.push(actual[i])
      }
    }
    return newArray
  }
  
  export function param (json) {
    if (!json) return ''
    return cleanArray(Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' +
        encodeURIComponent(json[key])
    })).join('&')
  }
  
  export function param2Obj (url) {
    const search = url.split('?')[1]
    if (!search) {
      return {}
    }
    return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
  }
  
  export function html2Text (val) {
    const div = document.createElement('div')
    div.innerHTML = val
    return div.textContent || div.innerText
  }
  
  export function objectMerge (target, source) {
    /* Merges two  objects,
     giving the last one precedence */
  
    if (typeof target !== 'object') {
      target = {}
    }
    if (Array.isArray(source)) {
      return source.slice()
    }
    for (const property in source) {
      if (source.hasOwnProperty(property)) {
        const sourceProperty = source[property]
        if (typeof sourceProperty === 'object') {
          target[property] = objectMerge(target[property], sourceProperty)
          continue
        }
        target[property] = sourceProperty
      }
    }
    return target
  }
  
  export function scrollTo (element, to, duration) {
    if (duration <= 0) return
    const difference = to - element.scrollTop
    const perTick = difference / duration * 10
    setTimeout(() => {
      console.log(new Date())
      element.scrollTop = element.scrollTop + perTick
      if (element.scrollTop === to) return
      scrollTo(element, to, duration - 10)
    }, 10)
  }
  
  export function toggleClass (element, className) {
    if (!element || !className) {
      return
    }
    let classString = element.className
    const nameIndex = classString.indexOf(className)
    if (nameIndex === -1) {
      classString += '' + className
    } else {
      classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
    }
    element.className = classString
  }
  
  export const pickerOptions = [
    {
      text: '今天',
      onClick(picker) {
        const end = new Date()
        const start = new Date(new Date().toDateString())
        end.setTime(start.getTime())
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近一周',
      onClick(picker) {
        const end = new Date(new Date().toDateString())
        const start = new Date()
        start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date(new Date().toDateString())
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date(new Date().toDateString())
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      }
    }]
  
  export function getTime (type) {
    if (type === 'start') {
      return new Date().getTime() - 3600 * 1000 * 24 * 90
    } else {
      return new Date(new Date().toDateString())
    }
  }
  
  export function debounce (func, wait, immediate) {
    let timeout, args, context, timestamp, result
  
    const later = function () {
      // 据上一次触发时间间隔
      const last = +new Date() - timestamp
  
      // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last)
      } else {
        timeout = null
        // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
        if (!immediate) {
          result = func.apply(context, args)
          if (!timeout) context = args = null
        }
      }
    }
  
    return function (...args) {
      context = this
      timestamp = +new Date()
      const callNow = immediate && !timeout
      // 如果延时不存在，重新设定延时
      if (!timeout) timeout = setTimeout(later, wait)
      if (callNow) {
        result = func.apply(context, args)
        context = args = null
      }
  
      return result
    }
  }
  
  export function deepClone (source) {
    if (!source && typeof source !== 'object') {
      throw new Error('error arguments', 'shallowClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    for (const keys in source) {
      if (source.hasOwnProperty(keys)) {
        if (source[keys] && typeof source[keys] === 'object') {
          targetObj[keys] = source[keys].constructor === Array ? [] : {}
          targetObj[keys] = deepClone(source[keys])
        } else {
          targetObj[keys] = source[keys]
        }
      }
    }
    return targetObj
  }
  
  /**
   * 递归树
   * @param data
   * @param pid
   * @returns {Array}
   */
  export function sonsTree (data, pid) {
    var result = [], temp
    for (var i in data) {
      if (data[i].parentId == pid) {
        result.push(data[i])
        temp = sonsTree(data, data[i].id)
        if (temp.length > 0) {
          data[i].children = temp
        }
      }
    }
    return result
  }
  
   
  
  /**
   * 比较对象差异
   * @param obj1  object array
   * @param obj2  object array
   * @returns true 有差异   false  没有差异
   */
  function type (o) {
    var s = Object.prototype.toString.call(o)
    return s.slice(s.indexOf(' ') + 1, s.length - 1).toLowerCase()
  }
  
  export function compareSimpleObject (origin, target) {
    if (typeof target === 'object' && target != null) {
      if (typeof origin !== 'object' && origin == null) return false
      let tempObject = Object.keys(origin).length > Object.keys(target).length ? Object.keys(origin) : Object.keys(target)
      for (let key of tempObject)
        if (!compareSimpleObject(origin[key], target[key])) return false
      return true
  
    } else return origin === target
  }
  /**
   * 获取地址栏参数
   * @param name
   * @returns {null}
   */
  export function getQueryString (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.href.match(reg)
    if (r != null)return unescape(r[2])
    return null
  }
  
  /**
   * 获取当前月份的上个月
   * @returns {string|*}
   */
  export function getLastMonthYestdy () {
    var date = new Date()
    var daysInMonth = new Array([0], [31], [28], [31], [30], [31], [30], [31], [31], [30], [31], [30], [31])
    var strYear = date.getFullYear()
    var strDay = date.getDate()
    var strMonth = date.getMonth() + 1
    if (strYear % 4 == 0 && strYear % 100 != 0) {
      daysInMonth[2] = 29
    }
    if (strMonth - 1 == 0) {
      strYear -= 1
      strMonth = 12
    }
    else {
      strMonth -= 1
    }
    strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth]
    if (strMonth < 10) {
      strMonth = '0' + strMonth
    }
    if (strDay < 10) {
      strDay = '0' + strDay
    }
    return strYear + strMonth
  }
   
  
  /**
   * 获取当前年的第一月份
   * return string eg 201801
   */
  export function getFirstMonth() {
    var myDate = new Date();
   let strYear = myDate.getFullYear()
   return strYear + "01"
  }
  
  /**
   * 获取当前月份
   * return string eg 201803
   */
  export function getCurrentMonth() {
    var myDate = new Date();
    let strYear = myDate.getFullYear();
    let strMonth = myDate.getMonth()+1;
    if (strMonth < 10) {
      strMonth = '0' + strMonth
    }
    return strYear + (strMonth.toString())
  }
  
  
  export function get3MonthBefor(){
    var resultDate,year,month
    var currDate = new Date();
    year = currDate.getFullYear();
    month = currDate.getMonth()+1;
    switch(month)
    {
      case 1:
      case 2:
      case 3:
        month += 9;
        year--;
        break;
      default:
        month -= 3;
        break;
    }
    month = (month < 10) ? ('0' + month) : month;
    resultDate = year + month.toString();
    return resultDate;
  }
  //精度加法
  export function accAdd(arg1,arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2))
    return ((arg1*m+arg2*m)/m).toFixed(2)
  }
  
  //获取某月的第一天
  export function getMonthStartDate(nowYear,nowMonth){
    let monthStartDate = new Date(parseInt(nowYear), parseInt(nowMonth)-1);
    return parseTime(monthStartDate,'{y}-{m}-{d}');
  }
  
  //获取某月的最后一天
  export function getMonthEndDate(nowYear,nowMonth){
    let monthEndDate = new Date(parseInt(nowYear), parseInt(nowMonth)-1, getMonthDays(parseInt(nowYear),parseInt(nowMonth)-1));
    return parseTime(monthEndDate,'{y}-{m}-{d}');
  }
  
  //获得某月的天数
  export  function getMonthDays(nowYear,myMonth){
    let monthStartDate = new Date(nowYear, myMonth, 1);
    let monthEndDate = new Date(nowYear, myMonth+1, 1);
    let days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
    return days;
  }
  
  export function GMTToStr(time){
    let date = new Date(time)
    let Str=date.getFullYear() + '-' +
      (date.getMonth() + 1) + '-' +
      date.getDate() + ' ';
      return Str
  }
  
  // 获取dom样式
  export function getStyle(obj,sName){
      return (obj.currentStyle||getComputedStyle(obj,false))[sName];
  }
  /**
 * @param {Sting} url
 * @param {Sting} title
 * @param {Number} w
 * @param {Number} h
 */

export default function openWindow(url, title, w, h) {
    // Fixes dual-screen position                         Most browsers      Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

  const left = ((width / 2) - (w / 2)) + dualScreenLeft
  const top = ((height / 2) - (h / 2)) + dualScreenTop
  const newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

// Puts focus on the newWindow
  if (window.focus) {
      newWindow.focus()
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
 



export function html2Text(val) {
    const div = document.createElement('div')
    div.innerHTML = val
    return div.textContent || div.innerText
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

 

 