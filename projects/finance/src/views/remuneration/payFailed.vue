<template>
    <div class="app-container">
        <contentTitle :titleParams="{ title: '支付失败列表',permission:permission,   }"></contentTitle>
        <el-form :inline="true" :model="listQuery" ref="listQuery" class="filter-container" label-width="71px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="签署人 :" prop="query.realName">
                        <el-input placeholder="签署人" v-model="listQuery.query.realName"
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
                    <el-form-item label="兑现月份 :" prop="query.dealMonth" class="cashPlaceHolder">
                        <el-date-picker
                                v-model="listQuery.query.dealMonth"
                                type="month"
                                format="yyyy-MM"
                                value-format="yyyyMM"
                                :editable="false"
                                :picker-options="pickerOptions"
                                placeholder="全部">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>

                <el-col :span="6" style="float: right">
                    <el-form-item class="search-btn-padding">
                        <search @search="fetchList" :listLoading="listLoading"></search>
                        <reset @reset="resetListQuery"></reset>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
        <div class="auditTableContainer" v-loading="listLoading" style="min-width: 2000px;">
            <v-affix :offset-top="60" >
                <table class="auditTable" style="width: 100%" cellspacing="1" cellpadding="5" bgcolor="#ebeef5">
                    <cashTableHead></cashTableHead>
                </table>
            </v-affix>
            <table class="auditTable" style="width: 100%" cellspacing="1" cellpadding="5" bgcolor="#ebeef5">
                <cashTableHead></cashTableHead>
                <tbody></tbody>
            </table>
            <blankList :listLen="listLen" :init="init"></blankList>

        </div>
        <cashAmount :selectedItems="selectedItems">
            <el-button type="primary" :disabled="selectedItems.length===0 || !rejectAuth" style="width:110px;height:32px;" v-if="!isLock" @click="rejectWaitPayBatch" :loading="auditPassLoading">
                驳回待兑现
            </el-button>
            <el-button :disabled="true" type="primary"
                       style="width:78px;height:32px; background: #FFBA75;border-color:#FFBA75;" v-if="isLock">已锁定
            </el-button>
        </cashAmount>

        <rejectRecord :rejectProps="rejectProps"></rejectRecord>

    </div>
</template>

