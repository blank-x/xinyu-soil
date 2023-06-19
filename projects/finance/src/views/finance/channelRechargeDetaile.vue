<template>
  <div class="app-container">
    <el-tabs v-model="activeName"  style="margin-bottom: -10px;"  @tab-click="handleClick">
      <el-tab-pane  name="first">
         <span slot="label">
          <b>实时收入</b>
          <!--<el-tooltip content="实时收入为部分数据因外在因素发生变更的数据" placement="bottom" effect="light">
             <i class="el-icon-zoom-out"></i>
            </el-tooltip>-->
          </span>
        <div class="filter-container" style="padding-top: 0px;">
          <el-form :inline="true" :model="listQuery" ref="listQuery" @submit.native.prevent>
            <el-row :gutter="6">
              <el-col :span="12">
                <el-form-item label="充值渠道 :"  style="margin-right: 12px">
                  <el-select v-model="listQuery.query.channelId" filterable clearable>
                    <el-option
                            v-for="item in channeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item  class="search-btn-padding" style="position: relative">
                  <search @search="handleFilter" :listLoading="listLoading1"></search>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="summary">
              <label>充值合计:<span v-if="summary && !listLoading1">{{summary.moneyText}}</span><i v-else class="el-icon-loading"></i></label>
              <label class="line"></label>
              <label>实收合计:<span v-if="summary && !listLoading1">{{summary.realMoneyText}}</span><i v-else class="el-icon-loading"></i></label>
            </div>
          </el-form>
        </div>
        <el-table ref="listTable" :data="actualTimeList" :max-height="tableHeight" :empty-text="emptyText" v-loading="listLoading1"
                  element-loading-text="加载中.." border fit stripe :header-cell-style="this.appConfig.HEADER_STYLE"
                  highlight-current-row>
          <!--  <el-table-column align="center" label="序号" type="index" width="50">-->
          <!--</el-table-column>-->
          <el-table-column align="center" label="渠道ID" width="200">
            <template slot-scope="scope">
              {{ scope.row.channelId }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="渠道名称" width="200">
            <template slot-scope="scope">
              {{scope.row.channelName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="兑换比例" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.ratio }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="充值金额" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.moneyText }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="实收金额" min-width="150">
            <template slot-scope="scope">
              <span class="operate">{{scope.row.realMoneyText }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane  name="second">
           <span slot="label">
            <b>固化收入</b>
             <!-- <el-tooltip content="固化收入为当月当时的统计结果" placement="bottom" effect="light">
               <i class="el-icon-zoom-out"></i>
              </el-tooltip>-->
           </span>
        <div class="filter-container" style="padding-top: 0px;">
          <el-form :inline="true" :model="listQuery2" ref="listQuery2" @submit.native.prevent>
            <el-row :gutter="6">
              <el-col :span="12">
                <el-form-item label="充值渠道 :"  style="margin-right: 12px">
                  <el-select v-model="listQuery2.query.channelId" filterable clearable> <!---->
                    <el-option
                            v-for="item in channeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item  class="search-btn-padding" style="position: relative">
                  <search @search="handleFilter" :listLoading="listLoading2"></search>
                  <el-button :style="appConfig.btnStyle120"  v-has="permission.fixed_time_item_export"  @click="exportFixedTimeFile()"   plain size="small" icon="el-icon-printer" v-waves>
                    导出数据
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="summary">
              <label>充值合计:<span v-if="fiexdTimeSummary && !listLoading2">{{fiexdTimeSummary.moneyText}}</span><i v-else class="el-icon-loading"></i></label>
              <label class="line"></label>
              <label>实收合计:<span v-if="fiexdTimeSummary && !listLoading2">{{fiexdTimeSummary.realMoneyText}}</span><i v-else class="el-icon-loading"></i></label>
            </div>
          </el-form>
        </div>
        <el-table :data="fixedTimeList" :max-height="tableHeight" :empty-text="emptyText" v-loading="listLoading2"
                  element-loading-text="加载中.." border fit stripe :header-cell-style="this.appConfig.HEADER_STYLE"
                  highlight-current-row>
          <el-table-column align="center" label="渠道ID" width="200">
            <template slot-scope="scope">
              {{ scope.row.channelId }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="渠道名称" width="200">
            <template slot-scope="scope">
              {{scope.row.channelName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="兑换比例" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.ratio }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="充值金额" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.moneyText }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="实收金额" min-width="150">
            <template slot-scope="scope">
              <span class="operate">{{scope.row.realMoneyText }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/ecmascript-6">
  import { fetchActualTimeItemList,fetchFixedTimeItemList,permission} from '@/api/finance' //稿费支付记录接口
  import waves from '@/directive/waves.js' // 水波纹指令
  import {exportFile,getChannelTopupList} from '@/api/common' //作品库接口
  import {getCompany,accAdd} from '@/utils'
  import tableMixin from '@/mixins/tableHeight'
  import { mapGetters } from 'vuex'
  export default {
    directives: {
      waves
    },
    data() {
      return {
        activeName: this.$route.params.type,
        pageSize: 10,
        currentPage: 1,
        listQuery: {
          query: {
            beginDate:this.$route.params.month.replace(/-/g,  ''),
            endDate:this.$route.params.month.replace(/-/g,  ''),
            channelId:''
          },
          sort: {
            orderByField: "id",
            orderDirect: "desc"
          }
        },
        listQuery2:{
          query: {
            beginDate:this.$route.params.month.replace(/-/g,  ''),
            endDate:this.$route.params.month.replace(/-/g,  ''),
            channelId:''
          },
          sort: {
            orderByField: "id",
            orderDirect: "desc"
          }
        },
        actualTimeList:[],
        fixedTimeList:[],
        channeList:[{name:'全部', id:''}],
        totalItems: 0,
        fiexdTimeTotalItems: 0,
        emptyText: this.appConfig.EMPTY_TEXT,//无数据提示
        init: true,
        listLoading1: true,
        listLoading2: true,
        permission:permission
      }
    },
    mixins: [tableMixin],
    computed:{
      summary:function () {
        let money = 0,realMoney=0;
        if(this.actualTimeList && this.actualTimeList.length ){
          for(let item of this.actualTimeList){
            money = accAdd(money, item.money)
            realMoney = accAdd(realMoney, item.realMoney)
          }
        }
        return {moneyText:(money/100).toFixed(2),realMoneyText:(realMoney/100).toFixed(2)}
      },
      fiexdTimeSummary:function () {
        let money = 0,realMoney=0;
        if(this.fixedTimeList &&  this.fixedTimeList.length){
        for(let item of this.fixedTimeList){
            money = accAdd(money, item.money)
            realMoney = accAdd(realMoney, item.realMoney)
          }
        }
        return {moneyText:(money/100).toFixed(2),realMoneyText:(realMoney/100).toFixed(2)}
      }
    },
    methods: {
      //多条件分页查询实时收入明细
      fetchList() {
        this.listLoading1 = true;
        fetchActualTimeItemList(this.listQuery).then((response)=>{
            this.actualTimeList = response.data.items ;
            if (this.init) {
              this.init = false
            } else {
              this.emptyText = this.appConfig.SEARCHEMPTY_TEXT;
            }
            this.listLoading1 = false
          });
      },
      fetchFiexdTimeList() {
        this.listLoading2 = true;
         fetchFixedTimeItemList(this.listQuery2).then((response)=>{
            this.fixedTimeList = response.data.items;
            if (this.init) {
              this.init = false
            } else {
              this.emptyText = this.appConfig.SEARCHEMPTY_TEXT;
            }
            this.listLoading2 = false
          });
      },
      //查询
      handleFilter() {
        switch (this.activeName){
          case 'first':
            this.fetchList();
            break;
          case 'second':
            this.fetchFiexdTimeList();
        }
      },
      //导出实时充值汇总记录
      exportFile(){
        exportFile('/channel_topup/actual_time/items/export', {
          query: this.listQuery.query,
          sort: this.listQuery.sort
        }, '实时充值明细记录', 'post');
      },
      //导出固化充值明细汇总记录
      exportFixedTimeFile(){
        exportFile('/channel_topup/fixed_time/items/export', {
          query: this.listQuery2.query,
          sort: this.listQuery2.sort
        }, '固化充值明细记录', 'post');
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
      //获取充值通道列表
      getChannelTopupList().then((res)=>{
        if(res.data.items){
          for(let key in res.data.items){
            this.channeList.push({
                name:res.data.items[key].name,
                id:res.data.items[key].id
            })
          }
        }
      })
      switch (this.$route.params.type){
        case 'first':
          this.fetchList();
        case 'second':
          this.fetchFiexdTimeList();
      }
    }
  }
</script>
