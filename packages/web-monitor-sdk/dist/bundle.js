(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ZS_M"] = factory();
	else
		root["ZS_M"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  logUrl: 'http://152.136.155.216/payment/errlog',
  performanceUrl: 'http://152.136.155.216/payment/errlog'
});

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ajax": () => (/* binding */ ajax),
/* harmony export */   "merge": () => (/* binding */ merge),
/* harmony export */   "getBaseInfo": () => (/* binding */ getBaseInfo),
/* harmony export */   "getErrType": () => (/* binding */ getErrType),
/* harmony export */   "validateConfig": () => (/* binding */ validateConfig),
/* harmony export */   "getGrammerErr": () => (/* binding */ getGrammerErr),
/* harmony export */   "getPromiseErr": () => (/* binding */ getPromiseErr),
/* harmony export */   "getResourceErr": () => (/* binding */ getResourceErr),
/* harmony export */   "getResourceSrc": () => (/* binding */ getResourceSrc)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

function ajax(params) {
  var xhr = new XMLHttpRequest();
  xhr.open(params.method, params.url, true);
  xhr.setRequestHeader('content-type', 'application/json');

  xhr.onload = function (e) {
    if (this.status == 200 || this.status == 304) {
      params.success && params.success(); // console.log(this.responseText);
    }
  };

  xhr.send(JSON.stringify(params.data));
}
function merge(...args) {
  return Object.assign({}, ...args);
}
function getBaseInfo() {
  return {
    url: location.href,
    client: navigator.userAgent
  };
}
function getErrType(message = '') {
  let type = _constants__WEBPACK_IMPORTED_MODULE_0__.errorType.find(item => message.includes(item));
  return type;
}
function validateConfig(config) {
  return true;

  if (!config.appId) {
    console.warn('需要appId');
    return false;
  }

  return true;
}
function getGrammerErr(err) {}
function getPromiseErr(err) {}
function getResourceErr(err) {}
function getResourceSrc(err) {
  if (err.target.tagName.toLowerCase() === 'link') {
    return err.target.link;
  }

  return err.target.src;
}

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "errorType": () => (/* binding */ errorType)
/* harmony export */ });
const errorType = ['SyntaxError', 'ReferenceError', 'RangeError', 'TypeError', 'URLError', 'EvalError']; // EvalError 浏览器不再抛出

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "start": () => (/* binding */ start),
/* harmony export */   "Version": () => (/* binding */ Version)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
// import ErrorBoundary from './ErrorBoundary/index';


let Cfg = {};
const start = (config = {}) => {
  if (!(0,_utils__WEBPACK_IMPORTED_MODULE_1__.validateConfig)(config)) {
    return false;
  }

  Cfg = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.merge)(_config__WEBPACK_IMPORTED_MODULE_0__.default, config);
  listenBasicErr();
  listenPromiseErr();
  listenAjaxErr(); // uploadPv(config);
  // 监听全局的点击事件
  // listenTriggerEvent(config);

  uploadPerformance();
};

function sendErrData(data) {
  (0,_utils__WEBPACK_IMPORTED_MODULE_1__.ajax)({
    url: Cfg.logUrl,
    method: "POST",
    data
  });
}

function sendPerformData(data) {
  (0,_utils__WEBPACK_IMPORTED_MODULE_1__.ajax)({
    url: Cfg.performanceUrl,
    method: "POST",
    data
  });
}

function listenBasicErr() {
  let baseInfo = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getBaseInfo)();
  window.addEventListener("error", err => {
    console.log(err);
    let data; //

    if (err instanceof ErrorEvent) {
      data = { ...baseInfo,
        errMessage: err.message,
        errLineNo: err.lineno,
        errColNo: err.colno,
        fileName: err.filename,
        errorStack: err.error && err.error.stack,
        errType: (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getErrType)(err.message)
      };
    } else if (err instanceof Event) {
      data = {
        resourceSrc: (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getResourceSrc)(err),
        errType: "resource"
      };
    }

    sendErrData(data);
  }, true);
}

function listenPromiseErr() {
  let baseInfo = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getBaseInfo)();
  window.addEventListener("unhandledrejection", err => {
    console.log(err); // reject出来的错误 ，信息放到了err.reason

    let errMessage = err.reason;
    let errorStack = "";
    let lineno, colNo, fileName; // 语法错误，err.reason是一个对象

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

    const data = { ...baseInfo,
      errMessage,
      errorStack,
      errLineNo: lineno,
      errColNo: colNo,
      fileName,
      errType: "unhandledrejection"
    };
    console.log(data);
    sendErrData(data);
  });
}

