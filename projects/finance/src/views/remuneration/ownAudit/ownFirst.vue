<template>
    <div class="app-container">
        <contentTitle :titleParams="titleParams"
                      @createHandler="addAuditManual">
            <el-button type="primary" icon="el-icon-search" style="float:right; margin-left: 15px" @click="toAuthorFailed">
                查看作者校验失败记录
            </el-button>
        </contentTitle>
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

                <el-col :span="6">
                    <el-form-item label="稿费类型 :" prop="query.type">
                        <el-select v-model="listQuery.query.type"> <!---->
                            <el-option
                                    v-for="item in typesList"
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
                                :picker-options="pickerOptions"
                                :editable="false"
                                placeholder="全部">
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
                <el-col :span="12" style="float: right">
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
                    <auditTableHead :editorName="true"></auditTableHead>
            </table>
            </v-affix>
            <table class="auditTable" style="width: 100%" cellspacing="1" cellpadding="5" bgcolor="#ebeef5">
                 <auditTableHead :editorName="true"></auditTableHead>
                <tbody ></tbody>
            </table>

            <blankList :listLen="listLen" :init="init"></blankList>

        </div>
        <auditPass :selectedItems="selectedItems"
                   @passAudit="passAudit"
                   :isLock="isLock"
                   :permission="permission.pass"
                   :auditPassLoading="auditPassLoading"
        ></auditPass>


        <rejectReason :rejectReasonProps="rejectReasonProps"></rejectReason>
        <el-dialog :title="addFormVisual?'添加稿费':'请核对添加的稿费：'" :visible.sync="addDialogVisual" width="860px"
                   :close-on-click-modal="false"
                   custom-class="partnerA-add-dialog">
            <el-form class="small-space" v-show="addFormVisual" :model="createData" label-width="130px"
                     :rules="addAuditRules" ref="addForm"
                     style="margin-left: 50px;">
                <el-form-item label="作品ID :" class="no-required-star" prop="bookId" :error="wrongIdError">
                    <el-select
                            style="width:400px;"
                            v-model="createData.bookId"
                            multiple
                            filterable
                            default-first-option
                            popper-class="fuzzy-el-select-class"
                            remote
                            :loading="fuzzyLoading"
                            :no-data-text="noDataText"
                            loading-text="加载中···"
                            placeholder="请填写作品ID进行选择"
                            :remote-method="remoteMethod"> <!---->
                        <el-option
                                v-for="item in fuzzyBookList"
                                :key="item.value"
                                :label="item.label+' - 所属CP :'+item.cpName"
                                :value="item.value">
                            <span>{{item.label}}
                                  <i style=" font-style:normal; font-size: 12px">-所属CP:{{item.cpName}}</i>
                            </span>
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="稿费类型 :" prop="typeTemp" class="no-required-star">
                    <el-select v-model="createData.typeTemp" style="width:200px;" placeholder="与所选作品CP关联">
                        <el-option
                                v-for="item in addTypesList"
                                :key="item.value"
                                :label="item.text"
                                :value="{value:item.value,numSign:item.numSign,text:item.text}">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="稿费 :" prop="moneyYuan" class="no-required-star">
                    <el-input style="width:200px" v-model="createData.moneyYuan">
                        <template slot="append">￥</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="备注 :" style="max-width: 600px" prop="remark" class="no-required-star">
                    <textareaSize placeholder="请填写备注，1-200字" v-model="createData.remark"
                                  :autosize="{minRows:2,maxRows:5}" :maxSize="200"></textareaSize>
                </el-form-item>

                <el-row>
                    <el-col :span="12">
                        <p class="errmsg">{{errorMsgAdd}}</p>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="" label-width="0" style="text-align: right;margin-bottom: 2px;">
                            <el-button type="primary" @click="createMethod">添 加</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>


            <el-form class="small-space" v-show="checkFormVisual" :model="createData" label-width="130px"
                     style="margin-left: 50px;">
                <el-form-item label="作者ID :" class="bottom10" prop="bookId">
                    <span>{{ bookInfoTemp.authorId}}</span>
                </el-form-item>
                <el-form-item label="作者笔名 :" class="bottom10" prop="bookId">
                    <span>{{ bookInfoTemp.penName}}</span>
                </el-form-item>
                <el-form-item label="作品ID :" class="bottom10" prop="bookId">
                    <span>{{ createData.bookId[0]}}</span>
                </el-form-item>

                <el-form-item label="作品名称 :" class="bottom10" prop="bookId">
                    <span>{{ bookInfoTemp.name}}</span>
                </el-form-item>

                <el-form-item label="稿费类型 :" prop="typeText" class="bottom10">
                    <span>{{createData.typeTemp.text}}</span>
                </el-form-item>

                <el-form-item label="稿费 :" prop="moneyYuan" class="bottom10">
                    <span>￥{{createData.moneyYuan}}</span>
                </el-form-item>

                <el-form-item label="备注 :" style="max-width: 600px" prop="remark" class="bottom10">
                    <span>{{createData.remark }}</span>

                </el-form-item>

                <el-form-item label="" label-width="0" style="text-align: right;margin-bottom: 2px;">

                </el-form-item>


                <el-row>
                    <el-col :span="12">
                        <p class="errmsg">{{errorMsgAdd}}</p>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="" label-width="0" style="text-align: right;margin-bottom: 2px;">
                            <el-button :loading="addloading" @click="saveAddData" type="primary">提 交</el-button>
                            <el-button style="width:88px;" @click="reModify">重新修改</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>


            </el-form>

        </el-dialog>

        <rejectRecord :rejectProps="rejectProps"></rejectRecord>
    </div>
