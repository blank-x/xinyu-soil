<template>
	<div id="app">
    <div>
      <el-button v-waves type="plain" icon="el-icon-refresh">搜索</el-button>
    </div>
    <div>

    </div>
		
	</div>
</template>

<script>
  import waves from '@/directive/waves.js'// 水波纹指令
  import {mapGetters} from 'vuex'

  export default{
    name: 'APP',
    directives: {
      waves
    },
  }
</script>

<style lang="scss">
@import '~normalize.css/normalize.css';// normalize.css 样式格式化
 
</style>