function listenAjaxErr() {
  function ajaxEventTrigger(event) {
    var ajaxEvent = new CustomEvent(event, {
      detail: this
    });
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
    realXHR.addEventListener("error", function () {
      ajaxEventTrigger.call(this, "ajaxError");
    }, false);
    realXHR.addEventListener("timeout", function (a) {
      console.log(a);
      ajaxEventTrigger.call(this, "ajaxTimeout");
    }, false);
    realXHR.addEventListener("loadend", function () {
      if (this.status > 400) {
        ajaxEventTrigger.call(this, "ajaxServerError");
      }
    }, false);
    return realXHR;
  }

  window.XMLHttpRequest = newXHR;
  let baseInfo = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getBaseInfo)();
  window.addEventListener("ajaxError", err => {
    console.log(err);
    let detail = err.detail || {}; // error

    var data = { ...baseInfo,
      apiUrl: detail._apiurl,
      errMessage: "",
      responseText: "",
      errType: "ajaxError"
    };
    sendErrData(data);
  });
  window.addEventListener("ajaxTimeout", err => {
    console.log(err);
    let detail = err.detail || {}; // error

    var data = { ...baseInfo,
      apiUrl: detail._apiurl,
      errMessage: "",
      responseText: "",
      errType: "ajaxTimeout"
    };
    sendErrData(data);
  });
  window.addEventListener("ajaxServerError", err => {
    console.log(err);
    let detail = err.detail || {}; // error

    var data = { ...baseInfo,
      apiUrl: detail.responseURL,
      errMessage: detail.statusText,
      responseText: detail.responseText,
      errType: "ajaxServerError"
    };
    sendErrData(data);
  });
}

function uploadPerformance() {
  window.onload = function () {
    const {
      domainLookupEnd,
      domainLookupStart,
      connectEnd,
      connectStart,
      secureConnectionStart,
      responseStart,
      requestStart,
      responseEnd,
      domInteractive,
      loadEventStart,
      domContentLoadedEventEnd,
      fetchStart
    } = window.performance.timing;
    const performanceParams = {
      /* 阶段性指标 */
      // DNS解析耗时
      dns: domainLookupEnd - domainLookupStart,
      // TCP连接耗时
      tcp: connectEnd - connectStart,
      // SSL安全连接耗时  
      ssl: connectEnd - secureConnectionStart,
      //dom渲染完成时间
      dom: domInteractive - domLoading,
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
      // 首次渲染   从请求开始到浏览器开始解析第一批 HTML 文档字节的时间差
      fpt: responseEnd - fetchStart,
      // 首次可交互  浏览器完成所有 HTML 解析并且完成 DOM 构建，此时浏览器开始加载资源
      tti: domInteractive - fetchStart,
      // Ready  如果页面有同步执行的 JS，则同步 JS 执行时间
      ready: domContentLoadedEventEnd - fetchStart,
      // 页面完全加载  首次渲染时间 + DOM 解析耗时 + 同步 JS 执行 + 资源加载耗时
      load: loadEventStart - fetchStart
    };
    const baseInfo = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getBaseInfo)();
    sendPerformData({ ...baseInfo,
      ...performanceParams
    });
  };
}

