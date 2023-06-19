<template>
  <div class="filter-container">
    <el-form :inline="true" :model="listQuery" ref="listQuery" label-width="71px">
      <el-row :gutter="0">
        <el-col :span="6">
          <el-form-item label="作品ID :" prop="query.bookId">
            <el-input placeholder="作品ID" :maxlength="10" @keyup.enter.native="getList" size="small"
                      v-model="listQuery.query.bookId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="作者ID :" prop="query.authorId">
            <el-input placeholder="作者ID" :maxlength="10" @keyup.enter.native="getList" size="small"
                      v-model="listQuery.query.authorId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属CP :" prop="query.cpId">
            <el-select v-if="options_cp.length>1" v-model="listQuery.query.cpId" placeholder="请选择">
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
        <el-col :span="6" v-if="this.$route.name==='非保底稿费记录'">
          <el-form-item label="稿费类型 :" prop="query.type">
            <el-select v-model="listQuery.query.type" placeholder="请选择">
              <el-option
                v-for="item in options_type"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>

          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="this.$route.name==='保底作品列表'">
          <el-form-item label="当前结算 :" prop="query.settlement">
            <el-select v-model="listQuery.query.settlement" placeholder="请选择">
              <el-option
                v-for="item in settlement_Dic"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="6" v-if="this.$route.name==='非保底稿费记录'">
          <el-form-item label="所属月份:" prop="query.dealMonth" class="datepicker-item">
            <el-date-picker
              value-format="yyyyMM"
              format="yyyy-MM"
              v-model="listQuery.query.dealMonth"
              :picker-options="pickerOptions"
              :editable="false"
              type="month"
              placeholder="选择月">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="this.$route.name==='保底作品列表'">
          <!--<el-form-item label="添加日期 :" prop="value4" class="datepicker-item">
            <el-date-picker
              @change="setQueryVal"
              value-format="yyyyMMddHHmmss"
              format="yyyy-MM-dd"
              range-separator="-"
              v-model="value4"
              type="datetimerange"
              :clearable="false"
              :editable="false"
              :picker-options="pickerOptions"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </el-form-item>-->
          <el-form-item label="添加日期 :" prop="query" style="margin-bottom: -5px;">
            <el-date-picker
              range-separator="-"
              v-model="timestamp"
              type="daterange"
              :editable="false"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="float: right">
          <el-form-item class="search-btn-padding">
            <search @search="getList" :listLoading="listLoading"></search>
            <reset @reset="resetForm('listQuery')"></reset>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
  import waves from '@/directive/waves.js'// 水波纹指令
  import {mapGetters} from 'vuex'
  import {parseTime, convertDic, getCpInfo} from '@/utils'
  export default {
    data() {
      return {
        value4: '',
        timestamp: [],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        //结算类型
        settlement_Dic: [{
          value: undefined,
          label: '全部'
        }, {
          value: 'false',
          label: '结算保底'
        }, {
          value: 'true',
          label: '结算非保底'
        }],

      }
    },
    directives: {
      waves
    },
    created() {
//      if (this.options_cp.length <= 1) {
//        this.listQuery.query.cpId = this.options_cp[0].value
//      }
    },
    computed: {
      //      字典调用方法
      ...mapGetters([
        'cpInfo',
        'dicList'
      ]),
      //cp
      options_cp: function () {
        let lists = getCpInfo(this.dicList, '5', this.cpInfo);
        console.log(lists)
        if (lists.length > 2) {
          lists.forEach((item) => {
            if (item.value == 0) {
              item.value = undefined
            }
          })
        } else {
          lists.shift()
          this.listQuery.query.cpId=lists[0].value
        }
        return lists//根据权限显示
      },
      //稿费类型
      options_type: function () {
        /*let lists = convertDic(this.dicList, '31')
         lists.forEach((item) => {
         if (item.value == 0) {
         item.value = undefined
         }
         })
         return lists*/

        return [
          {value: undefined, text: "全部", remark: null},
          {value: 1, text: "订阅分成", remark: null},
          {value: 2, text: "打赏分成", remark: null},
          {value: 27, text: "合作渠道分成", remark: null},
          {value: 28, text: "来看阅读分成", remark: null},
          {value: 0, text: "其他", remark: null},
        ]

      },
    },
    methods: {
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$emit('resetForm', formName);
        this.timestamp = []
        this.listQuery.query.beginDate = undefined
        this.listQuery.query.endDate = undefined
      },

//      setQueryVal(dataTimeStr){
//        if (dataTimeStr) {
//          this.listQuery.query.beginDate = dataTimeStr[0]
//          this.listQuery.query.endDate = dataTimeStr[1]
//        } else {
//          this.listQuery.query.beginDate = undefined
//          this.listQuery.query.endDate = undefined
//          this.value4 = ''
//        }
//      },
    },
    props: ['listQuery', 'listLoading', 'getList'],
    watch: {
      'listQuery.query.bookId': function (val, oldVal) {
        if (val) {
          let content = val.replace(/[^0-9]/g, '');
          setTimeout(() => {
            this.listQuery.query.bookId = content
          }, 0)
        }
      },

      'listQuery.query.authorId': function (val, oldVal) {
        if (val) {
          let content = val.replace(/[^0-9]/g, '');
          setTimeout(() => {
            this.listQuery.query.authorId = content
          }, 0)
        }
      },
      timestamp(value) {
        if (value && value.length > 0) {
          this.listQuery.query.beginDate = parseTime(value[0], '{y}-{m}-{d} 00:00:00')
          this.listQuery.query.endDate = parseTime(value[1], '{y}-{m}-{d} 23:59:59')
        } else {
          this.listQuery.query.beginDate = undefined
          this.listQuery.query.endDate = undefined
        }
      },
    },
  }
</script>
