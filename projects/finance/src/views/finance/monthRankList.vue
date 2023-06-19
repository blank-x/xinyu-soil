<template>
  <div class="app-container">
    <contentTitle :titleParams="{title:'月度榜单排行'}" ></contentTitle>
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" ref="listQuery" @submit.native.prevent>
        <el-form-item label="选择月份 :" prop="query.date" style="margin-right: 12px">
          <el-date-picker
                  :editable="false"
                  :clearable="false"
                  v-model="listQuery.query.month"
                  type="month"
                  :picker-options="pickerOptions"
                  format="yyyy-MM"
                  value-format="yyyyMM"
                  placeholder="选择月份">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <search @search="handleFilter" :listLoading="listLoading"></search>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="dataList" :span-method="objectSpanMethod"  :empty-text="emptyText" v-loading="listLoading" element-loading-text="加载中.." border :header-cell-style="this.appConfig.HEADER_STYLE">
    <!--  <el-table-column align="center" label="序号" type="index" width="50">-->
      <!--</el-table-column>-->
      <el-table-column align="center" label="所属CP" width="130">
        <template slot-scope="scope">
          {{scope.row.cp }}
          <!--<el-button type="text" icon="el-icon-document">{{scope.row.cp }}</el-button>-->
        </template>
      </el-table-column>
      <el-table-column align="center" label="榜单名称" width="130">
        <template slot-scope="scope">
         <span>{{scope.row.rankName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排名"   width="130">
        <template slot-scope="scope">
          <span>{{scope.row.ranking }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="作品ID"   width="130">
        <template slot-scope="scope">
          <a class="hoverLink" :href="$options.filters.createToBooKUrl(scope.row.bookId)" target="_blank">{{scope.row.bookId}}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="作品名称"  :resizable="false">
        <template slot-scope="scope">
          <a target="_blank" :href="'http://www.motie.com/book/'+scope.row.bookId">{{scope.row.bookName}}</a>
        </template>
      </el-table-column>
    </el-table>
    <back-to-top transitionName="fade" :customStyle="myBackToTopStyle" :visibilityHeight="400"
                 :backPosition="50"></back-to-top>
  </div>
</template>

<script type="text/ecmascript-6">
  import {fetchBookMonthRankList} from '@/api/finance' //财务结算
  import waves from '@/directive/waves.js' // 水波纹指令
  import {parseTime, objectMerge, compareSimpleObject,convertMergeDataTree,getLastMonthYestdy} from '@/utils'
  import tableMixin from '@/mixins/tableHeight'
  import BackToTop from '@/components/BackToTop'//返回顶部
  export default {
    data() {
      return {
        pickerOptions:{
          disabledDate(time) {
            debugger
            const beginDateVal = getLastMonthYestdy().substr(0,4)+"-"+getLastMonthYestdy().substr(4,2)+"-01";
            return time.getTime() > Date.parse(new Date(beginDateVal))
          }
        },
        listQuery: {
          query: {
            month:getLastMonthYestdy()
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
        dataList: [],
        emptyText: this.appConfig.EMPTY_TEXT,//无数据提示
        init:true,
        listLoading:true,
        myBackToTopStyle: {
          right: '50px',
          bottom: '50px',
          width: '40px',
          height: '40px',
          'line-height': '45px', // 请保持与高度一致以垂直居中
          background: '#e7eaf1'// 按钮的背景颜色
        },//返回顶部
      }
    },
    components: {
      BackToTop
    },
    mixins:[tableMixin],
    methods: {

      //合并单元格
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex == 0) {
          if (row.cpspan > 1) {
            return {
              rowspan: row.cpspan,
              colspan: 1
            };
          }
          if (row.cpdis) {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
        if (columnIndex == 1) {
          if (row.rankingspan > 1) {
            return {
              rowspan: row.rankingspan,
              colspan: 1
            };
          }
          if (row.rankingdis) {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      /**
       * 重置查询条件
       * @param formName
       */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      fetchList() {
        this.listLoading = true;
        fetchBookMonthRankList(this.listQuery).then(response => {
          this.dataList = response.data.items?convertMergeDataTree(response.data.items, 'ranking', 'rankName','cp'):[];
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
        //this.listQuery.page.pageNo = 1
        this.fetchList()
      },
    },
    created: function () {
      //this.listQuery.query.date =  parseTime(new Date().getTime(),'{y}-{m}');
      this.fetchList()


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
