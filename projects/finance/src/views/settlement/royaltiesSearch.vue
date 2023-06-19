<template>
  <div class="app-container welfare">
    <!--标题-->
    <contentTitle :titleParams="titleParams"></contentTitle>
    <!--查询-->
    <el-form :inline="true" :model="list_params" ref="list_params" class="filter-container" label-width="71px">
      <el-row :gutter="0">
        <el-col :span="6">
          <el-form-item label="作品ID :" prop="query.bookId">
            <el-input placeholder="作品ID" :maxlength="10" v-model="list_params.query.bookId"
                      @keyup.enter.native="getList"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="作者ID :" prop="query.authorId">
            <el-input placeholder="" :maxlength="10" placeholder="作者ID" v-model="list_params.query.authorId"
                      @keyup.enter.native="getList"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属CP :" prop="query.cpSearch">
            <el-select v-if="options_cp.length>1" v-model="list_params.query.cpSearch" @change="getCpId"
                       placeholder="请选择">
              <el-option
                v-for="item in options_cp"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input v-if="options_cp.length<=1" disabled v-model="options_cp[0].text"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="稿费类型 :" prop="query.type">
            <el-select v-model="list_params.query.type" placeholder="请选择">
              <el-option
                v-for="item in options_type"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="6">
          <el-form-item label="审核状态 :" prop="query.payStatus">
            <el-select v-model="list_params.query.payStatus" placeholder="请选择">
              <el-option
                v-for="item in options_payStatus"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="数据状态 :" prop="query.logicalDel">
            <el-select v-model="list_params.query.logicalDel" placeholder="请选择">
              <el-option
                v-for="item in options_payLogStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属月份:" prop="query.dealMonth" class="datepicker-item">
            <el-date-picker
              value-format="yyyyMM"
              format="yyyy-MM"
              v-model="list_params.query.dealMonth"
              :picker-options="pickerOptions"
              type="month"
              :editable="false"
              placeholder="选择月">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="float: right">
          <el-form-item class="search-btn-padding">
            <search @search="getList" :listLoading="listLoading"></search>
            <reset @reset="resetForm('list_params')"></reset>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--列表-->
    <el-table :data="list"
              ref="listTable"
              size="small"
              :max-height="tableHeight"
              :empty-text="emptyText"
              v-loading="listLoading"
              element-loading-text="加载中.."
              border fit stripe highlight-current-row
              :header-cell-style="headerStyle">

      <el-table-column label="所属月份" width="100" align="center">
        <template slot-scope="scope">
          <span style="display: inline-block; padding: 5px 0">{{scope.row.dealMonth | MonthsFilter}}</span>

        </template>
      </el-table-column>
      <el-table-column label="作者ID" width="100" align="center">
        <template slot-scope="scope">
          <notEnabled :row="scope.row"></notEnabled>
        </template>
      </el-table-column>
      <el-table-column label="作者笔名" min-width="120" align="center">
        <template slot-scope="scope">
          <a target="_blank" :href="'http://www.motie.com/people/'+scope.row.authorId">{{scope.row.penName}}</a>
        </template>
      </el-table-column>
      <el-table-column label="作品ID" width="100" align="center">
        <template slot-scope="scope">
          <a class="hoverLink" :href="$options.filters.createToBooKUrl(scope.row.bookId)"
             target="_blank">{{scope.row.bookId}}</a>
        </template>
      </el-table-column>
      <el-table-column label="作品名称" minWidth="120" align="center">
        <template slot-scope="scope">
          <a target="_blank" :href="'http://www.motie.com/book/'+scope.row.bookId">{{scope.row.bookName}}</a>
        </template>
      </el-table-column>
      <el-table-column label="所属CP" width="90" align="center">
        <template slot-scope="scope">
          <nullValue :text="scope.row.cpName"></nullValue>
        </template>
      </el-table-column>
      <el-table-column label="签约状态" width="90" align="center">
        <template slot-scope="scope">
          <nullValue :text="scope.row.signStatusDesc"></nullValue>
        </template>
      </el-table-column>
      <el-table-column label="签署人" width="90" align="center">
        <template slot-scope="scope">
          <nullValue :text="scope.row.realName"></nullValue>
        </template>
      </el-table-column>
      <el-table-column label="合作模式" width="90" align="center">
        <template slot-scope="scope">
          <nullValue :text="scope.row.payTypeDesc"></nullValue>
        </template>
      </el-table-column>
      <el-table-column label="稿费类型" width="90" align="center">
        <template slot-scope="scope">
          {{scope.row.typeDesc}}
          <router-link v-if="['全勤奖','签约全勤奖','签约全勤奖'].indexOf(scope.row.typeDesc)>-1"
                       target="_blank" :to="'/remuneration/fulltteAndance/'+scope.row.bookId">
            <el-button type="text" class="button-link">查看明细</el-button>
          </router-link>
          <router-link v-if="scope.row.typeDesc=='打赏分成'"
                       target="_blank"
                       :to="'/remuneration/rewardMonthDetail/'+scope.row.bookId+'/'+scope.row.dealMonth">
            <el-button type="text" class="button-link">查看明细</el-button>
          </router-link>
          <a v-if="scope.row.typeDesc=='订阅分成'"
             target="_blank"
             :href="subscribeLink(scope.row.bookId)">
            <el-button type="text" class="button-link">查看明细</el-button>
          </a>
        </template>

      </el-table-column>
      <el-table-column label="稿费" width="90" align="center">
        <template slot-scope="scope">
          <nullValue :text="scope.row.money"></nullValue>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="200" align="center">
        <template slot-scope="scope">
          <textEllipsis :text="scope.row.remark"></textEllipsis>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" minWidth="150" align="center">
        <template slot-scope="scope">
          <nullValue :text="scope.row.payStatusDesc"></nullValue>
        </template>
      </el-table-column>
      <el-table-column label="结算状态" width="90" align="center">
        <template slot-scope="scope">
          <nullValue :text="scope.row.financeStatusDesc"></nullValue>
        </template>
      </el-table-column>
      <el-table-column label="结算方式" width="90" align="center">
        <template slot-scope="scope">
          <nullValue :text="scope.row.financeTypeDesc"></nullValue>
        </template>
      </el-table-column>
      <el-table-column label="数据状态" width="90" align="center">
        <template slot-scope="scope">
          <nullValue :text="scope.row.payLogStatusDesc"></nullValue>
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
  import {royaltiesSearchList, permission} from '@/api/settlement'//接口
  import {mapGetters} from 'vuex'
  import tableMixin from '@/mixins/tableHeight'

  import {convertDic, getCpInfo, deepClone, getLastMonthYestdy} from '@/utils'
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  export default {
    mixins: [tableMixin],
    components: {ElButton},
    data() {
      return {
        permission: permission,//权限
        emptyText: '',//无数据提示
        init: true,
        headerStyle: this.appConfig.HEADER_STYLE,//表头样式
        titleParams: {
          title: this.$route.name,
        },//表头信息

        listLoading: true,//懒加载
        list: [],//内容列表数据
        page_list: '',//列表翻页数据
        list_params: {
          "query": {
            "authorCashId": undefined,
            "authorId": undefined,
            "bookId": undefined,
            "bookName": undefined,
            "cpId": undefined,
            "dealMonth": undefined,
            "manual": undefined,
            "money": undefined,
            "objectId": undefined,
            "objectType": undefined,
            "operatorId": undefined,
            "payStatus": undefined,
            "payTime": undefined,
            "payType": undefined,
            "penName": undefined,
            "realName": undefined,
            "refuseReason": undefined,
            "remark": undefined,
            "signedStatus": undefined,
            "type": undefined,
            cpSearch: undefined,
            logicalDel: undefined
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

        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },//查询月份限制

        //数据状态
        options_payLogStatus: [
          {
            value: undefined,
            label: '全部'
          }, {
            value: true,
            label: '已删除'
          }, {
            value: false,
            label: '正常'
          }
        ],

      }
    },
    created() {
      this.list_params.query.dealMonth = getLastMonthYestdy()
      this.getList()
    },
    computed: {
      //      字典调用方法
      ...mapGetters([
        'cpInfo',
        'dicList',
        'currentUser',
      ]),
      //cp
      options_cp: function () {
        let lists = getCpInfo(this.dicList, '5', this.cpInfo);
        console.log(lists)
        console.log(this.currentUser.roles)
        this.currentUser.roles.forEach((item) => {
          if (item.id === 37) {
            lists = [
              {value: 0, text: "全部", remark: "0"},
              {value: 1, text: "磨铁", remark: "1"},
              {value: 5, text: "锦文", remark: "1"},
              {value: 2, text: "墨墨", remark: "1"},
              {value: 3, text: "图书", remark: "1"}
            ]
          }
        })

        if (lists.length > 2) {
          lists.forEach((item) => {
            if (item.value == 0) {
              item.value = undefined
            }
          })
        } else {
          lists.shift()
          this.list_params.query.cpId = [lists[0].value]
        }
        return lists//根据权限显示
      },
      //稿费类型
      options_type: function () {
        let typelists = convertDic(this.dicList, '31')
        typelists.forEach((item) => {
          if (item.value == 0) {
            item.value = undefined
          }
        })
        return typelists
      },
      //审核状态
      options_payStatus: function () {
        let payStatuslists = convertDic(this.dicList, '32')
        payStatuslists.forEach((item) => {
          if (item.value == -3) {
            item.value = undefined
          }
        })
        return payStatuslists
      },

    },
    methods: {
      //列表数据-接口
      getList() {
        this.listLoading = true
        royaltiesSearchList(this.list_params).then(response => {
          this.listLoading = false
          this.list = response.data.items
          this.page_list = response.data.paginate//翻页数据
          if (this.init) {
            this.emptyText = '暂无数据'
            this.init = false
          } else {
            this.emptyText = '查询无结果'
          }
        })
      },

      //转cp类型
      getCpId(value){
        if (value) {
          this.list_params.query.cpId = [value]
        } else {
          this.list_params.query.cpId = undefined
        }
      },
      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$refs['listTable'].clearFilter();
        this.$refs['listTable'].clearSort();
        this.list_params.query.cpId = undefined
        this.getList()
      },
      subscribeLink(id) {
        // 订阅分成  跳转到旧站
        return process.env.PAGE_CONFIG.WEBSITE_URL + '/analytics/detail/book/' + id;
      }

    },

    watch: {
      'list_params.query.bookId': function (val, oldVal) {
        if (val) {
          let content = val.replace(/[^0-9]/g, '');
          setTimeout(() => {
            this.list_params.query.bookId = content
          }, 0)
        }
      },
      'list_params.query.authorId': function (val, oldVal) {
        if (val) {
          let content = val.replace(/[^0-9]/g, '');
          setTimeout(() => {
            this.list_params.query.authorId = content
          }, 0)
        }
      },
    },
  }
</script>
<style lang="scss" scoped>

</style>