const Version = "0.0.1";
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9aU19NL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9aU19NLy4vc3JjL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly9aU19NLy4vc3JjL3V0aWxzLmpzIiwid2VicGFjazovL1pTX00vLi9zcmMvY29uc3RhbnRzLmpzIiwid2VicGFjazovL1pTX00vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vWlNfTS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vWlNfTS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1pTX00vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9aU19NLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbImxvZ1VybCIsInBlcmZvcm1hbmNlVXJsIiwiYWpheCIsInBhcmFtcyIsInhociIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsIm1ldGhvZCIsInVybCIsInNldFJlcXVlc3RIZWFkZXIiLCJvbmxvYWQiLCJlIiwic3RhdHVzIiwic3VjY2VzcyIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwiZGF0YSIsIm1lcmdlIiwiYXJncyIsIk9iamVjdCIsImFzc2lnbiIsImdldEJhc2VJbmZvIiwibG9jYXRpb24iLCJocmVmIiwiY2xpZW50IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwiZ2V0RXJyVHlwZSIsIm1lc3NhZ2UiLCJ0eXBlIiwiZXJyb3JUeXBlIiwiaXRlbSIsImluY2x1ZGVzIiwidmFsaWRhdGVDb25maWciLCJjb25maWciLCJhcHBJZCIsImNvbnNvbGUiLCJ3YXJuIiwiZ2V0R3JhbW1lckVyciIsImVyciIsImdldFByb21pc2VFcnIiLCJnZXRSZXNvdXJjZUVyciIsImdldFJlc291cmNlU3JjIiwidGFyZ2V0IiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwibGluayIsInNyYyIsIkNmZyIsInN0YXJ0IiwiZGVmYXVsdENvbmZpZyIsImxpc3RlbkJhc2ljRXJyIiwibGlzdGVuUHJvbWlzZUVyciIsImxpc3RlbkFqYXhFcnIiLCJ1cGxvYWRQZXJmb3JtYW5jZSIsInNlbmRFcnJEYXRhIiwic2VuZFBlcmZvcm1EYXRhIiwiYmFzZUluZm8iLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwibG9nIiwiRXJyb3JFdmVudCIsImVyck1lc3NhZ2UiLCJlcnJMaW5lTm8iLCJsaW5lbm8iLCJlcnJDb2xObyIsImNvbG5vIiwiZmlsZU5hbWUiLCJmaWxlbmFtZSIsImVycm9yU3RhY2siLCJlcnJvciIsInN0YWNrIiwiZXJyVHlwZSIsIkV2ZW50IiwicmVzb3VyY2VTcmMiLCJyZWFzb24iLCJjb2xObyIsIm1hdGNoZXMiLCJtYXRjaCIsImFqYXhFdmVudFRyaWdnZXIiLCJldmVudCIsImFqYXhFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiZGlzcGF0Y2hFdmVudCIsIm9sZFhIUiIsIm5ld1hIUiIsInhoclByb3RvIiwicHJvdG90eXBlIiwib3JpZ09wZW4iLCJfYXBpdXJsIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJyZWFsWEhSIiwiY2FsbCIsImEiLCJhcGlVcmwiLCJyZXNwb25zZVRleHQiLCJyZXNwb25zZVVSTCIsInN0YXR1c1RleHQiLCJkb21haW5Mb29rdXBFbmQiLCJkb21haW5Mb29rdXBTdGFydCIsImNvbm5lY3RFbmQiLCJjb25uZWN0U3RhcnQiLCJzZWN1cmVDb25uZWN0aW9uU3RhcnQiLCJyZXNwb25zZVN0YXJ0IiwicmVxdWVzdFN0YXJ0IiwicmVzcG9uc2VFbmQiLCJkb21JbnRlcmFjdGl2ZSIsImxvYWRFdmVudFN0YXJ0IiwiZG9tQ29udGVudExvYWRlZEV2ZW50RW5kIiwiZmV0Y2hTdGFydCIsInBlcmZvcm1hbmNlIiwidGltaW5nIiwicGVyZm9ybWFuY2VQYXJhbXMiLCJkbnMiLCJ0Y3AiLCJzc2wiLCJkb20iLCJkb21Mb2FkaW5nIiwidHRmYiIsInRyYW5zIiwicmVzIiwiZmlyc3RieXRlIiwiZnB0IiwidHRpIiwicmVhZHkiLCJsb2FkIiwiVmVyc2lvbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87Ozs7Ozs7Ozs7O0FDVkEsaUVBQWU7QUFDYkEsUUFBTSxFQUFDLHVDQURNO0FBRWJDLGdCQUFjLEVBQUM7QUFGRixDQUFmLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNPLFNBQVNDLElBQVQsQ0FBY0MsTUFBZCxFQUFxQjtBQUUxQixNQUFJQyxHQUFHLEdBQUcsSUFBSUMsY0FBSixFQUFWO0FBQ0FELEtBQUcsQ0FBQ0UsSUFBSixDQUFTSCxNQUFNLENBQUNJLE1BQWhCLEVBQXdCSixNQUFNLENBQUNLLEdBQS9CLEVBQW9DLElBQXBDO0FBQ0FKLEtBQUcsQ0FBQ0ssZ0JBQUosQ0FBcUIsY0FBckIsRUFBb0Msa0JBQXBDOztBQUNBTCxLQUFHLENBQUNNLE1BQUosR0FBYSxVQUFTQyxDQUFULEVBQVk7QUFDdkIsUUFBRyxLQUFLQyxNQUFMLElBQWUsR0FBZixJQUFvQixLQUFLQSxNQUFMLElBQWUsR0FBdEMsRUFBMEM7QUFDeENULFlBQU0sQ0FBQ1UsT0FBUCxJQUFrQlYsTUFBTSxDQUFDVSxPQUFQLEVBQWxCLENBRHdDLENBRXRDO0FBQ0g7QUFDRixHQUxEOztBQU9BVCxLQUFHLENBQUNVLElBQUosQ0FBU0MsSUFBSSxDQUFDQyxTQUFMLENBQWViLE1BQU0sQ0FBQ2MsSUFBdEIsQ0FBVDtBQUNEO0FBRU0sU0FBU0MsS0FBVCxDQUFnQixHQUFHQyxJQUFuQixFQUF3QjtBQUM3QixTQUFPQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWlCLEdBQUdGLElBQXBCLENBQVA7QUFDRDtBQUVNLFNBQVNHLFdBQVQsR0FBc0I7QUFDM0IsU0FBTztBQUNMZCxPQUFHLEVBQUNlLFFBQVEsQ0FBQ0MsSUFEUjtBQUVMQyxVQUFNLEVBQUVD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UUFBUSxHQUFHcEMsbURBQVcsRUFBNUI7QUFDQW1DLG1CQUFlLENBQUMsRUFDZCxHQUFHQyxRQURXO0FBRWQsU0FBR3lEO0FBRlcsS0FBRCxDQUFmO0FBSUQsR0FyQ0Q7QUFzQ0Q7O0FBRU0sTUFBTWMsT0FBTyxHQUFHLE9BQWhCLEMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiWlNfTVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJaU19NXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiZXhwb3J0IGRlZmF1bHQge1xuICBsb2dVcmw6J2h0dHA6Ly8xNTIuMTM2LjE1NS4yMTYvcGF5bWVudC9lcnJsb2cnLFxuICBwZXJmb3JtYW5jZVVybDonaHR0cDovLzE1Mi4xMzYuMTU1LjIxNi9wYXltZW50L2VycmxvZydcbn0iLCJpbXBvcnQge2Vycm9yVHlwZX0gZnJvbSAnLi9jb25zdGFudHMnXG5leHBvcnQgZnVuY3Rpb24gYWpheChwYXJhbXMpe1xuIFxuICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgeGhyLm9wZW4ocGFyYW1zLm1ldGhvZCwgcGFyYW1zLnVybCwgdHJ1ZSk7XG4gIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdjb250ZW50LXR5cGUnLCdhcHBsaWNhdGlvbi9qc29uJylcbiAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcbiAgICBpZih0aGlzLnN0YXR1cyA9PSAyMDB8fHRoaXMuc3RhdHVzID09IDMwNCl7XG4gICAgICBwYXJhbXMuc3VjY2VzcyAmJiBwYXJhbXMuc3VjY2VzcygpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMucmVzcG9uc2VUZXh0KTtcbiAgICB9XG4gIH07XG4gIFxuICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeShwYXJhbXMuZGF0YSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2UgKC4uLmFyZ3Mpe1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwuLi5hcmdzKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QmFzZUluZm8oKXtcbiAgcmV0dXJuIHtcbiAgICB1cmw6bG9jYXRpb24uaHJlZixcbiAgICBjbGllbnQ6IG5hdmlnYXRvci51c2VyQWdlbnQsXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVyclR5cGUobWVzc2FnZT0nJyl7XG4gIGxldCB0eXBlID0gZXJyb3JUeXBlLmZpbmQoaXRlbT0+bWVzc2FnZS5pbmNsdWRlcyhpdGVtKSlcbiAgcmV0dXJuIHR5cGVcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlQ29uZmlnKGNvbmZpZyl7XG4gIHJldHVybiB0cnVlXG4gIGlmICghY29uZmlnLmFwcElkKSB7XG4gICAgY29uc29sZS53YXJuKCfpnIDopoFhcHBJZCcpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0R3JhbW1lckVycihlcnIpe1xuXG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvbWlzZUVycihlcnIpe1xuXG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVzb3VyY2VFcnIoZXJyKXtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVzb3VyY2VTcmMoZXJyKXtcbiAgaWYoZXJyLnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdsaW5rJyl7XG4gICAgcmV0dXJuIGVyci50YXJnZXQubGlua1xuICB9XG4gIHJldHVybiBlcnIudGFyZ2V0LnNyY1xufSIsImV4cG9ydCBjb25zdCBlcnJvclR5cGUgPSBbJ1N5bnRheEVycm9yJywgJ1JlZmVyZW5jZUVycm9yJywgJ1JhbmdlRXJyb3InLCAnVHlwZUVycm9yJywgJ1VSTEVycm9yJywnRXZhbEVycm9yJ11cbi8vIEV2YWxFcnJvciDmtY/op4jlmajkuI3lho3mipvlh7pcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gaW1wb3J0IEVycm9yQm91bmRhcnkgZnJvbSAnLi9FcnJvckJvdW5kYXJ5L2luZGV4JztcbmltcG9ydCBkZWZhdWx0Q29uZmlnIGZyb20gXCIuL2NvbmZpZ1wiO1xuaW1wb3J0IHsgbWVyZ2UsIHZhbGlkYXRlQ29uZmlnLCBnZXRFcnJUeXBlLCBhamF4LCBnZXRCYXNlSW5mbywgZ2V0UmVzb3VyY2VTcmMgfSBmcm9tIFwiLi91dGlsc1wiO1xubGV0IENmZyA9IHt9O1xuXG5leHBvcnQgY29uc3Qgc3RhcnQgPSAoY29uZmlnID0ge30pID0+IHtcbiAgaWYgKCF2YWxpZGF0ZUNvbmZpZyhjb25maWcpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIENmZyA9IG1lcmdlKGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG5cbiAgbGlzdGVuQmFzaWNFcnIoKTtcbiAgbGlzdGVuUHJvbWlzZUVycigpO1xuICBsaXN0ZW5BamF4RXJyKCk7XG4gIC8vIHVwbG9hZFB2KGNvbmZpZyk7XG4gIC8vIOebkeWQrOWFqOWxgOeahOeCueWHu+S6i+S7tlxuICAvLyBsaXN0ZW5UcmlnZ2VyRXZlbnQoY29uZmlnKTtcbiAgdXBsb2FkUGVyZm9ybWFuY2UoKTtcbn07XG5cbmZ1bmN0aW9uIHNlbmRFcnJEYXRhKGRhdGEpIHtcbiAgYWpheCh7XG4gICAgdXJsOiBDZmcubG9nVXJsLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgZGF0YSxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNlbmRQZXJmb3JtRGF0YShkYXRhKSB7XG4gIGFqYXgoe1xuICAgIHVybDogQ2ZnLnBlcmZvcm1hbmNlVXJsLFxuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgZGF0YSxcbiAgfSk7XG59XG5mdW5jdGlvbiBsaXN0ZW5CYXNpY0VycigpIHtcbiAgbGV0IGJhc2VJbmZvID0gZ2V0QmFzZUluZm8oKTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICBcImVycm9yXCIsXG4gICAgKGVycikgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIGxldCBkYXRhO1xuICAgICAgLy9cbiAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBFcnJvckV2ZW50KSB7XG4gICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgLi4uYmFzZUluZm8sXG4gICAgICAgICAgZXJyTWVzc2FnZTogZXJyLm1lc3NhZ2UsXG4gICAgICAgICAgZXJyTGluZU5vOiBlcnIubGluZW5vLFxuICAgICAgICAgIGVyckNvbE5vOiBlcnIuY29sbm8sXG4gICAgICAgICAgZmlsZU5hbWU6IGVyci5maWxlbmFtZSxcbiAgICAgICAgICBlcnJvclN0YWNrOiBlcnIuZXJyb3IgJiYgZXJyLmVycm9yLnN0YWNrLFxuICAgICAgICAgIGVyclR5cGU6IGdldEVyclR5cGUoZXJyLm1lc3NhZ2UpLFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIGlmIChlcnIgaW5zdGFuY2VvZiBFdmVudCkge1xuICAgICAgICBkYXRhID0ge1xuICAgICAgICAgIHJlc291cmNlU3JjOiBnZXRSZXNvdXJjZVNyYyhlcnIpLFxuICAgICAgICAgIGVyclR5cGU6IFwicmVzb3VyY2VcIixcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgc2VuZEVyckRhdGEoZGF0YSk7XG4gICAgfSxcbiAgICB0cnVlXG4gICk7XG59XG5cbmZ1bmN0aW9uIGxpc3RlblByb21pc2VFcnIoKSB7XG4gIGxldCBiYXNlSW5mbyA9IGdldEJhc2VJbmZvKCk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ1bmhhbmRsZWRyZWplY3Rpb25cIiwgKGVycikgPT4ge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgLy8gcmVqZWN05Ye65p2l55qE6ZSZ6K+vIO+8jOS/oeaBr+aUvuWIsOS6hmVyci5yZWFzb25cbiAgICBsZXQgZXJyTWVzc2FnZSA9IGVyci5yZWFzb247XG4gICAgbGV0IGVycm9yU3RhY2sgPSBcIlwiO1xuICAgIGxldCBsaW5lbm8sIGNvbE5vLCBmaWxlTmFtZTtcblxuICAgIC8vIOivreazlemUmeivr++8jGVyci5yZWFzb27mmK/kuIDkuKrlr7nosaFcbiAgICBjb25zb2xlLmxvZyhlcnIucmVhc29uLmVyck1lc3NhZ2UsIGVyci5yZWFzb24uc3RhY2spO1xuICAgIGlmIChlcnIucmVhc29uICYmIGVyci5yZWFzb24ubWVzc2FnZSAmJiBlcnIucmVhc29uLnN0YWNrKSB7XG4gICAgICBlcnJNZXNzYWdlID0gZXJyLnJlYXNvbi5tZXNzYWdlO1xuICAgICAgZXJyb3JTdGFjayA9IGVyci5yZWFzb24uc3RhY2s7XG5cbiAgICAgIGxldCBtYXRjaGVzID0gZXJyb3JTdGFjay5tYXRjaCgvYXQgKC4qKTooXFxkKyk6KFxcZCspLyk7XG4gICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICBmaWxlTmFtZSA9IG1hdGNoZXNbMV07XG4gICAgICAgIGxpbmVubyA9IG1hdGNoZXNbMl07XG4gICAgICAgIGNvbE5vID0gbWF0Y2hlc1szXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgLi4uYmFzZUluZm8sXG4gICAgICBlcnJNZXNzYWdlLFxuICAgICAgZXJyb3JTdGFjayxcbiAgICAgIGVyckxpbmVObzogbGluZW5vLFxuICAgICAgZXJyQ29sTm86IGNvbE5vLFxuICAgICAgZmlsZU5hbWUsXG4gICAgICBlcnJUeXBlOiBcInVuaGFuZGxlZHJlamVjdGlvblwiLFxuICAgIH07XG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgc2VuZEVyckRhdGEoZGF0YSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBsaXN0ZW5BamF4RXJyKCkge1xuICBmdW5jdGlvbiBhamF4RXZlbnRUcmlnZ2VyKGV2ZW50KSB7XG4gICAgdmFyIGFqYXhFdmVudCA9IG5ldyBDdXN0b21FdmVudChldmVudCwgeyBkZXRhaWw6IHRoaXMgfSk7XG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQoYWpheEV2ZW50KTtcbiAgfVxuXG4gIHZhciBvbGRYSFIgPSB3aW5kb3cuWE1MSHR0cFJlcXVlc3Q7XG5cbiAgZnVuY3Rpb24gbmV3WEhSKCkge1xuICAgIHZhciB4aHJQcm90byA9IG9sZFhIUi5wcm90b3R5cGUsXG4gICAgICBvcmlnT3BlbiA9IHhoclByb3RvLm9wZW47XG4gICAgeGhyUHJvdG8ub3BlbiA9IGZ1bmN0aW9uIChtZXRob2QsIHVybCkge1xuICAgICAgdGhpcy5fYXBpdXJsID0gdXJsO1xuICAgICAgcmV0dXJuIG9yaWdPcGVuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICB2YXIgcmVhbFhIUiA9IG5ldyBvbGRYSFIoKTtcblxuICAgIHJlYWxYSFIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwiZXJyb3JcIixcbiAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWpheEV2ZW50VHJpZ2dlci5jYWxsKHRoaXMsIFwiYWpheEVycm9yXCIpO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcblxuICAgIHJlYWxYSFIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwidGltZW91dFwiLFxuICAgICAgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coYSk7XG4gICAgICAgIGFqYXhFdmVudFRyaWdnZXIuY2FsbCh0aGlzLCBcImFqYXhUaW1lb3V0XCIpO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcblxuICAgIHJlYWxYSFIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwibG9hZGVuZFwiLFxuICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPiA0MDApIHtcbiAgICAgICAgICBhamF4RXZlbnRUcmlnZ2VyLmNhbGwodGhpcywgXCJhamF4U2VydmVyRXJyb3JcIik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmYWxzZVxuICAgICk7XG5cbiAgICByZXR1cm4gcmVhbFhIUjtcbiAgfVxuXG4gIHdpbmRvdy5YTUxIdHRwUmVxdWVzdCA9IG5ld1hIUjtcbiAgbGV0IGJhc2VJbmZvID0gZ2V0QmFzZUluZm8oKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJhamF4RXJyb3JcIiwgKGVycikgPT4ge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgbGV0IGRldGFpbCA9IGVyci5kZXRhaWwgfHwge307XG4gICAgLy8gZXJyb3JcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIC4uLmJhc2VJbmZvLFxuICAgICAgYXBpVXJsOiBkZXRhaWwuX2FwaXVybCxcbiAgICAgIGVyck1lc3NhZ2U6IFwiXCIsXG4gICAgICByZXNwb25zZVRleHQ6IFwiXCIsXG4gICAgICBlcnJUeXBlOiBcImFqYXhFcnJvclwiLFxuICAgIH07XG4gICAgc2VuZEVyckRhdGEoZGF0YSk7XG4gIH0pO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImFqYXhUaW1lb3V0XCIsIChlcnIpID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIGxldCBkZXRhaWwgPSBlcnIuZGV0YWlsIHx8IHt9O1xuICAgIC8vIGVycm9yXG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAuLi5iYXNlSW5mbyxcbiAgICAgIGFwaVVybDogZGV0YWlsLl9hcGl1cmwsXG4gICAgICBlcnJNZXNzYWdlOiBcIlwiLFxuICAgICAgcmVzcG9uc2VUZXh0OiBcIlwiLFxuICAgICAgZXJyVHlwZTogXCJhamF4VGltZW91dFwiLFxuICAgIH07XG4gICAgc2VuZEVyckRhdGEoZGF0YSk7XG4gIH0pO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImFqYXhTZXJ2ZXJFcnJvclwiLCAoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgICBsZXQgZGV0YWlsID0gZXJyLmRldGFpbCB8fCB7fTtcbiAgICAvLyBlcnJvclxuICAgIHZhciBkYXRhID0ge1xuICAgICAgLi4uYmFzZUluZm8sXG4gICAgICBhcGlVcmw6IGRldGFpbC5yZXNwb25zZVVSTCxcbiAgICAgIGVyck1lc3NhZ2U6IGRldGFpbC5zdGF0dXNUZXh0LFxuICAgICAgcmVzcG9uc2VUZXh0OiBkZXRhaWwucmVzcG9uc2VUZXh0LFxuICAgICAgZXJyVHlwZTogXCJhamF4U2VydmVyRXJyb3JcIixcbiAgICB9O1xuICAgIHNlbmRFcnJEYXRhKGRhdGEpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gdXBsb2FkUGVyZm9ybWFuY2UoKSB7XG4gIHdpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgeyBkb21haW5Mb29rdXBFbmQsIGRvbWFpbkxvb2t1cFN0YXJ0LCBjb25uZWN0RW5kLCBjb25uZWN0U3RhcnQsIHNlY3VyZUNvbm5lY3Rpb25TdGFydCwgcmVzcG9uc2VTdGFydCwgcmVxdWVzdFN0YXJ0LCByZXNwb25zZUVuZCwgZG9tSW50ZXJhY3RpdmUsIGxvYWRFdmVudFN0YXJ0LCBkb21Db250ZW50TG9hZGVkRXZlbnRFbmQsIGZldGNoU3RhcnQgfSA9IHdpbmRvdy5wZXJmb3JtYW5jZS50aW1pbmc7XG4gICAgY29uc3QgcGVyZm9ybWFuY2VQYXJhbXMgPSB7XG4gICAgICAvKiDpmLbmrrXmgKfmjIfmoIcgKi9cbiAgICAgIC8vIEROU+ino+aekOiAl+aXtlxuICAgICAgZG5zOiBkb21haW5Mb29rdXBFbmQgLSBkb21haW5Mb29rdXBTdGFydCxcbiAgICAgIC8vIFRDUOi/nuaOpeiAl+aXtlxuICAgICAgdGNwOiBjb25uZWN0RW5kIC0gY29ubmVjdFN0YXJ0LFxuICAgICAgIC8vIFNTTOWuieWFqOi/nuaOpeiAl+aXtiAgXG4gICAgICBzc2w6IGNvbm5lY3RFbmQgLSBzZWN1cmVDb25uZWN0aW9uU3RhcnQsXG4gICAgICAvL2Rvbea4suafk+WujOaIkOaXtumXtFxuICAgICAgZG9tOiBkb21JbnRlcmFjdGl2ZSAtIGRvbUxvYWRpbmcsXG4gICAgICAvLyBUVEZCIOaYryBUaW1lIHRvIEZpcnN0IEJ5dGUg55qE57yp5YaZ77yM572R57uc6K+35rGC6ICX5pe2XG4gICAgICAvLyAo5ZCO5Y+w5aSE55CG5pe26Ze0K+mHjeWumuWQkeaXtumXtClcbiAgICAgIC8vIOWvueacjeWKoeWZqOadpeivtO+8jFRURkIg5pe26Ze06LaK55+t77yM5bCx6K+05piO5pyN5Yqh5Zmo5ZON5bqU6LaK5b+r44CCXG4gICAgICAvLyAgNTAgbXMg5Lul5LiLXG4gICAgICB0dGZiOiByZXNwb25zZVN0YXJ0IC0gcmVxdWVzdFN0YXJ0LFxuICAgICAgLy8g5pWw5o2u5Lyg6L6T6ICX5pe2ICDooaHph4/nvZHpgJ/lkozotYTmupDlpKflsI9cbiAgICAgIHRyYW5zOiByZXNwb25zZUVuZCAtIHJlc3BvbnNlU3RhcnQsXG4gICAgICAvLyDotYTmupDliqDovb3ogJfml7YsIOihqOekuumhtemdouS4reeahOWQjOatpeWKoOi9vei1hOa6kFxuICAgICAgcmVzOiBsb2FkRXZlbnRTdGFydCAtIGRvbUNvbnRlbnRMb2FkZWRFdmVudEVuZCxcbiAgICAgIC8qIOWFs+mUruaAp+iDveaMh+aghyAqL1xuICAgICAgZmlyc3RieXRlOiByZXNwb25zZVN0YXJ0IC0gZG9tYWluTG9va3VwU3RhcnQsXG4gICAgICAvLyDpppbmrKHmuLLmn5MgICDku47or7fmsYLlvIDlp4vliLDmtY/op4jlmajlvIDlp4vop6PmnpDnrKzkuIDmibkgSFRNTCDmlofmoaPlrZfoioLnmoTml7bpl7Tlt65cbiAgICAgIGZwdDogcmVzcG9uc2VFbmQgLSBmZXRjaFN0YXJ0LFxuICAgICAgLy8g6aaW5qyh5Y+v5Lqk5LqSICDmtY/op4jlmajlrozmiJDmiYDmnIkgSFRNTCDop6PmnpDlubbkuJTlrozmiJAgRE9NIOaehOW7uu+8jOatpOaXtua1j+iniOWZqOW8gOWni+WKoOi9vei1hOa6kFxuICAgICAgdHRpOiBkb21JbnRlcmFjdGl2ZSAtIGZldGNoU3RhcnQsXG4gICAgICAvLyBSZWFkeSAg5aaC5p6c6aG16Z2i5pyJ5ZCM5q2l5omn6KGM55qEIEpT77yM5YiZ5ZCM5q2lIEpTIOaJp+ihjOaXtumXtFxuICAgICAgcmVhZHk6IGRvbUNvbnRlbnRMb2FkZWRFdmVudEVuZCAtIGZldGNoU3RhcnQsXG4gICAgICAvLyDpobXpnaLlrozlhajliqDovb0gIOmmluasoea4suafk+aXtumXtCArIERPTSDop6PmnpDogJfml7YgKyDlkIzmraUgSlMg5omn6KGMICsg6LWE5rqQ5Yqg6L296ICX5pe2XG4gICAgICBsb2FkOiBsb2FkRXZlbnRTdGFydCAtIGZldGNoU3RhcnQsXG4gICAgfTtcbiAgICBjb25zdCBiYXNlSW5mbyA9IGdldEJhc2VJbmZvKClcbiAgICBzZW5kUGVyZm9ybURhdGEoe1xuICAgICAgLi4uYmFzZUluZm8sXG4gICAgICAuLi5wZXJmb3JtYW5jZVBhcmFtc1xuICAgIH0pO1xuICB9O1xufVxuXG5leHBvcnQgY29uc3QgVmVyc2lvbiA9IFwiMC4wLjFcIjtcbiJdLCJzb3VyY2VSb290IjoiIn0=