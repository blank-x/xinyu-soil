<template></template>
<script>
  import {setToken, removeToken } from '@/utils/auth'
  import {getQueryString } from '@/utils'
    export default {
      name: 'sso',
      data() {
        return {}
      },
      created() {
        let encrypt = getQueryString('ticket');
        if(encrypt){
           //1:存储token
           setToken(encrypt.split("!")[0]);
           this.$store.dispatch('GetSystem',encrypt.split("!")[1]); //获取用户系统列表
           //获取用户相关信息
           this.locationWebSite(encrypt.split("!")[1]);
         }
       },
      methods:{
        locationWebSite(systemId) {
          //获取系统的菜单及按钮权限
          this.$store.dispatch('GetSysRources', systemId).then((res) => {
            if (res.data) {
              this.$store.dispatch('clearVisitedViews')
              const rolesRouterMap = res.data.items;
              this.$store.dispatch('GenerateRoutes', {rolesRouterMap}).then(() => { // 生成可访问的路由表
                this.$router.addRoutes(this.$store.getters.addRouters) // 动态添加可访问路由表
                let router = getQueryString('router');
                let params = getQueryString('param');
                if(router && params){
                  this.$router.push({path: "/"+ router+"/"+params})
                }else if(router) {
                  this.$router.push({path: "/"+ router})
                }else{
                  this.$router.push({path: '/home'})
                }
              })
            }
          })
        }
      }
    }
</script>
