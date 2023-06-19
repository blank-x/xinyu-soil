<template>
    <div  style="height:60px;text-align: center;color:#909399;padding-top: 25px;background: #fff;border:1px solid #ebeef5" v-if="listLen === 0 ">
        {{init?'暂无数据':'查询无结果'}}
    </div>

</template>
<script>
    export default {
        props:['listLen','init'],
    }
</script>