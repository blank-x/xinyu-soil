<template>
  <div class="app-container">
    <contentTitle :titleParams="{title:'单本作品买断列表'}" ></contentTitle>
    <el-table :data="dataList" :max-height="tableHeight" :empty-text="emptyText" v-loading="listLoading" element-loading-text="加载中.." border fit stripe :header-cell-style="this.appConfig.HEADER_STYLE"
              highlight-current-row >
      <el-table-column align="center" label="作者ID">
        <template slot-scope="scope">
          <notEnabled :row="scope.row"></notEnabled>
        </template>
      </el-table-column>
      <el-table-column align="center" label="作者笔名"  min-width="125">
        <template slot-scope="scope">
          <a target="_blank" :href="scope.row.authorId | createPeopleLink"
             class="hoverLink">
            {{scope.row.penName }}
          </a>
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
    </el-table>
    <pagination :listQuery="listQuery" :total="totalItems" :listLoading="listLoading" @getList="fetchList"></pagination>
  </div>
</template>

<script type="text/ecmascript-6">
  import { fetchPayOutAvgItem} from '@/api/finance'
  import waves from '@/directive/waves.js' // 水波纹指令
  import {parseTime, objectMerge, compareSimpleObject} from '@/utils'
  import tableMixin from '@/mixins/tableHeight'
  export default {
    data() {
      return {
        dataList: [],
        listQuery: {
          query: {bookId:parseInt(this.$route.params.bookId)},
          sort: {
            orderByField: "id",
            orderDirect: "asc"
          },
          page: {
            pageNo: 1,
            pageSize: this.appConfig.DEFAULT_PAGE_SIZE
          }
        },
        totalItems: 0,
        emptyText: this.appConfig.EMPTY_TEXT,//无数据提示
        init:true,
        listLoading:true
      }
    },
    mixins:[tableMixin],

    methods: {
      //查询单本分摊信息
      fetchList() {
        this.listLoading = true;
        fetchPayOutAvgItem(this.listQuery).then(response => {
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
    },
    created: function () {
        this.fetchList()
    }
  }
</script>
