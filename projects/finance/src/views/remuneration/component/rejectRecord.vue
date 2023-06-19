<template>
    <div>
        <el-dialog title="驳回记录" :visible.sync="rejectProps.dialogVisible" :width="appConfig.DIALOG_WIDTH_SMALL"
                   :close-on-click-modal="false">
            <el-table :data="rejectProps.list" border stripe :header-cell-style="appConfig.HEADER_STYLE" class="mb-18">
                <el-table-column min-width="150px" align="center" label="驳回时间" prop="updateTime" :resizable="false" >

                </el-table-column>
                <el-table-column min-width="90px" align="center" label="操作人" prop="operatorName" :resizable="false" >

                </el-table-column>
                <el-table-column min-width="200px;" align="center" label="驳回理由" prop="remark" :resizable="false"  v-if="showRemark" >

                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                dialogTitle: '驳回记录',
            }
        },
        computed:{

            showRemark(){
                return this.rejectProps.list && this.rejectProps.list[0].remark
            }
        },
        props: ['rejectProps'],

    }
</script>
<style>

</style>
