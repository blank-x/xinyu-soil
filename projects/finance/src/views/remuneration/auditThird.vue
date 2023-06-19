<template>
    <div class="app-container">
        <contentTitle :titleParams="{ title: '稿费三审',permission:permission,lock:showLockBtn}"
                      @lockHandler="lockAudit"></contentTitle>
        <el-form :inline="true" :model="listQuery" ref="listQuery" class="filter-container" label-width="71px">
            <el-row>
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
                    <el-form-item label="所属月份 :" prop="query.dealMonth" class="cashPlaceHolder">
                        <el-date-picker
                                v-model="listQuery.query.dealMonth"
                                type="month"
                                format="yyyy-MM"
                                value-format="yyyyMM"
                                :editable="false"
                                :picker-options="pickerOptions"
                                placeholder="全部"
                         >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="签约状态 :" prop="query.signStatusesKey">
                        <el-select v-model="listQuery.query.signStatusesKey">
                            <el-option
                                    v-for="item in signStatusesList"
                                    :key="item.value"
                                    :label="item.text"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="合作模式 :" prop="query.payTypesKey">
                        <el-select v-model="listQuery.query.payTypesKey">
                            <el-option
                                    v-for="item in payTypesList"
                                    :key="item.value"
                                    :label="item.text"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="稿费类型 :" prop="query.type">
                        <el-select v-model="listQuery.query.type">
                            <el-option
                                    v-for="item in typesList"
                                    :key="item.value"
                                    :label="item.text"
                                    :value="item.value">
                            </el-option>
                        </el-select>
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
            <v-affix :offset-top="60"   >
                <table class="auditTable" style="width: 100%" cellspacing="1" cellpadding="5" bgcolor="#ebeef5">
                    <auditTableHead></auditTableHead>
                </table>
            </v-affix>
            <table class="auditTable" style="width: 100%" cellspacing="1" cellpadding="5" bgcolor="#ebeef5">
                <auditTableHead></auditTableHead>
                <tbody></tbody>
            </table>
            <blankList :listLen="listLen" :init="init"></blankList>

        </div>

        <rejectReason :rejectReasonProps="rejectReasonProps"></rejectReason>

        <auditPass :selectedItems="selectedItems" @passAudit="passAudit" :isLock="isLock" :permission="permission.pass" :auditPassLoading="auditPassLoading"></auditPass>
        <rejectRecord :rejectProps="rejectProps"></rejectRecord>
    </div>
</template>

