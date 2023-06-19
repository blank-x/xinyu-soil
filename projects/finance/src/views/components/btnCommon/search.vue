<template>
  <el-button :style="appConfig.btnStyle88" :loading="listLoading" @click="search" @keyup.enter.native="search" type="primary" size="small" icon="el-icon-search" v-waves>
    查询
  </el-button>
</template>
<script>
  import waves from '@/directive/waves.js'// 水波纹指令
  /*搜索按钮*/
  export default {
    name: "search",
    methods: {
      search(){
        this.$emit('search')
      }
    },
    props: [ 'listLoading'],
    directives: {
      waves
    },
  }
</script>
