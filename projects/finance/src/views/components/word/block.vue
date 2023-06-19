<template>
    <div class="block">
        <div class="title" v-if="!!title">{{title}}</div>
        <div class="item-list">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
            title:{
                type:String
            }
        }
    }
</script>

<style scoped lang="scss">
    .item-list{
        border-bottom: 2px solid #ebeef5;
    }
    .title{
        font-size: 18px;
        font-weight: 600;
        padding-bottom: 20px;
        color:#000;
    }
    .block{
        margin-bottom: 18px;
    }

</style>
