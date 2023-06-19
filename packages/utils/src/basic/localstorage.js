
function myLocalStorage() {

  return   (typeof window !== 'undefined' ? window : global).localStorage
}

function read(key) {
  return myLocalStorage().getItem(key)
}

function write(key, data) {
  return myLocalStorage().setItem(key, data)
}

function each(fn) {
  for (var i = myLocalStorage().length - 1; i >= 0; i--) {
    var key = myLocalStorage().key(i)
    fn(read(key), key)
  }
}

function remove(key) {
  return myLocalStorage().removeItem(key)
}

function clearAll() {
  return myLocalStorage().clear()
}
// 本段代码是重写了setItem事件，实现myLocalStorage变化，在本页面也能监听到
const oriSetItem = myLocalStorage().setItem;
myLocalStorage().setItem = function(k, v) {
  const se = document.createEvent("StorageEvent");
  se.initStorageEvent('storage', false, false, k, null, v, null, null);
  window.dispatchEvent(se);
  oriSetItem.apply(this, [k,v]);
}
export default {
  name: 'myLocalStorage',
  read: read,
  write: write,
  each: each,
  remove: remove,
  clearAll: clearAll,
}
