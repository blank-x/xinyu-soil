<template>
    <div class="app-container">
        <contentTitle :titleParams="titleParams" @unlockHandler="unlock" @downHandler="downloadExcel"></contentTitle>
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
                        <el-select v-model="listQuery.query.companyId" :disabled="companyList.length===1"
                                   @change="setLockStatus"> <!---->
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
                                :editable="false"
                                :picker-options="pickerOptions"
                                value-format="yyyyMM"
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
                <tbody ></tbody>
            </table>
            <blankList :listLen="listLen" :init="init"></blankList>

        </div>

        <cashAmount :selectedItems="selectedItems">
            <div style="padding-left:20px;">
                <el-button type="primary" :disabled="selectedItems.length===0 || !rejectAuth"
                           style="width:78px;height:32px;" @click="settle" :loading="auditPassLoading">结算
                </el-button>
            </div>
        </cashAmount>
        <rejectReason :rejectReasonProps="rejectReasonProps"></rejectReason>
    </div>
</template>

<script type="text/ecmascript-6">
    /*
    * addAudit  添加稿费接口
    * fetchList 获取列表
    * */
    import {getCompanyLockInfo} from '@/api/auditCommon'
    import {
        permission_waitCash,
        waitCashAndFail,
        updateCash,
        updateCashAudit,
        doUnlockByCompanyId
    } from '@/api/waitCashAndFail'
    import {getLastMonthYestdy, convertDic, mergeDataConvert, getCompany, deepClone} from '@/utils'
    import {mapGetters} from 'vuex'
    import Sticky from '@/components/Sticky'
    import {exportFile} from '@/api/common'
    import rejectReason from '@/views/remuneration/component/rejectReason'
    import auditTableMixin from "./auditTableMixin";
    import blankList from './component/blankList'
    import cashAmount from '@/views/remuneration/component/cashAmount'
    import cashTableHead from '@/views/remuneration/component/cashTableHead'


    export default {
        components: {Sticky, rejectReason, blankList, cashAmount, cashTableHead},
        mixins: [auditTableMixin],
        data() {
            // 自定义不予支付理由验证
            let rejectReasonText = (rule, value, callback) => {

                if (!value) {
                    return callback(new Error('请填写理由'))
                }
                let formatValue = value.replace(/^\s*|\s*$/, '')
                if (formatValue === '') {
                    return callback(new Error('请填写理由'))
                }
                if (formatValue.length < 2) {
                    return callback(new Error('字数在2-50字'))
                }
                return callback()

            }

            let rejectReason = (rule, value, callback) => {
                if (this.rejectReasonData.reason == undefined) {
                    return callback(new Error('请选择理由'))
                }
                return callback()
            }
            return {
                //分页查询参数
                listQuery: {
                    query: {
                        authorId: undefined,
                        dealMonth: undefined,
                        realName: undefined,
                        companyId: null,
                    }
                },

                //loading 状态
                listLoading: true,

                rejectAuditDialogVisible: false,

                init: null,
                errorMsgReject: '',
                selectedItems: [],


                // 驳回 保存数据
                rejectReasonData: {reason: null, reasonText: null, id: null},
                // 驳回 理由验证规则
                rejectReasonFormRules: {
                    reason: [{validator: rejectReason, trigger: 'change'}],
                    reasonText: [{
                        validator: rejectReasonText, trigger: 'blur'
                    }]
                },
                // 公司对应主体锁定状态列表
                companyLockInfoList: [],
                //当前公司主体是否锁定  默认未锁定
                isLock: false,
                // 标题
                titleParams: {title: '需兑现清单', permission: permission_waitCash, download: true, unlock: false},
                //    下载excel 参数
                downloadParams: {},
                //查询月份限制
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                defaultCompanyId: null,
                rejectReasonProps: {},
                rejectAuth: this.$_has(permission_waitCash.reject)
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
            ids() {
                let temp = []
                this.selectedItems.forEach(item => {
                    if (temp.indexOf(item.id) === -1) {
                        temp.push(item.id)
                    }
                })
                return temp
            },
            // 稿费类型
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
            // 重置 搜索
            resetListQuery() {
                if (this.$refs['listQuery'] != undefined) {
                    this.$refs['listQuery'].resetFields();
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
                    companyIds: [this.listQuery.query.companyId],
                    realName: this.listQuery.query.realName?this.listQuery.query.realName:undefined,
                    dealMonth: this.listQuery.query.dealMonth,
                }


                waitCashAndFail(queryTemp, 'wait_cash').then(response => {
                    // 路由 切换后，该回调函数继续执行会导致页面数据错误
                    if(this.leaveCurrentRoute){
                        return false
                    }
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
                        },
                        //  驳回


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

                    if (this.init === null) {
                        this.init = true
                    } else if (this.init === true) {
                        this.init = false
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
                            this.bindEvents()
                        this.tableHeaderTop = document.querySelector(".auditTableContainer").offsetTop;
                    })

                    this.downloadParams = Object.assign({}, queryTemp)

                });
            },


            // 驳回 弹框
            rejectAudit(id) {
                if (this.rejectAuth === false) {
                    // 没有权限
                    return;
                }
                this.rejectReasonProps = {
                    title: '驳回',
                    show: true,
                    type: 'cash',
                    id: id,
                    rejectParams: 'fail',
                    reasonListKey: '36',
                    rejectMsg: '驳回成功',
                    finish: () => {
                        // this.fetchList()
                        let checkboxDom = document.querySelector("#spanCheckbox_" + id),
                            handleDom = document.querySelector("#handle_" + id);
                        checkboxDom.parentNode.removeChild(checkboxDom);
                        handleDom.innerHTML = "已驳回";
                        this.setSelectedOrSumMoney();
                    }
                }
            },


            // 解锁
            unlock() {
                // 如果 需兑现清单未结算清，提示
                if (this.checkBoxLen > 0) {
                    this.$alert('需兑现清单未全部结算，不能解锁', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    });
                    return false
                }
                // 通过companyId 找到公司名字
                let company = this.companyList.filter(item => {
                    return item.value == this.listQuery.query.companyId
                })
                this.$confirm('请确定要解锁的公司主体：' + company[0].text + '?', '解锁', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    // 110 根据员工过滤公司  权限
                    doUnlockByCompanyId(this.listQuery.query.companyId).then(res => {
                        if (res.data.items) {
                            this.$message({
                                message: '解锁成功',
                                type: 'success',
                                onClose: () => {
                                    this.getCompanyLockInfo()
                                    this.fetchList()
                                }
                            })
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'warning',
                            })
                        }
                    })
                }).catch((err) => {
                })
            },
            // 结算
            settle() {
                this.$confirm('确定结算吗', '结算', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    this.auditPassLoading = true

                    updateCash({ids: this.ids}, 'to_success').then(res => {
                        if (res.data.items) {
                            this.$message({
                                message: '结算成功',
                                type: 'success',
                                onClose: () => {
                                    this.fetchList()
                                }
                            })
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'warning',
                            })
                            this.auditPassLoading = false
                        }
                    })
                }).catch((err) => {
                })
            },
            getCompanyLockInfo() {
                return getCompanyLockInfo().then(res => {
                    if (res.data.items) {
                        this.companyLockInfoList = res.data.items
                        this.companyLockInfoList.forEach(item => {
                            if (item.companyId === this.listQuery.query.companyId) {
                                this.isLock = item.locked
                                this.titleParams.unlock = item.locked
                            }
                        });

                    }
                })
            },
            //  下载
            downloadExcel() {
                let temp = []

                this.companyList.forEach(item => {
                    temp.push(item.value)
                })
                this.downloadParams.companyIds = temp
                exportFile('/cash_audit/export', this.downloadParams, '需兑现清单', 'post', 'xlsx')
            },
            setLockStatus(value) {
                this.companyLockInfoList.forEach(item => {
                    if (item.companyId === value) {
                        this.titleParams.unlock = item.locked
                    }
                })
            }

        },
        created() {

            this.$store.dispatch('getAuditCompanyDetail').then((data) => {
                this.listQuery.query.companyId = data[0].value,
                    this.defaultCompanyId = data[0].value;
                this.getCompanyLockInfo().then(() => {
                    this.fetchList()
                })
            })

        },

    }
</script>

