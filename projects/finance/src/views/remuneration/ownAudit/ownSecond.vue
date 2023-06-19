<template>
    <div class="app-container">
        <contentTitle :titleParams="{ title: $route.name,permission:permission,download:true}" @downHandler="exportData">
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
                        <el-select v-model="listQuery.query.cpId" :disabled="cpList.length===1" @change="changeCp">
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
                                :editable="false"
                                :picker-options="pickerOptions"
                                value-format="yyyyMM"
                                placeholder="全部">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="签约状态 :" prop="query.signStatusesKey">
                        <el-select v-model="listQuery.query.signStatusesKey" >
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
        <div class="auditTableContainer" v-loading="listLoading" >
            <v-affix :offset-top="60" >
                <table class="auditTable" style="width: 100%" cellspacing="1" cellpadding="5" bgcolor="#ebeef5">
                    <auditTableHead :editorName="true"></auditTableHead>
                </table>
            </v-affix>
            <table class="auditTable"  style="width: 100%" cellspacing="1" cellpadding="5" bgcolor="#ebeef5" >
                <auditTableHead :editorName="true"></auditTableHead>
                <tbody >
                </tbody>
            </table>
            <blankList :listLen="listLen" :init="init"></blankList>
        </div>

        <auditPass :selectedItems="selectedItems" @passAudit="passAudit" :isLock="isLock" :permission="permission.pass" :auditPassLoading="auditPassLoading"></auditPass>

        <el-dialog title="总编二审" :visible.sync="passwordDialog" :close-on-click-modal="false"
                   width="480px" class="settlementDialog">

            <el-form :model="confirmPasswordData" class="small-space" style="margin-left:30px" label-width="100px"
                     ref="confirmPasswordForm">

                <div style="margin:10px 0 20px 18px;">
                  <i class=" el-icon-warning" style="color: #e6a23c;font-size: 25px;vertical-align:bottom;margin-right: 7px"></i>
                  确定将选中的稿费审核通过？
                </div>
                <el-form-item label="请输入密码 :" prop="password" :error="confirmPassErr" class="no-required-star"
                              :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
                    <el-input type="password"  v-model="confirmPasswordData.password" style="width:200px;"></el-input>
                </el-form-item>
            </el-form>
            <div class="rejectErrmsg">{{passError}}</div>
            <!--保存、取消修改-->
            <span slot="footer" class="dialog-footer">
                <el-button style="width:88px;" @click="passwordDialog = false">取 消</el-button>
                <el-button type="primary" style="width:78px!important;" :loading="confirmPassLoading"
                           @click="confirmPassword()">确 定</el-button>
            </span>
        </el-dialog>
        <rejectRecord :rejectProps="rejectProps"></rejectRecord>

        <rejectReason :rejectReasonProps="rejectReasonProps"></rejectReason>

    </div>
</template>

<script type="text/ecmascript-6">

    import {fetchList, update, validatePassword, pass, permission_ownSecond, getLockInfo} from '@/api/auditCommon'
    import auditPass from '@/views/remuneration/component/auditPass'
    import blankList from '@/views/remuneration/component/blankList'
    import rejectRecord from '@/views/remuneration/component/rejectRecord'
    import ownAuditMixin from './ownAuditMixin'
    import rejectReason from '@/views/remuneration/component/rejectReason'
    import auditTableMixin from "../auditTableMixin";
    import auditTableHead from '@/views/remuneration/component/auditTableHead'
    import {exportFile} from '@/api/common'

    //二审
    export default {
        components: {auditPass, rejectRecord,rejectReason,blankList,auditTableHead},
        mixins: [ ownAuditMixin,auditTableMixin],
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
                permission: permission_ownSecond,

                // 提交返回的错误信息
                passError: '',
                // 驳回一审 保存数据
                rejectReasonData: {reason: null, reasonText: null, id: null},
                // 驳回一审理由验证规则
                rejectReasonFormRules: {
                    reason: [{validator: rejectReason, trigger: 'change'}],
                    reasonText: [{
                        validator: rejectReasonText, trigger: 'blur'
                    }
                    ]
                },
                // 确认密码  弹窗显示
                passwordDialog: false,
                // 确认密码错误提示
                confirmPassErr: null,
                // 确认密码数据
                confirmPasswordData: {
                    password: null,
                },
                // 确认密码 loading
                confirmPassLoading: false,
                paramsText:{
                    list:'own_second',
                },
                rejectReasonProps:{},
                rejectAuth:this.$_has(permission_ownSecond.reject)

            }
        },

        methods: {
            // 驳回一审 弹框
            rejectAudit(id) {
                this.rejectReasonProps = {
                    title:'二审驳回',
                    show:true,
                    type:'audit',
                    id:id,
                    rejectParams:'to_first_own',
                    reasonListKey:'34',
                    rejectMsg:'驳回成功',
                    finish:()=>{
                      let checkboxDom =  document.querySelector("#spanCheckbox_"+id),
                        handleDom =  document.querySelector("#handle_"+id);
                      checkboxDom.parentNode.removeChild(checkboxDom);
                      handleDom.innerHTML = "已驳回";
                      this.setSelectedOrSumMoney();
                    }
                }
            },


            // 通过 弹框
            passAudit() {
                this.passError = ''
                this.passwordDialog = true
                this.resetForm('confirmPasswordForm')
            },

            // 总编二审确认
            confirmPassword() {
                this.confirmPassErr = null
                this.passError = ''

                this.$refs.confirmPasswordForm.validate((valid) => {
                    if (valid) {
                        this.confirmPassLoading = true
                        this.auditPassLoading = true
                        validatePassword({pwd: this.confirmPasswordData.password}).then(response => {
                            if (response.data.items) {
                                let params = {
                                    ids: this.ids
                                };
                                this.auditPassLoading = true
                                pass(params, 'pass_second_own').then(response => {

                                    if (response.data.items) {
                                        this.$message({
                                            message: '已审核通过',
                                            type: 'success',
                                            onClose: () => {
                                                this.fetchList()
                                            }
                                        })
                                        this.passwordDialog = false
                                    } else {
                                        this.auditPassLoading = false
                                        this.passError = response.data.msg
                                    }
                                    this.confirmPassLoading = false

                                })
                            } else {
                                this.confirmPassLoading = false
                                this.confirmPassErr = response.data.msg
                                this.auditPassLoading = false
                            }
                        })

                    }
                })
            },
            exportData(){
                let url = '/paylogs_export/own_second'
                exportFile(url, this.downloadParams, '自有二审稿费导出数据', 'post', 'xlsx')
            }
        }
    }
</script>
<style scoped>

    .rejectErrmsg {
        margin-top: -18px;
        margin-left: 50px;
        height: 16px;
        color: #fa5555;
        font-size: 12px;
    }

</style>
