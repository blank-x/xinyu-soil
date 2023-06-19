const nativeConsoleError = window.console.error;
window.console.error = function (...args) {
  console.log(111111);
   setTimeout(()=>{
    console.log(args);
   },1000)
   nativeConsoleError.apply(this, args);
}

window.addEventListener("error", function (e) {

  console.log(e);

},true);
 

 
var ps = null
// unhandledrejection 推荐处理方案
window.addEventListener(
  "unhandledrejection",
  (event) => {
    console.log(event);
    ps = event.promise
  },
  false // false 和true 没有什么区别
);
// // unhandledrejection 备选处理方案
 
// rejectionhandled 推荐处理方案
window.addEventListener(
  "rejectionhandled",
  (event) => {
    console.log(event);
    console.log(ps === event.promise)
  },
  true
);
// rejectionhandled 备选处理方案
 
// window.addEventListener("rejectionhandled", event => {
//   console.log("Promise rejected; reason: " + event.reason);
// }, false);
//即使是跨域脚本，若调用console.error也是使用本域的window.console，因此可以拦截，
