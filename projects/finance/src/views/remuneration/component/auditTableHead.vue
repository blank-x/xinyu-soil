<template>
    <thead>
    <th style="width:80px">作者ID</th>
    <th style="width:130px">作者笔名</th>
    <th style="width:100px">稿费总收入</th>
    <th style="width:90px">作品ID</th>
    <th style="width:152px">作品名称</th>
    <th style="width:90px" v-if="editorName">责编</th>
    <th style="width:93px">所属CP</th>
    <th style="width:105px">签约状态</th>
    <th style="width:105px">合作模式</th>
    <th style="width:105px">作品稿费</th>
    <th style="width:70px">签署人</th>
    <th style="width:32px" v-if="pageName != 'cashFail'">
        <input type="checkbox" class="el-checkbox__input_box el-checkbox__input_header" checked>
    </th>
    <th style="width:105px" v-if="pageName == 'cashFail'">
        所属月份
    </th>
    <th style="width:105px">稿费类型</th>
    <th style="width:90px">稿费</th>
    <th style="min-width:165px;">备注</th>
    <th style="width:90px" v-if="pageName != 'cashFail'">操作</th>
    <th style="width:90px" v-if="pageName == 'cashFail'">
        失败理由
    </th>
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

