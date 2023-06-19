export function deepClone(target) {
    var copyedObjectList = []; //此数组解决了循环引用和相同引用的问题，它存放已经递归到的目标对象 
    function _deepClone(target) {
        if ((typeof target !== 'object') || !target) {
            return target;
        }
        for (var i = 0; i < copyedObjectList.length; i++) {
            if (copyedObjectList[i].target === target) {
                return copyedObjectList[i].copyTarget;
            }
        }
        var obj = {};
        if (Array.isArray(target)) {
            obj = [];
        }
        copyedObjectList.push({
            target: target,
            copyTarget: obj
        });
        Object.keys(target).forEach(function (key) {
            if (obj[key]) {
                return;
            }
            obj[key] = _deepClone(target[key]);
        });
        return obj;
    }
    return _deepClone(target);
}
export default deepClone;
