<template>
    <div class="app-container">
        <contentTitle :titleParams="{ title: '稿费审核日志',permission:permission}"></contentTitle>
        <el-form :inline="true" :model="listQuery" ref="listQuery" class="filter-container" >
            <el-row>
                <el-col :span="6">
                    <el-form-item label="作者ID :" prop="query.authorId">
                        <el-input placeholder="作者ID" :maxlength="10" v-model="listQuery.query.authorId"
                                  @keyup.enter.native="fetchList"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="作品ID :" prop="query.bookId">
                        <el-input placeholder="作品ID" :maxlength="10" v-model="listQuery.query.bookId"
                                  @keyup.enter.native="fetchList"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="所属CP :" prop="query.cpId">
                        <el-select v-model="listQuery.query.cpId" :disabled="cpList.length===1"> <!---->
                            <el-option
                                    v-for="item in cpList"
                                    :key="item.text"
                                    :label="item.text"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="所属月份 :" prop="query.dealMonth">
                        <el-date-picker
                                v-model="listQuery.query.dealMonth"
                                type="month"
                                format="yyyy-MM"
                                value-format="yyyyMM"
                                :editable="false"
                                :clearable="false"
                                :picker-options="pickerOptions"
                                placeholder="选择月">
                        </el-date-picker>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item class="search-btn-padding">
                        <search @search="fetchList" :listLoading="listLoading"></search>
                        <reset @reset="resetListQuery"></reset>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>


        <el-table :data="list" v-loading="listLoading" element-loading-text="加载中.." border stripe fit ref="listTable"    highlight-current-row :empty-text="emptyText" :header-cell-style="appConfig.HEADER_STYLE"   :max-height="tableHeight" :cell-class-name="cellClassName">
            <el-table-column align="center" label="所属月份" prop="authorId" width="100" >
                <template slot-scope="scope">
                    {{scope.row.dealMonth.toString() | MonthsFilter}}
                </template>
            </el-table-column>

            <el-table-column align="center" min-width="100" label="作者ID" prop="authorId">
                <template slot-scope="scope">
                    <notEnabled :row="scope.row"></notEnabled>
                </template>
            </el-table-column>

            <el-table-column align="center" label="作者笔名" prop="penName" min-width="125">
                <template slot-scope="scope">

                <a target="_blank" :href="scope.row.authorId | createPeopleLink"
                   class="hoverLink">{{scope.row.penName}}</a>
                </template>

            </el-table-column>

            <el-table-column align="center" label="作品ID" width="100" prop="bookId">
                <template slot-scope="scope">
                    <a  class="hoverLink" :href="$options.filters.createToBooKUrl(scope.row.bookId)" target="_blank">{{scope.row.bookId}}</a>

                </template>
            </el-table-column>

            <el-table-column align="center" label="作品名称" min-width="130" prop="bookName">
                <template slot-scope="scope">
                    <a target="_blank" :href="scope.row.bookId | createBookLink"
                       class="hoverLink">{{scope.row.bookName}}</a>
                </template>
            </el-table-column>


            <el-table-column align="center" label="所属CP" prop="cpName" width="100">

            </el-table-column>

            <el-table-column align="center" label="签约状态" prop="signStatusDesc" width="80" >
                <template slot-scope="scope">
                    <span :class="{'danger':!scope.row.signStatus  || scope.row.signStatus==3}">{{scope.row.signStatusDesc}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="合作模式" prop="payTypeDesc" width="90" >
                <template slot-scope="scope">
                    <payType :row="scope.row"></payType>
                </template>
            </el-table-column>

            <el-table-column align="center" label="签署人" prop="realName" width="80">
                <template slot-scope="scope">
                    <span >{{!scope.row.signStatus  ? '------':(scope.row.realName || '------')}}</span>

                </template>
            </el-table-column>

            <el-table-column align="center" label="稿费类型"  prop="typeDesc">
                <template slot-scope="scope">
                    <openPayDetail :detailData="{
                        type:scope.row.type,
                        typeDesc:scope.row.typeDesc,
                        bookId:scope.row.bookId,
                        bookName:scope.row.bookName,
                        dealMonth:listQuery.query.dealMonth,
                        manual:scope.row.manual
                    }"></openPayDetail>
                </template>
            </el-table-column>

            <el-table-column align="center" label="稿费" prop="money" width="80">
                <template slot-scope="scope">
                    <span :class="{'danger':scope.row.money>=10000}">{{(scope.row.money/100).toFixed(2)}}</span>

                </template>
            </el-table-column>


            <el-table-column align="center" label="备注" prop="remark" min-width="160">
                <template slot-scope="scope">
                    <textEllipsis :text="scope.row.remark"></textEllipsis>
                </template>
            </el-table-column>


            <el-table-column align="center" label="操作" :resizable="false" width="90"  :fixed="fixedColumn" prop="handle">
                <template slot-scope="scope">
                    <el-button type="text" @click="checkAuditRecord(scope.row.id)">审核记录</el-button>
                </template>

            </el-table-column>
        </el-table>
        <pagination :listQuery="listQuery" :total="totalItems" :listLoading="listLoading"
                    @getList="fetchList"></pagination>
        <auditRecordDialog :dialogProps="recordProp"></auditRecordDialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import {fetchInspectedLogPay ,permission,fetchInspectedLog} from '@/api/auditLog'
    import {getLastMonthYestdy, convertDic,getCpInfo} from '@/utils'
    import {mapGetters} from 'vuex'
    import headerClickMixin from '@/mixins/headerClick'
    import auditRecordDialog from '@/views/remuneration/component/auditRecordDialog'
    import openPayDetail from '@/views/remuneration/component/openPayDetail'
    import tableMixin from '@/mixins/tableHeight'
    import payType from '@/views/remuneration/component/payType'


    export default {
        mixins: [headerClickMixin,tableMixin],
        components: {auditRecordDialog,openPayDetail,payType},
        data() {
            return {
                //分页查询参数
                listQuery: {
                    query: {
                        bookId: undefined,
                        authorId: undefined,
                        cpId:undefined,
                        dealMonth: getLastMonthYestdy(),
                    },
                    sort: {
                        orderByField: "id",
                        orderDirect: "desc"
                    },
                    page: {
                        pageNo: 1,
                        pageSize: this.appConfig.DEFAULT_PAGE_SIZE
                    }
                },
                fixedColumn: 'right',
                //
                list: [],
                logList: [],
                totalItems: 0,
                //loading 状态
                listLoading: true,
                emptyText: '',
                init: true,
                permission: permission,
                recordProp: {},
                //查询月份限制
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
            }
        },
        computed: {
            ...mapGetters([
                'dicList',
                'cpInfo',
                'auditCpsDetail'
            ]),

            cpList() {
                let temp = this.auditCpsDetail.slice()

                if(temp.length>1){
                    temp.unshift({value:undefined,text:'全部'})
                }

                this.listQuery.query.cpId = temp[0] && temp[0].value
                return temp
            },

            ids() {
                let temp = []
                this.selectedItems.forEach(item => {
                    temp.push(item.id)
                })
                return temp
            }

        },
        methods: {
            // 重置表单数据
            resetForm(formName) {
                this.$nextTick(() => {
                    if (this.$refs[formName] != undefined) {
                        this.$refs[formName].resetFields();
                    }
                })

            },
            resetListQuery() {
                if (this.$refs['listQuery'] != undefined) {
                    this.$refs['listQuery'].resetFields();
                    this.fetchList()
                }
            },

            fetchList() {
                this.listLoading = true;
                fetchInspectedLog(this.listQuery).then(response => {

                    this.list = response.data.items;

                    if (response.data.paginate == null) {
                        this.totalItems = 0
                    } else {
                        this.totalItems = response.data.paginate.totalItemsCount
                    }
                    if (this.init) {
                        this.init = false
                    } else {
                        this.emptyText = this.appConfig.SEARCHEMPTY_TEXT;
                    }
                    this.listLoading = false;
                });
            },
            checkAuditRecord(id) {
                fetchInspectedLogPay(id).then(res => {
                    this.recordProp = {
                        list: res.data.items ? res.data.items : [],
                        dialogVisible: true
                    }
                })
            },
            cellClassName(arg){
                let propertys = ['money','handle','typeDesc','remark']
                if(arg.row.manual===true && propertys.indexOf(arg.column.property ) >-1  ){
                    return 'marked'
                }
            },

        },
        created: function () {
            this.$store.dispatch('getAuditCpsDetail').then((data)=>{
                this.fetchList()
            })
        },
        watch: {
            'listQuery.query.bookId': {
                handler: function (val, oldVal) {
                    if (val === null || val === undefined) return
                    let val1 = val.replace(/[^0-9]/g, '')

                    this.$nextTick(() => {
                        this.listQuery.query.bookId = val1
                    })

                }
            },
            'listQuery.query.authorId': {
                handler: function (val, oldVal) {
                    if (val === null || val === undefined) return
                    let val1 = val.replace(/[^0-9]/g, '')
                    this.$nextTick(() => {
                        this.listQuery.query.authorId = val1
                    })
                }
            },
        }
    }
</script>
<style scoped>
    .hoverLink:hover {
        color: #1aaee5;
    }
</style>
