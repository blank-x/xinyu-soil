<template>
    <div class="row">
        <slot></slot>
    </div>
</template>

<script>
    export default {
    }
</script>

<style scoped>
    .row{
        display: flex;
        width:100%;
        margin-left: 2px;
    }
</style>