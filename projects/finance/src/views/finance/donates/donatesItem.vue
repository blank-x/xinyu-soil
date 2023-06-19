<template>
    <div class="app-container">
        <contentTitle :titleParams="{title:'《'+bookName+'》'+title+'打赏明细'}"  ></contentTitle>
        <div class="filter-container">
            <el-form :inline="true" :model="listQuery" ref="listQuery" @submit.native.prevent>
                <el-row :gutter="0">
                    <el-col :span="5">
                        <el-form-item label="用户ID :" prop="query.userId">
                            <el-input type="text"  v-model="listQuery.query.userId"  :maxlength="10"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="打赏时间 :"  prop="query.donatesDate">
                            <el-time-picker
                                    is-range
                                    range-separator="-"
                                    @change="setQueryVal"
                                    v-model="listQuery.query.donatesDate"
                                    :clearable="false"
                                    :editable="false"
                                    value-format="HH:mm:ss"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    align="right">
                            </el-time-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="打赏来源 :" prop="query.siteType" style="margin-right: 12px">
                            <el-select v-model="listQuery.query.siteType" filterable clearable>
                                <el-option
                                        v-for="item in siteList"
                                        :key="item.text"
                                        :label="item.text"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item  class="search-btn-padding" style="position: relative">
                            <search @search="handleFilter" :listLoading="listLoading"></search>
                            <reset  @reset="resetForm('listQuery')"></reset>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="summary">
                    <label>打赏合计:<span v-if="summary && !listLoading">{{summary.totalmtbSum+'M'}}</span><i v-else class="el-icon-loading"></i></label>
                </div>
            </el-form>
        </div>
        <el-table :data="actualTimeList" :max-height="tableHeight" :empty-text="emptyText" v-loading="listLoading"
                  element-loading-text="加载中.." border fit stripe :header-cell-style="this.appConfig.HEADER_STYLE"
                  highlight-current-row>
            <el-table-column align="center" label="打赏时间">
                <template slot-scope="scope">
                    {{scope.row.createTime }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="用户ID" >
                <template slot-scope="scope">
                    <span>{{scope.row.userId }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="用户昵称" >
                <template slot-scope="scope">
                    <span>{{scope.row.userName }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="打赏（M）" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.count }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="来源" >
                <template slot-scope="scope">
                    <span class="operate">{{scope.row.siteTypeText }}</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination :listQuery="listQuery" :total="totalItems" :listLoading="listLoading"
                    @getList="fetchList"></pagination>
    </div>
</template>
<script type="text/ecmascript-6">
  import { fetchDonatesUserItem,fetchDonatesMonthSum} from '@/api/finance' //稿费支付记录接口
  import waves from '@/directive/waves.js' // 水波纹指令
  import {exportFile} from '@/api/common' //作品库接口
  import {convertDic,parseTime} from '@/utils'
  import tableMixin from '@/mixins/tableHeight'
  import { mapGetters } from 'vuex'
  export default {
    directives: {
      waves
    },
    data() {
      return {
        listQuery: {
          query: {
            beginDate: this.$route.params.donateDay+" 00:00:00",
            endDate:this.$route.params.donateDay+ " 23:59:59",
            bookId:this.$route.params.bookId,
            userId:"",
            siteType:null,
            donatesDate:null
          },
          sort: {
            orderByField: "createTime",
            orderDirect: "asc"
          },
          page: {
            pageNo: 1,
            pageSize: this.appConfig.DEFAULT_PAGE_SIZE
          }
        },
        actualTimeList:[],
        summary:{},
        totalItems: 0,
        title:  parseTime(new Date(this.$route.params.donateDay),'{yyyy}年{mm}月{dd}日') ,
        listRoleLoading: true,
        emptyText: this.appConfig.EMPTY_TEXT,//无数据提示
        init: true,
        value4:"",
        listLoading: true,
        bookName:this.$route.params.bookName
      }
    },
    mixins: [tableMixin],
    computed:{
      ...mapGetters([
        'dicList'
      ]),
      siteList:function () {
        let temp = convertDic(this.dicList,'37');
        if(temp.length  == 4){
          temp.unshift({text:'全部',value:null})
        }
        return temp
      }
    },
    methods: {
      setQueryVal(dataTimeStr){
        if (dataTimeStr) {
          this.listQuery.query.beginDate = this.$route.params.donateDay+ " "+ dataTimeStr[0];
          this.listQuery.query.endDate = this.$route.params.donateDay + " " + dataTimeStr[1];
        } else {
          this.listQuery.query.beginDate = undefined;
          this.listQuery.query.beginDate = undefined;
        }
      },
      //多条件分页查询具体天的信息
      fetchList() {
        this.listLoading = true;
        //TODO 转换区间时间 this.value4;
        this.$_axios.all([fetchDonatesUserItem(this.listQuery),fetchDonatesMonthSum(this.listQuery)]).then(
          this.$_axios.spread((response,responseSummary)=>{
            this.actualTimeList = response.data.items;
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
        this.fetchList()
      },
      //导出作品库
      exportFile(){
        exportFile('/channel_topup/export', {
          query: this.listQuery.query,
          sort: this.listQuery.sort
        }, '充值记录', 'post');
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.listQuery.query.beginDate = this.$route.params.donateDay+" 00:00:00",
        this.listQuery.query.endDate = this.$route.params.donateDay+ " 23:59:59"
        this.fetchList()
      }
    },
    created: function () {
      this.fetchList()
    },
    watch: {
      'listQuery.query.userId': {
        handler: function (val, oldVal) {
          if (val === null || val === undefined) return
          let val1 = val.replace(/[^0-9]/g, '')
          this.$nextTick(() => {
            this.listQuery.query.userId = val1
          })
        }
      }
    }
  }
</script>
