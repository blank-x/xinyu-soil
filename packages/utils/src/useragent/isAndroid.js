/**
 * 检测当前浏览器是否为Android(Chrome)
 */
export default function  isAndroid(userAgent){
    var ua =  userAgent
    if (ua.indexOf('Android') > -1) {
        return true;
    }
    return false;
}
