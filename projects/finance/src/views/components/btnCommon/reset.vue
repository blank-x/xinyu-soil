<template>
  <el-button :style="style" @click="reset" type="plain" icon="el-icon-refresh" v-waves>重置</el-button>
</template>

<script>
  import waves from '@/directive/waves.js'// 水波纹指令
  /*搜索按钮*/
  export default {
    name: "reset",
    data(){
      return {
        style: this.appConfig.btnStyle88 + ';border-color:' + this.appConfig.APP_COLOR + ';color:' + this.appConfig.APP_COLOR
      }
    },
    methods: {
      reset(){
        this.$emit('reset')
      }
    },
    directives: {
      waves
    },
  }
</script>