<script type="text/ecmascript-6">
    /*
    * addAudit  添加稿费接口
    * fetchList 获取列表
    * */
    import {
        fetchList,
        update,
        pass,
        inspectLog,
        permission_third,
        doLockByCompanyId,
        getCompanyLockInfo
    } from '@/api/auditCommon'
    import {getLastMonthYestdy, convertDic, mergeDataConvert, getCpInfo, getCompany, deepClone} from '@/utils'
    import {mapGetters} from 'vuex'
    import auditPass from '@/views/remuneration/component/auditPass'
    import rejectRecord from '@/views/remuneration/component/rejectRecord'
    import rejectReason from '@/views/remuneration/component/rejectReason'
    import auditTableMixin from "./auditTableMixin";
    import blankList from './component/blankList'
    import auditTableHead from '@/views/remuneration/component/auditTableHead'

    export default {
        components: {auditPass, rejectRecord, rejectReason, blankList, auditTableHead},
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
                        dealMonth: getLastMonthYestdy(),
                        payTypesKey: undefined,
                        signStatusesKey: undefined,
                        type: undefined
                    }
                },


                //loading 状态
                listLoading: true,

                init: null,
                errorMsgReject: '',
                permission: permission_third,
                selectedItems: [],
                rejectLogVisible: false,
                rejectLogData: [],

                // 提交返回的错误信息
                errorMsgAdd: '',
                //  添加稿费  表单显示隐藏
                addFormVisual: false,
                //  核对稿费 表单显示隐藏
                checkFormVisual: false,
                //  添加稿费 dialog 显示隐藏
                addDialogVisual: false,
                // 书籍搜索结果临时保存，方便核对添加时，数据的展示
                bookInfoTemp: {},
                isLock: false,
                cpLockList: [],
                rejectProps: {},
                //查询月份限制
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                defaultCompanyId: null,
                rejectReasonProps: {},
                rejectAuth: this.$_has(permission_third.reject),
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
            cpList() {
                let temp = []
                this.auditCompanyDetail.forEach(item => {
                    if (item.value === this.listQuery.query.companyId) {
                        temp = item.cpInfos.slice()
                    }
                })
                if (temp.length > 1) {
                    temp.unshift({value: undefined, text: '全部'})
                }
                this.listQuery.query.cpId = temp[0] && temp[0].value
                return temp || []


            },
            payTypesList() {
                let temp = []
                this.auditCompanyDetail.forEach(item => {
                    if (item.value === this.listQuery.query.companyId) {
                        temp = item.copyrightPayTypes.slice()
                    }
                })
                temp.unshift({value: undefined, text: '全部'});
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
            signStatusesList() {
                let temp = convertDic(this.dicList, '7').slice()
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
            showLockBtn() {
                return !this.isLock
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
                    bookId: this.listQuery.query.bookId,
                    authorId: this.listQuery.query.authorId,
                    cpId: this.listQuery.query.cpId,
                    companyId: this.listQuery.query.companyId,
                    dealMonth: this.listQuery.query.dealMonth,
                    types: this.listQuery.query.type !== undefined ? [this.listQuery.query.type] : undefined,
                    signStatuses: this.listQuery.query.signStatusesKey !== undefined ? [this.listQuery.query.signStatusesKey] : undefined,
                    payTypes: this.listQuery.query.payTypesKey !== undefined ? [this.listQuery.query.payTypesKey] : undefined
                }


                fetchList(queryTemp, 'third').then(response => {
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
                    this.listLen = response.data.items ? response.data.items.length : 0

                    // this.html = mergeDataConvert({
                    //     data: response.data.items,
                    //     keys: condition,
                    //     isLock: this.isLock,
                    //     template: 'commonTable',
                    //     pageName: 'auditThird',
                    //     dealMonth: this.listQuery.query.dealMonth,
                    //     rejectAuthClass: this.rejectAuth ? '' : 'is-disabled',
                    // })

                    if (this.init === null) {
                        this.init = true
                    } else if (this.init === true) {
                        this.init = false
                        this.getCompanyLockInfo()
                    }

                    this.$nextTick(() => {
                        document.querySelector('.auditTable tbody').innerHTML =  mergeDataConvert({
                            data: response.data.items,
                            keys: condition,
                            isLock: this.isLock,
                            template: 'commonTable',
                            pageName: 'auditThird',
                            dealMonth: this.listQuery.query.dealMonth,
                            rejectAuthClass: this.rejectAuth ? '' : 'is-disabled',
                        })
                        this.bindEvents()
                        this.tableHeaderTop = document.querySelector(".auditTableContainer").offsetTop;
                    })
                });
            },

            // 驳回二审
            rejectAudit(id) {
                if(this.rejectAuth === false){
                    return;
                }
                this.rejectReasonProps = {
                    title: '三审驳回',
                    type: 'audit',
                    show: true,
                    id: id,
                    rejectParams: 'to_second',
                    reasonListKey: '35',
                    rejectMsg: '驳回成功',
                    finish: () => {
                        let checkboxDom = document.querySelector("#spanCheckbox_" + id),
                            handleDom = document.querySelector("#handle_" + id);
                        checkboxDom.parentNode.removeChild(checkboxDom);
                        handleDom.innerHTML = "已驳回";
                        this.setSelectedOrSumMoney();
                    }
                }
            },
            // 通过
            passAudit() {
                this.$confirm('确定通过吗', '稿费三审', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    let params = {
                        ids: this.ids
                    }
                    this.auditPassLoading = true
                    pass(params, 'pass_third').then(response => {
                        if (response.data.items) {
                            this.$message({
                                message: '已审核通过',
                                type: 'success',
                                onClose: () => {
                                    this.fetchList()
                                }
                            })
                        } else {
                            this.$message({
                                message: response.data.msg,
                                type: 'warning',
                            })
                            this.auditPassLoading = false
                        }
                    })
                }).catch((err) => {
                })

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

            lockAudit() {
                // 通过companyId 找到公司名字
                let company = this.companyList.filter(item => {
                    return item.value == this.listQuery.query.companyId
                })
                this.$confirm('请确定要锁定的公司主体：' + company[0].text + "?", '锁定', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    doLockByCompanyId(this.listQuery.query.companyId)
                        .then(response => {
                            if (response.data.items) {
                                this.$message({
                                    message: '锁定执行成功',
                                    type: 'success',
                                    onClose: () => {
                                        this.getCompanyLockInfo().then(() => {
                                            this.fetchList()
                                        })
                                    }
                                })

                            } else {
                                this.$message({
                                    message: response.data.msg,
                                    type: 'warning',
                                })
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
                this.listQuery.query.companyId = data[0].value;
                this.defaultCompanyId = data[0].value;
                this.getCompanyLockInfo().then(() => {
                    this.fetchList()
                })
            })
        },
    }
</script>
