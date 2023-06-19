
<template>
    <el-row class="title">
        <slot></slot>
        <span class="text">{{titleParams.title }}</span>
        <el-button v-has="titleParams.permission.export" :style="appConfig.btnStyle120" @click="download" class="create" type="primary" :icon="titleParams.exportIcon || 'el-icon-printer'" v-if="titleParams.download">{{titleParams.downloadText || '导出数据'}}</el-button>

        <el-button v-has="titleParams.permission.add"  :style="appConfig.btnStyle120" @click="createItem" class="download" icon="el-icon-plus" type="primary"  v-if="titleParams.createItem">{{titleParams.createText || '添加'}}</el-button>

        <el-button     :style="appConfig.btnStyle120" @click="lock" class="download"   type="primary"  v-has="titleParams.permission.lock"  v-if="titleParams.lock">{{titleParams.lockText || '锁定'}}</el-button>

        <el-button    :style="appConfig.btnStyle120" @click="unlock" class="download" v-has="titleParams.permission.unlock"  type="primary"  v-if="titleParams.unlock">{{titleParams.unlockText || '解锁'}}</el-button>
    </el-row>
    <!--展示放这里 等权限都添加后  恢复-->
    <!-- v-has="titleParams.permission.add"-->
</template>

<script>
    /*本组件是各页面的搜索标题栏*/
    export default {
        data(){
            return{
            }
        },
        props:{
            titleParams:{
                type:Object,
                required:true,
            }
        },
        created(){
        },
        methods:{
            download(){
                this.$emit('downHandler')
            },
            createItem(){
                this.$emit('createHandler')
            },
            lock(){
                this.$emit('lockHandler')

            },
            unlock(){
                this.$emit('unlockHandler')
            }
        }
    }
</script>

<style scoped>
    .title{
        height:40px;
        border-bottom: 1px solid #EFF2F7;
        color:#1b2d3f;
        font-size: 18px;
        line-height: 32px;
        font-weight:500;
        clear: both;
        padding: 0px 0px 0 0px;
        background: #ffffff;
    }
    .create,.download{
        float:right;
        margin-top: 0px;
        margin-left:10px;
        font-size: 14px;
    }

    .text{
        float:left;
        font-size: 16px;
    }
</style>
