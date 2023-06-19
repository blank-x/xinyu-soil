// import ErrorBoundary from './ErrorBoundary/index';
import defaultConfig from "./config";
import { merge, validateConfig, getErrType, ajax, getBaseInfo, getResourceSrc } from "./utils";
let Cfg = {};

export const start = (config = {}) => {
  if (!validateConfig(config)) {
    return false;
  }
  Cfg = merge(defaultConfig, config);

  listenBasicErr();
  listenPromiseErr();
  listenAjaxErr();
  // uploadPv(config);
  // 监听全局的点击事件
  // listenTriggerEvent(config);
  uploadPerformance();
};

function sendErrData(data) {
  ajax({
    url: Cfg.logUrl,
    method: "POST",
    data,
  });
}

function sendPerformData(data) {
  ajax({
    url: Cfg.performanceUrl,
    method: "POST",
    data,
  });
}
function listenBasicErr() {
  let baseInfo = getBaseInfo();

  window.addEventListener(
    "error",
    (err) => {
      console.log(err);
      let data;
      //
      if (err instanceof ErrorEvent) {
        data = {
          ...baseInfo,
          errMessage: err.message,
          errLineNo: err.lineno,
          errColNo: err.colno,
          fileName: err.filename,
          errorStack: err.error && err.error.stack,
          errType: getErrType(err.message),
        };
      } else if (err instanceof Event) {
        data = {
          resourceSrc: getResourceSrc(err),
          errType: "resource",
        };
      }

      sendErrData(data);
    },
    true
  );
}

function listenPromiseErr() {
  let baseInfo = getBaseInfo();

  window.addEventListener("unhandledrejection", (err) => {
    console.log(err);
    // reject出来的错误 ，信息放到了err.reason
    let errMessage = err.reason;
    let errorStack = "";
    let lineno, colNo, fileName;

    // 语法错误，err.reason是一个对象
    console.log(err.reason.errMessage, err.reason.stack);
    if (err.reason && err.reason.message && err.reason.stack) {
      errMessage = err.reason.message;
      errorStack = err.reason.stack;

      let matches = errorStack.match(/at (.*):(\d+):(\d+)/);
      if (matches) {
        fileName = matches[1];
        lineno = matches[2];
        colNo = matches[3];
      }
    }

    const data = {
      ...baseInfo,
      errMessage,
      errorStack,
      errLineNo: lineno,
      errColNo: colNo,
      fileName,
      errType: "unhandledrejection",
    };
    console.log(data);
    sendErrData(data);
  });
}

function listenAjaxErr() {
  function ajaxEventTrigger(event) {
    var ajaxEvent = new CustomEvent(event, { detail: this });
    window.dispatchEvent(ajaxEvent);
  }

  var oldXHR = window.XMLHttpRequest;

  function newXHR() {
    var xhrProto = oldXHR.prototype,
      origOpen = xhrProto.open;
    xhrProto.open = function (method, url) {
      this._apiurl = url;
      return origOpen.apply(this, arguments);
    };
    var realXHR = new oldXHR();

    realXHR.addEventListener(
      "error",
      function () {
        ajaxEventTrigger.call(this, "ajaxError");
      },
      false
    );

    realXHR.addEventListener(
      "timeout",
      function (a) {
        console.log(a);
        ajaxEventTrigger.call(this, "ajaxTimeout");
      },
      false
    );

    realXHR.addEventListener(
      "loadend",
      function () {
        if (this.status > 400) {
          ajaxEventTrigger.call(this, "ajaxServerError");
        }
      },
      false
    );

    return realXHR;
  }

  window.XMLHttpRequest = newXHR;
  let baseInfo = getBaseInfo();
  window.addEventListener("ajaxError", (err) => {
    console.log(err);
    let detail = err.detail || {};
    // error
    var data = {
      ...baseInfo,
      apiUrl: detail._apiurl,
      errMessage: "",
      responseText: "",
      errType: "ajaxError",
    };
    sendErrData(data);
  });
  window.addEventListener("ajaxTimeout", (err) => {
    console.log(err);
    let detail = err.detail || {};
    // error
    var data = {
      ...baseInfo,
      apiUrl: detail._apiurl,
      errMessage: "",
      responseText: "",
      errType: "ajaxTimeout",
    };
    sendErrData(data);
  });
  window.addEventListener("ajaxServerError", (err) => {
    console.log(err);
    let detail = err.detail || {};
    // error
    var data = {
      ...baseInfo,
      apiUrl: detail.responseURL,
      errMessage: detail.statusText,
      responseText: detail.responseText,
      errType: "ajaxServerError",
    };
    sendErrData(data);
  });
}

function uploadPerformance() {
  window.onload = function () {
    const { domainLookupEnd, domainLookupStart, connectEnd, connectStart, secureConnectionStart, responseStart, requestStart, responseEnd, domInteractive, loadEventStart, domContentLoadedEventEnd, fetchStart } = window.performance.timing;
    const performanceParams = {
      /* 阶段性指标 */
      // DNS解析耗时
      dns: domainLookupEnd - domainLookupStart,
      // TCP连接耗时
      tcp: connectEnd - connectStart,
       // SSL安全连接耗时
      ssl: connectEnd - secureConnectionStart,
      //dom渲染完成时间
      dom: domInteractive - responseEnd,
      // TTFB 是 Time to First Byte 的缩写，网络请求耗时
      // (后台处理时间+重定向时间)
      // 对服务器来说，TTFB 时间越短，就说明服务器响应越快。
      //  50 ms 以下
      ttfb: responseStart - requestStart,
      // 数据传输耗时  衡量网速和资源大小
      trans: responseEnd - responseStart,
      // 资源加载耗时, 表示页面中的同步加载资源
      res: loadEventStart - domContentLoadedEventEnd,
      /* 关键性能指标 */
      firstbyte: responseStart - domainLookupStart,
      // 首包时间   从请求开始到浏览器开始解析第一批 HTML 文档字节的时间差
      fpt: responseEnd - fetchStart,
      // 首次可交互  浏览器完成所有 HTML 解析并且完成 DOM 构建，此时浏览器开始加载资源
      tti: domInteractive - fetchStart,
      // Ready  如果页面有同步执行的 JS，则同步 JS 执行时间
      ready: domContentLoadedEventEnd - fetchStart,
      // 页面完全加载  首次渲染时间 + DOM 解析耗时 + 同步 JS 执行 + 资源加载耗时
      load: loadEventStart - fetchStart,
    };
    const baseInfo = getBaseInfo()
    sendPerformData({
      ...baseInfo,
      ...performanceParams
    });
  };
}

export const Version = "0.0.1";

