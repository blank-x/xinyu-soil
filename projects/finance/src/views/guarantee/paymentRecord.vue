<template>
  <div class="app-container welfare">
    <!--标题-->
    <el-row class="title">
      <span class="text">{{this.$route.name}}</span>
      <el-button :disabled="canCalculate==false"
                 v-has="permission.add"
                 @click="addCost()"
                 class="download" type="primary" :style="appConfig.btnStyle120"
                 icon="el-icon-plus">添加稿费
      </el-button>
    </el-row>
    <!--查询-->
    <searchItem :listQuery="list_params" :listLoading="listLoading" @resetForm="resetForm"
                :getList="getList"></searchItem>
    <!--列表-->
    <el-table :data="list"
              ref="listTable"
              size="small"
              :max-height="tableHeight"
              :empty-text="emptyText"
              v-loading="listLoading"
              element-loading-text="加载中.."
              border fit stripe highlight-current-row
              :header-cell-style="headerStyle"
              @header-click="headerClick"
              @filter-change="tableFilter_Fn"
              @sort-change="sort_Fn">

      <el-table-column label="所属月份" min-width="120" align="center">
        <template slot-scope="scope">
          {{scope.row.dealMonth | MonthsFilter}}
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
      <el-table-column label="作者ID" width="100" align="center">
        <template slot-scope="scope">
          <notEnabled :row="scope.row"></notEnabled>
          <!--<a target="_blank" :href="scope.row.authorId | createPeopleLink" class="hoverLink">{{scope.row.authorId}}</a>-->
        </template>
      </el-table-column>
      <el-table-column label="作者笔名" min-width="120" align="center">
        <template slot-scope="scope">
          <a target="_blank" :href="'http://www.motie.com/people/'+scope.row.authorId">{{scope.row.penName}}</a>
        </template>
      </el-table-column>
      <el-table-column label="所属CP" width="90" align="center">
        <template slot-scope="scope">
          {{scope.row.cpIdText}}
        </template>
      </el-table-column>
      <!--prop="sign" column-key="sign"
      :filters="[{ text: '已签约', value: 'true' }, { text: '未签约', value: 'false' }]"
      :filter-multiple="false"-->
      <el-table-column label="签约状态" width="90" align="center">
        <template slot-scope="scope">
          {{scope.row.signedText}}
        </template>
      </el-table-column>
      <el-table-column label="稿费类型" min-width="90" align="center">
        <template slot-scope="scope">
          {{scope.row.typeText}}
        </template>
      </el-table-column>
      <el-table-column label="稿费" width="90" align="center">
        <template slot-scope="scope">
          {{scope.row.moneyText}}
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="90" align="center">
        <template slot-scope="scope">
          <textEllipsis :text="scope.row.remark | remarkFilter"></textEllipsis>
          <!--{{scope.row.remark}}-->
        </template>
      </el-table-column>
      <el-table-column label="比对状态" width="90" align="center" prop="compareStatus" column-key="compareStatus"
                       :filters="[{ text: '比对', value: 'true' }, { text: '不比对', value: 'false' }]"
                       :filter-multiple="false">
        <template slot-scope="scope">
          <!--{{scope.row.compareStatusText}}-->
          <span v-text="scope.row.compareStatus?'比对':'不比对'"></span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" minWidth="150" align="center"
                       prop="createTime" sortable="custom"></el-table-column>
      <el-table-column label="操作" width="110" align="center"
                       :resizable="false"
                       :fixed="list.length==0?false:'right'">
        <template slot-scope="scope">
          <el-button v-if="lockedArr.indexOf(scope.row.cpId)!==-1"
                     type="text"
                     v-has="permission.compareStatus"
                     @click="force_Fn(scope.row.id,scope.row.compareStatus)">
            <span v-text="scope.row.compareStatus?'不比对':'比对'"></span>
          </el-button>
          <el-button type="text" v-if="lockedArr.indexOf(scope.row.cpId)==-1" disabled>已锁定</el-button>
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
    <!--添加稿费-->
    <el-dialog title="添加稿费" :visible.sync="addDialogVisual" width="860px"
               :close-on-click-modal="false"
               custom-class="partnerA-add-dialog">
      <el-form class="small-space"
               :model="addForm" label-width="130px"
               :rules="addAuditRules" ref="addForm"
               style="margin-left: 50px;">
        <el-form-item prop="bookId" :error="errorMessage" label="作品ID :"
                      class="encorrect-eltag-bug no-required-star">
          <el-select style="width:240px;color: red!important;"
                     v-model="addForm.bookId"
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
              :label="item.value"
              :value="item.value">
              <span>作品名称：{{item.name}}
                <i style=" font-style:normal; font-size: 14px; margin-left: 15px"> 所属CP：{{item.cpName}}</i>
              </span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="稿费 :"  prop="money" class="no-required-star">
          <el-input style="width:240px" v-model="addForm.money">
            <template slot="append">￥</template>
          </el-input>
        </el-form-item>

        <el-form-item label="选择月份 :" prop="dealMonth" class="datepicker-item no-required-star">
          <el-date-picker
            :editable="false"
            value-format="yyyyMM"
            format="yyyy-MM"
            v-model="addForm.dealMonth"
            :picker-options="dialogPickerOptions"
            type="month"
            style="width: 240px"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="备注 :" style="max-width: 600px" prop="remark" class="no-required-star">
          <textareaSize placeholder="请填写备注，1-200字" v-model="addForm.remark"
                        :autosize="{minRows:2,maxRows:5}" :maxSize="200"></textareaSize>
        </el-form-item>

        <el-row>
          <el-col :span="24">
            <el-form-item label="" label-width="0" style="float: right;margin-bottom: 2px;">
              <el-button type="primary" @click="add_Fn" :loading="addloading">添 加</el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {guarantee_pay_logsList, fetchComparison, permission,guaranteeAdd} from '@/api/guarantee'//接口
  import {locksList} from '@/api/locks'//接口
  import {mapGetters} from 'vuex'
  import tableMixin from '@/mixins/tableHeight'
  import searchItem from './searchPublic'

  import {convertDic, getCpInfo, deepClone, getLastMonthYestdy,getCurrentMonth} from '@/utils'
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import textareaSize from '@/views/components/textareaSize'
  import {searchBookInfoById} from '@/api/common'
  import {calculateData, permissionCal} from '@/api/settlement'

  export default {
    mixins: [tableMixin],
    components: {
      ElButton,
      searchItem,
      textareaSize
    },
    data() {
      let validator_money = (rule, value, callback) => {
        let reg = /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/
        if (!reg.test(value)) {
          return callback(new Error('稿费填写格式不正确'))
        }
        return callback()
      }
      return {
        // 稿费 验证
        permission: permission,//权限
        permissionCal: permissionCal,//权限
        emptyText: '',//无数据提示
        init: true,
        titleParams: {
          title: this.$route.name,
        },//表头信息
        listLoading: true,//懒加载
        headerStyle: this.appConfig.HEADER_STYLE,//表头样式
        list: [],//内容列表数据
        page_list: '',//列表翻页数据
        list_params: {
          "query": {
            "allowPay": undefined,
            "authorId": undefined,
            "bookId": undefined,
            "bookName": undefined,
            "cpId": undefined,
            "dealMonth": getLastMonthYestdy(),
            "type": undefined,
            "cpIdText": undefined,
            "finish": undefined,
            "finishText": undefined,
            "force": undefined,
            "penName": undefined,
            "price": undefined,
            "settlement": undefined,
            "signed": undefined,
            "signedText": undefined,
            "sumMoney": undefined,
            "id": undefined,
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
        lockedArr: [],
        addForm: {
          bookId: [],
          money: null,
          dealMonth: getCurrentMonth(),
          remark: null,
        },
        addloading: false,
        //  模糊查询 loading
        fuzzyLoading: false,
        fuzzyBookList: [],
        // 添加稿费验证规则
        addAuditRules: {
          money: [{required: true, message: '请填写稿费'}, {validator: validator_money, trigger: 'blur'}],
          dealMonth: [{required: true, message: '请选择所属月份', trigger: 'blur'}],
          remark: [{required: true, message: '不能为空'}]
        },
        addDialogVisual: false,
        dialogPickerOptions: {
          disabledDate(time) {
//            var date = new Date()
//            var
//              Y = date.getFullYear() + '-',
//              M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth()) : date.getMonth()) + '-',
//              D = date.getDate() + ' ',
//              h = date.getHours() + ':',
//              m = date.getMinutes() + ':',
//              s = date.getSeconds()
//            var lastData = new Date(Y + M + D + h + m + s).getTime()
//            return time.getTime() >= lastData;
            return time.getTime() > Date.now();
          }
        },//查询月份限制
        canCalculate: false,//是否在计算稿费
        errorMessage: null,
        fuzzyLoading: false,
        fuzzyBookList: [],
        noDataText: undefined,
        timer: null,
      }
    },
    created() {
      this.getList()
    },
    computed: {
//      字典调用方法
      ...mapGetters([
        'cpInfo',
        'dicList',
        'resourcePermission'
      ]),
      //稿费类型
      options_type: function () {
        let lists = convertDic(this.dicList, '31')
        lists.forEach((item) => {
          if (item.value == 0) {
            item.value = undefined
          }
        })
        return lists
      },
      //上个月份
      lastMonths: function () {
        let now = new Date();
        let monthn = now.getMonth().toString()
        let yearn = now.getFullYear().toString()
        monthn < 10 ? monthn = '0' + monthn : monthn
        return yearn + monthn
      }
    },
    methods: {
      //计算稿费权限
      checkPermission(){
        let falg = false
        for (let key in this.resourcePermission) {
          if (key == this.permissionCal.calculate[0] || key == this.permissionCal.author_cash[0]) {
            falg = this.resourcePermission[key];
            break;
          }
        }
        if (falg) {
          calculateData().then(response => {
            if (response.data.status == 200) {
              this.canCalculate = response.data.items.canCalculate
            } else {
//            this.$message({message: response.data.msg, type: 'error'})
            }
          })
        }
      },
      //列表数据-接口
      getList() {
        this.checkPermission()
        this.locks_Fn()
        this.listLoading = true
        guarantee_pay_logsList(this.list_params).then(response => {
          this.listLoading = false
          this.list = response.data.items
          //翻页数据
          this.page_list = response.data.paginate

        })
        if (this.init) {
          this.emptyText = '暂无数据'
          this.init = false
        } else {
          this.emptyText = '查询无结果'
        }
      },
      //锁定
      locks_Fn(){
        locksList().then(response => {
          response.data.items.map((item1) => {
            if (item1.locked == false) {
              this.lockedArr.push(item1.cpId)
            }
          })
        })
      },
      //翻页每页数条
      handleSizeChange(val) { //每页数条
        this.list_params.page.pageSize = val
        this.listData()
        //        console.log('每页 ' + val + '条');
      },
      //翻页当前页
      handleCurrentChange(val) {//翻页 当前页
        this.list_params.page.pageNo = val
        this.listData()
        //        console.log('当前页: ' + val);
      },
      //比对、不比对
      force_Fn(id, state){
        if (!state) {
          this.$confirm('确定设置为比对？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal: false
          }).then(() => {
            fetchComparison({compareStatus: !state, id: id}).then(response => {
              if (response.data.status == 200) {
                if (response.data.items) {
                  this.$message({
                    message: '比对操作成功',
                    type: 'success',
                    onClose: () => {
                      this.getList()//刷新数据
                    }
                  })
                } else {
                  this.$message({
                    message: response.data.msg,
                    type: 'warning',
                  })
                }
              }
            })
          }).catch(() => {
          });
        } else {
          this.$confirm('确定设置为不比对？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal: false
          }).then(() => {
            fetchComparison({compareStatus: !state, id: id}).then(response => {
              if (response.data.status == 200) {
                if (response.data.items) {
                  this.$message({
                    message: '不比对操作成功',
                    type: 'success',
                    onClose: () => {
                      this.getList()//刷新数据
                    }
                  })
                } else {
                  this.$message({
                    message: response.data.msg,
                    type: 'warning',
                  })
                }
              }
            })
          }).catch(() => {
          });
        }
      },

      //重置
      resetForm(formName) {
        this.$refs['listTable'].clearFilter();
        this.$refs['listTable'].clearSort();
//        this.tableFilter_Fn()
        this.sort_Fn()
        this.list_params.query.sign = undefined
        this.list_params.query.compareStatus = undefined
        this.getList()
      },
      //筛选
      tableFilter_Fn(key){
        if (key.sign) {
          this.list_params.query.sign = key.sign[0]
        }
        if (key.compareStatus) {
          this.list_params.query.compareStatus = key.compareStatus[0]
        }
        this.getList()
      },
      //排序
      sort_Fn(column){
//        console.log(column)
        if (column) {
          this.list_params.sort.orderByField = column.prop
          column.order == 'descending' && (this.list_params.sort.orderDirect = "desc")
          column.order == 'ascending' && (this.list_params.sort.orderDirect = "asc")
          column.order == null && (this.list_params.sort.orderByField = "id")
          this.getList()
        } else {
          this.list_params.sort.orderByField = "id"
          this.list_params.sort.orderDirect = "desc"
        }
      },
      //添加稿费
      addCost(){
        this.$refs['addForm'] && this.$refs['addForm'].resetFields();
        this.addDialogVisual = true
      },

      //选择作品id、作者id
      changeBookid(){
        if (this.addForm.bookId != undefined && this.addForm.bookId.length > 1) {
          this.addForm.bookId.shift()
          this.errorMessage = null
        } else {
          this.errorMessage = '请填写作品ID'
        }
      },
      // 模糊搜索方法
      fuzzyBookid(value){
        this.fuzzyLoading = true
        this.errorMessage = null
        value = value.replace(/(^\s*)/g, "")
        if (value == '') {
          this.fuzzyBookList = []
          this.fuzzyLoading = false
        }
        clearInterval(this.timer)
        if (!(/^\d+$/.test(value)) || value.indexOf(0) == 0) {
          this.fuzzyLoading = false
          this.noDataText = '请输入正确ID'
          return
        }
        this.timer = setTimeout(() => {
          searchBookInfoById(value).then(res => {
            this.fuzzyLoading = false
            this.fuzzyBookList = []
            if (res.data.items) {
              this.fuzzyBookList.push({
                value: res.data.items.id,
                cpName: res.data.items.cpName,
                name: res.data.items.name,
              })
            } else {
              this.noDataText = res.data.msg
            }
          })

        }, 500)
      },
      //添加
      add_Fn() {
        if (this.addForm.bookId.length == 0) {
          this.errorMessage = '请填写作品ID'
        } else {
          this.errorMessage = null
        }
        this.$refs['addForm'].validate((valid) => {
          if (valid) {
            if (this.addForm.bookId.length == 0) {
              return
            }
            this.addloading = true
            //添加

            let temp = {
              "authorId": undefined,
              "bookId": this.addForm.bookId.toString(),
              "compareStatus": false,
              "dealMonth":this.addForm.dealMonth,
              "money":this.addForm.money,
              "remark":this.addForm.remark,
              "type": undefined,
              "id": undefined
            };
            temp.money.indexOf(".")!=-1&&(temp.money=temp.money.substr(0,temp.money.indexOf(".")+3))
            temp.money=temp.money*100
            guaranteeAdd(temp).then(
              response => {
                if (response.data.status == 200) {
                  if (response.data.items) {
                    this.addDialogVisual = !this.addDialogVisual
                    this.$message({
                      message: '添加成功',
                      type: 'success',
                      duration: 2000
                    });
                    this.getList()
                  } else {
                    this.errorMessage = response.data.msg
                  }
                }
                this.addloading = false
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
    },
    filters: {
      remarkFilter(value){
        value = value.toString()
        return value
      }
    }

  }
</script>
<style lang="scss" scoped>
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

  .text {
    float: left;
    font-size: 16px;
  }

  .download {
    float: right;
    margin-top: 0px;
    margin-left: 10px;
    font-size: 14px;
  }
</style>
