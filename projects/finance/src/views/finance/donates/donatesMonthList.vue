<template>
    <div class="app-container">
        <contentTitle :titleParams="{title:title+'-月度打赏记录',download:true,permission:{export:permission.donates_month_export}}" @downHandler="exportFile()"  ></contentTitle>
        <div class="filter-container" >
            <el-form :inline="true" :model="listQuery" ref="listQuery" @submit.native.prevent>
                <el-row :gutter="6">
                    <el-col :span="6">
                        <el-form-item label="作品ID :" prop="query.bookId">
                            <el-input type="text" placeholder="作品ID" @keyup.enter.native="getList"  :maxlength="10" v-model="listQuery.query.bookId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="打赏日期 :"  style="margin-right: 12px" prop="query.donatesDate">
                            <el-date-picker
                                    @change="setQueryVal"
                                    v-model="listQuery.query.donatesDate"
                                    value-format="yyyy-MM-dd"
                                    format="yyyy-MM-dd"
                                    type="daterange"
                                    range-separator="-"
                                    :default-value="defaultVal"
                                    :picker-options="dateOptions"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item  class="search-btn-padding" style="position: relative">
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
        <el-table :data="actualTimeList" :max-height="tableHeight" :empty-text="emptyText" v-loading="listLoading"
                  element-loading-text="加载中.." border fit stripe :header-cell-style="this.appConfig.HEADER_STYLE"
                  highlight-current-row @filter-change="getFilter" ref="listTable">
            <el-table-column align="center" label="打赏日期" prop="donateDay">
            </el-table-column>
            <el-table-column align="center" label="作品ID" width="100" prop="bookId">
                <template slot-scope="scope">
                    <a target="_blank" :href="scope.row.bookId | createToBooKUrl" class="hoverLink">{{scope.row.bookId}}
                    </a>
                </template>
            </el-table-column>
            <el-table-column align="center" label="作品名称" min-width="125" prop="bookName">
                <template slot-scope="scope">
                    <a target="_blank" :href="scope.row.bookId | createBookLink"
                       class="hoverLink">{{scope.row.bookName}}</a>
                </template>
            </el-table-column>
            <el-table-column align="center" label="作者ID">
                <template slot-scope="scope">
                    <notEnabled :row="scope.row"></notEnabled>
                </template>
            </el-table-column>
            <el-table-column align="center" label="作者笔名"  min-width="145">
                <template slot-scope="scope">
                    <a target="_blank" :href="scope.row.authorId | createPeopleLink"
                       class="hoverLink">
                        {{scope.row.penName }}
                    </a>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所属CP" min-width="90"  prop="cpIdText"
                             column-key="cpId"
                             filter-placement="bottom" :filters="cpList">
            </el-table-column>
            <el-table-column align="center" label="打赏（M）" min-width="90" prop="count">
            </el-table-column>
            <el-table-column align="center" label="操作" width="200" :resizable="false">
                <template slot-scope="scope">
                    <span class="operate"><router-link  class="el-button--text" :to="{ path: '../donatesItem/'+scope.row.donateDay+'/'+scope.row.bookName+'/'+scope.row.bookId}">查看明细</router-link></span>
                </template>
            </el-table-column>
        </el-table>
        <pagination :listQuery="listQuery" :total="totalItems" :listLoading="listLoading"
                    @getList="fetchList"></pagination>
    </div>
