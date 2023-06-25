
// 去掉字符串的前后换行符、制表符、空格等特殊字符
export function strTrim(str: string) {
  if (typeof str === 'string') {
    return str.replace(/(^[\s\n\t\r]+)|([\s\n\t\r]+$)/g, "");
  } 
  return str;
}

export default strTrim;
