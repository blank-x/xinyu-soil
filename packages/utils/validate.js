/**
 * Created by motie on 17/11/01.
 */

export function isvalidUsername(str) {
    const valid_map = ['zhangsan', 'lisi', 'wangwu']
    return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/
    return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/
    return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
}

/* 数字校验最大值为100*/
export function validatMax100(str) {
    const reg = /^(?:0|[1-9][0-9]?|100)$/
    return reg.test(str);
}

/**人民币金额校验**/
export function  validatMoney(str) {
    const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
    return reg.test(str);
}
/**整数金额校验**/
export function  validatNumber(str) {
    const reg = /^[0-9]\d*$/
    return reg.test(str);
}
/**
 * 文件上传
 * file  Object 文件
 * type  String or Array文件类型 多个用逗号隔开
 * maxSize  Mumber允许上传最大文件大小M
 */
export  function checkFileTypeOrMax(file,type,maxSize) {
    if(!file) return;
    var name=file.name;
    var fileName = name.substring(name.lastIndexOf(".")+1).toLowerCase();
  //这里限制类型
    if(type.indexOf(fileName) < 0){
        return {success:false, msg:'附件或文件格式必须为'+type}
    }
    var fileSize = 0;
    fileSize = file.size;
    var size = fileSize / 1024 ;
  //这里限制大小
    if(size>parseInt(maxSize)*1024){
        return {success:false, msg:'附件或文件不能大于'+maxSize+'M'}
    }
    return {success:true}
}