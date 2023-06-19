import isAndroid from "../lib/device/isAndroid";
import isIphone from "../lib/device/isIPhone";

describe('设备判断/device', ()=> {
    // 夸克浏览器
    const QuarkUa = 'Mozilla/5.0 (Linux; U; Android 9; zh-CN; MI 6X Build/PKQ1.180904.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 Quark/4.2.1.138 Mobile Safari/537.36'
    const iphoneUa = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/604.3.5 (KHTML, like Gecko) Version/13.0 MQQBrowser/9.9.1 Mobile/15B87 Safari/604.1 QBWebViewUA/2 QBWebViewType/1 WKType/1'
    test('判断夸克浏览器userAgent判断是否是安卓',()=>{
        expect(isAndroid(QuarkUa)).toBe(true)
    })
    test('判断夸克浏览器userAgent判断是否是安卓',()=>{
        expect(isAndroid(iphoneUa)).toBe(false)
    })

    test('判断是否是Iphone',()=>{
        expect(isIphone(iphoneUa)).toBe(true)
    })
    test('判断是否是Iphone',()=>{
        expect(isIphone(QuarkUa)).toBe(false)
    })
})
