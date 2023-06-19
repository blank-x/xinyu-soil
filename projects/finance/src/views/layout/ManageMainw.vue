<template>
    <div class="sysbox">
        <el-row class="sys-title">
            <el-col  :span="6" :offset="9">
                <img src="~assets/manage_images/system-logo.png" alt="">
            </el-col>
        </el-row>
        <div class="item-list">
            <el-row :gutter="20"  style="width: 100%">
                <el-col :span="12" class="system-icon"  v-for="item in systems" :key="Math.random()" v-if="!item.logicalDel">
                    <img :title="item.name" @click="locationWebSite(item)" class="user-avatar" :src="'./static/manage_images/'+item.icon+'.png'">
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
  import store from '@/store'
  import router from '@/router'
  import {mapGetters} from 'vuex'
  import {getToken} from '@/utils/auth'
  export default {
    data() {
      return {}
    },
    computed: {
      ...mapGetters([
        'systems',
      ])
    },
    methods: {
      locationWebSite(currentSystem) {
        //获取系统的菜单及按钮权限
        let timestamp = Math.round(new Date())
        window.location.href = currentSystem.path+'#sso/?timestamp='+timestamp+'&ticket='+getToken()+"!"+currentSystem.id;
        /*this.$store.dispatch('GetSysRources', currentSystem.id).then((res) => {
          if (res.data) {
            this.$store.dispatch('clearVisitedViews')
            this.$store.dispatch('setCurrentSystem', currentSystem);
            const rolesRouterMap = res.data.items;
            this.$store.dispatch('GenerateRoutes', {rolesRouterMap}).then(() => { // 生成可访问的路由表
              this.$router.addRoutes(this.$store.getters.addRouters) // 动态添加可访问路由表
              this.$router.push({path: '/home'})
            })
          }
        })*/
      }
    },

  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>



    .el-col-8 a:hover .user-avatar {
        position: relative;

    }

    .sysbox {
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        overflow: hidden;
        padding: 120px 0 0px 0;
    }
    .item-list{
        display: flex;
        flex-wrap:  wrap;
        margin:0 auto;
        width: 40%;
    img{
        width:100%;
        transition: all .3s ease-out;
    &:hover{
         box-shadow: 0 2px 14px rgba(0,0,0,.3);

     }
    }
    }

    .system-icon {
        margin-bottom: 18px;
        cursor: pointer;

    }
    .sys-title{
        margin: 0 auto 40px;
        text-align: center;

    img{
        width: 100%;

    }

    }
</style>
