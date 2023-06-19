"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isMobile() {
    return /Android|webOS|iPhone|iPod|BlackBerry|iPad/i.test(window.navigator.userAgent);
}
function isAndroid() {
    return /(Android)/i.test(window.navigator.userAgent);
}
function isIos() {
    return /(iPhone|iPad|iPod|iOS)/i.test(window.navigator.userAgent);
}
function getBrowserType() {
    var userAgent = navigator.userAgent;
    var isOpera = userAgent.indexOf("Opera") > -1;
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera;
    var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE;
    var isFF = userAgent.indexOf("Firefox") > -1;
    var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1;
    var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return "ie7";
        }
        else if (fIEVersion == 8) {
            return "ie8";
        }
        else if (fIEVersion == 9) {
            return "ie9";
        }
        else if (fIEVersion == 10) {
            return "ie10";
        }
        else if (fIEVersion == 11) {
            return "ie11";
        }
    }
    if (isFF) {
        return "ff";
    }
    if (isOpera) {
        return "opera";
    }
    if (isSafari) {
        return "safari";
    }
    if (isChrome) {
        return "chrome";
    }
    if (isEdge) {
        return "edge";
    }
    return "";
}
exports.default = {
    isMobile: isMobile,
    getBrowserType: getBrowserType,
    isAndroid: isAndroid,
    isIos: isIos
};
