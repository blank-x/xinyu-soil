<template>
  <div class="filter-container">
      <el-form :inline="true" :model="listQuery" ref="listQuery" label-position="right">
         <el-row :gutter="0">
            <el-col :sm="10" :md="7" :lg="5">
                <el-form-item label="作品ID :" prop="query.bookId">
                    <el-input placeholder="作品ID" :maxlength="10"  @keyup.enter.native="getList"   size="small" v-model="listQuery.query.bookId"></el-input>
                </el-form-item>
            </el-col>
             <el-col :sm="10" :md="7" :lg="5">
                 <el-form-item label="作品名称 :" prop="query.bookName">
                     <el-input placeholder="作品名称" :maxlength="10"  @keyup.enter.native="getList"   size="small" v-model="listQuery.query.bookName"></el-input>
                 </el-form-item>
             </el-col>
            <el-col :sm="10" :md="7" :lg="5">
                <el-form-item label="作者ID :" prop="query.authorId">
                    <el-input placeholder="作者ID" :maxlength="10" @keyup.enter.native="getList"   size="small" v-model="listQuery.query.authorId"></el-input>
                </el-form-item>
            </el-col>
             <el-col :sm="10" :md="7" :lg="5">
                 <el-form-item label="作者名称 :" prop="query.penName">
                     <el-input placeholder="作者名称" :maxlength="10"  @keyup.enter.native="getList"   size="small" v-model="listQuery.query.penName"></el-input>
                 </el-form-item>
             </el-col>
            <el-col :sm="12"   :md="10" :lg="9" >
                <el-form-item :label="$route.path.indexOf('logs')!=-1?'审核日期 :':'申请日期 :'" prop="value4" class="datepicker-item">
                    <el-date-picker
                            @change="setQueryVal"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            range-separator="-"
                            v-model="value4"
                            type="datetimerange"
                            :clearable="false"
                            :editable="false"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :sm="12"  :lg="{span:5}" :md="{span:24 }" >
                <el-form-item class="search-btn-padding">
                    <search @search="getList" :listLoading="listLoading"></search>
                    <reset  @reset="resetForm('listQuery')"></reset>
                </el-form-item>
            </el-col>
         </el-row>
      </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
  import waves from '@/directive/waves.js'// 水波纹指令
  export default {
    data() {
      return {
        value4:"",
      /*  pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }*/
      }
    },
    directives: {
      waves
    },
    computed: {

    },
    methods: {
      /**
       * 重置查询条件
       * @param formName
       */
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$emit('resetForm',formName);
      },
      /**
       * 设置时间查询条件
       * @param val
       */
      setQueryVal(dataTimeStr){
        if (dataTimeStr) {
          this.listQuery.query.beginTime = dataTimeStr[0]
          this.listQuery.query.endTime = dataTimeStr[1]
        } else {
          this.listQuery.query.beginTime = undefined
          this.listQuery.query.endTime = undefined
        }
      },
    },
    props: [ 'listQuery','listLoading','getList'],
    watch:{
      'listQuery.query.bookId': function (val, oldVal)
      {
        if(val){
          let content = val.replace(/[^0-9]/g, '');
          setTimeout(() => {
            this.listQuery.query.bookId = content
          }, 0)
        }
      },
      'listQuery.query.authorId': function (val, oldVal) {
          if(val){
            let content = val.replace(/[^0-9]/g, '');
            setTimeout(() => {
              this.listQuery.query.authorId = content
            }, 0)
          }
      },
    },
  }
</script>
