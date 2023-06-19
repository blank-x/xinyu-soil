export function deepClone(target: any) { 
  const copyedObjectList: any[] = []; //此数组解决了循环引用和相同引用的问题，它存放已经递归到的目标对象 
  function _deepClone(target: any) {
    if((typeof target !== 'object') || !target) {
      return target;
    }
    for(let i= 0 ;i < copyedObjectList.length; i++) {
      if(copyedObjectList[i].target === target) {
        return copyedObjectList[i].copyTarget;
      }
    }
    let obj: Record<string, any> = {};
    if(Array.isArray(target)) {
      obj = [];
    }
    copyedObjectList.push({
      target: target,
      copyTarget: obj
    });
    Object.keys(target).forEach(key => { 
      if(obj[key]) { 
        return;
      }
      obj[key] = _deepClone(target[key]);
    });
    return obj;
  }
  return _deepClone(target);
}

export default deepClone;
  