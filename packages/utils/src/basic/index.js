export function getClassName(mod) {
  return 'any-'+mod
}

export function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }
  const last = funcs[funcs.length - 1]
  const rest = funcs.slice(0, -1)
  return (...args) => rest.reduceRight((composed, f) => f(composed), last(...args))
}

export function curry(f, ...args) {
  if (args.length >= f.length) {
    return f(...args)
  }

  return (...next) => curry(f.bind(f, ...args), ...next)
}


export function memoize(fn) {
  return key => {
    fn.cache = fn.cache || {}

    if (!(key in fn.cache)) {
      fn.cache[key] = fn(key)
    }

    return fn.cache[key]
  }
}

export function createFunc(func) {
  if (typeof func === 'function') return func
  return data => (func ? data[func] : data)
}

/*空函数*/
export function emptyFunc() {}

/*判断元素是否是另一个元素的子元素*/
export function isContain(parent,ele) {
  if(!ele || !parent){
    return false
  }
  while (ele){
    if(parent !== ele){
      ele = ele.parentElement
    }else{
      return true
    }
  }
  return false
}




export function openDownloadDialog(url: any, saveName: string) {
  if (typeof url === 'object' && url instanceof Blob) {
    url = URL.createObjectURL(url); // 创建blob地址
  }
  const aLink = document.createElement('a');
  aLink.href = url;
  aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  let event;
  if (window.MouseEvent) event = new MouseEvent('click');
  else {
    event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  }
  aLink.dispatchEvent(event);
}
