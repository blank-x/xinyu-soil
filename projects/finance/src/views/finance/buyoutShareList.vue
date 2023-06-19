<template>
  <div class="app-container">
    <contentTitle :titleParams="{title:'买断分摊列表'}" ></contentTitle>
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" ref="listQuery" @submit.native.prevent>
        <el-form-item label="作品ID :" prop="query.realName" style="margin-right: 12px">
          <el-input placeholder="作品ID" size="small" :maxlength="10"  v-model.trim="listQuery.query.bookId"></el-input>
        </el-form-item>
        <el-form-item  >
          <search @search="handleFilter" :listLoading="listLoading"></search>
          <el-button :style="appConfig.btnStyle120" @click="exportFile()"  v-has="permission.payout_avg_logs_export"  plain size="small" icon="el-icon-printer" v-waves>
            导出数据
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="dataList" :max-height="tableHeight" :empty-text="emptyText" v-loading="listLoading" element-loading-text="加载中.." border fit stripe :header-cell-style="this.appConfig.HEADER_STYLE"
              highlight-current-row >
      <el-table-column align="center" label="作者ID">
        <template slot-scope="scope">
          <notEnabled :row="scope.row"></notEnabled>
        </template>
      </el-table-column>
      <el-table-column align="center" label="作者笔名"  width="95">
        <template slot-scope="scope">
          <a target="_blank" :href="scope.row.authorId | createPeopleLink"
             class="hoverLink">
            {{scope.row.penName }}
          </a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="签署人">
        <template slot-scope="scope">
          <span>{{scope.row.realName }}</span>
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
      <el-table-column align="center" label="买入价格"  >
        <template slot-scope="scope">
          <span>{{scope.row.bookMoneyText }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结算月份"  >
        <template slot-scope="scope">
          <span>{{scope.row.dealMonth | formatMonth }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="本月金额"  >
        <template slot-scope="scope">
          <span>{{scope.row.moneyText }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="授权起止期"  width="180">
      <template slot-scope="scope">
        <span>{{scope.row.authorizationDate }}</span>
      </template>
    </el-table-column>
      <el-table-column align="center" label="总需摊销期数"  width="110">
        <template slot-scope="scope">
          <span>{{scope.row.allAvgNum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="本月前已摊金额">
        <template slot-scope="scope">
          <span>{{scope.row.avgedMoneyText || "0.00"}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="累计摊销金额"  >
        <template slot-scope="scope">
          <span>{{scope.row.allAvgedMoneyText || "0.00"}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="未摊销金额"  >
        <template slot-scope="scope">
          <span class="operate">{{scope.row.avgingMoneyText || "0.00"}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作"  fixed="right">
        <template slot-scope="scope">
          <span class="operate"><router-link class="el-button--text" target="_blank" :to="{ path: 'buyoutShareItem/'+scope.row.bookId}">查看明细</router-link></span>
        </template>
      </el-table-column>
    </el-table>
    <pagination :listQuery="listQuery" :total="totalItems" :listLoading="listLoading" @getList="fetchList"></pagination>
  </div>
</template>

<script type="text/ecmascript-6">
  import { fetchPayOutAvgList,permission} from '@/api/finance'
  import { exportFile} from '@/api/common'
  import waves from '@/directive/waves.js' // 水波纹指令
  import {parseTime, objectMerge, compareSimpleObject} from '@/utils'
  import tableMixin from '@/mixins/tableHeight'
  export default {
    data() {
      return {
        dataList: [],
        listQuery: {
          query: {roleId:null},
          sort: {
            orderByField: "createTime",
            orderDirect: "desc"
          },
          page: {
            pageNo: 1,
            pageSize: this.appConfig.DEFAULT_PAGE_SIZE
          }
        },
        totalItems: 0,
        emptyText: this.appConfig.EMPTY_TEXT,//无数据提示
        init:true,
        listLoading:true,
        permission:permission,
      }
    },
    mixins:[tableMixin],
    directives: {
      waves
    },
    methods: {
      /**
       * 重置查询条件
       * @param formName
       */
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.fetchList()
      },
      //多条件分页查询组织信息
      fetchList() {
        this.listLoading = true;
        fetchPayOutAvgList(this.listQuery).then(response => {
          this.dataList = response.data.items;
          if (response.data.paginate == null) {
            this.totalItems = 0
          } else {
            this.totalItems = response.data.paginate.totalItemsCount
          }
          if(this.init){
            this.init = false
          }else{
            this.emptyText = this.appConfig.SEARCHEMPTY_TEXT;
          }
            this.listLoading = false
        });
      },
      //查询
      handleFilter() {
        this.listQuery.page.pageNo = 1
        this.fetchList()
      },
      //导出实时充值汇总记录
      exportFile(){
        exportFile('/payout_avg_logs/export', {
          query: this.listQuery.query,
          sort: this.listQuery.sort
        }, '买断分摊列表', 'post');
      },
    },
    created: function () {
        this.fetchList()
    },
    watch: {
      'listQuery.query.bookId': {
        handler: function (val, oldVal) {
          if (val === null || val === undefined) return
          let val1 = val.replace(/[^0-9]/g, '')
          this.$nextTick(() => {
            this.listQuery.query.bookId = val1
          })
        }
      }
    }
  }
</script>
<style>
  .add-Orgs-button {
    float: right;
  }

  .pagenation {
    margin-top: 10px;
  }
</style>
