<template>
    <div class="app-container">
        <contentTitle :titleParams="{ title: $route.name,permission:permission}"></contentTitle>
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
                        <el-input  placeholder="作者ID" :maxlength="10" v-model="listQuery.query.authorId"
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
                                placeholder="全部">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="签约状态 :" prop="query.signStatusesKey">
                        <el-select v-model="listQuery.query.signStatusesKey"  >
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
                        <el-select v-model="listQuery.query.payTypesKey"  >
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
                        <el-select v-model="listQuery.query.type" >
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


        <div class="auditTableContainer" v-loading="listLoading"  >
            <v-affix :offset-top="60" >
                <table class="auditTable" style="width: 100%" cellspacing="1" cellpadding="5" bgcolor="#ebeef5">
                    <auditTableHead></auditTableHead>
                </table>
            </v-affix>
            <table class="auditTable"  style="width: 100%" cellspacing="1" cellpadding="5" bgcolor="#ebeef5" >
                <auditTableHead></auditTableHead>
                <tbody ></tbody></table>
            <blankList :listLen="listLen" :init="init"></blankList>

        </div>

        <auditPass
                :selectedItems="selectedItems"
                @passAudit="passAudit"
                :isLock="isLock"
                :auditPassLoading="auditPassLoading"
                :permission="permission.pass"></auditPass>

        <el-dialog :title="this.$route.name" :visible.sync="dialogVisible" :close-on-click-modal="false"
                   width="480px"  class="settlementDialog">

            <el-form :model="form1Data" class="small-space" style="margin-left:30px" label-width="100px"   ref="form1">
                <div style="margin:10px 0 15px 18px;background: #fff;" > <i style="transform: translateY(2px);font-size:18px;color:#EA9F0D" class="el-icon-warning"></i> <span>确定将选中的稿费审核通过？</span></div>
                <el-form-item label="请输入密码 :" class="no-required-star " prop="password" :error="errorMsg"  :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
                    <el-input type="password"  v-model="form1Data.password" style="width:200px;"></el-input>
                </el-form-item>
            </el-form>
            <div class="rejectErrmsg">{{passError}}</div>
            <!--保存、取消修改-->
            <span slot="footer" class="dialog-footer">
                <el-button style="width:88px;" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" style="width:78px!important;" @click="confirmPassword()" :loading="confirmPassLoading">确 定</el-button>
            </span>
        </el-dialog>
        <rejectRecord :rejectProps="rejectProps"></rejectRecord>

    </div>
</template>

<script type="text/ecmascript-6">
    import {update,validatePassword,inspectLog,pass,permission_partnersSecond} from '@/api/auditCommon'
    import auditPass from '@/views/remuneration/component/auditPass'
    import blankList from '../component/blankList'
    import rejectRecord from '@/views/remuneration/component/rejectRecord'
    import partnerAuditMixin from './partnerAuditMixin'
    import auditTableMixin from "../auditTableMixin";
    import auditTableHead from '@/views/remuneration/component/auditTableHead'

    export default {
        components: {auditPass,rejectRecord,blankList,auditTableHead},
        mixins: [ partnerAuditMixin,auditTableMixin],
        data() {
            return {
                dialogVisible: false,
                errorMsg: '',
                permission: permission_partnersSecond,
                password:'',
                form1Data:{password:null},
                rejectLogData:[],
                rejectProps:{},
                paramsText:{
                    list:'partner_second',
                    reject:'to_first_partner',
                    rejectMsg:'驳回成功'
                },
                rejectAuth:this.$_has(permission_partnersSecond.reject),
                passError:'',
                confirmPassLoading:false
            }
        },
        computed: {},
        methods: {
            // 确认密码
            confirmPassword(){
                this.errorMsg = ''
                this.passError = ''
                this.$refs.form1.validate((valid) => {
                    if(valid){
                        this.confirmPassLoading = true
                        this.auditPassLoading = true
                        validatePassword({pwd:this.form1Data.password}).then(response=>{
                            if(response.data.items){
                                let params = {
                                    ids: this.ids
                                };

                                pass(params, 'pass_second_partner').then(response => {
                                    if (response.data.items) {
                                        this.dialogVisible = false
                                        this.auditPassLoading = true

                                        this.$message({
                                            message: '已审核通过',
                                            type: 'success',
                                            onClose: () => {
                                                this.fetchList()
                                            }
                                        })
                                        this.dialogVisible = false
                                    }else{
                                        this.passError = response.data.msg
                                        this.auditPassLoading = false
                                    }
                                    this.confirmPassLoading = false
                                })
                            }else{
                                this.errorMsg = response.data.msg

                                this.confirmPassLoading = false
                                this.auditPassLoading = false
                            }
                        })

                    }
                })
            },
            // 查看驳回记录
            rejectAuditLog(id){
                inspectLog(id).then(res => {
                    this.rejectProps = {
                        list: res.data.items ? [res.data.items] : [],
                        dialogVisible: true
                    }
                })
            },
            passAudit(){
                this.passError = ''
                this.$nextTick(() => {
                    if (this.$refs['form1'] != undefined) {
                        this.$refs['form1'].resetFields()
                    }
                })
                this.dialogVisible = true
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
