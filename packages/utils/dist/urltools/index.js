var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// 规范：https://zh.wikipedia.org/wiki/%E7%BB%9F%E4%B8%80%E8%B5%84%E6%BA%90%E6%A0%87%E5%BF%97%E7%AC%A6
var regUrl = /^((http|https):\/\/([^/?:]+)(?:\:(\d+))?)?(\/[^?#]*)(?:\?([^#]*))?(?:#(.*))?/i;
var EMPTY = '';
var undef = void 0;
var urlEncode = encodeURIComponent;
var toString = {}.toString;
//val不能是function/object
function isValidParamValue(val) {
    var type = typeof val;
    // If the type of val is null, undef, number, string, boolean, return TRUE.
    return val == null || (type !== 'object' && type !== 'function');
}
function isArray(o) {
    return toString.apply(o) === '[object Array]';
}
// decode query参数
function urlDecode(s) {
    try {
        return decodeURIComponent(s.replace(/\+/g, ' '));
    }
    catch (e) {
        console.warn('urlDecode ERROR:', e);
        return '';
    }
}
/**
 * 根据一个对象，拼接成一个query字符串
 *
 * for example:
 *     @example
 *     {foo: 1, bar: 2}    // -> 'foo=1&bar=2'
 *     {foo: 1, bar: [2, 3]}    // -> 'foo=1&bar=2&bar=3'
 *     {foo: '', bar: 2}    // -> 'foo=&bar=2'
 *     {foo: undef, bar: 2}    // -> 'foo=undef&bar=2'
 *     {foo: TRUE, bar: 2}    // -> 'foo=TRUE&bar=2'
 *
 * @param {Object} o json data
 * @param {String} [sep='&'] separator between each pair of data
 * @param {String} [eq='='] separator between key and value of data
 * @param {Boolean} [serializeArray=false] whether add '[]' to array key of data，缺省是把[]符号也编码
 * @return {String}
 * @member KISSY
 */
export function makeQuery(queryObj, sep, eq, serializeArray) {
    if (sep === void 0) { sep = '&'; }
    if (eq === void 0) { eq = '='; }
    if (serializeArray === void 0) { serializeArray = false; }
    var buf = [];
    var _loop_1 = function (key) {
        var val = queryObj[key];
        var originalKey = key;
        key = urlEncode(key);
        // val 不是object 和 function
        if (isValidParamValue(val)) {
            buf.push(key);
            if (val !== undef) {
                buf.push(eq, urlEncode(val + EMPTY));
            }
            buf.push(sep);
        }
        else if (isArray(val)) {
            // val是数组,数组元素不能是object,function
            if (val.length) {
                val.forEach(function (item) {
                    if (isValidParamValue(item)) {
                        buf.push(key, serializeArray && originalKey.slice(0 - 2) !== '[]' ? urlEncode('[]') : EMPTY);
                        if (item !== undef) {
                            buf.push(eq, urlEncode(item + EMPTY));
                        }
                        buf.push(sep);
                    }
                });
            }
            else {
                buf.push(key, eq, sep);
            }
        }
    };
    for (var key in queryObj) {
        _loop_1(key);
    }
    buf.pop();
    return buf.join(EMPTY);
}
/**
 * Parses a URI-like query string and returns an object composed of parameter/value pairs.
 *
 * for example:
 *      @example
 *      'section=blog&id=45'        // -> {section: 'blog', id: '45'}
 *      'section=blog&tag=js&tag=doc' // -> {section: 'blog', tag: ['js', 'doc']}
 *      'tag=ruby%20on%20rails'        // -> {tag: 'ruby on rails'}
 *      'id=45&raw'        // -> {id: '45', raw: ''}
 * @param {String} str param string
 * @param {String} [sep='&'] separator between each pair of data
 * @param {String} [eq='='] separator between key and value of data
 * @return {Object} json data
 */
export function parseQuery(str, sep, eq) {
    if (sep === void 0) { sep = '&'; }
    if (eq === void 0) { eq = '='; }
    var ret = {}, pairs = str.split(sep);
    pairs.forEach(function (item) {
        var eqIndex = item.indexOf(eq);
        var key, val;
        if (eqIndex === -1) {
            key = urlDecode(item);
            val = undef;
        }
        else {
            // remember to decode key!
            key = urlDecode(item.substring(0, eqIndex));
            val = item.substring(eqIndex + 1);
            // http://stackoverflow.com/questions/9064536/javascript-decodeuricomponent-malformed-uri-exception
            val = urlDecode(val);
            if (key.slice(0 - 2) === '[]') {
                key = key.slice(0, 0 - 2);
            }
        }
        if (key in ret) {
            if (isArray(ret[key])) {
                ret[key].push(val);
            }
            else {
                ret[key] = [ret[key], val];
            }
        }
        else {
            ret[key] = val;
        }
    });
    return ret;
}
export function isValidUrl(url) {
    return !(url.match(regUrl) === null);
}
/*
* url示例
        origin             path
  ┌───────┴───────────┐┌────┴────┐
* abc://example.com:1234/path/data?key=value&key2=value2#fragid1
  └┬┘   └─────┬───┘ └─┬┘           └─────────┬─────────┘ └──┬──┘
scheme       host   port                   query           hash
*/
export function parseUrl(url) {
    var str = url;
    var scheme = '';
    var host = '';
    var port = '';
    var origin = '';
    var path = '';
    var query = '';
    var hash = '';
    var ret = {
        url: url,
        scheme: scheme,
        host: host,
        port: port,
        origin: origin,
        path: path,
        query: query,
        hash: hash
    };
    var match = str.match(regUrl);
    if (match === null) {
        return null;
    }
    origin = match[1] || '';
    scheme = match[2] || '';
    host = match[3] || '';
    port = match[4] || '';
    path = match[5] || '';
    query = match[6] || '';
    hash = match[7] || '';
    // 其他字符
    // str = match[5]
    // let hashIndex = str.indexOf('#')
    // if (hashIndex !== -1) {
    //     // url中有#的情況，先把hash分离出去
    //     hash = str.substring(hashIndex + 1)
    //     str = str.substring(0, hashIndex)
    // }
    // let queryIndex = str.indexOf('?')
    // //分离出path 和 query,hash
    // if (queryIndex !== -1) {
    //     // url中有?的情況
    //     path = str.substring(0, queryIndex)
    //     query = str.substring(queryIndex + 1)
    // } else {
    //     // url中沒有?的情況
    //     path = str
    // }
    ret = Object.assign(ret, {
        origin: origin,
        scheme: scheme,
        host: host,
        port: port,
        path: path,
        query: query,
        hash: hash
    });
    return ret;
}
// 根据urlObj构建一个url
/*
urlObj = {
    query: Object,
    origin: String,
    path: String,
    hash: String
}
*/
export function makeUrl(urlObj) {
    var queryObj = urlObj['query'] || {};
    var query = makeQuery(queryObj);
    var buf = [];
    buf.push(urlObj['origin'] ? urlObj['origin'] : '');
    buf.push(urlObj['path']);
    buf.push(query ? '?' + query : '');
    buf.push(urlObj['hash'] ? '#' + urlObj['hash'] : '');
    return buf.join(EMPTY);
}
export function setUrlParams(url, addObj, delObj) {
    if (addObj === void 0) { addObj = {}; }
    if (delObj === void 0) { delObj = {}; }
    var urlObj = parseUrl(url);
    var query = urlObj['query'];
    var queryObj = parseQuery(query);
    for (var key in addObj) {
        if (addObj[key]) {
            queryObj[key] = addObj[key];
        }
    }
    for (var key in delObj) {
        delete queryObj[key];
    }
    // make url
    urlObj = __assign(__assign({}, urlObj), { query: queryObj });
    var newUrl = makeUrl(urlObj);
    return newUrl;
}
// key是url的参数的名字，如果不传默认返回所有的query组成的对象
// 如果key不存在，返回undefined
// 如果url不合法，也返回undefined
export function getUrlParams(url, key) {
    if (key === void 0) { key = undef; }
    var urlObj = parseUrl(url);
    if (urlObj === null) {
        return undef;
    }
    var query = urlObj['query'];
    var queryObj = parseQuery(query);
    if (key) {
        return queryObj[key];
    }
    else {
        return queryObj;
    }
}
export default {
    isValidUrl: isValidUrl,
    setUrlParams: setUrlParams,
    getUrlParams: getUrlParams
};
