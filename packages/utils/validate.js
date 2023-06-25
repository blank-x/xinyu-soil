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

export const emailReg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/

export function validateEmail (email) {
  const reg = emailReg;
  return reg.test(email);
}
 

export const phoneReg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/

export function validatePhone (phone) {
  const reg = phoneReg;
  return reg.test(phone);
}
 

/**
 * antd 校验包裹器
 * @param validator
 * @param msg
 */
export const antdValidatorWrapper = (validator: (val: any) => boolean, msg: string) => (rule: any, value: any) => {
    const res = validator(value);
    if (res) {
      return Promise.resolve();
    }
    return Promise.reject(msg);
  };
  
  // mobile: 11位号码，无国际区号，无+86；
  // land：010-7654321, 0107654321, 7654321均可
  // service: 400-800-9555, 400-8009555, 4008009555均可
  // 手机号校验
  export const telphoneValidator = (value: string) => {
    if (!value) {
      return true; // 此处不做必填校验
    }
  
    const mobileReg = /^1(3|4|5|6|7|8|9)[0-9]\d{8}$/; // 移动电话的正则
    const landReg = /^(0\d{2,3}-?)?\d{7,8}$/; // 大陆电话的正则
    const serviceReg = /^[48]00-?\d{3}-?\d{4}$/; // 客服电话的正则
    return mobileReg.test(value) || landReg.test(value) || serviceReg.test(value);
  };
  
  // 身份证校验
  export const idcreditValidator = (value: string) => {
    if (!value) {
      return false;
    }
  
    const arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const arrValid = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
    if (/^\d{17}\d|x$/i.test(value)) {
      let sum = 0;
  
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < value.length - 1; i++) {
        // 对前17位数字与权值乘积求和
        sum += parseInt(value.substr(i, 1), 10) * arrExp[i];
      }
      // 计算模（固定算法）
      const idx = sum % 11;
      // 检验第18为是否与校验码相等
      return `${arrValid[idx]}` === value.substr(17, 1).toUpperCase();
    }
    return false;
  };