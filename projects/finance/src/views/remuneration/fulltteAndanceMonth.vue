<template>
  <div class="app-container welfare">
    <div v-if="bookName">
      <!--标题-->
      <contentTitle :titleParams="{title:'《'+bookName+'》'+formatDealMonth+'份全勤奖明细' }"></contentTitle>

      <div class="filter-container">
        <div class="level">全勤级别:{{rewardGradeDesc}}</div>
        <el-row class="revenue" type="flex" justify="start">
          <el-col :span="4">上月结余:￥{{leftMoney}}</el-col>
          <el-col :span="1"><i class="line aLink">|</i></el-col>
          <el-col :span="5">本月收入:￥{{money}}</el-col>
        </el-row>
      </div>
      <!--列表-->
      <el-table v-if="bookName" :data="list"
                ref="listTable"
                size="small"
                :max-height="tableHeight"
                :empty-text="emptyText"
                v-loading="listLoading"
                element-loading-text="加载中.."
                border fit stripe highlight-current-row
                :span-method="arraySpanMethod"
                :header-cell-style="headerStyle">
        <el-table-column label="日期" align="center" prop="publishDate" width="100">
          <template slot-scope="scope">
            <nullValue :text="scope.row.publishDate"></nullValue>
          </template>
        </el-table-column>
        <el-table-column label="章节发布时间" align="center" prop="publishTime" width="160">
          <template slot-scope="scope">
            <nullValue :text="scope.row.publishTime"></nullValue>
          </template>
        </el-table-column>
        <el-table-column label="章节名称" align="center" prop="chapterName" min-width="200">
          <template slot-scope="scope">
            <nullValue :text="scope.row.chapterName"></nullValue>
            <img style="vertical-align: text-top" :src="vipImg" v-if="!scope.row.free">
          </template>
        </el-table-column>
        <el-table-column label="公开状态" align="center" prop="openDesc" width="80">
          <template slot-scope="scope">
            <nullValue :text="scope.row.openDesc"></nullValue>
          </template>
        </el-table-column>
        <el-table-column label="公开时间" align="center" prop="openTime" width="160">
          <template slot-scope="scope">
            <nullValue :text="scope.row.openTime"></nullValue>
          </template>
        </el-table-column>
        <el-table-column label="是否缺勤" align="center" prop="absenceDesc" width="80">
          <template slot-scope="scope">
            <nullValue :text="scope.row.absenceDesc"></nullValue>
          </template>
        </el-table-column>
        <el-table-column label="全勤字数" align="center" prop="words">
        </el-table-column>

        <el-table-column label="全勤收入（¥）" align="center" prop="moneyYuan" fixed="right">
        </el-table-column>

      </el-table>
    </div>
    <div v-else>
      <no-data :msg="msg"></no-data>
    </div>

  </div>
</template>

<script>
  import {fullAttentanceMonth,fullAttentanceInfo, permission} from '@/api/fullAttentance'//接口
  import {mapGetters} from 'vuex'
  import tableMixin from '@/mixins/tableHeight'
  import {convertDic, getCpInfo, deepClone, getLastMonthYestdy, mergeDataConvert, parseTime} from '@/utils'

  export default {
    mixins: [tableMixin],
    components: {},
    data() {
      return {
        permission: permission,//权限
        emptyText: '',//无数据提示
        init: true,
        vipImg: this.appConfig.VIP_IMG,//vip章节
        headerStyle: this.appConfig.HEADER_STYLE,//表头样式
        title: undefined,
        listLoading: true,//懒加载
        list: [],//内容列表数据
        page_list: '',//列表翻页数据
        totalMoney: undefined,
        totalMoneyYuan: undefined,
        bookName: '',
        listQuery: {
          query: {
            bookId: this.$route.params.bookId,
            dealMonth: this.$route.params.dealMonth
          }
        },//列表传入参数
        msg: '',
        info: this.$route.params.info.split("|"),
        listInfo:{},
        money:0,
        leftMoney:0,
        rewardGradeDesc:0
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
      formatDealMonth: function () {
        let dateStr = this.$route.params.dealMonth;
        return parseTime(new Date(dateStr.substr(0, 4), parseInt(dateStr.substr(4, 2)) - 1), '{yyyy}年{mm}月');
      }
    },
    methods: {

      //列表数据-接口
      getList(bookId) {
        this.listLoading = true
        fullAttentanceMonth(this.listQuery.query).then(response => {

          let condition = {
            key: 'publishDate',
            publishDate: {
              column: 'publishDate'
            },
            moneyYuan: {
              column: 'publishDate',
              isSum: true,
              // 汇总哪个列表的数据
              sumColumn: 'moneyYuan'
            }
          }
          if (response.data.items) {
            if (response.data.items.queryChapterRecordInfoVOs) {
              this.list = mergeDataConvert({
                data: response.data.items.queryChapterRecordInfoVOs,
                keys: condition,
                onlyMerge: true
              });
            }
            this.bookName = response.data.items.bookName
            this.money= response.data.items.money
            this.leftMoney=response.data.items.leftMoney
            this.rewardGradeDesc=response.data.items.rewardGradeDesc
          } else {
            this.msg = response.data.msg;
          }

          this.listLoading = false
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
      // 单元格合并
      arraySpanMethod({row, column, rowIndex, columnIndex}) {

        if (row.mergeData.hasOwnProperty(column.property)) {
          return {
            rowspan: row.mergeData[column.property] || 0,
            colspan: row.mergeData[column.property] ? 1 : 0
          }
        }

      },

    },

    watch: {
      'listQuery.query.userId': function (val, oldVal) {
        if (val) {
          let content = val.replace(/[^0-9]/g, '');
          setTimeout(() => {
            this.listQuery.query.userId = content
          }, 0)
        }
      },

    },
  }
</script>
<style lang="scss" scoped>
  .level {
    font-size: 14px;
  }

  .revenue {
    font-size: 14px;
    margin: 10px 0;
  }

  .line {
    font-style: normal;
  }
</style>
