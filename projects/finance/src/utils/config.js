/**
 * Created by zhengqiang.liu on 2017/11/30.
 */
import store from "@/store";
export default {
    install(Vue, options) {
        Vue.prototype.appConfig = {
            PAGE_SIZE: [20, 40, 80, 100], //分页数组
            DEFAULT_PAGE_SIZE:store.getters.pagination.pageSize || 40,
            HEADER_STYLE: {"background": "#EFF2F7","height": "48px!important",padding:'5px 0'},//表头背景色，高度
            SEARCHEMPTY_TEXT: '查询无结果',//查询无数据时提示
            EMPTY_TEXT: '暂无数据',//无数据时提示
            btnStyle88: 'width:78px;height:32px;',
            btnStyle120: 'width:120px;height:32px;',
            btnStyle60: 'width:60px;height:32px;',
            input180: 'width:180px;',
            input140: 'width:140px;',
            UPLOAD_API: process.env.CONTENT_API+'/upload/tempdir',
            DIALOG_WIDTH_SMALL: '480px',
            DIALOG_WIDTH_MAX: '860px',
            APP_COLOR: '#1aaee5',
            VIP_IMG: require('@/assets/manage_images/vip.gif'),//章节vip
            DEFAULT_IMG: 'this.src="' + require('@/assets/manage_images/motie.jpg') + '"',//图片加载失败
        },
        Vue.prototype.$_has = function (rArray) {
          //页面按钮权限校验
            let resources = [];
            let permission = true;
            if (Array.isArray(rArray)) {
                rArray.forEach(function (e) {
                    resources = resources.concat(e);
                });
            } else {
                resources = resources.concat(rArray);
            }
            resources.forEach(function (p) {
                if (!store.getters.resourcePermission[p]) {
                    return permission = false;
                }
            });
          //console.log(resources, permission);
            return permission;
        }
    }
}
