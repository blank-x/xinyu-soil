<template>
    <div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogProps.dialogVisible" width="860px" :lock-scroll="false"
                    :close-on-click-modal="false">
            <el-table :data="dialogProps.list"  element-loading-text="加载中.." border stripe fit
                      highlight-current-row   max-height="400"
                       style="width:100%;margin-bottom:18px;overflow: hidden"
                      :header-cell-style="appConfig.HEADER_STYLE">

                <el-table-column align="center" label="审核状态" min-width="80" prop="oldStatusDesc">
                </el-table-column>

                <el-table-column align="center" label="审核人" width="80" prop="operatorName">
                </el-table-column>

                <el-table-column align="center" label="审核结果" min-width="80" prop="newStatusDesc">
                </el-table-column>

                <el-table-column align="center" label="理由" min-width="120" prop="remark">
                    <template slot-scope="scope">
                        <span>{{scope.row.remark || '------'}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="审核时间"  prop="createTime">
                    <template slot-scope="scope">
                      <span class="operate">{{scope.row.createTime}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                dialogTitle: '审核记录',
            }
        },
        props: ['dialogProps'],
    }
</script>
<style>

</style>
