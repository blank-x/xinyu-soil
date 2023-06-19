<template>
    <div class="app-container">
        <contentTitle :titleParams="{ title: '兑现失败列表',permission:permission }"></contentTitle>
        <el-form :inline="true" :model="listQuery" ref="listQuery" class="filter-container" label-width="71px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="签署人 :" prop="query.realName">
                        <el-input placeholder="签署人" v-model="listQuery.query.realName"
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
                    <el-form-item label="作者ID :" prop="query.authorId">
                        <el-input placeholder="作者ID" :maxlength="10" v-model="listQuery.query.authorId"
                                  @keyup.enter.native="fetchList"></el-input>
                    </el-form-item>
                </el-col>
                <!--<el-col :span="6">
                    <el-form-item label="所属公司 :" prop="query.companyId">
                        <el-select v-model="listQuery.query.companyId" :disabled="companyList.length===1"> &lt;!&ndash;&ndash;&gt;
                            <el-option
                                    v-for="item in companyList"
                                    :key="item.text"
                                    :label="item.text"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>-->
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
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="兑现月份 :" prop="query.cashMonth" class="cashPlaceHolder">
                        <el-date-picker
                                v-model="listQuery.query.cashMonth"
                                type="month"
                                :editable="false"
                                :clearable="false"
                                format="yyyy-MM"
                                :picker-options="pickerOptions"
                                value-format="yyyyMM">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item class="search-btn-padding">
                        <search @search="fetchList" :listLoading="listLoading"></search>
                        <reset @reset="resetListQuery"></reset>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
        <div class="auditTableContainer" v-loading="listLoading" >
            <v-affix :offset-top="60" >
                <table class="auditTable" style="width: 100%" cellspacing="1" cellpadding="5" bgcolor="#ebeef5">
                    <auditTableHead :pageName="`cashFail`"></auditTableHead>
                </table>
            </v-affix>
            <table class="auditTable" style="width: 100%" cellspacing="1" cellpadding="5" bgcolor="#ebeef5">
                <auditTableHead :pageName="`cashFail`"></auditTableHead>
                <tbody ></tbody>
            </table>
            <blankList :listLen="listLen" :init="init"></blankList>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    /*
     * addAudit  添加稿费接口
     * fetchList 获取列表
     * */
    import {fetchList, pass, permission_waitPay, getCompanyLockInfo} from '@/api/auditCommon'
    import {getLastMonthYestdy, convertDic, mergeDataConvert, getCpInfo, getCurrentMonth} from '@/utils'
    import {mapGetters} from 'vuex'
    import auditPass from '@/views/remuneration/component/auditPass'
    import auditTableMixin from "./auditTableMixin";
    import blankList from '@/views/remuneration/component/blankList'
    import auditTableHead from '@/views/remuneration/component/auditTableHead'


    export default {
        components: {auditPass, blankList,auditTableHead},
        mixins: [auditTableMixin],
        data() {
            return {
                //分页查询参数
                listQuery: {
                    query: {
                        bookId: undefined,
                        authorId: undefined,
                        companyId: null,
                        cpId: null,
                        cashMonth: getCurrentMonth(),
                    }
                },
                //loading 状态
                listLoading: true,
                init: null,
                permission: permission_waitPay,
                selectedItems: [],
                cpLockList: [],
                isLock: false,
                //查询月份限制
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                defaultCompanyId: null,
                rejectAuth: this.$_has(permission_waitPay.reject),
                lockList:[]
            }
        },
        computed: {
            ...mapGetters([
                'dicList',
                'cpInfo',
                'auditCpsDetail'
            ]),
            cpList() {
              return   this.auditCpsDetail || []
            },
            signStatusesList() {
                let temp = convertDic(this.dicList, '7').slice()
                temp.unshift({value: undefined, text: '全部'})
                return temp
            },
            payTypesList() {
                let temp = []
                this.auditCompanyDetail.forEach(item => {
                    if (item.value === this.listQuery.query.companyId) {
                        temp = item.copyrightPayTypes.slice()
                    }
                })
                temp.unshift({value: undefined, text: '全部'})
                return temp
            },
            typesList() {
                let temp = []
                this.auditCompanyDetail.forEach(item => {
                    if (item.value === this.listQuery.query.companyId) {
                        temp = item.payLogTypes.slice()
                    }
                })
                temp.unshift({value: undefined, text: '全部'})
                return temp
            },
            ids() {
                let temp = []
                this.selectedItems.forEach(item => {
                    temp.push(item.id)
                })
                return temp
            },

        },
        methods: {
            // 重置 搜索
            resetListQuery() {
                if (this.$refs['listQuery'] != undefined) {
                    this.$refs['listQuery'].resetFields();
                    //所属公司
                    if (this.defaultCompanyId) {
                        this.listQuery.query.companyId = this.defaultCompanyId;
                    }
                    this.fetchList()
                }
            },

            //  获取列表
            fetchList() {
                this.listLoading = true;
                this.auditPassLoading = true
                let queryTemp = {
                    realName:this.listQuery.query.realName?this.listQuery.query.realName:undefined,
                    bookId: this.listQuery.query.bookId,
                    authorId: this.listQuery.query.authorId,
                    cpId: this.listQuery.query.cpId,
                    companyId:this.listQuery.query.companyId,
                    cashMonth: this.listQuery.query.cashMonth,
                    types: this.listQuery.query.type !== undefined ? [this.listQuery.query.type] : undefined,
                    signStatuses:this.listQuery.query.signStatusesKey !== undefined ? [this.listQuery.query.signStatusesKey] : undefined,
                    payTypes:this.listQuery.query.payTypesKey !== undefined ? [this.listQuery.query.payTypesKey] : undefined
                }
                fetchList(queryTemp, 'cash_fail').then(response => {
                    // 路由 切换后，该回调函数继续执行会导致页面数据错误
                    if(this.leaveCurrentRoute){
                        return false
                    }
                    this.setLockStatus()
                    let condition = {
                        key: 'authorId',
                        authorId: {
                            column: 'authorId'
                        },
                        penName: {
                            column: 'authorId'
                        },
                        sumMoney: {
                            column: 'authorId',
                        },
                        bookId: {
                            column: 'bookId',
                        },
                        bookName: {
                            column: 'bookId',
                        },
                        cpName: {
                            column: 'bookId',
                        },
                        signStatusDesc: {
                            column: 'bookId',
                        },
                        payTypeDesc: {
                            column: 'bookId',
                        },
                        realName: {
                            column: 'bookId',
                        },
                        bookMoney: {
                            column: 'bookId',
                            isSum: true,
                            // 汇总哪个列表的数据
                            sumColumn: 'money'
                        }
                    }

                    if(this.init=== null){
                        this.init = true
                    }else if(this.init === true){
                        this.init=false
                        this.getCompanyLockInfo()
                    }
                    this.listLen = response.data.items ? response.data.items.length : 0

                    this.$nextTick(() => {
                        document.querySelector('.auditTable tbody').innerHTML =mergeDataConvert({
                            data: response.data.items,
                            keys: condition,
                            isLock: this.isLock,
                            template: 'commonTable',
                            pageName: 'cashFail',
                            rejectAuthClass: this.rejectAuth ? '' : 'is-disabled',
                        })
                            this.bindEvents()
                        this.tableHeaderTop = document.querySelector(".auditTableContainer").offsetTop;
                    })
                });
            },


            getCompanyLockInfo() {
                return getCompanyLockInfo().then(res => {
                    if (res.data.items) {
                        this.lockList = res.data.items
                        this.setLockStatus()

                    }
                })
            },
            setLockStatus(){
                this.lockList.forEach(item => {
                    if (item.companyId === this.listQuery.query.companyId) {
                        this.isLock = item.locked
                    }
                });
            }


        },
        created: function () {
            this.$store.dispatch('getAuditCpsDetail').then((data) => {
                this.listQuery.query.cpId = data[0].value
                this.fetchList()
            })
        }

    }
</script>

