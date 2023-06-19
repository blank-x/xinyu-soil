<template>
    <div>
        <el-dialog :title="rejectReasonProps.title" :visible.sync="rejectReasonProps.show" :close-on-click-modal="false"
                   width="480px"  >

            <el-form :model="rejectReasonData" class="small-space" label-width="100px" :rules="rejectReasonFormRules"
                     ref="rejectReasonForm">

                <el-form-item label="驳回理由 :" prop="reason">
                    <el-select v-model="rejectReasonData.reason" placeholder="请选择驳回理由"> <!---->
                        <el-option
                                v-for="item in rejectReasonList"
                                :key="item.text"
                                :label="item.text"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop="reasonText"
                              v-if="rejectReasonData.reason && (rejectReasonData.reason.value===-999)">

                    <textareaSize placeholder="请输入驳回理由,必填" v-model="rejectReasonData.reasonText" :autosize="{minRows:2,maxRows:5}" :maxSize="50"  ></textareaSize>
                </el-form-item>
            </el-form>
            <!--保存、取消修改-->
            <div class="rejectErrmsg">{{errorMsg}}</div>
            <span slot="footer" class="dialog-footer">
                <!--:error="errorMsgReject"-->
                <el-button style="width:88px;" @click="rejectReasonProps.show = false">取 消</el-button>
                <el-button type="primary" style="width:78px!important;" @click="rejectAuditConfirm" :loading="submitLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
    import {  convertDic } from '@/utils'
    import {mapGetters} from 'vuex'
    import {update} from '@/api/auditCommon'
    import {updateCashAudit} from '@/api/waitCashAndFail'
    import textareaSize from '@/views/components/textareaSize' // textarea

    export default {
        components:{textareaSize},
        props: {
            rejectReasonProps: {
                default:{}
            },
        },
        data(){
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
                rejectReasonData:{
                    reason: null,
                    reasonText: null,
                },
                // 不予支付理由验证规则
                rejectReasonFormRules: {
                    reason: [{validator: rejectReason, trigger: 'change'}],
                    reasonText: [{
                        validator: rejectReasonText
                    }]
                },
                errorMsg:'',
                submitLoading:false
            }
        },
        computed:{
            ...mapGetters([
                'dicList',
            ]),
            rejectReasonList(){
                let temp = convertDic(this.dicList, this.rejectReasonProps.reasonListKey).slice()
                temp.push({
                    value: -999,
                    text: '其他',
                    remark: null
                })
                return temp
            }
        },
        methods:{
            // 不予支付确认  二审驳回确认
            rejectAuditConfirm() {
                this.errorMsg = ''
                this.$refs.rejectReasonForm.validate((valid) => {
                    if (valid) {
                        //  其他的情况
                        let params = null
                        if (this.rejectReasonData.reason.value === -999) {
                            params = {remark: this.rejectReasonData.reasonText}
                        } else {
                            params = {remark: this.rejectReasonData.reason.text}
                        }
                        let method = null
                        if(this.rejectReasonProps.type === 'cash'){
                            method = updateCashAudit
                        }else if(this.rejectReasonProps.type === 'audit'){
                            method = update
                        }
                        this.submitLoading = true
                        method(this.rejectReasonProps.id, this.rejectReasonProps.rejectParams, params).then(response => {
                            if (response.data.items) {
                                this.$message({
                                    message: this.rejectReasonProps.rejectMsg,
                                    type: 'success',
                                    onClose: () => {

                                    }
                                });
                                this.rejectReasonProps.finish()
                                this.rejectReasonProps.show = false
                            } else {
                                this.errorMsg = response.data.msg
                            }
                            this.submitLoading = false
                        })

                    }
                })
            },
        },
        mounted(){

        },
        watch:{
            rejectReasonProps(){
                if (this.$refs.rejectReasonForm != undefined) {
                    this.$refs.rejectReasonForm.resetFields();
                }
            }
        }
    }
</script>

<style scoped>

</style>