</template>

<script type="text/ecmascript-6">
    /*
     * addAudit  添加稿费接口
     * fetchList 获取列表
     * */
    import {fetchList, update, pass, permission_ownFirst, addAudit, getLockInfo,filteEditors,checkAuthorNumber} from '@/api/auditCommon'
    import {searchBookInfoById} from '@/api/common'
    import auditPass from '@/views/remuneration/component/auditPass'
    import blankList from '@/views/remuneration/component/blankList'
    import rejectRecord from '@/views/remuneration/component/rejectRecord'
    import ownAuditMixin from './ownAuditMixin'
    import {convertDic} from '@/utils'
    import rejectReason from '@/views/remuneration/component/rejectReason'
    import textareaSize from '@/views/components/textareaSize'
    import auditTableMixin from "../auditTableMixin"; // textarea
    import auditTableHead from '@/views/remuneration/component/auditTableHead'

    export default {
        components: {auditPass, rejectRecord, rejectReason, textareaSize, blankList, auditTableHead},
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
                checked: true,
                password: '',
                form1Data: {password: null},
                createData: {
                    bookId: [],
                    moneyYuan: null,
                    remark: null,
                    type: null,
                    typeTemp: {}
                },
                addloading: false,
                //  模糊查询 loading
                fuzzyLoading: false,
                fuzzyBookList: [],
                // 添加稿费验证规则
                addAuditRules: {
                    bookId: [{required: true, message: '作品不能为空', trigger: 'blur,change'}],
                    typeTemp: [{validator: typeTempValidator, trigger: 'blur,change'}],
                    moneyYuan: [{required: true, message: '请填写稿费'}, {validator: validator_money, trigger: 'blur'}],
                    remark: [{required: true, message: '请填写备注，1-200字'}]
                },
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
                // 不予支付 保存数据
                rejectReasonData: {reason: null, reasonText: null, id: null},

                titleParams: {
                    title: this.$route.name,
                    permission: permission_ownFirst,
                    createItem: true,
                    createText: '添加稿费'
                },
                paramsText: {
                    list: 'own_first',
                },
                rejectReasonProps: {},
                noDataText: '无数据',
                wrongIdError: '',
                permission: permission_ownFirst,
                rejectAuth: this.$_has(permission_ownFirst.reject),
                deleteAuth: this.$_has(permission_ownFirst.delete),
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

            // 手动添加稿费  弹框
            addAuditManual() {
                this.getLimitedByRole()
                this.resetForm('addForm')
                this.addDialogVisual = true
                this.addFormVisual = true
                this.checkFormVisual = false
                this.getLimitedByRole()
             },

            // 不予支付
            rejectAudit(id) {
                // 没有权限
                if (this.rejectAuth === false) {
                    return;
                }
                this.rejectReasonProps = {
                    title: '不予支付',
                    show: true,
                    type: 'audit',
                    id: id,
                    rejectParams: 'to_reject_own',
                    reasonListKey: '33',
                    rejectMsg: '不予支付操作成功',
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
                this.$confirm('确定通过吗', '责编一审', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    let params = {
                        ids: this.ids
                    }
                    this.auditPassLoading = true
                    pass(params, 'pass_first_own').then(response => {
                        this.auditPassLoading = true
                        if (response.data.items) {
                            this.$message({
                                message: '已审核通过',
                                type: 'success',
                                onClose: () => {
                                    checkAuthorNumber(params).then(res=>{
                                        if(res.data.items){
                                            this.$confirm(`共<span style="color:#F56C6C">${res.data.items}</span>个作者因校验信息存在缺陷<br/>请尽快联系作者完善信息避免影响稿费结算!`, '提示', {
                                                dangerouslyUseHTMLString: true,
                                                confirmButtonText: '查看作者校验失败记录',
                                                showCancelButton:false,
                                                type: 'warning'
                                            }).then(() => {
                                                this.$router.push({ path:"/remuneration/checkFailed"});
                                            })
                                        }
                                        this.fetchList()
                                    })
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
                }).catch((err) => {})
            },
            //跳转作者失败列表
            toAuthorFailed(){
                this.$router.push({ path:"/remuneration/checkFailed"});
            },
            // 删除手动添加的
            deleteManual(id) {
                console.log('手动删除')
                // 没有权限
                if (this.deleteAuth === false) {
                    return;
                }
                this.$confirm('确定删除吗', '责编一审', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {

                    update(id, 'to_delete_own', {}).then(response => {
                        if (response.data.items) {
                            this.$message({
                                message: '已删除',
                                type: 'success',
                                onClose: () => {
                                    let checkboxDom = document.querySelector("#spanCheckbox_" + id),
                                        handleDom = document.querySelector("#handle_" + id);
                                    checkboxDom.parentNode.removeChild(checkboxDom);
                                    handleDom.innerHTML = "已删除";
                                    this.setSelectedOrSumMoney();
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
            // 模糊搜索方法
            remoteMethod(value) {
                // 空值不搜索
                if (value === '') {
                    this.fuzzyBookList = []
                    this.fuzzyLoading = false
                    return
                }

                // 如果输入的值不是数字  ，提示只能是数字
                if (!/^\d*$/.test(value)) {
                    this.$nextTick(() => {
                        document.querySelector('.fuzzy-el-select-class.el-select-dropdown.el-popper.is-multiple').style.display = 'none'
                        this.wrongIdError = '作品ID只能是数字'
                    })
                    return
                }
                // 置空错误信息
                this.wrongIdError = ''
                document.querySelector('.fuzzy-el-select-class.el-select-dropdown.el-popper.is-multiple').style.display = ''

                this.fuzzyLoading = true
                clearInterval(this.timer)
                this.timer = setTimeout(() => {
                    searchBookInfoById(value).then(res => {

                        this.fuzzyLoading = false
                        this.fuzzyBookList = []

                        if (res.data.items) {
                            let temp = res.data.items
                            this.bookInfoTemp = temp
                            this.fuzzyBookList = [{
                                value: temp.id,
                                label: temp.name,
                                cpName: temp.cpName

                            }]
                        } else {
                            this.noDataText = res.data.msg
                        }
                    })
                }, 500)
            },
            // 添加稿费 form显示
            createMethod() {
                this.$refs.addForm.validate(valid => {
                    if (valid) {
                        this.addFormVisual = !this.addFormVisual
                        this.checkFormVisual = !this.checkFormVisual
                    }
                })
            },
            // 确认 保存稿费
            saveAddData() {
                this.errorMsgAdd = ''
                this.addloading = true
                let params = {
                    bookId: this.createData.bookId[0],
                    type: this.createData.typeTemp.value,
                    moneyYuan: this.createData.moneyYuan,
                    remark: this.createData.remark
                }

                addAudit(params).then(res => {
                    if (res.data.items) {
                        this.addDialogVisual = !this.addDialogVisual
                        this.$message({
                            message: '添加成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.fetchList()
                    } else {
                        this.errorMsgAdd = res.data.msg
                    }
                    this.addloading = false
                })
            },

            // 重新修改添加稿费
            reModify() {
                this.addFormVisual = !this.addFormVisual
                this.checkFormVisual = !this.checkFormVisual
            },
            // 添加稿费中的稿费类型
            getLimitedByRole(){
                filteEditors().then(res=>{
                    this.canAdd = res.data.items
                })
            }
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
