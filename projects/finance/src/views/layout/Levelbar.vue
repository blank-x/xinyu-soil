<template>
  <el-breadcrumb class="app-levelbar">
    <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path">
      <span v-if='isRouted(item)' class="no-redirect">{{item.name}}</span>
      <router-link v-else :to="item.path+'?t='+new Date().getTime()" class="crumbLink">{{item.name}}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    created() {
      this.getBreadcrumb()
    },
    data() {
      return {
        levelList: null
      }
    },
    methods: {
      getBreadcrumb() {

        let matched = this.$route.matched.filter((item) => {
          if (this.$route.meta.dynamic) {
            if (item.name == this.$route.name) {
              item.name = item.name.indexOf('年') != -1 ? item.name : this.$route.params[this.$route.meta.dynamic].replace(/-/g, '年') + '月' + item.name
            }
          }
          return item.name
        })

        const first = matched[0]
        if (first && (first.name !== '首页' || !(first.path === '' || first.path === '/'))) {
          matched = [{name: '首页', path: '/home'}].concat(matched)
        }

        if(this.$route.matched[this.$route.matched.length - 1].path.indexOf(':') != -1){
          let routeObj = this.$route.matched[this.$route.matched.length - 1].path
          let paramsId = ''
          for (var i in this.$route.params) {
            paramsId += "/" +this.$route.params[i]
          }
          routeObj = routeObj.slice(0, routeObj.indexOf(':')-1) + paramsId
          console.log(routeObj)
          matched[matched.length - 1].path=routeObj
        }
        this.levelList = matched
      },
      isRouted(item){
        if (item.path == '/home') {
          return false
        } else if (!item.parent || item.path.split("/").length == 2) {
          return true
        } else {
          return false
        }
      }

    },
    watch: {
      $route() {
        this.getBreadcrumb()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-levelbar.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
    .el-icon-arrow-right {
      line-height: 50px;
    }
    .crumbLink {
      color: #606266 !important
    }
    .crumbLink:hover {
      color: #1aaee5 !important;
      cursor: pointer;
    }
  }
</style>
