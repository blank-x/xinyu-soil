<template>
  <div class="app-container settlement">
    <!--标题-->
    <el-row class="title" v-model="form1">
      <span class="text">{{this.$route.name}}</span>
      <el-button v-if="this.$route.meta.type == 1"
                 :style="appConfig.btnStyle120"
                 :loading="dialogLoading"
                 :disabled="form1.canCalculate==false"
                 v-has="permission.calculate"
                 @click="open_Fn()" class="download" type="primary">{{this.$route.name}}
      </el-button>
      <el-button v-if="this.$route.meta.type == 2"
                 :style="appConfig.btnStyle120"
                 :loading="dialogLoading"
                 :disabled="form2.canCalculate==false"
                 v-has="permission.author_cash"
                 @click="open_Fn()" class="download" type="primary">{{this.$route.name}}
      </el-button>
      <el-button v-if="this.$route.meta.type == -1"
                 :style="appConfig.btnStyle120"
                 :loading="dialogLoading"
                 :disabled="form1.canCalculate==false"
                 v-has="permission.calculate"
                 @click="open_Fn()" class="download" type="primary">{{this.$route.name}}
      </el-button>
      <el-button v-if="this.$route.meta.type == -2"
                 :style="appConfig.btnStyle120"
                 :loading="dialogLoading"
                 :disabled="form2.canCalculate==false"
                 v-has="permission.author_cash"
                 @click="open_Fn()" class="download" type="primary">{{this.$route.name}}
      </el-button>
    </el-row>
    <!--查询-->
    <el-form :inline="true" :model="list_params" ref="list_params" class="filter-container" label-width="71px">
      <el-row :gutter="0">
        <el-col :sm="10" :md="6" :lg="6">
          <el-form-item label="所属月份:" prop="query.dealMonth" class="datepicker-item">
            <el-date-picker
              value-format="yyyyMM"
              format="yyyy-MM"
              :picker-options="pickerOptions"
              v-model="list_params.query.dealMonth"
              type="month"
              :editable="false"
              placeholder="选择所属月份">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="6" :lg="6">
          <el-form-item label="所属公司 :" prop="query.company">
            <el-select v-if="companyList.length>1" v-model="list_params.query.company" placeholder="请选择">
              <el-option
                v-for="item in companyList"
                :key="item.text"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input v-if="companyList.length==1" disabled v-model="companyList[0].text"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="10" :md="6" :lg="6" style="float: right">
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
      <el-table-column label="所属月份" minWidth="150" align="center">
        <template slot-scope="scope">
          {{scope.row.dealMonth | MonthsFilter}}
        </template>
      </el-table-column>
      <el-table-column label="所属公司" minWidth="150" align="center">
        <template slot-scope="scope">
          <nullValue :text="scope.row.companyDesc"></nullValue>
        </template>
      </el-table-column>
      <el-table-column :label="typeValue" minWidth="150" align="center">
        <template slot-scope="scope">
          <nullValue :text="scope.row.startTime"></nullValue>
        </template>
      </el-table-column>
      <el-table-column :label="typeValue2" minWidth="150" align="center">
        <template slot-scope="scope">
          <nullValue :text="scope.row.endTime"></nullValue>

        </template>
      </el-table-column>
      <el-table-column label="当前状态" minWidth="150" align="center" prop="tag" column-key="finish">
        <template slot-scope="scope">
          <span v-if="scope.row.status==-1" style="color: red">{{scope.row.statusDesc}}</span>
          <span v-else>{{scope.row.statusDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统执行结果" minWidth="150" align="center">
        <template slot-scope="scope">
          <!--<nullValue :text="scope.row.resultDesc"></nullValue>-->
          <span v-if="scope.row.status==-1" style="color: red">{{scope.row.resultDesc}}</span>
          <span v-if="scope.row.status==2">{{scope.row.resultDesc}}</span>
          <span v-if="scope.row.status==1">------</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" minWidth="150" align="center"
                       :resizable="false"
                       :fixed="list.length==0?false:'right'">
        <template slot-scope="scope">

          <router-link target="_blank" :to="{ path: '/settlement/viewDetails/'+scope.row.id}">
            <el-button type="text">查看详情</el-button>
          </router-link>
          <!--<span style="color: red">已锁定</span>-->
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
    <!--弹窗-->
    <el-dialog :title="this.$route.name" :visible.sync="dialogVisible" :close-on-click-modal="false"
               width="480px" class="settlementDialog">

      <el-form v-if="this.$route.meta.type==1"
               class="small-space" style="margin-left:30px" label-width="80px"
               :model="form1">
        <el-form-item label="公司 :">{{companyName}}</el-form-item>
        <el-form-item label="计算范围 :">{{cpValue}}</el-form-item>
        <el-form-item label="月份 :">{{form1.dealMonth | MonthsFilter}}</el-form-item>
      </el-form>
      <el-form v-show="!this.ReCountVisible&&this.$route.meta.type==-1"
               class="small-space" style="margin-left:20px" label-width="80px"
               :model="form1"
               :rules="form1Rules"
               ref="form1">
        <el-form-item label="选择范围 :" prop="resource" class="no-required-star">
          <el-radio-group v-model="form1.resource" @change="handleCheckAllChange">
            <el-radio :label="1" v-model="checkAll"
                      :indeterminate="true">{{companyName}}
            </el-radio>
            <el-radio :label="2">单本</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form1.resource==1" class="no-required-star"
                      style="margin-top: -20px">
          <el-checkbox-group v-model="form1.cpsDiy" @change="cpChange">
            <el-checkbox style="margin-right: 20px"
                         v-for="city in options_cp.text" :label="city" :key="city">{{city}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item><!--公司-->
        <el-form-item v-if="form1.resource==2" prop="bookIds" :error="errorMessage"
                      style="margin-top: -20px;"
                      class="encorrect-eltag-bug">
          <el-select style="width:240px;color: red!important;"
                     v-model="form1.bookIds"
                     multiple
                     filterable
                     default-first-option
                     remote
                     :loading="fuzzyLoading"
                     :no-data-text="noDataText"
                     loading-text="加载中···"
                     placeholder="请填写作品ID"
                     @change="changeBookid"
                     :remote-method="fuzzyBookid">
            <el-option
              v-for="item in fuzzyBookList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <span>作品名称：{{item.bookName}}
                <i style=" font-style:normal; font-size: 14px; margin-left: 15px"> 所属CP：{{item.cpName}}</i>
              </span>
            </el-option>
          </el-select>
        </el-form-item><!--单本-->

        <el-form-item label="选择月份 :" prop="dealMonth" class="datepicker-item no-required-star">
          <el-date-picker
            :editable="false"
            value-format="yyyyMM"
            format="yyyy-MM"
            v-model="form1.dealMonth"
            :picker-options="dialogPickerOptions"
            type="month"
            style="width: 240px"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="稿费类型 :" prop="payLogTypesDiy" size="small" class="no-required-star">
          <el-checkbox-group v-model="form1.payLogTypesDiy" @change="typeChange" v-loading="disabled">
            <el-checkbox style="margin-right: 10px" border
                         :disabled="payLogDisabled.length>0&&payLogDisabled.indexOf(city.value.toString())==-1"
                         v-for="city in options_type" :label="city.value" :key="city.value">{{city.text}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <el-form v-if="this.$route.meta.type==2"
               class="small-space" style="margin-left:0px" label-width="110px"
               :model="form2"
               :rules="form2Rules"
               ref="form2">

        <el-form-item label="请选择兑现公司 :" prop="companyIdsDiy" size="small" class="no-required-star">
          <el-checkbox-group v-model="form2.companyIdsDiy" @change="companyChange" style="display: inline-block">
            <el-checkbox style="margin-right: 10px" border
                         v-for="city in options_company"
                         :label="city.value"
                         :key="city.value">{{city.text}}
            </el-checkbox>
          </el-checkbox-group>
          <el-checkbox-group v-model="form2.invalidCompanyIds" disabled style="display: inline-block">
            <el-checkbox style="margin-right: 10px" border
                         v-for="city in options_invalidCompanyIds"
                         :label="city"
                         :key="city">{{city}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <el-form v-if="this.$route.meta.type==-2"
               class="small-space" style="margin-left:20px" label-width="80px"
               :model="form2"
               :rules="form2Rules"
               ref="form2">

        <el-alert :title="'提示：必须指定兑现公司和作者，请谨慎操作！'"
                  :closable="false" type="warning" show-icon
                  style="width: 100%; height: 32px; margin: 0 0 20px 0px"></el-alert>

        <el-form-item label="兑现公司 :" prop="companyIdsDiyNew" size="small" class="no-required-star">
          <el-checkbox-group v-model="form2.companyIdsDiyNew" @change="companyChange">
            <el-checkbox style="margin-right: 10px" border
                         v-for="city in options_company" :label="city.value" :key="city.value">{{city.text}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="作者ID :" prop="authorIds" :error="errorMessage"
                      style="margin-top: 0px"
                      class="encorrect-eltag-bug no-required-star">
          <el-select style="width:240px;"
                     v-model="form2.authorIds"
                     multiple
                     filterable
                     default-first-option
                     remote
                     :loading="fuzzyLoading"
                     :no-data-text="noDataText"
                     loading-text="加载中···"
                     placeholder="请填写要重新兑现的作者ID"
                     @change="changeBookid"
                     :remote-method="fuzzyAuthorid">
            <el-option
              v-for="item in fuzzyBookList2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <span>作者ID：{{item.value}}
                <i style=" font-style:normal; font-size: 14px; margin-left: 15px"> 笔名：{{item.label}}</i>
              </span>
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>

      <!--保存、取消修改-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm_Fn" :disabled="disabled">确 定</el-button>
      </span>
    </el-dialog>
    <!--重算确认弹窗-->
    <el-dialog :title="this.$route.name" :visible.sync="ReCountVisible" :close-on-click-modal="false"
               width="480px" class="settlementDialog">
      <el-form class="small-space" style=" text-align: center" label-width="" :model="form1">
        <el-form-item style="margin-bottom: 0px">确定要重算稿费吗？</el-form-item>
        <el-form-item v-if="form1.resource==1" style="margin-bottom: 0px">重算范围 :{{form1.cpsText}}</el-form-item>
        <el-form-item v-if="form1.resource==2" style="margin-bottom: 0px">重算作品 :{{form1.bookIds | bookIdsFilter}}
        </el-form-item>
        <el-form-item style="margin-bottom: 0px">月份 :{{form1.dealMonth | MonthsFilter}}</el-form-item>
        <el-form-item style="margin-bottom: 0px">稿费类型 :{{form1.typeText }}</el-form-item>
      </el-form>
      <!--保存、取消修改-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="ReCountVisible=false">取 消</el-button>
        <el-button type="primary" @click="confirm_Fn">确 定</el-button>
      </span>
    </el-dialog>
    <!--重算单本错误弹窗-->
    <el-dialog
      title="提示"
      :visible.sync="errorVisible"
      :close-on-click-modal="false"
      @close="errorClose()"
      width="460px">
      <div v-if="errorList.length>0" style="margin-bottom: 10px">作品ID“{{errorList[0].objectId}}”申请重算稿费失败，请确认：</div>
      <el-table
        :data="errorList"
        v-loading="errorLoading"
        ref="listTable"
        size="small"
        border fit stripe highlight-current-row
        :header-cell-style='{"background": "#EFF2F7",padding:"5px 0"}'
        style="margin-bottom: 30px;">
        <el-table-column label="稿费类型" width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.payLogTypeStr}}
          </template>
        </el-table-column>
        <el-table-column label="重算条件" min-width="322" align="center">
          <template slot-scope="scope">
            {{scope.row.result}}
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>
  </div>
</template>
<script>
  import {
    permission,
    royaltiesList,
    calculateData,
    re_calculateData,
    calculateSubmit,
    cashData,
    re_cashData,
    cashSubmit,
    checkAuthorid,
    checkBookid,
    paylogtypeData,
    validate_book_paymentData,
    validate_author_cashData
  } from '@/api/settlement'//接口
  import {mapGetters} from 'vuex'
  import tableMixin from '@/mixins/tableHeight'

  import {convertDic, getCpInfo, deepClone, getCompany, getLastMonthYestdy} from '@/utils'
  import ElInput from "../../../node_modules/element-ui/packages/input/src/input";
  const cityOptions = ['上海', '北京', '广州',];
  export default {
    mixins: [tableMixin],
    components: {ElInput},
    data() {
      return {
        permission: permission,//权限
        emptyText: '',//无数据提示
        init: true,//判断无数据提示
        headerStyle: this.appConfig.HEADER_STYLE,//表头样式
        titleParams: {
          title: this.$route.name,
        },//表头信息

        listLoading: true,//列表懒加载
        list: [],//内容列表数据
        page_list: '',//列表翻页数据
        list_params: {
          "query": {
            "authorId": undefined,
            "bookId": undefined,
            "company": undefined,
            "dealMonth": undefined,
            "endTime": undefined,
            "operatorId": undefined,
            "result": undefined,
            "startTime": undefined,
            "status": undefined,
            "type": this.$route.meta.type
          },
          "sort": {
            "orderByField": "id",
            "orderDirect": "desc"
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
        dialogPickerOptions: {
          disabledDate(time) {
            var date = new Date()
            var
              Y = date.getFullYear() + '-',
              M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth()) : date.getMonth()) + '-',
              D = date.getDate() + ' ',
              h = date.getHours() + ':',
              m = date.getMinutes() + ':',
              s = date.getSeconds()
            var lastData = new Date(Y + M + D + h + m + s).getTime()
            return time.getTime() >= lastData;
//            return time.getTime() > Date.now();
          }
        },//查询月份限制

        dialogVisible: false,
        dialogLoading: false,
        form1: {
          canCalculate: false,
//          payLogTypes: [5, 6, 9, 11, 12],
          payLogTypes: [],
          dealMonth: undefined,
          companyId: '1',
          bookIds: undefined,
//          cps: [1, 2, 4, 5],
          cps: [],

          resource: undefined,
          cpsIdDiy: [],
          cpsDiy: undefined,
          typeText: undefined,
          cpsText: undefined,
          payLogTypesDiy: [],
        },//计算，重算数据
        form2: {
          canCalculate: false,
          "authorIds": undefined,
//          companyIds: [1, 2, 3, 4],
          companyIds: [],
          invalidCompanyIds: [],
          companyIdsDiy: [],
          companyIdsDiyNew: [],
        },//兑现，重新兑现数据
        form1Rules: {
          resource: [{required: true, message: '请选择重算范围', trigger: 'change'}],
          bookIds: [{required: true, message: '请填写要重算的作品ID', trigger: 'change'}],
          dealMonth: [{required: true, message: '请选择月份', trigger: 'change'}],
          payLogTypesDiy: [{type: 'array', required: true, message: '请选择稿费类型，可多选', trigger: 'change'}],
          companyCash: [{type: 'array', required: true, message: '请选择兑现公司', trigger: 'change'}],
        },
        form2Rules: {
          companyIdsDiy: [{type: 'array', required: true, message: '请选择兑现公司', trigger: 'change'}],
          companyIdsDiyNew: [{type: 'array', required: true, message: '请选择兑现公司', trigger: 'change'}],
          authorIds: [{required: true, message: '请填写作者ID', trigger: 'change'}],
        },
        checkAll: false,//范围全选变量
        cities: cityOptions,
        isIndeterminate: true,
        ReCountVisible: false,//重算确认弹窗

        //id校验
        fuzzyBookList: [],
        fuzzyBookList2: [],
        fuzzyLoading: false,
        timer: null,
        errorMessage: null,
        noDataText: '无数据',
        disabled: false,
        payLogDisabled: [],
        bookcpId: undefined,

        errorVisible: false,
        errorLoading: false,
        errorList: [],
      }
    },
    created() {
      this.$store.dispatch('getAuditCompanyDetail').then((data) => {
        this.list_params.query.company = data[0].value;
        this.defaultCompanyId = data[0].value;
        this.getList()
      })
    },
    computed: {
      //      字典调用方法
      ...mapGetters([
        'cpInfo',
        'dicList',
        'auditCompanyDetail',
        'resourcePermission'
      ]),
      //公司
      companyList() {
//        console.log(this.auditCompanyDetail)
        return this.auditCompanyDetail || []
      },

      //计算稿费显示公司名称
      companyName: function () {
        let lists = convertDic(this.dicList, '45')
        let value = this.form1.companyId
        let temp = lists.find(function (item) {
          return value == item.value;
        })
        return temp && temp.text
      },
      //计算稿费显示计算范围
      cpValue: function () {
        let lists = convertDic(this.dicList, '5')
        let arr = []
        if (this.form1.cps) {
          this.form1.cps.map((item1) => {
            let temp = lists.find(function (item2) {
              return item1 == item2.value;
            })
            temp && arr.push(temp.text)
            return arr
          })
        }
        return arr.join('/') + '所有作品'

      },

      //重算范围
      options_cp: function () {
        let obj = {}
        let lists = convertDic(this.dicList, '5');
        let arrText = [], arrObj = []
//        console.log(this.form1.cps)
        if (this.form1.cps) {
          this.form1.cps.map((item1) => {
            let temp = lists.find(function (item2) {
              return item1 == item2.value;
            })
            temp && arrText.push(temp.text) && arrObj.push(temp)
            obj = {text: arrText, obj: arrObj}
            return obj
          })
        }
        return obj
      },

      //重算稿费显示稿费类型
      options_type: function () {
        let lists = convertDic(this.dicList, '31')
        let arr = []
        if (this.form1.payLogTypes) {
          this.form1.payLogTypes.map((item1) => {
            let temp = lists.find(function (item2) {
              return item1 == item2.value;
            })
            temp && arr.push(temp)
            return arr
          })
        }
        return arr
      },

      //兑现稿费、重新兑现公司名称
      options_company: function () {
        let lists = convertDic(this.dicList, '45')
        let arr = []
        if (this.form2.companyIds) {
          this.form2.companyIds.map((item1) => {
            let temp = lists.find(function (item2) {
              return item1 == item2.value;
            })
            temp && arr.push(temp)
            return arr
          })
          return arr
        }
      },
      options_invalidCompanyIds: function () {
        let lists = convertDic(this.dicList, '45')
        let arr = []
        if (this.form2.invalidCompanyIds) {
          this.form2.invalidCompanyIds.map((item1) => {
            let temp = lists.find(function (item2) {
              return item1 == item2.value;
            })
            temp && arr.push(temp.text)
            return arr
          })
//          console.log(arr)
          return arr
        }
      },

      typeValue(){
        if (this.$route.meta.type == 1)return '申请计算时间'
        if (this.$route.meta.type == -1)return '申请重算时间'
        if (this.$route.meta.type == 2)return '申请兑现时间'
        if (this.$route.meta.type == -2)return '重新兑现时间'
      },
      typeValue2(){
        if (this.$route.meta.type == 1)return '计算完成时间'
        if (this.$route.meta.type == -1)return '重算完成时间'
        if (this.$route.meta.type == 2)return '兑现完成时间'
        if (this.$route.meta.type == -2)return '兑现完成时间'
      },
    },
    methods: {
      //是否可以含有兑现稿费，计算稿费权限
      checkPermission(){
        let falg = false
        for (let key in this.resourcePermission) {
          if (key == this.permission.calculate[0] || key == this.permission.author_cash[0]) {
            falg = this.resourcePermission[key];
            break;
          }
        }
        if (falg) {
          this.whetherComputed()
        }
      },
      //查询列表数据-
      getList() {
        this.checkPermission()
        this.listLoading = true
        this.$nextTick(() => {
          royaltiesList(this.list_params).then(response => {
            this.listLoading = false
            this.list = response.data.items
            this.page_list = response.data.paginate //翻页数据
            if (this.init) {
              this.emptyText = '暂无数据'
              this.init = false
            } else {
              this.emptyText = '查询无结果'
            }
          })
        })
      },
      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$refs['listTable'].clearFilter();
        this.$refs['listTable'].clearSort();
        this.list_params.query.company = this.defaultCompanyId;
        this.getList()
      },

      //是否可以计算、兑现
      whetherComputed(){
        //是否计算稿费
        if (this.$route.meta.type == 1) {
          calculateData().then(response => {
            if (response.data.status == 200) {
              this.dialogLoading = false
              this.form1 = Object.assign(this.form1, response.data.items)
              this.form1.dealMonth = getLastMonthYestdy()//显示上个月
            } else {
//            this.$message({message: response.data.msg, type: 'error'})
            }
          })
        }
        //是否重算稿费
        if (this.$route.meta.type == -1) {
          re_calculateData().then(response => {
            if (response.data.status == 200) {
              this.form1 = Object.assign({}, this.form1, response.data.items)
              console.log(this.form1)
              this.form1.dealMonth = getLastMonthYestdy()//显示上个月
            }
          })
        }
        //是否兑现稿费
        if (this.$route.meta.type == 2) {
          cashData().then(response => {
            if (response.data.items) {
              this.dialogLoading = false
              this.form2 = Object.assign(this.form2, response.data.items)
            }
          })
        }
        //是否重新兑现
        if (this.$route.meta.type == -2) {
          re_cashData().then(response => {
            if (response.data.status == 200) {
              this.form2.companyIds = response.data.items.companyIds
              this.form2.canCalculate = response.data.items.canCalculate
            }
          })
        }
      },
      //计算、重算弹窗接口
      calculateSubmit_Fn(params){
        calculateSubmit(params).then(response => {
          if (response.data.status == 200) {
            this.$message({message: this.$route.name + '申请成功', type: 'success'})
            this.dialogVisible = false
            this.ReCountVisible = false
            this.form1.resource=undefined
            this.getList()
          } else {
//            this.$message({message: response.data.msg, type: 'error'})
          }
        })
      },
      //兑现、重新兑现弹窗接口
      cashSubmit_Fn(params){
        cashSubmit(params).then(response => {
          if (response.data.status == 200) {
            this.$message({message: this.$route.name + '申请成功', type: 'success'})
            this.dialogVisible = false
            this.getList()
          } else {
//            this.$message({message: response.data.msg, type: 'error'})
          }
        })
      },
      //弹出弹窗
      open_Fn(){
        this.$refs['form1'] && this.$refs['form1'].resetFields();
        this.$refs['form2'] && this.$refs['form2'].resetFields();
        this.payLogDisabled = []
        this.dialogLoading = true

        setTimeout(() => {
          this.dialogLoading = false
          this.dialogVisible = true
        }, 300)
      },
      //确定弹窗
      confirm_Fn(){
        if (this.$route.meta.type == 1) {
          let params = {
            "bookIds": undefined,
            "companyId": this.form1.companyId,
            "cps": this.form1.cps,
            "dealMonth": this.form1.dealMonth,
            "payLogTypes": undefined,
            "recompute": false
          }
//          console.log(params)
          this.calculateSubmit_Fn(params)
        }
        if (this.$route.meta.type == -1) {
          this.$refs['form1'].validate((valid) => {
            if (valid) {
              this.$nextTick(() => {
                this.ReCountVisible = true//确认弹窗
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        }
        if (this.ReCountVisible == true) {
//          console.log(this.form1.cpsIdDiy)
          let params = {
            "bookIds": this.form1.bookIds,
            "companyId": this.form1.companyId,
            "cps": this.form1.cpsIdDiy,
            "dealMonth": this.form1.dealMonth,
            "payLogTypes": this.form1.payLogTypesDiy,
            "recompute": true
          }

          if (this.form1.resource == 2) {
            validate_book_paymentData(this.form1.bookIds, this.form1.dealMonth, this.form1.payLogTypesDiy).then(response => {
              if (response.data.items.length == 0) {
                this.calculateSubmit_Fn(params)
              } else {
                this.errorList = response.data.items
                this.dialogVisible = false
                this.ReCountVisible = false
                setTimeout(() => {
                  this.errorVisible = true
                }, 500)
                return
              }
            })
          } else {
            this.calculateSubmit_Fn(params)
          }

        }//重算确认
        if (this.$route.meta.type == 2) {
          if (this.options_company.length > 1) {
            this.form2Rules.companyIdsDiyNew[0].message = '请选择兑现公司，可多选'
          }
          this.$refs['form2'].validate((valid) => {
            if (valid) {
              let params = {
                "authorIds": undefined,
                "canCalculate": false,
                "companyIds": this.form2.companyIdsDiy,
                "recompute": false
              }

              this.cashSubmit_Fn(params)
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        }
        if (this.$route.meta.type == -2) {
          if (this.options_company.length > 1) {
            this.form2Rules.companyIdsDiyNew[0].message = '请选择兑现公司，可多选'
          }
          this.$refs['form2'].validate((valid) => {
            if (valid) {

              let params = {
                "authorIds": this.form2.authorIds,
                "canCalculate": false,
                "companyIds": this.form2.companyIdsDiyNew,
                "recompute": true
              }
              params.companyIds = params.companyIds.join('-')
              validate_author_cashData(params.authorIds, params.companyIds).then(response => {
                if (response.data.items) {
                  params.companyIds = params.companyIds.split('-')
                  this.cashSubmit_Fn(params)
                } else {
                  this.$message({message: response.data.msg, type: 'error'})
                  return
                }
              })

            } else {
              console.log('error submit!!');
              return false;
            }
          });
        }
      },
      errorClose(){
        setTimeout(() => {
          this.dialogVisible = true
        }, 400)
      },
      //选择作品id、作者id
      changeBookid(){
//        console.log(this.form1.bookIds)
        if (this.form1.bookIds != undefined) {
          this.form1.bookIds.length > 1 && (this.form1.bookIds.shift())
          paylogtypeData(this.bookcpId).then(response => {
            if (response.data.items) {
              this.disabled = false
              if (response.data.items) {
                this.form1.payLogTypesDiy = []
                this.payLogDisabled = response.data.items.split('-')
              }
            }
          })
        }
        if (this.form2.authorIds != undefined && this.form2.authorIds.length > 1) {
          this.form2.authorIds.shift()
        }
      },
      //重算作品查询
      fuzzyBookid(value){
        this.errorMessage = null
        value = value.replace(/(^\s*)/g, "")
        if (value === '') {
          this.fuzzyBookList = []
          this.fuzzyLoading = false
          return
        }
        this.fuzzyLoading = true
        clearInterval(this.timer)
        if (/[^0-9]/g.test(value)) {
          this.fuzzyLoading = false
          this.noDataText = '请输入正确ID'
          return
        }
        this.timer = setTimeout(() => {
          checkBookid(value, this.form1.companyId).then(res => {
            this.fuzzyLoading = false
            this.fuzzyBookList = []
            let temp = res.data.items
//            console.log(temp)
            if (temp) {
              this.bookcpId = res.data.items.cpId
              this.fuzzyBookList.push({
                value: temp.bookId,
                label: temp.bookName,
                bookName: temp.bookName,
                cpName: temp.cpName
              })
            } else {
              this.noDataText = res.data.msg
            }
          })

        }, 500)
      },
      //重兑作者查询
      fuzzyAuthorid(value){
        this.errorMessage = null
        value = value.replace(/(^\s*)/g, "")
        if (value === '') {
          this.fuzzyBookList2 = []
          this.fuzzyLoading = false
          return
        }
        let companyIds = this.form2.companyIdsDiyNew.join('-')
        if (companyIds == '') {
          this.errorMessage = '请选择公司'
          return

        }
//        console.log(companyIds)
        if (/[^0-9]/g.test(value)) {
          this.fuzzyLoading = false
          this.noDataText = '请输入正确ID'
          return
        }
        this.fuzzyLoading = true
        clearInterval(this.timer)
        this.timer = setTimeout(() => {

          checkAuthorid(value, companyIds).then(res => {
            this.fuzzyLoading = false
            this.fuzzyBookList2 = []
            if (res.data.items) {
              let temp = res.data.items
              this.fuzzyBookList2.push({
                value: temp.authorId,
                label: temp.authorPenName,
                penName: temp.authorPenName
              })
            } else {
              this.noDataText = res.data.msg
            }
          })
        }, 500)
      },

      //重算选择范围
      handleCheckAllChange(val) {
//        console.log(val)
        if (val == 1) {
          this.form1.cpsDiy = val ? this.options_cp.text : [];
          this.isIndeterminate = false;
          this.form1.cpsText = '所有' + this.options_cp.text.join('/') + '作品'
          this.form1.bookIds = undefined
        }
        this.form1.cpsIdDiy = this.form1.cps
        this.payLogDisabled = []
      },
      //重算选择范围cp
      cpChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        checkedCount == 0 && (this.form1.resource = undefined)

        //确定窗cp的参数
        let lists = this.options_cp.obj
        let arr = []
        value.map((item1) => {
          let temp = lists.find(function (item2) {
            return item1 == item2.text;
          })
          temp && arr.push(temp.value)
          return arr
        })
//        console.log(arr)
        this.form1.cpsText = '所有' + value.join('/') + '作品'
        this.form1.cpsIdDiy = arr

        this.disabled = true
        var params = arr.join('-')
        if (arr.length == 0) {
          this.disabled = false
        } else {
          paylogtypeData(params).then(response => {
            if (response.data.items) {
              this.disabled = false
              if (response.data.items) {
                this.form1.payLogTypesDiy = []
                this.payLogDisabled = response.data.items.split('-')
              }
            }
          })
        }

      },
      //重算选择类型
      typeChange(val){
        this.form1.payLogTypesDiy = val
        //确定窗显示的稿费类型文本
        let lists = this.options_type
        let arr = []
        this.form1.payLogTypesDiy.map((item1) => {
          let temp = lists.find(function (item2) {
            return item1 == item2.value;
          })
          temp && arr.push(temp.text)
          return arr
        })
        this.form1.typeText = arr.join('、')
      },
      //兑现、重兑现选择公司
      companyChange(val){
//        console.log(val)
        this.form2.companyIdsDiy = val
        this.form2.companyIdsDiyNew = val
      },
    },
    filters: {
      bookIdsFilter(value){
        value && (value = value.toString())
        return value
      },
    },

  }

</script>
<style scoped>
  .title {
    height: 40px;
    border-bottom: 1px solid #EFF2F7;
    color: #1b2d3f;
    font-size: 18px;
    line-height: 32px;
    font-weight: 500;
    clear: both;
    padding: 0px 0px 0 0px;
    background: #ffffff;
  }

  .create, .download {
    float: right;
    margin-top: 0px;
    margin-left: 10px;
    font-size: 14px;
  }

  .text {
    float: left;
    font-size: 16px;
  }

  .errmsg {
    height: 20px;
    margin-left: 20px;
    color: #fa5555;
    padding-left: 110px;
    margin-top: -16px;
    margin-bottom: 0px;
  }
</style>
