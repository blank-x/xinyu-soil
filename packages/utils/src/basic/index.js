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
