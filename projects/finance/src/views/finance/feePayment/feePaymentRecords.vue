<template>
    <div class="app-container">
        <contentTitle :titleParams="{title:'稿费支付记录'}"></contentTitle>
        <div class="filter-container">
            <el-form :inline="true" :model="listQuery" ref="listQuery" @submit.native.prevent>
                <el-row :gutter="6">
                    <el-col :span="6">
                        <el-form-item label="所属公司 :" prop="query.compay" style="margin-right: 12px">
                            <el-select v-model="listQuery.query.company" :disabled="companyList.length == 1" :filterable="companyList.length > 1" :clearable="companyList.length > 1"> <!---->
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
                        <el-form-item label="支付月份 :"  style="margin-right: 12px">
                            <el-col :span="11" >
                                <el-date-picker :editable="false" :clearable="false" type="month"placeholder="选择开始月份"  :picker-options="beginDateOptions" v-model="listQuery.query.beginDate" value-format="yyyyMM"></el-date-picker>
                            </el-col>
                            <el-col class="text-center" :span="2">-</el-col>
                            <el-col :span="11" prop="query.endDate">
                                <el-date-picker :editable="false" :clearable="false"  type="month" placeholder="选择结束月份"  :picker-options="endDateOptions" v-model="listQuery.query.endDate" value-format="yyyyMM"></el-date-picker>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item class="search-btn-padding">
                            <search @search="handleFilter" :listLoading="listLoading"></search>
                            <reset  @reset="resetForm('listQuery')"></reset>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="summary">
                    <label>稿费总合计:<span>{{summary.sumMoneyText || '0.00' }}</span></label>
                    <label class="line"></label>
                    <label>税金总合计:<span>{{summary.sumTaxMoneyText || '0.00'}}</span></label>
                    <label class="line"></label>
                    <label>实付总合计:<span>{{summary.sumPayMoneyText || '0.00'}}</span></label>
                </div>
            </el-form>
        </div>
        <el-table :data="listData" :max-height="tableHeight" :empty-text="emptyText" v-loading="listLoading"
                  element-loading-text="加载中.." border fit stripe :header-cell-style="this.appConfig.HEADER_STYLE"
                  highlight-current-row>
            <!--  <el-table-column align="center" label="序号" type="index" width="50">-->
            <!--</el-table-column>-->
            <el-table-column align="center" label="支付月份" width="140">
                <template slot-scope="scope">
                    {{ scope.row.createMonth |  formatMonth}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="所属公司" min-width="140">
                <template slot-scope="scope">
                    {{ scope.row.companyText }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="稿费合计" min-width="160">
                <template slot-scope="scope">
                    {{scope.row.sumMoneyText}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="税金合计" min-width="160" prop="createTime">
                <template slot-scope="scope">
                    <span>{{scope.row.sumTaxMoneyText }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="160" align="center" label="实付合计">
               <template slot-scope="scope">
                   {{scope.row.sumPayMoneyText }}
               </template>
             </el-table-column>
            <el-table-column align="center" label="操作" width="200" :resizable="false">
                <template slot-scope="scope">
                    <span class="operate"><router-link class="el-button--text" :to="{ path: 'monthFeePaymentDetaile/'+scope.row.createMonth+'/'+scope.row.company}">查看明细</router-link></span>
                </template>
            </el-table-column>
        </el-table>
        <pagination :listQuery="listQuery" :total="totalItems" :listLoading="listLoading"
                    @getList="fetchAuthorCashList"></pagination>
    </div>
</template>
<script type="text/ecmascript-6">
  import { fetchAuthorCashStatistics, fetchAuthorCashStatisticsSum} from '@/api/finance' //稿费支付记录接口
  import waves from '@/directive/waves.js' // 水波纹指令
  import { parseTime, objectMerge, compareSimpleObject,getCompany,get3MonthBefor,getLastMonthYestdy} from '@/utils'
  import tableMixin from '@/mixins/tableHeight'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        endDateOptions: {
          disabledDate: (time) => {
            const beginDateVal = this.listQuery.query.beginDate?this.listQuery.query.beginDate.substr(0,4)+"-"+this.listQuery.query.beginDate.substr(4,2)+"-01":"";
            if (beginDateVal) {
              return time.getTime() < (Date.parse(new Date(beginDateVal)))
            }
          }
        },
        beginDateOptions: {
          disabledDate: (time) => {
            const endTimeVal = this.listQuery.query.endDate?this.listQuery.query.endDate.substr(0,4)+"-"+this.listQuery.query.endDate.substr(4,2)+"-01":"";
            if (endTimeVal) {
              return time.getTime() > (Date.parse(new Date(endTimeVal)))
            }
          }
        },
        activeName: 'first',
        pageSize: 10,
        currentPage: 1,
        listQuery: {
          query: {
            beginDate: get3MonthBefor(),
            endDate:getLastMonthYestdy(),
            company:null,
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
        //companyList:[{name:'全部',id:0},{name:'磨铁数盟',id:1},{name:'醉唐',id:2},{name:'秀闻',id:3},{name:'磨铁图书',id:4}],
        totalItems: 0,
        summary:{},
        listRoleLoading: true,
        emptyText: this.appConfig.EMPTY_TEXT,//无数据提示
        init: true,
        listLoading: true
      }
    },
    mixins: [tableMixin],
    computed:{
        ...mapGetters([
          'cpInfo',
          'dicList',
          'auditCompanyDetail'
        ]),
        companyList:function () {
            let temp = this.auditCompanyDetail ? this.auditCompanyDetail.slice():[];
            if(temp.length===1){
                this.listQuery.query.company = temp[0].value;
                return temp
            }else{
                temp.unshift({text:'全部',value:null})
            }
          return temp || []
        }
    },
    methods: {
      fetchAuthorCashList() {
        this.listLoading = true;
        this.$_axios.all([fetchAuthorCashStatistics(this.listQuery),fetchAuthorCashStatisticsSum(this.listQuery)]).then(
          this.$_axios.spread((response,responseSummary)=>{
          if(response && responseSummary){
            this.listData = response.data.items;
            this.summary = responseSummary.data.items || {sumMoney:0,sumTaxMoney:0,sumPayMoney:0};;
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
          }
          this.listLoading = false
        }));
      },
      //查询
      handleFilter() {
        this.listQuery.page.pageNo = 1
        this.fetchAuthorCashList()
      },
      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.listQuery.query.beginDate = get3MonthBefor();
        this.listQuery.query.endDate = getLastMonthYestdy();
        this.listQuery.query.company = null;
        this.fetchAuthorCashList()
      },
    },
    created: function () {
      this.$store.dispatch('getAuditCompanyDetail').then((data)=>{
        //this.listQuery.query.company = data[0].value;
        //this.defaultCompanyId = data[0].value;
        this.fetchAuthorCashList();
      })
    }
  }
</script>
