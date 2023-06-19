<template>
    <!--<a target="_blank" @click="showDialog()"  class="hoverLink">{{row.authorId || row.userId }}</a>-->
  <a target="_blank" :href="row.authorId?'http://www.motie.com/manage/people/'+row.authorId: 'http://www.motie.com/manage/people/'+row.userId"
     class="hoverLink">{{row.authorId || row.userId}}</a>
</template>
<script type="text/ecmascript-6">
  export default{
    name:'notEnabled',
    methods:{
      showDialog(){
        this.$notify({
           title: '提示',
           message: '功能未启用',
           type: 'warning'
         });
      }
    },
    props:['row']
  }
</script>
