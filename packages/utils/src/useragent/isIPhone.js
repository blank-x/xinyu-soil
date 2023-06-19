/**
 * 检测当前浏览器是否为iPhone(Safari)
 */
export default function isIPhone(userAgent) {
    var ua = userAgent;
    if (ua.indexOf('iPhone') > -1) {
        return true;
    }
    return false;
}
