export function isEmptyObject(target) {
    var arr = Object.keys(target);
    return arr.length === 0;
}
export default isEmptyObject;
