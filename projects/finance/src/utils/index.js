/**
 * Created by motie on 17/11/08.
 */

export function convertDic (list, type) {
  let targetDicList = []
  for (let obj in list) {
    if (list[obj].type === type) {
      targetDicList = list[obj].dicObjList
    }
  }
  return targetDicList
}

/**
 * 获取用户cp数据字典
 * @param dicLists 数组字典list
 * @param dicId 5 cp 对应type
 * @param cpInfo 当前cp 信息
 * @returns {*}
 */
export function getCpInfo (dicLists, dicType, cpId) {
  let tempList = []
  let dicList = convertDic(dicLists, dicType)
  if (cpId.length == 0 || dicLists.length == 0) return

  if (cpId !== 0) {
    for (let i = 0; i < dicList.length; i++) {
      // 全部选项不过滤
      if(dicList[i].value === 0){
          tempList.push(dicList[i])
      }
      if (cpId == dicList[i].value) {
        tempList.push(dicList[i])
      }
    }
    if (tempList.length > 0) {
      return tempList
    }
  }
  return dicList
}
/**
 * 获取用户对应公司
 * @param dicLists 数组字典list
 * @param dicType 27 company 对应type
 * @param cpId 当前cpId
 * @returns {*}
 */
export function getCompany (dicLists, dicType, cpId) {
  let tempList = []
  let dicList = convertDic(dicLists, dicType)
  console.log(cpId);
    if (cpId !== 0) {
    for (let i = 0; i < dicList.length; i++) {
      if(cpId && [4,6].indexOf(cpId)<0){
        tempList.push(dicList[1])
        break
      }
      else if(cpId == 4){
        tempList.push(dicList[2]);
        break
      }
      else if(cpId == 6){
        tempList.push(dicList[3]);
        break
      }
      //磨铁，墨墨, 锦文，图书都归属到数盟
      else if (cpId == dicList[i].value) {
        tempList.push(dicList[i]);
        break
      }
    }
    return tempList;
  }else{
    return dicList
  }
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
 * @returns {number} output value
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

export function getCapthUrl (url) {
  return process.env.AUTH_API + url
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
 * 合并单元格数据转换
 * @param list
 * @param colum  合并条件
 * @param key 主键
 * @returns {*}
 */
export function convertMergeData(list,colum,key){
  for (let field in list[0]) {
    var k = 0;
    while (k < list.length) {
      if(field == colum){
        list[k][field + 'span'] = 1;
        list[k][field + 'dis'] = false;
        for (var i = k + 1; i <= list.length - 1; i++) {
          if (list[k][colum] != list[i][colum] && list[k][key] == list[i][key]) {
            list[k][ field+'span']++;
            list[i][field+'dis'] = true;
            list[k][field+'typedis'] = true;
          } else {
            break;
          }
        }
      }
      k = i;
    }
  }
  return list;
}
export function convertMergeDataTree(list,colum,key,key2, sumObj ={isSum:false}){
  for (let field in list[0]) {
    var k = 0;
    while (k < list.length) {
      if(field == colum ){
        list[k][field + 'span'] = 1;
        list[k][field + 'dis'] = false;
        if(sumObj.isSum){
           list[k]['bookMoneysum'] = list[k][sumObj['sumKey']];
        }
        for (var i = k + 1; i <= list.length - 1; i++) {
        if (list[k][colum] != list[i][colum] && list[k][key] == list[i][key]) {
            if(sumObj.isSum){
              list[k]['bookMoneysum'] += list[i][sumObj['sumKey']];
            }
            list[k][ field+'span']++;
            list[i][field+'dis'] = true;
            list[k][field+'typedis'] = true;
          } else {
            break;
          }
        }
      }
      k = i;
    }
  }
  if(key2){
    for (let field in list[0]) {
      var k = 0;
      while (k < list.length) {
        if(field == key2 ){
          list[k][field + 'span'] = 1;
          list[k][field + 'dis'] = false;
          for (var i = k + 1; i <= list.length - 1; i++) {
            if (list[k][key2] == list[i][key2]) {
              list[k][ field+'span']++;
              list[i][field+'dis'] = true;
              list[k][field+'typedis'] = true;
            } else {
              break;
            }
          }
        }
        k = i;
      }
    }
  }
  return list;
}



export function mergeDataConvert(obj){
    let data = obj.data,
        keys = obj.keys,
        isLock=obj.isLock,
        template=obj.template,
        pageName = obj.pageName,
        dealMonth = obj.dealMonth,
        html = '',
        rejectAuthClass = obj.rejectAuthClass,
        deleteAuthClass = obj.deleteAuthClass

    let onlyMerge =  obj.onlyMerge
    if(data === null){
      return html
    }

    let mergeIndex = 0
    for (let i = data.length - 1; i >= 0; i--) {
        // 默认是 合并，
        data[i].mergeData = data[i].mergeData || {}
        data[i].selected = true
        // 只有一条数据，直接continue
        if(data.length ===1){
            data[i].mergeIndex = 0
            continue
        }
        if(data[i+1] && data[i][keys.key] !== data[i+1][keys.key]){
            mergeIndex++
        }
        data[i].mergeIndex = mergeIndex


        //  第一次循环  最后一行
        if(i === data.length-1 ){
            if( data[i][keys.key] !== data[i - 1][keys.key]){
                continue
            }
        //    最后一次循环  第一行
        }else if(i===0){
            if( data[i][keys.key] !== data[i + 1][keys.key]){
                continue
            }
        }else{
            //  如何本次和上一次也不一致，不需要初始化单元格合并，直接continue
            if( (data[i][keys.key] !== data[i + 1][keys.key]) && data[i][keys.key] !== data[i - 1][keys.key]){
                continue
            }
        }


        for (let j in keys) {

            // 跳过 key
            if (j === 'key') {
                continue
            }
            // 初始 合并单元格数量为1
            data[i].mergeData[j] = 1

            // 如果需要汇总数字   初始化合并数字为本身   并在data中添加 j+'sum'的字段用来填充表格
            if (keys[j].isSum) {
                data[i][j + 'sum'] = data[i][keys[j].sumColumn]
            }
            // 防止index溢出
            if(i === data.length-1){
              continue
            }

            //  如果继续合并前一行
            if (data[i][keys[j].column] === data[i + 1][keys[j].column] && data[i][keys.key] === data[i + 1][keys.key]) {
                data[i].mergeData[j] = data[i + 1].mergeData[j] + 1
                data[i + 1].mergeData[j] = 0
                if (keys[j].isSum) {
                    data[i][j + 'sum'] = (+data[i][keys[j].sumColumn]) + (+data[i + 1][j + 'sum'])
                }
            }
        }
    }

    if(onlyMerge === true){
      return data
    }

    console.log(rejectAuthClass)

  let render = require('views/remuneration/component/'+template+'.art');
  return  render({
      data:data,
      isLock:isLock,
      env:process.env,
      pageName:pageName,
      dealMonth:dealMonth,
      rejectAuthClass:rejectAuthClass,
      deleteAuthClass:deleteAuthClass
  });
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
