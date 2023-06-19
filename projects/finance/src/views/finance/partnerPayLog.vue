<template>
    <div class="app-container">
        <contentTitle :titleParams="{title: '合作方稿费记录'}"></contentTitle>
        <div class="filter-container">
            <el-form :inline="true" :model="listQuery" ref="listQuery" @submit.native.prevent>
                <el-row :gutter="6">
                    <el-col :span="6">
                        <el-form-item label="作品ID :" prop="query.bookId">
                            <el-input type="text" v-model="listQuery.query.bookId" placeholder="作品ID"></el-input>
                        </el-form-item>
                    </el-col>
                     <el-col :span="6">
                       <el-form-item label="合作方状态 :" prop="query.cooperationStatus">
                           <el-select v-model="listQuery.query.cooperationStatus" filterable>
                               <el-option
                                       v-for="item in cooperationStatusList"
                                       :label="item.text"
                                       :value="item.value">
                                   <!--<span style="float: left">{{item.name }}</span>
                                   <span style="float: right; color: #8492a6; font-size: 13px;margin-left:20px"v-if="item.logicalDel!=null">{{ item.logicalDel?'已结束':'正常' }}</span>-->
                               </el-option>
                           </el-select>
                       </el-form-item>
                     </el-col>
                    <el-col :span="6">
                        <el-form-item label="合作方 :" prop="query.partnerId" style="margin-right: 12px">
                            <el-select v-model="listQuery.query.partnerId" filterable>
                                <el-option
                                        v-for="item in partnerList"
                                        v-if="typeof listQuery.query.cooperationStatus == 'undefined' || listQuery.query.cooperationStatus == item.cooperationStatus"
                                        :label="item.name"
                                        :value="item.id">
                                    <!--<span style="float: left">{{item.name }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px;margin-left:20px"v-if="item.logicalDel!=null">{{ item.logicalDel?'已结束':'正常' }}</span>-->
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属月份 :" prop="query.dealMonth">
                            <el-date-picker :clearable="true" :editable="false" type="month" placeholder="全部月份"
                                            v-model="listQuery.query.dealMonth" value-format="yyyyMM"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="校验月份 :" prop="query.checkMonth">
                            <el-date-picker :clearable="true" :editable="false" type="month" placeholder="全部月份"
                                            v-model="listQuery.query.checkMonth" value-format="yyyyMM"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="12">
                        <el-form-item class="search-btn-padding">
                            <search @search="handleFilter" :listLoading="listLoading"></search>
                            <reset @reset="resetForm('listQuery')"></reset>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="summary">
                    <label v-if="multipleSelection.length > 0">当前页应结算:<span>{{payment || '0.00' }}</span></label>
                    <label v-if="multipleSelection.length == 0 && !listLoading">当前页应结算:<span>{{paymentTotal || '0.00'}}</span></label>
                    <label class="line"></label>
                    <label v-if="multipleSelection.length > 0">当前页需结算:<span>{{needPayment || '0.00' }}</span></label>
                    <label v-if="multipleSelection.length == 0 && !listLoading">当前页需结算:<span>{{needPaymentTotal || '0.00'}}</span></label>
                    <label class="line"></label>
                    <label v-if="!listLoading">需结算总合计:<span>{{paymentCountSum.sumNeedPaymentYuan || '0.00' }}</span></label>
                    <label class="line"></label>
                    <label v-if="!listLoading">应结算总合计:<span>{{paymentCountSum.sumPaymentYuan || '0.00' }}</span></label>
                </div>
            </el-form>
        </div>
        <el-table :data="listData" :max-height="tableHeight" ref="listTable" :empty-text="emptyText"
                  v-loading="listLoading"
                  element-loading-text="加载中.." border fit stripe :header-cell-style="this.appConfig.HEADER_STYLE"
                  highlight-current-row @filter-change="getFilter" @selection-change="handleSelectionChange"
                  @sort-change="getSortColumn">
            <el-table-column align="center" type="selection" prop='payStatus' :selectable='checkboxInit' width="45"
                             fixed>
            </el-table-column>
            <el-table-column align="center" label="作品ID" width="65">
                <template slot-scope="scope">
                    <a class="hoverLink" :href="$options.filters.createToBooKUrl(scope.row.bookId)" target="_blank">{{scope.row.bookId}}</a>
                </template>
            </el-table-column>
            <el-table-column align="center" label="作品名称" width="125">
                <template slot-scope="scope">
             <span class="link-type" v-if="scope.row.bookName">
                  <a target="_blank" :href="scope.row.bookId | createBookLink"
                     class="hoverLink">{{scope.row.bookName}}</a>
             </span>
                    <span v-else>
                ------
             </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="作者ID">
                <template slot-scope="scope">
                    <notEnabled :row="scope.row"></notEnabled>
                </template>
            </el-table-column>
            <el-table-column align="center" label="作者笔名" width="90">
                <template slot-scope="scope">
                    <a target="_blank" :href="scope.row.authorId | createPeopleLink"
                       class="hoverLink">
                        {{scope.row.penName }}
                    </a>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所属CP" width="90" prop="cpIds" column-key="cpIds"
                             filter-placement="bottom" :filters="cpList">
                <template slot-scope="scope">
                    {{scope.row.cpName }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="合作模式" prop="payTypes" column-key="payTypes"
                             filter-placement="bottom" :filters="payTypeList" width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.payTypeDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="总收入" prop="sumMoneyYuan">
                <template slot-scope="scope">
                    <span>{{scope.row.sumMoneyYuan || "------"}}</span>
                </template>
            </el-table-column>
            </el-table-column>
            <el-table-column align="center" width="90" label="不结算" prop="noPaymentYuan">
                <template slot-scope="scope">
                    <span>{{scope.row.noPaymentYuan || "------"}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" width="90" label="需结算" prop="needPaymentYuan">
                <template slot-scope="scope">
                    <span>{{scope.row.needPaymentYuan || "------"}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" width="90" label="应结算" prop="paymentYuan">
            </el-table-column>
            <el-table-column align="center" label="合作方" prop="partnerName" width="120">
            </el-table-column>
            <el-table-column align="center" label="合作状态" prop="cooperationStatusDesc">
            </el-table-column>
            <el-table-column align="center" label="稿费类型" prop="types" :filters="typesList"
                             filter-placement="bottom" column-key="types" width="110" v-if="!isCurrentUserLaikan">
                <template slot-scope="scope">
                    <span>{{scope.row.typeDesc }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="稿费类型"
                             width="110" v-if="isCurrentUserLaikan">
                <template slot-scope="scope">
                    <span>{{scope.row.typeDesc }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="添加时间" prop="createTime" min-width="150" sortable>
            </el-table-column>
            <el-table-column align="center" label="校验月份">
                <template slot-scope="scope">
                    <span>{{scope.row.checkMonth | insertFlag }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" min-width="100" label="校验结果" prop="checkResults" fixed="right"
                             :filters="checkResultList"
                             filter-placement="bottom" column-key="checkResults">
                <template slot-scope="scope">
          <span v-if="scope.row.checkResult == 0" class="operate red-color">
            {{scope.row.checkResultDesc }}
          </span>
                    <span v-else class="operate">
            {{scope.row.checkResultDesc }}
          </span>
                </template>
            </el-table-column>
        </el-table>
        <div>
            <div style="display: table-cell; float: left;" class="mt-10">
                <el-button v-if="multipleSelection.length > 0" v-has="permission.partner_pay_pass" :loading="batchPassLoading" type="primary"
                           @click="batchPass()">通过
                </el-button>
                <el-tooltip content="全部通过来看阅读分成且未校验的记录" placement="top" v-if="listData.length > 0 ">
                    <el-button type="warning" @click="batchPassAll()" :loading="batchPassAllLoading"  v-has="permission.partner_pay_pass_all">全部通过</el-button>
                </el-tooltip>
            </div>
            <div style="display: table-cell;float: right">
                <pagination :listQuery="listQuery" :total="totalItems" :listLoading="listLoading"
                            @getList="fetchPartnerPayLogsList"></pagination>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {
        fetchPartnerPayLogs,
        fetchPartnerPayLogsPass,
        fetchPayLogSumPayMent,
        fetchPartnerPayLogsPassAll,
        permission
    } from '@/api/finance' //稿费支付记录接口
    import { fetchPartnerList } from '@/api/common' //作品库接口
    import waves from '@/directive/waves.js' // 水波纹指令
    import { parseTime, objectMerge, compareSimpleObject, getLastMonthYestdy, convertDic, accAdd } from '@/utils'
    import tableMixin from '@/mixins/tableHeight'
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                multipleSelection: [],
                rolesList: [],
                pageSize: 10,
                currentPage: 1,
                listQuery: {
                    query: {
                        dealMonth: null,
                        partnerId: null,
                        checkResults: undefined,
                        types: undefined,
                        cooperationStatus:undefined
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
                listData: [],
                partnerList: [],
                totalItems: 0,
                listRoleLoading: true,
                emptyText: this.appConfig.EMPTY_TEXT,//无数据提示
                init: true,
                listLoading: true,
                batchPassLoading: false,
                batchPassAllLoading: false,
                payTypeList: [],
                selectedCps: [],
                payment: 0,
                paymentCountSum: 0,
                paymentTotal: 0,
                needPaymentTotal: 0,
                permission:permission
            }
        },
        mixins: [tableMixin],
        computed: {
            ...mapGetters([
                'dicList',
                'auditCpsDetail',
                'roles'
            ]),
            cpList() {
                return this.auditCpsDetail || [];
            },
            // 稿费类型
            typesList(){
                let temp = []
                this.auditCpsDetail.forEach(item => {
                    if (item.value) {
                        temp = item.payLogTypes
                    }
                })
                temp = temp.filter(item => {
                    return item.partnerType
                })
                return temp
            },
            checkResultList(){
                return [{text: '未校验', value: 0}, {text: '校验成功', value: 1}, {text: '校验失败', value: -1}]
            },
            cooperationStatusList(){
                return [{text: '全部', value: undefined}, {text: '合作中', value: 1}, {text: '已结束', value: 0}]
            },
            //是否显示全部通过按钮 列表数据必须来看阅读且未校验状态
            isShowPassAllBtn(){
                return this.listQuery.query.checkResults ? this.listQuery.query.checkResults[0] == 0 : false
            },
            //当前用户角色是否是来看收入审核员 角色是【来看收入审核员】 数据需过滤
            isCurrentUserLaikan(){
                return this.roles.some(item => item.id == 62)
            }
        },
        methods: {
            //选择事件
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.paymentSum();
            },
            //应结算合计
            paymentSum(){
                this.payment = 0
                this.needPayment = 0;
                this.multipleSelection.map((row) => {
                    this.payment = accAdd(this.payment, row.paymentYuan);
                    this.needPayment = accAdd(this.needPayment, row.needPaymentYuan);
                })
            },
            //状态是否可选条件:合作方来看,并且未校验
            checkboxInit(row, index){
                return row.type == 28 && row.checkResult == 0
            },

            //多条件分页信息
            fetchPartnerPayLogsList() {
                this.listLoading = true;
                this.$_axios.all([fetchPartnerPayLogs(this.listQuery), fetchPayLogSumPayMent(this.listQuery.query)]).then(
                    this.$_axios.spread((response, responseSummary) => {
                        //将数据转成合并单元格数据格式
                        this.paymentTotal = 0;
                        this.needPaymentTotal = 0
                        this.listData = response.data.items;
                        this.paymentCountSum = responseSummary.data.items ? responseSummary.data.items : {
                            sumPaymentYuan: '0',
                            sumNeedPaymentYuan: '0'
                        };
                        if (response.data.items) {
                            response.data.items.map((item) => {
                                this.paymentTotal = accAdd(this.paymentTotal, item.paymentYuan)
                                this.needPaymentTotal = accAdd(this.needPaymentTotal, item.needPaymentYuan)
                            })
                        }
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
                        this.listLoading = false
                        //获取所有合作模式
                        this.setPayType()
                    }));
            },
            //查询
            handleFilter() {
                this.listQuery.page.pageNo = 1
                this.fetchPartnerPayLogsList()
            },
            //状态过滤
            getFilter(columnKeys){
                for (let i in columnKeys) {
                    this.listQuery.query[i] = ['payStatus'].indexOf(i) >= 0 ? columnKeys[i][0] : columnKeys[i];
                }
                this.fetchPartnerPayLogsList()
            },
            setPayType(){
                this.payTypeList = []
                this.auditCpsDetail.forEach(item => {
                    item.copyrightPayTypes.slice().forEach((item) => {
                        if (!this.checkItem(this.payTypeList, item)) {
                            this.payTypeList.push(item);
                        }
                    })
                })
            },
            checkItem(list, obj){
                if (list.length == 0) {
                    return false;
                }
                return list.find((item, index) => {
                    return item.value == obj.value
                })
            },
            //排序
            getSortColumn({column, prop, order}){
                this.listQuery.sort.orderByField = prop || 'createTime',
                    this.listQuery.sort.orderDirect = order === 'ascending' ? 'asc' : 'desc',
                    this.fetchPartnerPayLogsList()
            },
            //获取合作方列表
            getPartnerList(){
                fetchPartnerList().then(response => {
                    if (response) {
                        this.partnerList = response.data.items;
                        this.partnerList.unshift({
                            'id': null,
                            'name': '全部合作方'
                        })
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.$refs['listTable'].clearFilter();
                this.$refs['listTable'].clearSort();
                this.listQuery.query.dealMonth = getLastMonthYestdy();
                this.fetchPartnerPayLogsList()
            },
            //批量通过选中数据
            batchPass(){
                this.$confirm('确定批量通过选中数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.batchPassQuery = {
                        ids: [],
                    };
                    this.multipleSelection.forEach((item) => {
                        this.batchPassQuery.ids.push(item.id)
                    })
                    this.batchPassLoading = true;
                    fetchPartnerPayLogsPass(this.batchPassQuery).then(response => {
                        if (response.data.items) {
                            this.$message({
                                type: 'success',
                                message: '操作成功!'
                            });
                            this.batchPassLoading = false;
                            this.fetchPartnerPayLogsList();
                        }
                    });
                })
            },
            //批量通过所有未校验的来看分成数据
            batchPassAll(){
                this.$confirm('确定批量通过所有数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.batchPassAllLoading = true;
                    fetchPartnerPayLogsPassAll(this.listQuery).then(response => {
                        if (response.data.items) {
                            this.$message({
                                type: 'success',
                                message: '操作成功!'
                            });
                            this.batchPassAllLoading = false;
                            this.fetchPartnerPayLogsList();
                        }else{
                            this.$message({
                                type: 'warning',
                                message: '未找到需要审核的记录!'
                            });
                            this.batchPassAllLoading = false;
                        }
                    });
                })
            }
        },
        created: function () {
            this.$store.dispatch('getAuditCpsDetail').then((data) => {
                this.listQuery.query.dealMonth = getLastMonthYestdy();
                this.getPartnerList()
                this.fetchPartnerPayLogsList();
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
            }
        },
        filters: {
            insertFlag: function (value) {
                return value ? value.toString().substr(0, 4) + '-' + value.toString().substr(4, 2) : '------';
            }
        }
    }
</script>
