<template>
    <div class="app-container">
        <contentTitle :titleParams="{ title: $route.name,permission:permission}"></contentTitle>
        <el-form :inline="true" :model="listQuery" ref="listQuery" class="filter-container" label-width="71px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="作品ID :" prop="query.bookId">
                        <el-input placeholder="" placeholder="作品ID" :maxlength="10" v-model="listQuery.query.bookId"
                                  @keyup.enter.native="fetchList"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="作者ID :" prop="query.authorId">
                        <el-input placeholder="" placeholder="作者ID" :maxlength="10" v-model="listQuery.query.authorId"
                                  @keyup.enter.native="fetchList"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="所属公司 :" prop="query.companyId">
                        <el-select v-model="listQuery.query.companyId" :disabled="companyList.length===1"> <!---->
                            <el-option
                                    v-for="item in companyList"
                                    :key="item.value"
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
                                    :key="item.value"
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
                        <el-select v-model="listQuery.query.signStatusesKey"   >
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

        <div class="auditTableContainer" v-loading="listLoading"   >
            <v-affix :offset-top="60">
                <table class="auditTable" style="width: 100%" cellspacing="1" cellpadding="5" bgcolor="#ebeef5" >
                    <auditTableHead></auditTableHead>
                </table>
            </v-affix>
            <table class="auditTable"  style="width: 100%" cellspacing="1" cellpadding="5" bgcolor="#ebeef5" >
                <auditTableHead></auditTableHead>
                <tbody  ></tbody>
            </table>
            <blankList :listLen="listLen" :init="init"></blankList>
        </div>
        <auditPass
                :selectedItems="selectedItems"
                @passAudit="passAudit"
                :isLock="isLock"
                :auditPassLoading="auditPassLoading"
                :permission="permission.pass">
        </auditPass>
    </div>
</template>

<script type="text/ecmascript-6">
    import {update, pass,permission_partnersFirst} from '@/api/auditCommon'
    import auditPass from '@/views/remuneration/component/auditPass'
    import blankList from '@/views/remuneration/component/blankList'
    import partnerAuditMixin from './partnerAuditMixin'
    import auditTableMixin from "../auditTableMixin";
    import auditTableHead from '@/views/remuneration/component/auditTableHead'

    export default {
        components: {auditPass,blankList,auditTableHead},
        mixins: [ partnerAuditMixin,auditTableMixin],
        data() {
            return {
                permission: permission_partnersFirst,
                paramsText: {
                    list: 'partner_first',
                    reject: 'to_reject_partner',
                    rejectMsg: '不予支付操作成功'
                },
                rejectAuth:this.$_has(permission_partnersFirst.reject)
            }
        },
        computed: {},
        methods: {
            // 通过审核
            passAudit() {
                this.$confirm('确定通过吗', '合作方稿费一审', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    let params = {
                        ids: this.ids
                    }
                    this.auditPassLoading = true
                    pass(params, 'pass_first_partner').then(response => {
                        if (response.data.items) {
                            this.$message({
                                message: '已审核通过',
                                type: 'success',
                                onClose: () => {
                                    this.fetchList()
                                }
                            })
                        }else{
                            this.$message({
                                type: 'warning',
                                message: response.data.msg,
                            });
                            this.auditPassLoading = true
                        }
                    })
                }).catch((err) => {
                })
            },
        }
    }
</script>
