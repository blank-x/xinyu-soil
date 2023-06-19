<template>
  <div class="noData">
    <img class="img_noData" :src="img_noData" alt="暂无数据"><br/>
    <span style="color:#666 ">{{message}}</span>
  </div>
</template>

<script>
import img_noData from '@/assets/404_images/noData.png'
export default {
  props:{
    msg:{
      type:String,
      default:'暂无数据......'
    }
  },
  data() {
    return {
      img_noData,
    }
  },
  computed: {
    message() {
      return this.msg
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.noData{
  width: 100%;
  text-align: center;
  img{
    margin-top: 15vh;
  }
}
</style>
