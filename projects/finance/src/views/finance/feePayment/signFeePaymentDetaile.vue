<template>
    <div class="app-container">
        <contentTitle :titleParams="{title: title+'稿费支付明细 '}"></contentTitle>
        <div class="filter-container">
            <el-form :inline="true" :model="listQuery" ref="listQuery" @submit.native.prevent>
                <el-row :gutter="6">
                    <el-col :span="5">
                        <el-form-item label="所属公司 :" prop="query.company" style="margin-right: 12px">
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
                    <el-col :span="5">
                        <el-form-item label="支付月份 :" prop="query.createMonth" style="margin-right: 12px">
                            <el-col :span="18">
                                <el-date-picker  :clearable="false" :editable="false" @change="handleFilter()" type="month"placeholder="选择开始月份" v-model="listQuery.query.createMonth" value-format="yyyyMM"></el-date-picker>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="签署人 :" prop="query.realName">
                              <el-input type="text"  v-model.trim="listQuery.query.realName" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="作者ID :" prop="query.authorId">
                            <el-input type="text" :maxlength="10" placeholder="作者ID"  v-model="listQuery.query.authorId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item class="search-btn-padding">
                            <search @search="handleFilter" :listLoading="listLoading"></search>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-table  v-show="!defaultAuthorId"   :data="listData" :span-method="objectSpanMethod"  :empty-text="emptyText" v-loading="listLoading"
                  element-loading-text="加载中.." border :header-cell-style="this.appConfig.HEADER_STYLE"
                  highlight-current-row >
            <el-table-column align="center" label="作者ID" width="125">
                <template slot-scope="scope">
                    <notEnabled :row="scope.row"></notEnabled>
                </template>
            </el-table-column>
            <el-table-column align="center" label="作者笔名">
                <template slot-scope="scope">
                    <a target="_blank" :href="scope.row.authorId | createPeopleLink"  class="hoverLink">{{scope.row.penName}}</a>
                </template>
            </el-table-column>
            <el-table-column align="center" label="作品ID" width="100" prop="bookId">
                <template slot-scope="scope">
                    <a target="_blank" :href="scope.row.bookId | createToBooKUrl"
                       class="hoverLink">{{scope.row.bookId}}
                    </a>
                </template>
            </el-table-column>

            <el-table-column align="center" label="作品名称" min-width="125" prop="bookName">
                <template slot-scope="scope">
                    <a target="_blank" :href="scope.row.bookId | createBookLink"
                       class="hoverLink">{{scope.row.bookName}}</a>
                </template>
            </el-table-column>
            <el-table-column align="center" label="作品稿费" prop="createTime">
                <template slot-scope="scope">
                    <span>{{ (scope.row.bookMoneysum/100)  | KeepTwoNum }}</span>
                </template>
            </el-table-column>
            <el-table-column  align="center" label="稿费类型">
                <template slot-scope="scope">
                    <openPayDetail :detailData="{
                        type:scope.row.payLogtype,
                        typeDesc:scope.row.payLogtypeText,
                        bookId:scope.row.bookId,
                        bookName:scope.row.bookName,
                        dealMonth:listQuery.query.createMonth
                    }"></openPayDetail>
                </template>
            </el-table-column>
            <el-table-column  align="center" label="稿费">
                <template slot-scope="scope">
                    {{scope.row.moneyText}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注" width="300">
                <template slot-scope="scope">
                    {{ scope.row.remark || '------'}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="结算状态">
                <template slot-scope="scope">
                    {{ scope.row.payStatusText }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="结算时间" width="160">
                <template slot-scope="scope">
                    {{ scope.row.authorPayTime || '------'}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="结算方式" :resizable="false" width="100">
                <template slot-scope="scope">
                    <span class="operate">{{ scope.row.typeText }}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-table v-show="defaultAuthorId" :data="listData" :empty-text="emptyText" v-loading="listLoading"
                  element-loading-text="加载中.." border :header-cell-style="this.appConfig.HEADER_STYLE"
                  highlight-current-row :span-method="objectSpanMethod2" >
            <el-table-column align="center" label="作品ID" width="100" prop="bookId">
                <template slot-scope="scope">
                    <a target="_blank" :href="scope.row.bookId | createToBooKUrl"
                       class="hoverLink">{{scope.row.bookId}}
                    </a>
                </template>
            </el-table-column>

            <el-table-column align="center" label="作品名称" min-width="125" prop="bookName">
                <template slot-scope="scope">
                    <a target="_blank" :href="scope.row.bookId | createBookLink"
                       class="hoverLink">{{scope.row.bookName}}</a>
                </template>
            </el-table-column>
            <el-table-column align="center" label="作品稿费" >
                <template slot-scope="scope">
                    <span>{{ (scope.row.bookMoneysum/100) | KeepTwoNum }}</span>
                </template>
            </el-table-column>
            <el-table-column  align="center" label="稿费类型">
                <template slot-scope="scope">
                    <openPayDetail :detailData="{
                        type:scope.row.payLogtype,
                        typeDesc:scope.row.payLogtypeText,
                        bookId:scope.row.bookId,
                        bookName:scope.row.bookName,
                        dealMonth:listQuery.query.dealMonth
                    }"></openPayDetail>
                </template>
            </el-table-column>
            <el-table-column  align="center" label="稿费">
                <template slot-scope="scope">
                    {{scope.row.moneyText}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注" width="300">
                <template slot-scope="scope">
                    {{ scope.row.remark || "------"}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="结算状态">
                <template slot-scope="scope">
                    {{ scope.row.payStatusText }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="结算时间" width="160">
                <template slot-scope="scope">
                    {{ scope.row.authorPayTime }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="结算方式" :resizable="false" width="100">
                <template slot-scope="scope">
                    <span class="operate">{{ scope.row.typeText }}</span>
                </template>
            </el-table-column>
        </el-table>
        <sticky :stickyTop="1000" :className="'sticky'"  v-if="listData.length > 0 && (defaultAuthorId || defaultRealName)">
        <div class="summaryBox">
           <div class="tabSummary">
               <ul>
                   <li v-for="item in monthSummary">{{item.itemTypeText}}：{{item.moneyText}}</li>
               </ul>
           </div>
           <div class="summary" style="border: 0px">
               <label>稿费合计:<span>{{summary.sumMoneyText  || '0.00'}}</span></label>
               <label class="line" v-if="!defaultAuthorId"></label>
               <label v-if="!defaultAuthorId">税金合计:<span>{{summary.sumTaxMoneyText || '0.00' }}</span></label>
               <label v-if="!defaultAuthorId"  class="line"></label>
               <label v-if="!defaultAuthorId">实付合计:<span>{{summary.sumPayMoneyText || '0.00' }}</span></label>
           </div>
        </div>
        </sticky>
    </div>
</template>

<script type="text/ecmascript-6">
  import { fetchAuthorCashMonthList,fetchAuthorCashMonthSum,fetchAuthorCashStatisticsSum} from '@/api/finance' //财务接口
  import waves from '@/directive/waves.js' // 水波纹指令
  import { parseTime, objectMerge, compareSimpleObject,getCompany,convertMergeDataTree} from '@/utils'
  import tableMixin from '@/mixins/tableHeight'
  import Sticky from '@/components/Sticky'
  import { mapGetters } from 'vuex'
  import openPayDetail from '@/views/remuneration/component/openPayDetail'
  export default {
    data() {
      return {
        OrgsList: [],
        pageSize: 10,
        currentPage: 1,
        defaultCreateMonth:this.$route.params.createMonth,
        defaultAuthorId:null,
        defaultRealName:this.$route.params.realName,
        listQuery: {
          query: {
            createMonth: this.$route.params.createMonth || null,
            company:parseInt(this.$route.params.company) || null,
            realName:this.$route.params.realName || null,
            authorCashId:this.$route.params.id || null
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
        summary:{},
        monthSummary:{},
        totalItems: 0,
        emptyText: this.appConfig.EMPTY_TEXT,//无数据提示
        init: true,
        listLoading: true,
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
        //this.listQuery.query.company =this.auditCompanyDetail[0] && this.auditCompanyDetail[0].value
        return this.auditCompanyDetail || []
      },
      title:function () {
        let realName =  this.defaultRealName;
        let dateStr = this.listQuery.query.createMonth;
        return   realName+ parseTime(new Date(dateStr.substr(0,4),parseInt(dateStr.substr(4,2))-1),'{yyyy}年{mm}月');
      }
    },
    components: { Sticky,openPayDetail },
    methods: {
      //合并单元格
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex < 2 ||  columnIndex > 7) {
          if (row.authorIdspan > 1) {
            return {
              rowspan: row.authorIdspan,
              colspan: 1
            };
          }
          if (row.authorIddis) {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
        if (columnIndex > 1 && columnIndex < 5 ) {
          if (row.payLogtypespan > 1) {
            return {
              rowspan: row.payLogtypespan,
              colspan: 1
            };
          }
          if (row.payLogtypedis) {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      //作者查詢合并单元格
      objectSpanMethod2({row, column, rowIndex, columnIndex}) {
        if (columnIndex > 5) {
          if (row.authorIdspan > 1) {
            return {
              rowspan: row.authorIdspan,
              colspan: 1
            };
          }
          if (row.authorIddis) {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
        if (columnIndex < 3 ) {
          if (row.payLogtypespan > 1) {
            return {
              rowspan: row.payLogtypespan,
              colspan: 1
            };
          }
          if (row.payLogtypedis) {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      //多条件稿费支付明细
      fetchAuthorCashList() {
        this.listLoading = true;
        this.listQuery.query.realName = this.listQuery.query.realName==""?null:this.listQuery.query.realName;
        this.$_axios.all([fetchAuthorCashMonthList(this.listQuery),fetchAuthorCashMonthSum(this.listQuery),fetchAuthorCashStatisticsSum(this.listQuery)]).then(
          this.$_axios.spread((response, responseMonthSummary,responseSummary)=>{
            this.defaultAuthorId = this.listQuery.query.authorId;
            this.defaultRealName = this.listQuery.query.realName ? '签署人'+this.listQuery.query.realName:"";
            this.listData = response.data.items?convertMergeDataTree(response.data.items, 'payLogtype', 'bookId','authorId',{isSum:true,key:'bookId',sumKey:'money'}):[];
            this.summary = responseSummary.data.items || {sumMoney:0,sumTaxMoney:0,sumPayMoney:0};
            this.monthSummary = responseMonthSummary.data.items;
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
          }));
      },
      //查询
      handleFilter() {
        this.listQuery.page.pageNo = 1;
        this.listQuery.query.authorCashId = null;
        this.fetchAuthorCashList()
      }
    },

    created: function () {
      this.$store.dispatch('getAuditCompanyDetail').then((data)=>{
        this.fetchAuthorCashList()
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.fetchAuthorCashList()
    },
    watch: {
      'listQuery.query.authorId': {
        handler: function (val, oldVal) {
          if (val === null || val === undefined) return
          let val1 = val.replace(/[^0-9]/g, '')
          this.$nextTick(() => {
            this.listQuery.query.authorId = val1
          })
        }
      }
    },
    filters:{
      KeepTwoNum:function(value){
        return Number(value).toFixed(2)
      }
    }
  }
</script>

