<template>
    <div class="app-container">
        <contentTitle :titleParams="{ title: '兑现清单日志',permission:permission}"></contentTitle>
        <el-form :inline="true" :model="listQuery" ref="listQuery" class="filter-container" label-width="71px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="签署人 :" prop="query.realName">
                        <el-input placeholder="签署人"  v-model="listQuery.query.realName"
                                  @keyup.enter.native="fetchList"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="作者ID :" prop="query.authorId">
                        <el-input placeholder="作者ID" :maxlength="10" v-model="listQuery.query.authorId"
                                  @keyup.enter.native="fetchList"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="所属公司 :" prop="query.companyId">
                        <el-select v-model="listQuery.query.companyId" :disabled="companyList.length===1"> <!---->
                            <el-option
                                    v-for="item in companyList"
                                    :key="item.text"
                                    :label="item.text"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="兑现月份 :" prop="query.dealMonth">
                        <el-date-picker
                                v-model="listQuery.query.dealMonth"
                                type="month"
                                format="yyyy-MM"
                                :editable="false"
                                :clearable="false"
                                :picker-options="pickerOptions"
                                value-format="yyyyMM"
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


        <el-table :data="list" v-loading="listLoading" element-loading-text="加载中.." border stripe fit ref="listTable"
                  highlight-current-row :empty-text="emptyText" :header-cell-style="appConfig.HEADER_STYLE"
                  :max-height="tableHeight" :cell-class-name="cellClassName">
            <el-table-column align="center" label="兑现月份" prop="authorId" width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.createMonth.toString() | MonthsFilter}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" min-width="90" label="稿费总收入" prop="moneyYuan">
                <template slot-scope="scope">
                    <span :class="{'danger':scope.row.moneyYuan>=100}">{{scope.row.moneyYuan}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="税金" prop="taxMoneyYuan" min-width="90">

            </el-table-column>

            <el-table-column align="center" label="实付" min-width="100" prop="payMoneyYuan">
            </el-table-column>

            <el-table-column align="center" label="签署人" min-width="80" prop="realName">
                <template slot-scope="scope">
                    <span >{{ scope.row.realName || '------' }}</span>
                </template>
            </el-table-column>


            <el-table-column align="center" label="所属公司" prop="companyName" width="90">

            </el-table-column>

            <el-table-column align="center" label="作者ID" prop="authorId" width="100">
                <template slot-scope="scope">
                    <notEnabled :row="scope.row"></notEnabled>
                </template>
            </el-table-column>

            <el-table-column align="center" label="作者笔名" prop="penName" min-width="110">
                <template slot-scope="scope">
                    <a target="_blank" :href="scope.row.authorId | createPeopleLink"
                       class="hoverLink">{{scope.row.penName}}</a>
                </template>

            </el-table-column>
            <el-table-column align="center" label="作者信息" min-width="280">
                <template slot-scope="scope">
                    <div class="tdInfo" v-html="$options.filters.authorInfo(scope.row.accountInfo)">
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="90" :resizable="false" prop="handle"
                             :fixed="fixedColumn">
                <template slot-scope="scope">
                    <div>
                        <el-button type="text" @click="checkAuditRecord(scope.row.id)">审核记录</el-button>
                    </div>
                    <el-button type="text" @click="checkPayDetail(scope.row.id)">稿费明细
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination :listQuery="listQuery" :total="totalItems" :listLoading="listLoading"
                    @getList="fetchList"></pagination>
        <auditRecordDialog :dialogProps="recordProp"></auditRecordDialog>

    </div>
</template>

<script type="text/ecmascript-6">
    import {fetchCashAuditLogList, fetchInspectedLogCash,permission} from '@/api/cashListLog'
    import {getCurrentMonth, convertDic, getCompany, getCpInfo} from '@/utils'
    import {mapGetters} from 'vuex'
    import auditRecordDialog from '@/views/remuneration/component/auditRecordDialog'
    import tableMixin from '@/mixins/tableHeight'

    export default {
        mixins: [tableMixin],
        components: {auditRecordDialog},
        data() {
            return {
                //分页查询参数
                listQuery: {
                    query: {
                        authorId: undefined,
                        companyId: undefined,
                        dealMonth: getCurrentMonth(),
                        realName: undefined,
                    },
                    sort: {
                        orderByField: "id",
                        orderDirect: "asc"
                    },
                    page: {
                        pageNo: 1,
                        pageSize: 100
                    }
                },
                fixedColumn: 'right',
                list: [],
                listLoading: true,
                emptyText: '',
                init: true,
                permission: permission,
                totalItems: 0,
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
                'auditCompanyDetail',
                'auditCpsDetail'
            ]),
            companyList() {
                let temp = this.auditCompanyDetail.slice()

                if(temp.length>1){
                    temp.unshift({text: '全部', value: undefined})
                }

                this.listQuery.query.companyId = temp[0] && temp[0].value
                return temp
            },

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

            // 获取书单列表
            fetchList() {
                this.listLoading = true;
                fetchCashAuditLogList(this.listQuery).then(response => {
                    if (!response.data.items) return;
                    this.list = response.data.items || []
                    this.listLoading = false

                    if (response.data.paginate == null) {
                        this.totalItems = 0
                    } else {
                        this.totalItems = response.data.paginate.totalItemsCount
                    }

                    if (this.init) {
                        this.emptyText = '暂无数据'
                        this.init = false
                    } else {
                        this.emptyText = '查询无结果'
                    }

                });
            },

            // 审核记录
            checkAuditRecord(id) {
                fetchInspectedLogCash(id).then(res => {
                    this.recordProp = {
                        list: res.data.items ? res.data.items : [],
                        dialogVisible: true
                    }
                })
            },

            // 稿费明细   id 不对
            checkPayDetail(id) {
                if (location.href.indexOf('#') > -1) {
                    //非history模式
                    window.open('#/remuneration/cashDetail/' + this.listQuery.query.dealMonth + '/' + id)
                } else {
                    // history模式
                    window.open('/remuneration/cashDetail/' + this.listQuery.query.dealMonth + '/' + id)
                }
            },
            cellClassName(arg){
                let propertys = [ 'handle' ]
                if(arg.row.manual===true && propertys.indexOf(arg.column.property ) >-1  ){
                    return 'marked'
                }
            },
        },
        created: function () {
            this.$store.dispatch('getAuditCpsDetail')
            this.$store.dispatch('getAuditCompanyDetail').then(() => {
                this.fetchList()
            })
        },
        watch: {
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
