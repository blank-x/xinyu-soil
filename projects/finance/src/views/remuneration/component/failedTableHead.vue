<template>
  <thead>
    <th style="width:80px">作者ID</th>
    <th style="width:130px">作者笔名</th>
    <th style="width:110px">缺陷提示</th>
    <th style="width:300px">作家信息</th>
    <th style="width:90px">作品ID</th>
    <th style="width:152px">作品名称</th>
    <th style="width:90px">责编</th>
    <th style="width:93px">所属CP</th>
    <th style="width:105px">签约状态</th>
    <th style="width:105px">合作模式</th>
    <th style="width:105px">稿费总收入</th>
    <th style="width:70px">签署人</th>
    <th style="width:105px">稿费类型</th>
    <th style="width:90px">稿费</th>
    <th style="width:265px;">备注</th>
    </thead>
</template>

<script>
    export default {
        props: {
            editorName: {
                default: false
            },
            pageName:{
                default:''
            }
        }
    }
</script>

