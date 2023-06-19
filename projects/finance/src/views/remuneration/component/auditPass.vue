<template>
    <div :style="styleBottom" ref="bottom" style="width:100%;background: #fff;z-index: 10;overflow: hidden;margin-left: -40px;padding-left: 40px;">
        <el-row style="padding : 6px 50px;background: #fff;margin:0 -50px;">
            <span type="text" style="color:#303133;font-size: 14px;">稿费合计 : </span>
            <span type="text" style="min-width:100px;text-align: left;color:#FF7802;font-size: 14px;display: inline-block">{{passAmount}}</span>
            <el-button type="primary" style="min-width:78px;height:32px;" v-show="!isLock" @click="pass" :disabled="disablePass" :loading="auditPassLoading">{{text}}</el-button>
            <el-button  type="primary" style="width:78px;height:32px; background: #FFBA75;border-color:#FFBA75;" :disabled="true" v-show="isLock">已锁定</el-button>
        </el-row>
    </div>
</template>

<script>

    export default {
        data(){
            return {
                hasSetPos:false,
                styleBottom:{},
                passAuth:true
            }
        },
        computed:{
            passAmount(){
                if(this.selectedItems.length === 0 ){
                    return 0
                }
                let temp = 0
                this.selectedItems.forEach(function (item) {
                    temp += parseInt(item.money)
                })
                return (temp/100).toFixed(2)
            },
            disablePass(){
                return this.selectedItems.length === 0 || !this.passAuth
            }
        },
        methods:{
            pass(){
                this.$emit('passAudit')
            },
            resetPos(){

                this.styleBottom =  {
                    marginTop:'-40px'
                }

                this.$nextTick(res=>{
                    const offsetTop = this.$refs.bottom.getBoundingClientRect().bottom
                    const winHeight = document.documentElement.clientHeight
                    if(offsetTop>=winHeight ){
                        this.styleBottom =  {
                            position:'fixed',
                            bottom:'0',
                            marginTop:'0',
                            boxShadow:'0 -1px 5px rgba(0,0,0,.12)'
                        }
                    }
                })

            }
        },
        props:{
            selectedItems:{
                type: Array,
                default: []
            },
            text:{
                type:String,
                default:'通过'
            },
            isLock:{
                type:Boolean,
                default:true
            },
            permission:{},
            auditPassLoading:{}

    },
        watch:{
            selectedItems(val){
                this.$nextTick(()=>{
                    this.resetPos()
                })
            }
        },
        created(){
            this.passAuth = this.$_has(this.permission)
        }
    }
</script>

<style scoped>

</style>