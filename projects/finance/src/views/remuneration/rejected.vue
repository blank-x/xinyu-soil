<template>
    <div class="app-container welfare">
        <!--标题-->
        <contentTitle :titleParams="{ title: '不予支付列表',permission:permission }"></contentTitle>
        <!--查询-->
        <el-form :inline="true" :model="listQuery" ref="listQuery" class="filter-container" label-width="71px">
            <el-row :gutter="0">
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
                    <el-form-item label="所属CP:" prop="query.cpId">
                        <el-select v-model="listQuery.query.cpId" :disabled="cpList.length===1"  placeholder="请选择">
                            <el-option
                                    v-for="item in cpList"
                                    :key="item.value"
                                    :label="item.text"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="合作模式 :" prop="query.payType">
                        <el-select v-model="listQuery.query.payType" placeholder="请选择">
                            <el-option
                                    v-for="item in payTypesList"
                                    :key="item.value"
                                    :label="item.text"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="0">
                <el-col :span="6">
                    <el-form-item label="所属月份:" prop="query.dealMonth" class="cashPlaceHolder" >
                        <el-date-picker
                                value-format="yyyyMM"
                                format="yyyy-MM"
                                v-model="listQuery.query.dealMonth"
                                :picker-options="pickerOptions"
                                type="month"
                                 :editable="false"
                                placeholder="全部">
                        </el-date-picker>
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
        <!--列表-->
        <el-table :data="list"
                  ref="listTable"
                  size="small"
                  :empty-text="emptyText"
                  v-loading="listLoading"
                  element-loading-text="加载中.."
                  border fit stripe highlight-current-row
                  :header-cell-style="headerStyle"
                  @header-click="headerClick"
                  :max-height="tableHeight"
                  :cell-class-name="cellClassName"
                  @filter-change="tableFilter_Fn">

            <el-table-column label="作者ID" width="100" align="center">
                <template slot-scope="scope">
                    <notEnabled :row="scope.row"></notEnabled>
                </template>

            </el-table-column>
            <el-table-column label="作者笔名" min-width="125" align="center">
                <template slot-scope="scope">
                    <a target="_blank" :href="scope.row.authorId | createPeopleLink"
                       class="hoverLink">{{scope.row.penName}}</a>
                </template>
            </el-table-column>
            <el-table-column label="作品ID" width="100" align="center">
                <template slot-scope="scope">
                    <a class="hoverLink" :href="$options.filters.createToBooKUrl(scope.row.bookId)" target="_blank">{{scope.row.bookId}}</a>
                </template>
            </el-table-column>
            <el-table-column label="作品名称" minWidth="120" align="center">
                <template slot-scope="scope">
                    <a target="_blank" :href="scope.row.bookId | createBookLink"
                       class="hoverLink">{{scope.row.bookName}}</a>
                </template>
            </el-table-column>
            <el-table-column label="所属CP" width="100" align="center">
                <template slot-scope="scope">
                    <nullValue :text="scope.row.cpName"></nullValue>
                </template>
            </el-table-column>
            <el-table-column label="签约状态" width="100" align="center" prop="signStatus" column-key="signStatuses"  :filters="options_sign" filter-placement="bottom">
                <template slot-scope="scope">
                    <span :class="{'danger':!scope.row.signStatus || scope.row.signStatus==3}">{{scope.row.signStatusDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column label="合作模式" width="100" align="center"  >
                <template slot-scope="scope">
                    <payType :row="scope.row"></payType>
                </template>
            </el-table-column>
            <el-table-column label="签署人" width="100" align="center">
                <template slot-scope="scope">
                    <span >{{!scope.row.signStatus ? '------':(scope.row.realName || '------')}}</span>

                </template>
            </el-table-column>

            <el-table-column label="稿费类型" width="100" align="center" prop="type" :filters="typesList"  filter-placement="bottom" column-key="types">
                <template slot-scope="scope">
                    <openPayDetail :detailData="{
                        type:scope.row.type,
                        typeDesc:scope.row.typeDesc,
                        bookId:scope.row.bookId,
                        bookName:scope.row.bookName,
                        dealMonth:listQuery.query.dealMonth,
                        manual:scope.row.manual
                    }"></openPayDetail>
                </template>
            </el-table-column>
            <el-table-column label="稿费" width="100" align="center" prop="money">
                <template slot-scope="scope">
                    <span :class="{'danger':scope.row.money>=10000}">{{(scope.row.money/100).toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" min-width="180" align="center" prop="remark">
                <template slot-scope="scope">
                    <textEllipsis :text="scope.row.remark"></textEllipsis>
                </template>
            </el-table-column>

            <el-table-column label="操作" min-width="110" align="center"  :resizable="false"  :fixed="list.length==0?false:'right'"  prop="handle">
                <template slot-scope="scope">
                    <div>
                        <el-button type="text" v-has="permission.recover" class="button-link" v-if="!isLock"
                                   @click="recovery_Fn(scope.row.id)">恢复一审</el-button>
                    </div>

                    <div>
                        <el-button class="button-link" v-if="scope.row.rejectId  " type="text"
                                   @click="reject_Fn(scope.row.rejectId)">驳回记录</el-button>
                    </div>

                    <el-button :disabled="true" class="button-link" type="text" v-if="isLock">已锁定</el-button>

                </template>
            </el-table-column>


        </el-table>
        <!--翻页-->
        <pagination :listQuery="listQuery"
                    :total="this.page_list.totalItemsCount"
                    :listLoading="listLoading"
                    v-if="list.length!==0"
                    @fetchList="fetchList">
        </pagination>
        <rejectRecord :rejectProps="rejectProps"></rejectRecord>


    </div>
</template>

<script>
    import {rejectedList, recover_first, inspectLog, permission} from '@/api/rejected'//接口
    import {getLockInfo} from '@/api/auditCommon'//接口
    import {mapGetters} from 'vuex'
    import tableMixin from '@/mixins/tableHeight'
    import headerClick from '@/mixins/headerClick'
    import {convertDic, getCpInfo, deepClone, getLastMonthYestdy} from '@/utils'
    import openPayDetail from '@/views/remuneration/component/openPayDetail'
    import rejectRecord from '@/views/remuneration/component/rejectRecord'

    import payType from '@/views/remuneration/component/payType'

    export default {
        components: {openPayDetail, rejectRecord,payType},
        mixins: [headerClick, tableMixin],
        data() {
            return {
                permission: permission,//权限
                emptyText: '',//无数据提示
                init: true,
                headerStyle: this.appConfig.HEADER_STYLE,//表头样式
                listLoading: true,//懒加载
                list: [],//内容列表数据
                page_list: '',//列表翻页数据
                //列表传入参数
                listQuery: {
                    query: {
                        authorId: undefined,
                        bookId: undefined,
                        cpId: null,
                        dealMonth: getLastMonthYestdy(),
                        payType: undefined,
                        signStatus: undefined,
                        types: undefined
                    },
                    sort: {
                        orderByField: "id",
                        orderDirect: "desc"
                    },
                    page: {
                        pageNo: 1,
                        pageSize: 100
                    }
                },

                //查询月份限制
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },

                rejectLogData: [],
                isLock: false,
                rejectProps: {},
                defaultCpId:null,
                lockList:[]
            }
        },
        created() {
            this.$store.dispatch('getAuditCpsDetail').then((data)=>{
                this.listQuery.query.cpId = data[0].value;
                this.defaultCpId = data[0].value;
                this.getLockInfo().then(()=>{
                    this.fetchList()
                })
            })

        },
        computed: {
            // 字典调用方法
            ...mapGetters([
                'cpInfo',
                'dicList',
                'auditCpsDetail'
            ]),

            cpList() {
                return this.auditCpsDetail.slice() || []
            },
            payTypesList(){
                let temp = []
                this.auditCpsDetail.forEach(item=>{
                    if(item.value === this.listQuery.query.cpId){
                        temp =  item.copyrightPayTypes.slice()
                    }
                })
                temp.unshift({value:undefined,text:'全部'})
                return temp
            },
            typesList(){
                let temp = []
                this.auditCpsDetail.forEach(item=>{
                    if(item.value === this.listQuery.query.cpId){
                        temp =  item.payLogTypes.slice()
                    }
                })
                return temp
            },

            //签约状态
            options_sign: function () {
                let signlists = convertDic(this.dicList, '7')
                return signlists//根据权限显示
            },

        },
        methods: {
            //列表数据-接口
            fetchList() {
                this.listLoading = true
                rejectedList(this.listQuery).then(response => {
                    this.setLockStatus()
                    this.listLoading = false
                    this.list = response.data.items
                    this.page_list = response.data.paginate//翻页数据
                    if (this.init) {
                        this.emptyText = '暂无数据'
                        this.init = false
                    } else {
                        this.emptyText = '查询无结果'
                        this.getLockInfo()
                    }
                })
            },
            //重置
            resetListQuery() {
                if (this.$refs['listQuery'] != undefined) {
                    this.$refs['listQuery'].resetFields();
                    this.$refs['listTable'].clearFilter()
                    // 重置筛选条件
                    this.listQuery.query.payTypes=undefined
                    this.listQuery.query.signStatuses=undefined
                    this.listQuery.query.types=undefined
                    //所属公司
                    if(this.defaultCpId){
                      this.listQuery.query.cpId = this.defaultCpId;
                    }
                    this.fetchList()
                }
            },
            // 表头过滤
            tableFilter_Fn(column) {
                console.log(column)
                for (let i in column) {
                    if (column[i].length > 0) {
                        this.listQuery.query[i] = column[i]
                    } else {
                        this.listQuery.query[i] = undefined
                    }
                }
                this.fetchList();
            },


            //恢复
            recovery_Fn(val) {
                this.$confirm('确定恢复到稿费一审吗?', '恢复一审', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    recover_first(val).then(response => {
                        this.listLoading = false
                        if (response.data.items) {
                            this.$message({message: '恢复一审成功', type: 'success'})
                            this.fetchList()
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
            //驳回记录
            reject_Fn(id) {
                inspectLog(id).then(res => {
                    this.rejectProps = {
                        list: res.data.items ? [res.data.items] : [],
                        dialogVisible: true
                    }
                })
            },
            getLockInfo() {
                return getLockInfo().then(res => {
                    if (res.data.items) {
                        this.lockList = res.data.items
                        this.setLockStatus()

                    }
                })
            },
            cellClassName(arg){
                let propertys = ['money','handle','typeDesc','remark']
                if(arg.row.manual===true && propertys.indexOf(arg.column.property ) >-1  ){
                    return 'marked'
                }
            },
            setLockStatus(){
                this.lockList.forEach(item => {
                    if (item.cpId === this.listQuery.query.cpId) {
                        this.isLock = item.locked
                    }
                });
            }

        },
        watch: {
            'listQuery.query.bookId': function (val, oldVal) {
                if (val) {
                    let content = val.replace(/[^0-9]/g, '');
                    setTimeout(() => {
                        this.listQuery.query.bookId = content
                    }, 0)
                }
            },
            'listQuery.query.authorId': function (val, oldVal) {
                if (val) {
                    let content = val.replace(/[^0-9]/g, '');
                    setTimeout(() => {
                        this.listQuery.query.authorId = content
                    }, 0)
                }
            },
        },
    }
</script>
<style lang="scss" scoped>
    .button-link {
        padding-top: 2px;
        padding-bottom: 2px;
    }
</style>
