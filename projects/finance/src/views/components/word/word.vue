<template>
    <div class="word-content">
        <div v-if="title" class="title" :style="titleStyle">{{title}}</div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "word_detail",
        props:{
            title:{
                type:String
            },
            titleStyle:{
                type:Object
            }
        }
    }
</script>

<style scoped>
    .word-content{
        padding:0 25px;
    }
    .title{
        font-size: 22px;
        font-weight: 600;
        color: #000;
        text-align: center;
        margin-bottom: 20px;
    }

</style>