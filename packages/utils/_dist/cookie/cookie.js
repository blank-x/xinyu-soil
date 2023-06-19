"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delCookie = exports.setCookie = exports.getAllCookie = exports.getCookie = void 0;
function getCookie(name) {
    var result = new RegExp("(?:^|; )" + encodeURIComponent(name) + "=([^;]*)").exec(document.cookie);
    if (result) {
        return decodeURIComponent(result[1]);
    }
    return '';
}
exports.getCookie = getCookie;
function getAllCookie() {
    var arr = document.cookie.split('; ');
    var res = {};
    arr.forEach(function (item) {
        var group = item.split('=');
        var name = group[0];
        var value = group[1];
        try {
            name = decodeURIComponent(name);
            value = value ? decodeURIComponent(value) : value;
            // cookie中有多个同名cookie时，前面不会被覆盖，后面同名cookie被舍弃，跟getCookie返回的结果一致
            if (!res[name]) {
                res[name] = value;
            }
        }
        catch (e) {
            console.warn(e);
            console.info("parse " + name + "/" + value + " \u51FA\u9519");
        }
    });
    return res;
}
exports.getAllCookie = getAllCookie;
// 不设置exhours过期时间时，系统默认不设置过期时间，关闭浏览器之后，cookie就失效(但是有的浏览器在设置无过期时间的cookie时因为浏览器甚至问题，导致cookie长期存在：https://stackoverflow.com/questions/10617954/chrome-doesnt-delete-session-cookies);当设置的过期时间是过去的一个时间时，就是删除该cookie
// 不设置path时，path为空，此时系统设置的path是当前页面所在的path
// 不设置domain时，系统默认设置的是domain是当前页面的域名而不一定是根域名，例如x.y.daojia.com
// 例如：在页面https://jzt.daojia.com/home/indexPage?channel=wxwallet&hmsr=wxwallet设置cookie不传path和domain时，设置的path是/home,设置的域名是jzt.daoja.com
function setCookie(name, value, exhours, path, domain) {
    var d;
    var expires;
    if (!exhours) {
        expires = '';
    }
    else {
        d = new Date();
        d.setTime(d.getTime() + (exhours * 60 * 60 * 1000));
        expires = "; expires=" + d.toUTCString();
    }
    var cookiePath = path ? "; path=" + path : '';
    var cookieDomain = domain ? "; domain=" + domain : '';
    document.cookie = name + "=" + value + expires + cookiePath + cookieDomain;
}
exports.setCookie = setCookie;
// 删除cookie,name,path,domain必传
function delCookie(name, path, domain) {
    setCookie(name, '', -1, path, domain);
}
exports.delCookie = delCookie;
exports.default = {
    getCookie: getCookie,
    setCookie: setCookie,
    delCookie: delCookie,
    getAllCookie: getAllCookie
};
