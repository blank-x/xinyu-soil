<template>
    <div class="app-container">
        <contentTitle :titleParams="{title: '作者校验失败记录'}"></contentTitle>
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
                    <el-form-item label="所属CP :" prop="query.cpId">
                        <el-select v-model="listQuery.query.cpId" :disabled="cpList.length===1" @change="changeCp"> <!---->
                            <el-option
                                    v-for="item in cpList"
                                    :key="item.text"
                                    :label="item.text"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <el-form-item label="责编 :" prop="query.editorIds">
                        <el-select v-model="listQuery.query.editorIds" class="cpListMuti" :disabled="editorList.length<=1"  multiple  collapse-tags placeholder="全部">
                            <el-option
                                    v-for="item in editorList"
                                    :key="item.userId"
                                    :label="item.realName"
                                    :value="item.userId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="float: right">
                    <el-form-item class="search-btn-padding">
                        <search @search="fetchList" :listLoading="listLoading"></search>
                        <reset @reset="resetListQuery"></reset>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
        <div class="auditTableContainer" v-loading="listLoading"   >
            <v-affix :offset-top="60">
            <table class="auditTable" style="width: 100%" cellspacing="1" cellpadding="5" bgcolor="#ebeef5">
                    <failedTableHead></failedTableHead>
            </table>

            </v-affix>
            <table class="auditTable" style="width: 100%" cellspacing="1" cellpadding="5" bgcolor="#ebeef5">
                 <failedTableHead :editorName="true"></failedTableHead>
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
    import {checkAuthorFailed,getLockInfo,filteEditors} from '@/api/auditCommon'
    import {searchBookInfoById} from '@/api/common'
    import blankList from '@/views/remuneration/component/blankList'
    import ownAuditMixin from './ownAudit/ownAuditMixin'
    import {convertDic,mergeDataConvert} from '@/utils'
    import textareaSize from '@/views/components/textareaSize'
    import auditTableMixin from "./auditTableMixin"; // textarea
    import failedTableHead from '@/views/remuneration/component/failedTableHead'

    export default {
        components: { textareaSize, blankList, failedTableHead},
        mixins: [ownAuditMixin, auditTableMixin],
        data() {
            // 稿费 验证
            let validator_money = (rule, value, callback) => {
                let reg = /^(\-)?([|1-9]\d*)?\d(\.\d*)?$/

                if (!reg.test(value)) {
                    return callback(new Error('稿费填写格式不正确，仅限阿拉伯数字'))
                }

                if (this.createData.typeTemp) {
                    if (this.createData.typeTemp.numSign === -1 && (value > 0)) {
                        return callback(new Error('此稿费类型是扣款类型，请填写负值'))
                    }
                    if (this.createData.typeTemp.numSign === 1 && (value < 0)) {
                        return callback(new Error('此稿费类型不是扣款类型，请填写正值'))
                    }
                }
                return callback()

            }

            let typeTempValidator = (rule, value, callback) => {

                if (!value.value) {
                    return callback(new Error('请选择稿费类型'))
                }
                return callback()

            }

            return {
                noDataText: '无数据',
                ajaxStatus:false,
                canAdd:false
             }
        },
        computed: {
            addTypesList () {
                let temp = []

                if(this.canAdd === undefined){
                    return temp
                }

                if (this.createData.bookId.length === 0) {
                    this.createData.typeTemp = {}
                } else {
                    this.auditCpsDetail.forEach(item => {
                        if (item.value === this.bookInfoTemp.cpId) {
                            temp = item.payLogTypes.filter(item => {
                                // 不是合作方
                                // 如果 canAdd是true  所有的稿费类型都可以添加
                                // 如果 canAdd是false limitByRole是false的可以添加
                                return !item.partnerType && (this.canAdd || !item.limitedByRole)
                            })
                        }
                    })
                }


                return  temp
            },

        },
        methods: {
//  获取列表
            fetchList() {
                this.listLoading = true;
                this.auditPassLoading = true

                let queryTemp = {
                    bookId: this.listQuery.query.bookId,
                    authorId: this.listQuery.query.authorId,
                    cpId: this.listQuery.query.cpId,
                    editorIds:this.listQuery.query.editorIds.length === 0 ? undefined : this.listQuery.query.editorIds
                }
                checkAuthorFailed(queryTemp).then(response => {
                    if(this.leaveCurrentRoute){
                        return false
                    }
                    this.setLockStatus()
                    let condition = {
                        key: 'userId',
                        userId: {
                            column: 'userId'
                        },
                        penName: {
                            column: 'userId'
                        },
                        sumMoney: {
                            column: 'userId',
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


                    if (this.init === null) {
                        this.init = true
                    } else if (this.init === true) {
                        this.init = false
                    }

                    this.$nextTick(() => {
                        document.querySelector('.auditTable tbody').innerHTML =  mergeDataConvert({
                            data: response.data.items,
                            keys: condition,
                            isLock: this.isLock,
                            template: 'failedTable',
                            pageName: 'checkFailed',
                            dealMonth: this.listQuery.query.dealMonth,
                            rejectAuthClass: this.rejectAuth ? '' : 'is-disabled',
                        })
                        this.bindEvents()
                        this.tableHeaderTop = document.querySelector(".auditTableContainer").offsetTop;
                    })
                });
            },

        },
        watch: {

            // 当填写了第三位小数时则第三位小数不显示
            'createData.moneyYuan': {
                handler: function (val, oldVal) {
                    // 超过两位小数的数字
                    let reg = /^(\-)?([1-9]\d*)?\d(\.\d{3,})$/
                    if (reg.test(this.createData.moneyYuan)) {
                        this.$nextTick(() => {
                            let index = this.createData.moneyYuan.indexOf('.')
                            this.createData.moneyYuan = this.createData.moneyYuan.substring(0, index + 3)
                        })
                    }
                }
            },
            'createData.bookId': {
                handler: function (val, oldVal) {
                    if (this.createData.bookId.length > 1) {
                        this.createData.bookId.splice(0, 1)
                    }
                }
            }
        }
    }
</script>
<style scoped>
    .errmsg {
        height: 20px;
        margin-left: 20px;
        color: #fa5555;
        padding-left: 110px;
        margin-top: -16px;
        margin-bottom: 0px;
    }
</style>
