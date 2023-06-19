/**
 * Created by zhengqiang.liu on 2018/2/7.平台跳转公共类
 **/
import store from "@/store";
import {getToken} from '@/utils/auth'
/**
 * 根据Id 生成跨平台详情页链接
 * @param Id
 * @returns {string}
 */
export function createCrossPlatformUrl(router,Id) {
    let contentSys = store.getters.systems.find((item)=>{
        return item.id == 1
    });
    if(typeof contentSys == "undefined"){
        return 'javaScriipt:void(0)'
    }
    let timestamp = Math.round(new Date())
    return contentSys.path+'#sso/?timestamp='+timestamp+'&ticket='+getToken()+"!"+contentSys.id+"&router="+router+"&param="+Id;
}
