<template>
  <div class='menu-wrapper'>

    <template v-for="item in routes">
      <!--<router-link v-if="!item.hidden&&item.noDropdown&&item.children.length>0"-->
      <!--:to="item.path+'/'+item.children[0].path">-->
      <!--<el-menu-item :index="item.path+'/'+item.children[0].path" class='submenu-title-noDropdown'>-->
      <!--<icon-svg v-if='item.icon' :icon-class="item.icon"  ></icon-svg>-->
      <!--<span>{{item.children[0].name}}</span>-->
      <!--</el-menu-item>-->
      <!--</router-link>-->
      <el-submenu :index="item.name" v-if="!item.noDropdown&&!item.hidden">
        <template slot="title">
          <!--<router-link :to="item.path+'/'+item.children[0].path" class="link-router">-->
          <!--</router-link>-->
          <icon v-if='item.icon' :name="item.icon"></icon>
          <!--<icon-svg v-if='item.icon' :icon-class="item.icon"></icon-svg>-->
          <span>{{item.name}}</span>
          <i class="el-icon-arrow-down submenu__icon-arrow"></i>
        </template>
        <template v-for="child in item.children" v-if='!child.hidden' >
          <sidebar-item class='nest-menu' v-if='child.children&&child.children.length>0'
                        :routes='[child]'></sidebar-item>
          <router-link v-else :to="item.path+'/'+child.path" @click.native="flushCom(item.path+'/'+child.path)" >
            <el-menu-item :index="item.path+'/'+child.path" style="padding-left: 34px;" data-i="2" >
              <icon-svg v-if='child.icon' :icon-class="child.icon"></icon-svg>
              <span >{{child.name}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      }
    },
    methods: {
      flushCom: function (path) {
        this.$router.push({
          path,
          query: {
            t: +new Date() //保证每次点击路由的query项都是不一样的，确保会重新刷新view
          }
        })
      }
    },
    computed: {},
    created(){
    }
  }
</script>
<style>
  .fa-icon {
    margin-right: 1px;
  }
   .nest-menu .el-submenu .el-submenu__title {
    font-weight: normal;
  }

  .nest-menu .el-submenu .el-menu .el-menu-item{
    color: #909399;
  }
  .nest-menu .el-submenu .el-menu .el-menu-item.is-active{
    color: #1aaee5;
  }
</style>

