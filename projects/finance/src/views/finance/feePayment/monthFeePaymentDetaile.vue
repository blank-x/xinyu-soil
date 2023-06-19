<template>
    <div class="app-container">
        <contentTitle :titleParams="{title: (titleAction || title) +'-月度支付明细' }"></contentTitle>
        <div class="filter-container">
            <el-form :inline="true" :model="listQuery" ref="listQuery" @submit.native.prevent>
                <el-row :gutter="6">
                    <el-col :span="6">
                        <el-form-item label="所属公司 :" prop="query.compay" style="margin-right: 12px">
                            <el-select v-model="listQuery.query.company" :disabled="companyList.length == 1" :filterable="companyList.length > 1" :clearable="companyList.length > 1">
                                <el-option
                                        v-for="item in companyList"
                                        :key="item.text"
                                        :label="item.text"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="支付月份 :" prop="query.createMonth" style="margin-right: 12px">
                            <el-col :span="18">
                                <el-date-picker   :clearable="false" :editable="false" type="month" placeholder="选择开始月份" v-model="listQuery.query.createMonth" value-format="yyyyMM"></el-date-picker>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item class="search-btn-padding">
                            <search @search="handleFilter" :listLoading="listLoading"></search>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="summary">
                    <label>稿费合计:<span>{{summary.sumMoneyText || '0.00' }}</span></label>
                    <label class="line"></label>
                    <label>税金合计:<span>{{summary.sumTaxMoneyText || '0.00' }}</span></label>
                    <label class="line"></label>
                    <label>实付合计:<span>{{summary.sumPayMoneyText || '0.00' }}</span></label>
                </div>
                <div class="summaryBox">
                    <div class="tabSummary" style="background: none">
                        <ul style="padding-left: 0px; padding-right: 0px">
                            <li v-for="(item,index) in monthSummary" v-bind:class="{firstLi:index == 0}" >{{item.itemTypeText}}：{{item.moneyText}}</li>
                        </ul>
                    </div>
                </div>
            </el-form>
        </div>
        <el-table :data="listData" :max-height="tableHeight" :empty-text="emptyText" v-loading="listLoading"
                  element-loading-text="加载中.." border fit stripe :header-cell-style="this.appConfig.HEADER_STYLE"
                  highlight-current-row>
            <!--  <el-table-column align="center" label="序号" type="index" width="50">-->
            <!--</el-table-column>-->
            <el-table-column align="center" label="支付ID" >
            <template slot-scope="scope">
                {{ scope.row.id }}
            </template>
            </el-table-column>
            <el-table-column align="center" label="签署人">
                <template slot-scope="scope">
                    {{ scope.row.realName }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="稿费总收入"  width="95">
                <template slot-scope="scope">
                    {{scope.row.moneyText}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="税金" prop="createTime">
                <template slot-scope="scope">
                    <span>{{scope.row.taxMoneyText}}</span>
                </template>
            </el-table-column>
            <el-table-column  align="center" label="实付">
                <template slot-scope="scope">
                    {{scope.row.payMoneyText}}
                </template>
            </el-table-column>
            <el-table-column  align="center" label="结算方式">
                <template slot-scope="scope">
                    {{scope.row.typeText}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="结算时间" width="180">
                <template slot-scope="scope">
                    {{ scope.row.authorPayTime }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注" width="300">
                <template slot-scope="scope">
                    <div class="text-left">
                    {{ scope.row.remark}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" :resizable="false" fixed="right">
                <template slot-scope="scope">
                    <span class="operate">
                        <router-link class="el-button--text" :to="{ path: '../../signFeePaymentDetaile/'+listQuery.query.createMonth+'/'+scope.row.company+'/'+scope.row.realName+'/'+ scope.row.id}" target="_blank">查看明细</router-link></span>
                </template>
            </el-table-column>
        </el-table>
        <pagination :listQuery="listQuery" :total="totalItems" :listLoading="listLoading"
                    @getList="fetchAuthorCashItems"></pagination>
    </div>
</template>

<script type="text/ecmascript-6">
  import { fetchAuthorCashItems, fetchAuthorCashStatisticsSum,fetchAuthorCashMonthSum} from '@/api/finance' //稿费支付记录接口query
  import waves from '@/directive/waves.js' // 水波纹指令
  import { parseTime, objectMerge, compareSimpleObject,getCompany } from '@/utils'
  import tableMixin from '@/mixins/tableHeight'
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return {
        OrgsList: [],
        listQuery: {
          query: {
            createMonth:  this.$route.params.month.toString() || "",
            company:parseInt(this.$route.params.company) || null,
          },
          sort: {
            orderByField: "id",
            orderDirect: "desc"
          },
          page: {
            pageNo: 1,
            pageSize: this.appConfig.DEFAULT_PAGE_SIZE
          }
        },
        listData: [],
        totalItems: 0,
        monthSummary:[],
        summary:{},
        listRoleLoading: true,
        emptyText: this.appConfig.EMPTY_TEXT,//无数据提示
        init: true,
        listLoading: true,
        titleAction: null
      }
    },
    mixins: [tableMixin],
    computed:{
      ...mapGetters([
        'cpInfo',
        'dicList',
        'auditCompanyDetail'
      ]),
      companyList() {
        return this.auditCompanyDetail || []
      },
      title:function () {
        let dateStr = this.$route.params.month;
        return parseTime(new Date(dateStr.substr(0,4),parseInt(dateStr.substr(4,2))-1),'{yyyy}年{mm}月');
      }
    },
    methods: {
      fetchAuthorCashItems() {
        this.listLoading = true;
        this.$_axios.all([fetchAuthorCashItems(this.listQuery),fetchAuthorCashStatisticsSum(this.listQuery),fetchAuthorCashMonthSum(this.listQuery)]).then(
          this.$_axios.spread((response,responseSummary,responseMonthSummary)=>{
            this.listData = response.data.items;
            this.summary = responseSummary.data.items || {sumMoney:0,sumTaxMoney:0,sumPayMoney:0};
            this.monthSummary = responseMonthSummary.data.items || []
            if (response.data.paginate == null) {
              this.totalItems = 0
            } else {
              this.totalItems = response.data.paginate.totalItemsCount
            }
            if (this.init) {
              this.init = false
            } else {
              this.emptyText = this.appConfig.SEARCHEMPTY_TEXT;
            }
            this.listLoading = false
            let dateStr = this.listQuery.query.createMonth;
            this.titleAction = parseTime(new Date(dateStr.substr(0,4),parseInt(dateStr.substr(4,2))-1),'{yyyy}年{mm}月');
          }));
      },
      //查询
      handleFilter() {
        this.listQuery.page.pageNo = 1
        this.fetchAuthorCashItems()
      }
    },
    created: function () {
      this.$store.dispatch('getAuditCompanyDetail').then((data)=>{
        this.fetchAuthorCashItems()
      })
    }
  }
</script>
<style scoped>
    .add-Orgs-button {
        float: right;
    }

    .pagenation {
        margin-top: 10px;
    }
    .firstLi{
        padding-left: 0px!important;
    }
</style>
