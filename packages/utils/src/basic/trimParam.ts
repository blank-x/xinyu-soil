
function createReg() {
  return {
    blankReg: /^\s+|\s+$/g,
    zeroReg: /[\u200b-\u200f\uFEFF\u202a-\u202e]/g
  }
}
const trim = function (str: string) {
  if(!str || typeof str !== 'string'){
    return str
  }
  const { blankReg, zeroReg } = createReg()
  str = str.replace(blankReg,'');
  str = str.replace(zeroReg, "")
  return str
}


// 去掉字符串的前后换行符、制表符、空格、零宽字符等特殊字符
export function trimParam(param: unknown) {
  if(typeof param === "string"){
    return trim(param)
  }
  if(typeof param === 'object' && param!==null ){

    const data: Record<string, any> = param;
    if(data.__noTrim===true){
      delete data.__noTrim
      return data
    }
    Object.keys(data).forEach( (key: string) => {
      if ( typeof data[key] === 'string') {
        data[key] = trim(data[key]);
      } else if ( typeof data[key] === 'object' && param !==null ){
        data[key] = trimParam(data[key])
      }
    })
  }
  return param
}

export function isHasBlankOrZero(str: string) {
  if(!str){
    return true
  }
  const { blankReg, zeroReg } = createReg()

  if(blankReg.test(String(str)) || zeroReg.test(String(str))){
    return true
  }
  return false
}
// 对象的值 去掉前后空格
export const trimObject = (obj) => {
  const objKeys = Object.keys(obj);
  const newObj = {};
  objKeys.forEach(item => {
    if (typeof obj[item] === 'string') {
      newObj[item] = obj[item].trim();
    }
  });
  return { ...obj, ...newObj };
};
