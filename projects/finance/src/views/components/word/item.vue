<template>
    <div  class="item">
         <slot></slot>
    </div>
</template>

<script>
    export default {
    }
</script>

<style scoped>
.item{
    flex:1;
    border:2px solid #ebeef5;
    border-bottom: none;
    margin-left: -2px;
    line-height: 20px;
    padding: 10px 0;
    padding-left: 20px;
}
</style>