<template>
    <div class="app-container">
        <contentTitle :titleParams="{title:'打赏记录',download:true,permission:{export:permission.export}}" @downHandler="exportFile()"></contentTitle>
        <div class="filter-container">
            <el-form :inline="true" :model="listQuery" ref="listQuery" @submit.native.prevent>
                <el-row :gutter="6">
                    <el-col :span="14">
                        <el-form-item label="打赏日期 :"  style="margin-right: 12px" >
                            <el-col :span="11" >
                                <el-date-picker  type="month"placeholder="开始日期" :clearable="false"   :picker-options="beginDateOptions" v-model="listQuery.query.beginDate" value-format="yyyyMM"></el-date-picker>
                            </el-col>
                            <el-col class="text-center" :span="2">-</el-col>
                            <el-col :span="11" prop="query.endDate">
                                <el-date-picker type="month" placeholder="结束日期"  :clearable="false"   :picker-options="endDateOptions" v-model="listQuery.query.endDate" value-format="yyyyMM"></el-date-picker>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="4">
                        <el-form-item class="search-btn-padding">
                            <search @search="handleFilter" :listLoading="listLoading"></search>
                            <reset  @reset="resetForm('listQuery')"></reset>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="summary">
                    <label>打赏合计:<span v-if="summary && !listLoading">{{summary.totalmtbSum +'M'}}</span><i v-else class="el-icon-loading"></i></label>
                </div>
            </el-form>
        </div>
        <el-table :data="listData" :max-height="tableHeight" :empty-text="emptyText" v-loading="listLoading"
                  element-loading-text="加载中.." border fit stripe :header-cell-style="this.appConfig.HEADER_STYLE"
                  highlight-current-row>
            <!--  <el-table-column align="center" label="序号" type="index" width="50">-->
            <!--</el-table-column>-->
            <el-table-column align="center" label="月份" width="140">
                <template slot-scope="scope">
                    {{ scope.row.dealMonth | formatMonth}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="磨铁（M)">
                <template slot-scope="scope">
                    {{ scope.row.mtMtbSum || 0 }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="墨墨（M）">
                <template slot-scope="scope">
                    {{scope.row.mmMtbSum || 0}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="锦文（M）" >
                <template slot-scope="scope">
                    <span>{{scope.row.jwMtbSum  || 0}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="逸云（M）" >
                <template slot-scope="scope">
                    <span>{{scope.row.yyMtbSum || 0 }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="醉唐（M）" >
                <template slot-scope="scope">
                    <span>{{scope.row.ztMtbSum || 0}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="图书（M）" >
                <template slot-scope="scope">
                    <span>{{scope.row.tsMtbSum || 0}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="合计（M）">
                <template slot-scope="scope">
                    {{scope.row.monthTotalmtbSum || 0}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="200" :resizable="false">
                <template slot-scope="scope">
                    <span class="operate"><router-link class="el-button--text" :to="{ path: 'donatesMonthList/'+scope.row.dealMonth}">查看明细</router-link></span>
                </template>
            </el-table-column>
        </el-table>
        <pagination :listQuery="listQuery" :total="totalItems" :listLoading="listLoading"
                    @getList="fetchDataList"></pagination>
    </div>
</template>
<script type="text/ecmascript-6">
  import { fetchDonateslist,permission, fetchDonatesSum} from '@/api/finance' //稿费支付记录接口
  import waves from '@/directive/waves.js' // 水波纹指令
  import { parseTime, objectMerge, compareSimpleObject,get3MonthBefor,getLastMonthYestdy} from '@/utils'
  import tableMixin from '@/mixins/tableHeight'
  import {exportFile} from '@/api/common' //作品库接口
  export default {
    data() {
      return {
        permission: permission,
        endDateOptions: {
          disabledDate: (time) => {
            const beginDateVal = this.listQuery.query.beginDate?this.listQuery.query.beginDate.substr(0,4)+"-"+this.listQuery.query.beginDate.substr(4,2)+"-01":"";
            if (beginDateVal) {
              return time.getTime() < Date.parse(new Date(beginDateVal))
            }
          }
        },
        beginDateOptions: {
          disabledDate: (time) => {
            const endTimeVal = this.listQuery.query.endDate?this.listQuery.query.endDate.substr(0,4)+"-"+this.listQuery.query.endDate.substr(4,2)+"-01":"";
            if (endTimeVal) {
              return time.getTime() > Date.parse(new Date(endTimeVal))
            }
          }
        },
        listQuery: {
          query: {
            beginDate:get3MonthBefor(),
            endDate:getLastMonthYestdy(),
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
        summary:{},
        listRoleLoading: true,
        emptyText: this.appConfig.EMPTY_TEXT,//无数据提示
        init: true,
        listLoading: true
      }
    },
    mixins: [tableMixin],
    methods: {
      fetchDataList() {
        this.listLoading = true;
        this.$_axios.all([fetchDonateslist(this.listQuery),fetchDonatesSum(this.listQuery)]).then(
          this.$_axios.spread((response,responseSummary)=>{
            this.listData = response.data.items;
            this.summary = responseSummary.data.items.totalmtbSum ? responseSummary.data.items : {totalmtbSum:0};
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
        this.listQuery.page.pageNo = 1
        this.fetchDataList()
      },
      //重置
      resetForm(formName) {
        this.listQuery.query.beginDate = get3MonthBefor();
        this.listQuery.query.endDate = getLastMonthYestdy();
        this.$refs[formName].resetFields();
        this.fetchDataList()
      },
      //导出打赏记录
      exportFile(){
        exportFile('/donates/statistics/export', {
          query: this.listQuery.query,
          sort: this.listQuery.sort
        },  '打赏记录', 'post');
      }
    },
    created: function () {
      this.fetchDataList()
    }
  }
</script>