<script type="text/ecmascript-6">
    /*
    * addAudit  添加稿费接口
    * fetchList 获取列表
    * */
    import {inspectLog, getCpInfo,getCompanyLockInfo} from '@/api/auditCommon'
    import {permission_fail,waitCashAndFail,updateCash } from '@/api/waitCashAndFail'
    import {getLastMonthYestdy, convertDic, mergeDataConvert, getCompany} from '@/utils'
    import {mapGetters} from 'vuex'
    import rejectRecord from '@/views/remuneration/component/rejectRecord'
    import auditTableMixin from "./auditTableMixin";
    import cashAmount from '@/views/remuneration/component/cashAmount'
    import blankList from '@/views/remuneration/component/blankList'
    import cashTableHead from '@/views/remuneration/component/cashTableHead'

    export default {
        components: {rejectRecord, blankList, cashAmount,cashTableHead},
        mixins: [auditTableMixin],
        data() {
            return {
                //分页查询参数
                listQuery: {
                    query: {
                        authorId: undefined,
                        dealMonth: undefined,
                        companyId: undefined,
                        realName: undefined,

                    }
                },
                //loading 状态
                listLoading: true,
                init: null,
                permission: permission_fail,
                selectedItems: [],
                rejectLogData: [],
                isLock: false,
                rejectProps: {},
                //查询月份限制
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                defaultCompanyId: null,
                rejectAuth: this.$_has(permission_fail.reject),
                lockList:[]

            }
        },
        computed: {
            ...mapGetters([
                'dicList',
                'cpInfo',
                'auditCompanyDetail'
            ]),

            companyList() {
                return this.auditCompanyDetail || []
            },

            // 多选 id
            ids() {
                let temp = []
                this.selectedItems.forEach(item => {
                    if (temp.indexOf(item.id) === -1) {
                        temp.push(item.id)
                    }
                })
                return temp
            }

        },
        methods: {
            // 重置 搜索
            resetListQuery() {
                if (this.$refs['listQuery'] != undefined) {
                    this.$refs['listQuery'].resetFields();
                    this.listQuery.query.signStatuses = undefined
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
                    authorId: this.listQuery.query.authorId,
                    companyIds:[this.listQuery.query.companyId],
                    realName:this.listQuery.query.realName?this.listQuery.query.realName:undefined,
                    dealMonth: this.listQuery.query.dealMonth,
                }

                waitCashAndFail(queryTemp, 'fail').then(response => {
                    // 路由 切换后，该回调函数继续执行会导致页面数据错误
                    if(this.leaveCurrentRoute){
                        return false
                    }
                    this.setLockStatus()
                    let condition = {
                        key: 'id',
                        id: {
                            column: 'id'
                        },
                        // 所属月份
                        createMonth: {
                            column: 'id'
                        },
                        // 稿费总收入
                        sumMoneyYuan: {
                            column: 'id',
                        },
                        // 税金
                        sumTaxMoneyYuan: {
                            column: 'id'
                        },
                        // 实付
                        sumPayMoneyYuan: {
                            column: 'id'
                        },
                        // 签署人
                        realName: {
                            column: 'id',
                        },
                        // 作者信息
                        account: {
                            column: 'id',
                        },
                        // 所属公司
                        companyName: {
                            column: 'id',

                        },
                        // 作者id
                        authorId: {
                            column: 'authorId'
                        },
                        penName: {
                            column: 'authorId'
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

                        payTypeDesc: {
                            column: 'bookId',
                        },
                        bookMoney: {
                            column: 'bookId',
                            isSum: true,
                            // 汇总哪个列表的数据
                            sumColumn: 'money'
                        }
                    }

                    this.listLen = response.data.items ? response.data.items.length : 0
                    let routerPath = this.$route.path.split("/");

                    // this.html = mergeDataConvert({
                    //     data: response.data.items,
                    //     keys: condition,
                    //     isLock: this.isLock,
                    //     template: 'cashTable',
                    //     pageName: routerPath[routerPath.length - 1],
                    //     rejectAuthClass: this.rejectAuth ? '' : 'is-disabled',
                    // })


                    if(this.init=== null){
                        this.init = true
                    }else if(this.init === true){
                        this.init=false
                        this.getCompanyLockInfo()
                    }
                    this.$nextTick(() => {
                        document.querySelector('.auditTable tbody').innerHTML =mergeDataConvert({
                            data: response.data.items,
                            keys: condition,
                            isLock: this.isLock,
                            template: 'cashTable',
                            pageName: routerPath[routerPath.length - 1],
                            rejectAuthClass: this.rejectAuth ? '' : 'is-disabled',
                        })

                        this.bindEvents();
                        this.tableHeaderTop = document.querySelector(".auditTableContainer").offsetTop;
                    })

                });
            },


            // 查看驳回记录
            rejectAuditLog(id) {
                inspectLog(id).then(res => {
                    this.rejectProps = {
                        list: res.data.items ? [res.data.items] : [],
                        dialogVisible: true
                    }
                })
            },
            // 单行驳回
            rejectAudit(id) {
                this.rejectWaitPay([id],'rejectAudit')
            },
            // 批量驳回
            rejectWaitPayBatch() {
                this.rejectWaitPay(this.ids,'rejectWaitPayBatch')

            },
            //发出驳回请求
            rejectWaitPay(idArr,flag) {
                if(this.rejectAuth === false){
                    // 没有权限
                    return;
                }
                if(this.rejectAjaxStatus){
                    return
                }
                this.rejectAjaxStatus = true
                this.$confirm('确定驳回吗', '驳回待兑现', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    this.auditPassLoading = true
                    let params = {
                        ids: idArr
                    }
                    updateCash(params, 'reject').then(response => {
                        if (response.data.items) {
                            if(flag === 'rejectAudit'){
                                let checkboxDom = document.querySelector("#spanCheckbox_" + idArr[0]),
                                    handleDom = document.querySelector("#handle_" + idArr[0]);
                                checkboxDom.parentNode.removeChild(checkboxDom);
                                handleDom.innerHTML = "已驳回";
                                this.setSelectedOrSumMoney();
                            }
                            if(flag === 'rejectWaitPayBatch'){
                                this.fetchList()
                            }
                            this.rejectAjaxStatus = false
                            this.$message({
                                message: '驳回成功',
                                type: 'success',
                                onClose: () => {

                                }
                            })
                        } else {
                            this.$message({
                                message: response.data.msg,
                                type: 'warning',
                            })
                            this.auditPassLoading = false
                            this.rejectAjaxStatus = false

                        }
                    })
                }).catch((err) => {
                })

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
            this.$store.dispatch('getAuditCompanyDetail').then((data) => {
                this.listQuery.query.companyId = data[0].value
                this.defaultCompanyId = data[0].value
                this.getCompanyLockInfo().then(() => {
                    this.fetchList()
                })
            })
        },

    }
</script>

