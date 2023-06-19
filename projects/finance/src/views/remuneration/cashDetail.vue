<template>
    <div class="app-container">
        <contentTitle :titleParams="{ title: '稿费明细',permission:permission}"></contentTitle>
        <el-row style="height:40px;padding-top:12px;font-size: 14px;">
            <el-col :span="4">
                <span>作者ID:</span>
                <notEnabled :row="dataList"></notEnabled>
            </el-col>

            <el-col :span="4">
                <span>作者笔名:</span>
                <a target="_blank" :href="'http://www.motie.com/people/'+dataList.authorId">{{dataList.penName}}</a>
            </el-col>
            <el-col :span="4">
                <span>签署人:</span>

                <span v-text="dataList.realName"></span>
            </el-col>

        </el-row>

        <el-table :data="list" v-loading="listLoading" element-loading-text="加载中.." border stripe fit ref="listTable"
                  highlight-current-row :empty-text="emptyText" :header-cell-style="appConfig.HEADER_STYLE"
                  :span-method="arraySpanMethod" :max-height="tableHeight-80">
            <el-table-column align="center" label="作品ID" prop="bookId" width="100">
                <template slot-scope="scope">
                    <a class="hoverLink" :href="$options.filters.createToBooKUrl(scope.row.bookId)"
                       target="_blank">{{scope.row.bookId}}</a>

                </template>
            </el-table-column>
            <el-table-column align="center" min-width="125" label="作品名称" prop="bookName">
                <template slot-scope="scope">
                    <a target="_blank" :href="scope.row.bookId | createBookLink"
                       class="hoverLink">{{scope.row.bookName}}</a>
                </template>
            </el-table-column>

            <el-table-column align="center" label="所属CP" prop="cpName" width="100">

            </el-table-column>

            <el-table-column align="center" label="作品稿费" prop="sumMoneyBookYuan">

            </el-table-column>

            <el-table-column align="center" label="稿费类型" prop="typeDesc">
                <template slot-scope="scope">

                    <openPayDetail :detailData="{
                        type:scope.row.type,
                        typeDesc:scope.row.typeDesc,
                        bookId:scope.row.bookId,
                        bookName:scope.row.bookName,
                        dealMonth:$route.params.dealMonth
                    }"></openPayDetail>
                </template>

            </el-table-column>

            <el-table-column align="center" label="稿费" prop="moneyYuan">

            </el-table-column>

            <el-table-column align="center" label="备注" prop="remark" min-width="185">

            </el-table-column>

            <el-table-column align="center" label="结算状态" prop="payStatusDesc" min-width="125">

            </el-table-column>
            <el-table-column align="center" label="结算时间" prop="authorPayTime" min-width="125">
                <template slot-scope="scope">
                    <span >{{scope.row.authorPayTime || '------'}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="结算方式" prop="cashTypeDesc" min-width="125">
                <template slot-scope="scope">
                    <span class="operate" v-text="scope.row.cashTypeDesc"></span>
                </template>
            </el-table-column>
        </el-table>
        <sticky :stickyTop="1000" :className="'sticky'" v-if="dataList.payLogInfos">
            <div class="summaryBox">
                <div class="tabSummary">
                    <ul>
                        <li v-for="item in dataList.payLogInfos">{{item.typeDesc}}：{{item.moneyYuan}}</li>
                    </ul>
                </div>
                <div class="summary" style="border: 0px">
                    <label>稿费合计:<span v-text="dataList.sumMoneyYuan"></span></label>
                </div>
            </div>
        </sticky>

    </div>
</template>

<script type="text/ecmascript-6">
    import {fetchCashDetailById} from '@/api/auditCommon'
    import {permission} from '@/api/auditPartnersFirst'
    import {mergeDataConvert} from '@/utils'
    import Sticky from '@/components/Sticky'
    import openPayDetail from '@/views/remuneration/component/openPayDetail'
    import tableMixin from '@/mixins/tableHeight'

    export default {
        components: {Sticky, openPayDetail},
        mixins: [tableMixin],
        data() {
            return {
                //分页查询参数
                list: [],
                dataList: [],
                listLoading: true,
                emptyText: '',
                init: true,
                id: this.$route.params.id,
                permission: permission,

            }
        },
        computed: {},
        methods: {

            // 获取稿费明细
            fetchList() {
                this.listLoading = true;
                fetchCashDetailById(this.id).then(response => {
                    let condition = {
                        key: 'payStatus',
                        payStatus: {
                            column: 'payStatus'
                        },
                        // 结算状态
                        payStatusDesc: {
                            column: 'payStatus'
                        },
                        // 结算时间
                        authorPayTime: {
                            column: 'payStatus'
                        },
                        // 结算方式
                        cashTypeDesc: {
                            column: 'payStatus'
                        },

                        bookId: {
                            column: 'bookId'
                        },
                        bookName: {
                            column: 'bookId'
                        },
                        cpName: {
                            column: 'bookId'
                        },
                        sumMoneyBookYuan: {
                            column: 'bookId',
                        }
                    }

                    if (response.data.items) {
                        this.dataList = response.data.items;
                        this.list = mergeDataConvert({
                            data:this.dataList.authorCashPayLogInfos,
                            keys:condition,
                            onlyMerge:true
                        } );

                    } else {
                        this.list = response.data.items || []
                    }
                    this.listLoading = false
                    if (this.init) {
                        this.emptyText = '暂无数据'
                        this.init = false
                    } else {
                        this.emptyText = '查询无结果'
                    }
                });
            },

            // 单元格合并方式
            arraySpanMethod({row, column, rowIndex, columnIndex}) {

                if (row.mergeData.hasOwnProperty(column.property)) {
                    return {
                        rowspan: row.mergeData[column.property] || 0,
                        colspan: row.mergeData[column.property] ? 1 : 0
                    }
                }

            },
        },
        created: function () {
            this.fetchList()
        },

    }
</script>
<style scoped>
    .hoverLink:hover {
        color: #1aaee5;
    }
</style>
