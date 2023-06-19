<template>
  <div class="app-container welfare">
    <!--标题-->
    <contentTitle :titleParams="{title: title}"></contentTitle>
    <!--查询-->
    <el-form :inline="true" :model="list_params" ref="list_params" class="filter-container">
      <el-form-item label="用户ID :" prop="query.userId">
        <el-input placeholder="" :maxlength="10" v-model="list_params.query.userId"
                  @keyup.enter.native="getList"></el-input>
      </el-form-item>
      <search @search="getList" :listLoading="listLoading"></search>
      <reset @reset="resetForm('list_params')"></reset>
    </el-form>
    <!--打赏合计-->
    <div  class="sum">
      <label>打赏合计:
        <span v-if="totalMoney">{{totalMoney+'(M)'}}</span>
        <i v-else class="el-icon-loading"></i></label>
      <label class="line"></label>
      <label>折合金额:
        <span v-if="totalMoneyYuan">{{totalMoneyYuan+'(元)'}}</span>
        <i v-else class="el-icon-loading"></i>
      </label>
    </div>

    <!--列表-->
    <el-table :data="list"
              ref="listTable"
              size="small"
              :max-height="tableHeight-50"
              :empty-text="emptyText"
              v-loading="listLoading"
              element-loading-text="加载中.."
              border fit stripe highlight-current-row
              :header-cell-style="headerStyle">
      <el-table-column label="打赏日期" align="center">
        <template slot-scope="scope">
          <nullValue :text="scope.row.createDate"></nullValue>
        </template>
      </el-table-column>
      <el-table-column label="打赏时间" align="center">
        <template slot-scope="scope">
          <nullValue :text="scope.row.createTime"></nullValue>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" align="center">
        <template slot-scope="scope">
          <nullValue :text="scope.row.userId"></nullValue>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" align="center">
        <template slot-scope="scope">
          <nullValue :text="scope.row.nickname"></nullValue>
        </template>
      </el-table-column>
      <el-table-column label="打赏(M)" align="center">
        <template slot-scope="scope">
          <nullValue :text="scope.row.money"><p style="margin: 8px 0"></p></nullValue>
        </template>
      </el-table-column>
      <el-table-column label="来源" align="center" fixed="right">
        <template slot-scope="scope">
          <nullValue :text="scope.row.siteTypeDesc"></nullValue>
          <p style="margin: 8px 0"></p>
        </template>
      </el-table-column>

    </el-table>
    <!--翻页-->
    <pagination :listQuery="list_params"
                :total="this.page_list.totalItemsCount"
                :listLoading="listLoading"
                v-if="list.length!==0"
                @getList="getList">
    </pagination>


  </div>
</template>

<script>
  import {rewardDetailsList, permission} from '@/api/rewardDetails'//接口
  import {mapGetters} from 'vuex'
  import tableMixin from '@/mixins/tableHeight'

  import {convertDic, getCpInfo, deepClone, getLastMonthYestdy} from '@/utils'
  export default {
    mixins: [tableMixin],
    components: {},
    data() {
      return {
        permission: permission,//权限
        emptyText: '',//无数据提示
        init: true,
        headerStyle: this.appConfig.HEADER_STYLE,//表头样式

        title:undefined,
        listLoading: true,//懒加载
        list: [],//内容列表数据
        page_list: '',//列表翻页数据
        totalMoney:undefined,
        totalMoneyYuan:undefined,
        list_params: {
          "query": {
            "bookId": this.$route.params.bookId ,
            "dealMonth": this.$route.params.dealMonth,
            "userId": undefined
          },
          "sort": {
            "orderByField": "id",
            "orderDirect": "asc"
          },
          "page": {
            "pageNo": 1,
            "pageSize": this.appConfig.DEFAULT_PAGE_SIZE
          }
        },//列表传入参数

      }
    },
    created() {
      this.getList()
    },
    computed: {
      //      字典调用方法
      ...mapGetters([
        'cpInfo',
        'dicList'
      ]),
    },
    methods: {
      //列表数据-接口
      getList() {
        this.listLoading = true
        rewardDetailsList(this.list_params).then(response => {
          this.listLoading = false
          if(response.data.items){
            let year=response.data.items.dealMonth.toString().substring(0,4)
            let months=response.data.items.dealMonth.toString().substring(4)
            this.title='《'+response.data.items.bookName+'》'+year+'年'+months+'月'+'打赏明细'
            this.totalMoney = response.data.items.totalMoney.toString();
            this.totalMoneyYuan=response.data.items.totalMoneyYuan;
            if(response.data.items.paginatedResult){
              this.list = response.data.items.paginatedResult.items;
              this.page_list = response.data.items.paginatedResult.paginate;//翻页数据
            }else{
              this.list = []
            }
          }else {
            this.totalMoney = "0";
            this.totalMoneyYuan= "0.00";
            this.$message.error('错了哦，书籍不存在');
          }
          if (this.init) {
            this.emptyText = '暂无数据'
            this.init = false
          } else {
            this.emptyText = '查询无结果'
          }
        })
      },


      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.getList()
      },

    },

    watch: {
        'list_params.query.userId': {
            handler: function (val, oldVal) {
                if (val === null || val === undefined) return
                let val1 = val.replace(/[^0-9]/g, '')
                this.$nextTick(() => {
                    this.list_params.query.userId = val1
                })
            }
        },

    },
  }
</script>
<style lang="scss" scoped>
    .sum{
        border-top:1px solid #DFE4ED ;
        margin-top: 5px;
        padding: 12px 0 12px;
        color: #606266;
        label{
            font-size: 14px;
            span{
                color: #ff8400;
                font-weight: bold;
                margin-left: 6px;
            }
            &.line{
                border-right:1px solid #DFE4ED;
                margin: 0 20px;
            }
        }
    }
</style>
