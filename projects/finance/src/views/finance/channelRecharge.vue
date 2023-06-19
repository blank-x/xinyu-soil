<template>
  <div class="app-container">
    <el-tabs v-model="activeName"  style="margin-bottom: -10px;"  @tab-click="handleClick">
      <el-tab-pane  name="first">
         <span slot="label">
          <b>实时收入</b>
           <!-- <el-tooltip content="实时收入为部分数据因外在因素发生变更的数据" placement="bottom" effect="light">
             <i class="el-icon-zoom-out"></i>
            </el-tooltip>-->
          </span>
        <div class="filter-container" style="padding-top: 0px;">
        <el-form :inline="true" :model="listQuery" ref="listQuery" @submit.native.prevent>
          <el-row :gutter="6">
            <el-col :span="12">
              <el-form-item label="选择月份 :"  style="margin-right: 12px">
                <el-col :span="11" >
                  <el-date-picker :editable="false"  :clearable="false"   type="month"placeholder="开始月份"  :picker-options="beginDateOptions" v-model="listQuery.query.beginDate" value-format="yyyyMM"></el-date-picker>
                </el-col>
                <el-col class="text-center" :span="2">-</el-col>
                <el-col :span="11" prop="query.endDate">
                  <el-date-picker :editable="false" :clearable="false"  type="month" placeholder="结束月份"  :picker-options="endDateOptions" v-model="listQuery.query.endDate" value-format="yyyyMM"></el-date-picker>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item  class="search-btn-padding" style="position: relative">
                <search @search="handleFilter" :listLoading="listLoading"></search>
                <el-button :style="appConfig.btnStyle120" v-has="permission.actual_time_export"  @click="exportFile()"   plain size="small" icon="el-icon-printer" v-waves>
                  导出数据
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="summary">
            <label>充值合计:<span v-if="summary && !listLoading">{{summary.moneyText}}</span><i v-else class="el-icon-loading"></i></label>
            <label class="line"></label>
            <label>实收合计:<span v-if="summary && !listLoading">{{summary.realMoneyText}}</span><i v-else class="el-icon-loading"></i></label>
          </div>
        </el-form>
      </div>
        <el-table :data="actualTimeList" :max-height="tableHeight" :empty-text="emptyText" v-loading="listLoading"
                  element-loading-text="加载中.." border fit stripe :header-cell-style="this.appConfig.HEADER_STYLE"
                  highlight-current-row>
          <!--  <el-table-column align="center" label="序号" type="index" width="50">-->
          <!--</el-table-column>-->
          <el-table-column align="center" label="月份" width="200">
            <template slot-scope="scope">
              {{ scope.row.payTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="充值金额" width="200">
            <template slot-scope="scope">
              {{scope.row.moneyText }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="实收金额" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.realMoneyText }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200" :resizable="false">
            <template slot-scope="scope">
              <span class="operate"><router-link class="el-button--text" target="_blank" :to="{ path: 'channelRechargeDetaile/'+scope.row.payTime+'/'+activeName}">查看明细</router-link></span>
            </template>
          </el-table-column>
        </el-table>
        <pagination :listQuery="listQuery" :total="totalItems" :listLoading="listLoading"
                    @getList="fetchList"></pagination>
      </el-tab-pane>
      <el-tab-pane  name="second">
           <span slot="label">
            <b>固化收入</b>
            <!--  <el-tooltip content="固化收入为当月当时的统计结果" placement="bottom" effect="light">
               <i class="el-icon-zoom-out"></i>
              </el-tooltip>-->
           </span>
        <div class="filter-container" style="padding-top: 0px;">
          <el-form :inline="true" :model="listQuery2" ref="listQuery2" @submit.native.prevent>
            <el-row :gutter="6">
              <el-col :span="12">
                <el-form-item label="选择月份 :"  style="margin-right: 12px">
                  <el-col :span="11" >
                    <el-date-picker :editable="false" :clearable="false"   type="month"placeholder="开始月份"  :picker-options="beginDateOptions2" v-model="listQuery2.query.beginDate" value-format="yyyyMM"></el-date-picker>
                  </el-col>
                  <el-col class="text-center" :span="2">-</el-col>
                  <el-col :span="11" prop="query.endDate">
                    <el-date-picker :editable="false" :clearable="false"  type="month" placeholder="结束月份"  :picker-options="endDateOptions2" v-model="listQuery2.query.endDate" value-format="yyyyMM"></el-date-picker>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item  class="search-btn-padding" style="position: relative">
                  <search @search="handleFilter" :listLoading="listLoading"></search>
                  <el-button :style="appConfig.btnStyle120"  v-has="permission.fixed_time_export"  @click="exportFixedTimeFile()"   plain size="small" icon="el-icon-printer" v-waves>
                    导出数据
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="summary">
              <label>充值合计:<span v-if="fiexdTimeSummary && !listLoading">{{fiexdTimeSummary.moneyText}}</span><i v-else class="el-icon-loading"></i></label>
              <label class="line"></label>
              <label>实收合计:<span v-if="fiexdTimeSummary && !listLoading">{{fiexdTimeSummary.realMoneyText}}</span><i v-else class="el-icon-loading"></i></label>
            </div>
          </el-form>
        </div>
        <el-table :data="fixedTimeList" :max-height="tableHeight" :empty-text="emptyText" v-loading="listLoading"
                  element-loading-text="加载中.." border fit stripe :header-cell-style="this.appConfig.HEADER_STYLE"
                  highlight-current-row>
          <!--  <el-table-column align="center" label="序号" type="index" width="50">-->
          <!--</el-table-column>-->
          <el-table-column align="center" label="月份" width="200">
            <template slot-scope="scope">
              {{ scope.row.payTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="充值金额" width="200">
            <template slot-scope="scope">
              {{scope.row.moneyText }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="实收金额" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.realMoneyText }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200" :resizable="false">
            <template slot-scope="scope">
              <span class="operate"><router-link class="el-button--text" target="_blank" :to="{ path: 'channelRechargeDetaile/'+scope.row.payTime+'/'+activeName}">查看明细</router-link></span>
            </template>
          </el-table-column>
        </el-table>
        <pagination :listQuery="listQuery" :total="totalItems" :listLoading="listLoading"
                    @getList="fetchList"></pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/ecmascript-6">
  import { fetchActualTimeList,fetchActualTimeSum,fetchFixedTimeList,fetchFixedTimeSum,permission} from '@/api/finance' //稿费支付记录接口
  import waves from '@/directive/waves.js' // 水波纹指令
  import {exportFile} from '@/api/common' //作品库接口
  import { parseTime, objectMerge, compareSimpleObject,getFirstMonth,getLastMonthYestdy,get3MonthBefor} from '@/utils'
  import tableMixin from '@/mixins/tableHeight'
  export default {
    directives: {
      waves
    },
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
          },
        },
        endDateOptions2: {
          disabledDate: (time) => {
            const beginDateVal = this.listQuery2.query.beginDate?this.listQuery2.query.beginDate.substr(0,4)+"-"+this.listQuery2.query.beginDate.substr(4,2)+"-01":"";
            if (beginDateVal) {
              return time.getTime() < (Date.parse(new Date(beginDateVal)))
            }
          }
        },
        beginDateOptions2: {
          disabledDate: (time) => {
            const endTimeVal = this.listQuery2.query.endDate?this.listQuery2.query.endDate.substr(0,4)+"-"+this.listQuery2.query.endDate.substr(4,2)+"-01":"";
            if (endTimeVal) {
              return time.getTime() > Date.parse(new Date(endTimeVal))
            }
          },
        },
        activeName: 'first',
        pageSize: 10,
        currentPage: 1,
        listQuery: {
          query: {
            beginDate:get3MonthBefor(),
            endDate:getLastMonthYestdy(),
            id:"",
          },
          sort: {
            orderByField: "payTime",
            orderDirect: "asc"
          },
          page: {
            pageNo: 1,
            pageSize: this.appConfig.DEFAULT_PAGE_SIZE
          }
        },
        listQuery2:{
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
        actualTimeList:[],
        fixedTimeList:[],
        summary:{},
        fiexdTimeSummary:{},
        totalItems: 0,
        fiexdTimeTotalItems: 0,
        emptyText: this.appConfig.EMPTY_TEXT,//无数据提示
        init: true,
        listLoading: true,
        permission:permission,
      }
    },
    mixins: [tableMixin],

    methods: {
      //多条件分页查询实时收入明细
      fetchList() {
        this.listLoading = true;
        this.$_axios.all([fetchActualTimeList(this.listQuery),fetchActualTimeSum(this.listQuery)]).then(
          this.$_axios.spread((response,responseSummary)=>{
            this.actualTimeList = response.data.items;
            this.summary = responseSummary.data.items ? responseSummary.data.items : {moneyText:0,realMoneyText:0};
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
      fetchFiexdTimeList() {
        this.listLoading = true;
        this.$_axios.all([fetchFixedTimeList(this.listQuery2),fetchFixedTimeSum(this.listQuery2)]).then(
          this.$_axios.spread((response,responseSummary)=>{
            this.fixedTimeList = response.data.items;
            this.fiexdTimeSummary = responseSummary.data.items? responseSummary.data.items: {moneyText:0,realMoneyText:0};
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
      //按鈕查询
      handleFilter() {
        switch (this.activeName){
          case 'first':
            this.listQuery.page.pageNo = 1;
            this.fetchList();
            break;
          case 'second':
            this.listQuery2.page.pageNo = 1;
            this.fetchFiexdTimeList();
        }
      },
      //导出实时充值汇总记录
      exportFile(){
        exportFile('/channel_topup/actual_time/statistics/export', {
          query: this.listQuery.query,
          sort: this.listQuery.sort
        }, '实时充值汇总记录', 'post');
      },
      //导出固化充值汇总记录
      exportFixedTimeFile(){
        exportFile('/channel_topup/fixed_time/statistics/export', {
          query: this.listQuery2.query,
          sort: this.listQuery2.sort
        }, '固化充值汇总记录', 'post');
      },
      handleClick(tab,event){
        switch (tab.paneName){
          case 'first':
              this.fetchList();
              break;
          case 'second':
            this.fetchFiexdTimeList();
        }
      }
    },
    created: function () {
      this.fetchList();
      console.log(get3MonthBefor());
    }
  }
</script>
