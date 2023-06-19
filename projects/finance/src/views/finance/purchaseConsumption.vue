<template>
  <div class="app-container">
    <contentTitle :titleParams="{title: '外购作品消费记录',download:true,permission:{export:permission.export}}" @downHandler="exportFile()"></contentTitle>
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" ref="listQuery" @submit.native.prevent>
        <el-row :gutter="6">
          <el-col :span="6">
            <el-form-item label="作品ID :" prop="query.bookId">
              <el-input type="text" placeholder="作品ID"  :maxlength="10"  v-model="listQuery.query.bookId" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="作者ID :" prop="query.authorId">
              <el-input type="text" placeholder="作者ID" :maxlength="10"  v-model="listQuery.query.authorId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="合作方 :" prop="query.partnerId" style="margin-right: 12px">
              <el-select v-model="listQuery.query.partnerId" filterable>
                <el-option
                        v-for="item in partnerList"
                        :key="item.name"
                        :label="item.name"
                        :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属月份 :" prop="query.dealMonth">
              <el-date-picker :clearable="false" :editable="false"  type="month" placeholder="选择开始月份" v-model="listQuery.query.dealMonth"  value-format="yyyyMM"  ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="18">
            <el-form-item class="search-btn-padding">
              <search @search="handleFilter" :listLoading="listLoading"></search>
              <reset  @reset="resetForm('listQuery')"></reset>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="listData" :max-height="tableHeight" ref="listTable"   :empty-text="emptyText" v-loading="listLoading"
              element-loading-text="加载中.." border fit stripe :header-cell-style="this.appConfig.HEADER_STYLE"
              highlight-current-row @selection-change="handleSelectionChange" @filter-change="getFilter" @sort-change="getSortColumn"  :span-method="objectSpanMethod">
      <el-table-column align="center"
              type="selection" prop='payStatus'  :selectable='checkboxInit'
              width="45" fixed>
      </el-table-column>
      <el-table-column align="center" label="作品ID"  prop="bookId">
        <template slot-scope="scope">
          <a  class="hoverLink" :href="$options.filters.createToBooKUrl(scope.row.bookId)" target="_blank">{{scope.row.bookId}}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="作品名称" width="125">
        <template slot-scope="scope">
             <span class="link-type" v-if="scope.row.bookName">
                  <a target="_blank" :href="scope.row.bookId | createBookLink"  class="hoverLink">{{scope.row.bookName}}</a>
             </span>
             <span v-else>
                ------
             </span>
        </template>
      </el-table-column>
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
      <el-table-column align="center" label="所属CP"  width="95">
        <template slot-scope="scope">
          {{scope.row.cpName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="合作方" prop="partnerName">
        <template slot-scope="scope">
          <span>{{scope.row.partnerName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属月份" prop="dealMonth" >
        <template slot-scope="scope">
          <span>{{scope.row.dealMonth | formatMonth }}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="稿费类型">
        <template slot-scope="scope">
          {{scope.row.typeDesc}}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="稿费">
        <template slot-scope="scope">
          {{scope.row.moneyDesc}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" width="190">
        <template slot-scope="scope">
          {{ scope.row.remark}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="分成前"  fixed="right" :resizable="false">
        <template slot-scope="scope">
          {{ scope.row.sumMoneyDesc}}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="充值费"  fixed="right" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.topupRatio / 100}}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="渠道推广费" minWidth="100"  fixed="right" :resizable="false" >
        <template slot-scope="scope">
          {{scope.row.channelRatio / 100}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="分成比例"  fixed="right" :resizable="false">
        <template slot-scope="scope">
          {{ scope.row.proportionRatio / 100}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="分成后"  fixed="right" :resizable="false">
        <template slot-scope="scope">
          {{ scope.row.sumMoneyPayDesc}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="结算状态" width="90"  column-key="payStatus" prop="payStatus"
                       filter-placement="bottom-end" :filters="payStatusList" :filter-multiple="false"  fixed="right" :resizable="false">
        <template slot-scope="scope">
          <span :class="scope.row.payStatus?'':'danger'">
          {{ scope.row.payStatusDesc }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" width="150"  prop="createTime"  sortable="custom"  fixed="right" :resizable="false">
        <template slot-scope="scope">
          <span class="operate">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 5px 0px">
      <el-button  :disabled="!multipleSelection.length > 0"  type="primary" icon="el-icon-document" @click="settlement()"  :loading="settlementLoading">结算</el-button>
      <strong v-if="multipleSelection.length > 0"><span  style="color: rgb(48, 49, 51); font-size:14px; margin-left: 15px">分成后总合计: </span><span style="color: #ff7802">{{payment/100}}</span></strong>
      <strong v-if="multipleSelection.length == 0 && !listLoading"><span  style="color: rgb(48, 49, 51); font-size:14px; margin-left: 15px">分成后总合计: </span><span style="color: #ff7802">{{paymentTotal}}</span></strong>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {fetchPayLogsOutsourcing, permission, fetchSettlementPaylogsOutsourcing} from '@/api/finance' //稿费支付记录接口
  import {exportFile,fetchPartnerOutsourcingList} from '@/api/common' //作品库接口
  import waves from '@/directive/waves.js' // 水波纹指令
  import { parseTime, objectMerge, compareSimpleObject, getLastMonthYestdy,convertMergeData,accAdd} from '@/utils'
  import tableMixin from '@/mixins/tableHeight'
  export default {
    data() {
      return {
        permission: permission,
        multipleSelection: [],
        rolesList: [],
        pageSize: 10,
        currentPage: 1,
        listQuery: {
          query: {
            dealMonth: null,
            partnerId: null
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
        partnerList:[],
        totalItems: 0,
        listRoleLoading: true,
        emptyText: this.appConfig.EMPTY_TEXT,//无数据提示
        init: true,
        listLoading: true,
        settlementLoading: false,
        payment:0,
        paymentTotal:0
      }
    },
    mixins: [tableMixin],
    computed: {
      payStatusList: function () {
        return [{text: '已结算', value: true}, {text: '待结算', value: false}]
      }
    },
    methods: {
      //多条件分页查询组织信息
      fetchPayLogsOutsourcingList() {
        this.listLoading = true;
        fetchPayLogsOutsourcing(this.listQuery).then(response => {
          //将数据转成合并单元格数据格式
          this.paymentTotal = 0;
          this.listData = response.data.items?convertMergeData(response.data.items, 'type', 'bookId'):[];
          if(response.data.items){
              let tempId =0;
              response.data.items.map((item)=>{
              if(item.bookId != tempId ){
                  this.paymentTotal = accAdd(this.paymentTotal, item.sumMoneyPayDesc);
                  tempId = item.bookId
              }
            })
          }
          if (response.data.total == null) {
            this.totalItems = 0
          } else {
            this.totalItems = response.data.total

          }
          if (this.init) {
            this.init = false
          } else {
            this.emptyText = this.appConfig.SEARCHEMPTY_TEXT;
          }
          this.listLoading = false
        });
      },
      //查询
      handleFilter() {
        this.listQuery.page.pageNo = 1
        this.fetchPayLogsOutsourcingList()
      },
      //导出作品库
      exportFile(){
        exportFile('/paylogs_outsourcing/export', {
          query: this.listQuery.query,
          sort: this.listQuery.sort
        }, this.listQuery.query.dealMonth + '外购作品消费记录', 'post');
      },
      //选择事件
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.paymentSum();
      },
      //应结算合计
      paymentSum(){
        this.payment = 0;
        this.multipleSelection.map((row)=>{
          this.payment  = accAdd(this.payment,row.moneyPay);
        })
      },

      //批量结算
      settlement(){
        this.$confirm('确定结算吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.settlementQuery = {
            bookIds: [],
            dealMonth: this.listQuery.query.dealMonth,
          };
          this.multipleSelection.forEach((item) => {
            this.settlementQuery.bookIds.push(item.bookId)
          })
          this.settlementLoading = true;
          fetchSettlementPaylogsOutsourcing(this.settlementQuery).then(response => {
            if (response.data.items) {
              this.$message({
                type: 'success',
                message: '结算成功!'
              });
              this.settlementLoading = false;
              this.fetchPayLogsOutsourcingList();
            }
          });
        })
      },
      //状态是否可选
      checkboxInit(row, index){
        return !row.payStatus
      },
      //状态过滤
      getFilter(columnKeys){
        for (let i in columnKeys) {
          this.listQuery.query[i] = ['payStatus'].indexOf(i) >= 0 ? columnKeys[i][0] : columnKeys[i];
        }
        this.fetchPayLogsOutsourcingList()
      },
      //排序
      getSortColumn({column, prop, order}){
        this.listQuery.sort.orderByField = prop || 'createTime',
          this.listQuery.sort.orderDirect = order === 'ascending' ? 'asc' : 'desc',
          this.fetchPayLogsOutsourcingList()
      },
      //合并列
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex < 8 || columnIndex > 10) {
          if (row.typespan > 1) {
            return {
              rowspan: row.typespan,
              colspan: 1
            };
          }
          if (row.typedis) {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      //获取合作方列表
      getPartnerList(){
        fetchPartnerOutsourcingList().then(response => {
          this.partnerList = response.data.items;
          this.partnerList.unshift({
            'id': null,
            'name': '全部合作方'
          })
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        debugger
        this.listQuery.query.dealMonth = getLastMonthYestdy();
        this.fetchPayLogsOutsourcingList()
      }
    },
    created: function () {
      this.listQuery.query.dealMonth = getLastMonthYestdy();
      this.fetchPayLogsOutsourcingList()
      this.getPartnerList();
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
      },
      'listQuery.query.authorId': {
        handler: function (val, oldVal) {
          if (val === null || val === undefined) return
          let val1 = val.replace(/[^0-9]/g, '')
          this.$nextTick(() => {
            this.listQuery.query.authorId = val1
          })
        }
      }
    }
  }
</script>
