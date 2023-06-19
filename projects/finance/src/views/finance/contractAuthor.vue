<template>
  <div class="app-container">
    <contentTitle :titleParams="{title:'签约作者列表'}" ></contentTitle>
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" ref="listQuery" @submit.native.prevent>
        <el-row :gutter="6">
          <el-col :span="5">
            <el-form-item label="作者ID :" prop="query.userId" style="margin-right: 12px">
              <el-input placeholder="作者ID" size="small" :maxlength="10"  v-model.trim="listQuery.query.userId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="签署人 :" prop="query.realName" style="margin-right: 12px">
              <el-input placeholder="签署人" size="small"   v-model.trim="listQuery.query.realName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属CP :" prop="query.realName" style="margin-right: 12px">
              <el-select v-model="listQuery.query.cpId" filterable  :disabled = "cpList.length == 1">
                <el-option
                        v-for="item in cpList"
                        :key="item.text"
                        :label="item.text"
                        :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
        <el-form-item label="注册日期 :" prop="query.registeDate" style="margin-bottom: -5px;">
          <el-date-picker
                  @change="setQuerydateVal"
                  v-model="listQuery.query.registeDate"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
          </el-col>
          <el-col :span="24">
        <el-form-item  class="search-btn-padding">
          <search @search="handleFilter" :listLoading="listLoading"></search>
          <reset @reset="resetQueryForm"></reset>
        </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="listData" :max-height="tableHeight" ref="listTable" :empty-text="emptyText" v-loading="listLoading" element-loading-text="加载中.." border fit stripe :header-cell-style="this.appConfig.HEADER_STYLE"
              highlight-current-row @filter-change="getFilter"  @sort-change="getSortColumn" >
      <el-table-column align="center" label="作者ID">
        <template slot-scope="scope">
          <notEnabled :row="scope.row"></notEnabled>
        </template>
      </el-table-column>
      <el-table-column align="center" label="作者笔名"  width="95">
        <template slot-scope="scope">
          <a target="_blank" :href="scope.row.userId | createPeopleLink"
             class="hoverLink">
            {{scope.row.penName }}
          </a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属CP" column-key="cpId" prop="cpId"  min-width="100"
                       filter-placement="bottom-end" >
        <template slot-scope="scope">
          <span>{{scope.row.cpIdText }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间" min-width="150" column-key="createTime"  prop="createTime" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="签署人" min-width="100" >
        <template slot-scope="scope">
          <span>{{scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开户行" min-width="180">
        <template slot-scope="scope">
          <span>{{scope.row.bankBranch }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="银行账号" min-width="160">
        <template slot-scope="scope">
          <span>{{scope.row.bankAccount.replace(/\s/g, "" ) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="证件类型" min-width="100">
      <template slot-scope="scope">
        <span>{{scope.row.idTypeText }}</span>
      </template>
    </el-table-column>
      <el-table-column align="center" label="证件号码" min-width="150">
      <template slot-scope="scope">
        <span>{{scope.row.idNo.replace(/\s/g, "" )}}</span>
      </template>
    </el-table-column><el-table-column align="center" label="手机号码" min-width="120">
      <template slot-scope="scope">
        <span>{{scope.row.mobile || "------"}}</span>
      </template>
    </el-table-column><el-table-column align="center" label="邮箱地址" min-width="160" >
      <template slot-scope="scope">
        <span>{{scope.row.email || "------" }}</span>
      </template>
    </el-table-column><el-table-column align="center" label="邮寄地址" min-width="270">
      <template slot-scope="scope">
        <span class="operate">{{scope.row.address  || "------"}}</span>
      </template>
    </el-table-column>
    </el-table>
    <pagination :listQuery="listQuery" :total="totalItems" :listLoading="listLoading" @getList="fetchContractAuthorList"></pagination>
  </div>
</template>
<script type="text/ecmascript-6">
  import { fetchSignedAuthors} from '@/api/finance' //稿费支付记录接口
  import waves from '@/directive/waves.js' // 水波纹指令
  import { parseTime, objectMerge, compareSimpleObject,getCpInfo} from '@/utils'
  import tableMixin from '@/mixins/tableHeight'
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        listQuery: {
          query: {
            beginDate: null,
            endDate:null,
            userId:null,
            cpId:null,
            realName:null,
            registeDate:null
          },
          sort: {
            orderByField: "id",
            orderDirect: "asc"
          },
          page: {
            pageNo: 1,
            pageSize: this.appConfig.DEFAULT_PAGE_SIZE
          }
        },
        listData: [],
        totalItems: 0,
        emptyText: this.appConfig.EMPTY_TEXT,//无数据提示
        init: true,
        listLoading: true
      }
    },
    mixins: [tableMixin],
    computed: {
      ...mapGetters([
        'dicList',
        'cpInfo'
      ]),
      // 获取CP列表
      cpList() {
        let temp = getCpInfo(this.dicList,'5',this.cpInfo);
        if(temp.length == 2){
           temp.splice(0,1); //移除全部
        }
        this.listQuery.query.cpId = temp[0].value
        return  temp
      }
    },
    methods: {
      /**
       * 设置时间查询条件
       * @param val
       */
      setQuerydateVal(dateTimeStr){
        if (dateTimeStr) {
          this.listQuery.query.beginDate = dateTimeStr[0]
          this.listQuery.query.endDate = dateTimeStr[1]
        } else {
          this.listQuery.query.beginDate = undefined
          this.listQuery.query.endDate = undefined
        }
      },
      fetchContractAuthorList() {
        this.listLoading = true;
        fetchSignedAuthors(this.listQuery).then(response => {
          this.listData = response.data.items;
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
        });
      },
      handleFilter() {
        this.listQuery.page.pageNo = 1
        this.fetchContractAuthorList()
      },
      getFilter(columnKeys){
        for(let i in columnKeys){
          this.listQuery.query[i] = ['cpId'].indexOf(i)>=0?columnKeys[i][0]:columnKeys[i];
        }
        this.fetchContractAuthorList()
      },
      getSortColumn({column, prop, order}){
        this.listQuery.sort.orderByField = prop || 'id',
        this.listQuery.sort.orderDirect = order === 'ascending' ? 'asc' : 'desc',
        this.fetchContractAuthorList()
      },
      resetQueryForm() {
        this.timestamp = [];
        if (this.$refs['listQuery'] != undefined) {
          this.$refs['listQuery'].resetFields();
          this.$refs['listTable'].clearFilter()
          this.listQuery.query.cpId = 0,
          this.listQuery.query.beginDate = undefined
          this.listQuery.query.endDate = undefined
          this.fetchContractAuthorList()
        }
      },
    },
    created: function () {
      this.fetchContractAuthorList()
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
