<template>
    <!--<el-popover-->
            <!--placement="left"-->
            <!--popper-class="popover"-->
            <!--width="180"-->
            <!--v-if="text && text.length>lenNum*rowNum"-->
            <!--trigger="hover">-->
        <!--<span slot="reference" v-html="textResult"></span>-->
        <!--<pre class="pop" v-html="text"></pre>-->
    <!--</el-popover>-->
  <span v-if="text" >{{text}}</span>
    <span  v-else>------</span>
</template>

<script>
    /*搜索按钮*/
    export default {
        data() {
            return {
                lenNum:12,
                rowNum:2
            }
        },
        computed: {
            textResult() {
                if (this.text) {
                    let temp = this.text
                    temp = this.text.replace(/\<br\>|\<br\/\>/g,'')
                    if(temp.length<=12){
                        return temp
                    }
                    if(temp.length<=24){
                        return '<span >'+temp.substring(0,this.lenNum)+'</span><br><span >'+temp.substring(this.lenNum,this.lenNum*2)+'</span>'
                    }
                    if(temp.length>24){
                        return '<span >'+temp.substring(0,this.lenNum)+'</span><br><span >'+temp.substring(this.lenNum,this.lenNum*2-1)+'...</span>'
                    }
                }else{
                    return '------'
                }
            },
        },
        props: ['text']
    }
</script>