</template>
<script type="text/ecmascript-6">
  import { fetchDonatesMonthList,fetchDonatesMonthSum,permission} from '@/api/finance' //稿费支付记录接口
  import waves from '@/directive/waves.js' // 水波纹指令
  import {exportFile} from '@/api/common' //作品库接口
  import { parseTime, objectMerge, compareSimpleObject,getMonthStartDate, getMonthEndDate} from '@/utils'
  import tableMixin from '@/mixins/tableHeight'
  import {mapGetters} from 'vuex'

  export default {
    directives: {
      waves
    },
    data() {
      return {
          permission:permission,
          dateOptions: {
          disabledDate: (time) => {
            const beginDateVal = getMonthStartDate(this.listQuery.query.dealMonth.substr(0,4),this.listQuery.query.dealMonth.substr(4,2));
            const endTimeVal = getMonthEndDate(this.listQuery.query.dealMonth.substr(0,4),this.listQuery.query.dealMonth.substr(4,2));
            if (beginDateVal && endTimeVal) {
              return parseTime(time,'{yyyy}-{mm}-{dd}') < beginDateVal ||  parseTime(time,'{yyyy}-{mm}-{dd}') > endTimeVal
            }
          }
        },
        listQuery: {
          query: {
            bookId:"",
            dealMonth: this.$route.params.month.toString() || "",
            beginDate:null,
            endDate:null,
            donatesDate:"",
          },
          sort: {
            orderByField: "count",
            orderDirect: "desc"
          },
          page: {
            pageNo: 1,
            pageSize: this.appConfig.DEFAULT_PAGE_SIZE
          }
        },
        actualTimeList:[],
        summary:{},
        totalItems: 0,
        listRoleLoading: true,
        emptyText: this.appConfig.EMPTY_TEXT,//无数据提示
        init: true,
        listLoading: true,
        title:parseTime(new Date(this.$route.params.month.substr(0,4),parseInt(this.$route.params.month.substr(4,2))-1),'{yyyy}年{mm}月'),
        defaultVal:parseTime(new Date(this.$route.params.month.substr(0,4),parseInt(this.$route.params.month.substr(4,2))-1,1),'{yyyy}-{mm}-{dd}')
      }
    },
    mixins: [tableMixin],
    computed: {
      ...mapGetters([
        'dicList',
        'auditCpsDetail',
      ]),
      cpList() {
        return this.auditCpsDetail || [];
      }
    },
    methods: {
      /**
       * 设置时间查询条件
       * @param val
       */
      setQueryVal(dataTimeStr){
        if (dataTimeStr) {
          this.listQuery.query.beginDate = dataTimeStr[0] + " 00:00:00";
          this.listQuery.query.endDate = dataTimeStr[1] + " 23:59:59";
        } else {
          this.listQuery.query.beginDate = undefined;
          this.listQuery.query.endDate = undefined;
        }
      },
      //多条件分页查询组织信息
      fetchList() {
        this.listLoading = true;
        this.$_axios.all([fetchDonatesMonthList(this.listQuery),fetchDonatesMonthSum(this.listQuery)]).then(
          this.$_axios.spread((response,responseSummary)=>{
            this.actualTimeList = response.data.items;
            this.summary = responseSummary.data.items.totalmtbSum ? responseSummary.data.items: {totalmtbSum:0};
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
        this.fetchList()
      },
      //导出月度打赏记录
        exportFile(){
            exportFile('/donates/month/items/export', this.listQuery, this.title+'月度打赏记录', 'post');
      },
      //重置
      resetForm(formName) {
        this.listQuery.query.beginDate = null;
        this.listQuery.query.endDate = null;
        this.$refs[formName].resetFields();
        this.$refs['listData'].clearFilter();
        this.listQuery.query['cpId'] = undefined;
        this.fetchList()
      },
      getFilter(columnKeys){
        for (let i in columnKeys) {
          this.listQuery.query[i] = columnKeys[i];
        }
        this.fetchList()
      },
    },
    created: function () {
      this.$store.dispatch('getAuditCpsDetail').then((data) => {
        this.fetchList()
      })
    },
    watch: {
      'listQuery.query.bookId': function (val, oldVal) {
        if (val) {
          let content = val.replace(/[^0-9]/g, '');
          setTimeout(() => {
            this.listQuery.query.bookId = content
          }, 0)
        }
      }
    }
  }
</script>
