<template>
  <div class="app-container welfare">
    <!--标题-->
    <contentTitle :titleParams="titleParams"></contentTitle>
    <!--查询-->
    <searchItem :listQuery="list_params" :listLoading="listLoading" @resetForm="resetForm"
                :getList="getList"></searchItem>
    <!--列表-->
    <el-table :data="list"
              ref="listTable"
              style="width: 100%"
              size="small"
              :max-height="tableHeight"
              :empty-text="emptyText"
              v-loading="listLoading"
              element-loading-text="加载中.."
              border fit stripe highlight-current-row
              :header-cell-style="headerStyle"
              @filter-change="tableFilter_Fn"
              @sort-change="sort_Fn">

      <el-table-column label="作品ID" width="100" align="center">
        <template slot-scope="scope">
          <router-link target="_blank" :to="{ path: '/works/bookInfo/'+scope.row.bookId}">{{scope.row.bookId}}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="作品名称" minWidth="120" align="center">
        <template slot-scope="scope">
          <a target="_blank" :href="'http://www.motie.com/book/'+scope.row.bookId">{{scope.row.name}}</a>
        </template>
      </el-table-column>
      <el-table-column label="作者ID" width="100" align="center">
        <template slot-scope="scope">
          <notEnabled :row="scope.row"></notEnabled>

          <!--<a target="_blank" :href="scope.row.authorId | createPeopleLink"  class="hoverLink">{{scope.row.authorId}}</a>-->
        </template>
      </el-table-column>
      <el-table-column label="作者笔名" min-width="120" align="center">
        <!--<template slot-scope="scope">-->
        <!--{{scope.row.penName}}-->
        <!--</template>-->
        <template slot-scope="scope">
          <a target="_blank" :href="'http://www.motie.com/people/'+scope.row.authorId">{{scope.row.penName}}</a>
        </template>
      </el-table-column>
      <el-table-column label="所属CP" width="90" align="center"
                       v-if="cp_Dic!=undefined && cp_Dic.length<2">
        <template slot-scope="scope">
          <span v-for="item in cp_Dic" v-if="scope.row.cpId==item.value" :key="Math.random()">{{item.text}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属CP" width="90" align="center" prop="cpId"
                       :filters="cp_Dic"
                       column-key="cpId"
                       v-else>
        <template slot-scope="scope">
          <span v-for="item in cp_Dic" v-if="scope.row.cpId==item.value" :key="Math.random()">{{item.text}}</span>
        </template>
      </el-table-column>
      <el-table-column label="完结状态" width="90" align="center" prop="tag" column-key="finish"
                       v-if="this.$route.meta.type != 2">
        <template slot-scope="scope">
          <span v-text="scope.row.finish?'已完结':'连载中'"></span>
        </template>
      </el-table-column>
      <el-table-column label="签约状态" width="90" align="center">
        <template slot-scope="scope">{{scope.row.signedName}}</template>
      </el-table-column>
      <el-table-column label="当前结算" align="center"
                       minWidth="150"
                       prop="createTime"
                       sortable="custom">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="强制保底" align="center"
                       minWidth="150"
                       prop="createTime"
                       sortable="custom">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="字数" width="90" align="center">
        <template slot-scope="scope">
          {{scope.row.words | words_Filter}}
        </template>
      </el-table-column>
      <el-table-column label="千字价格(元)" align="center"
                       minWidth="150"
                       v-if="this.$route.meta.type != 2">
        <template slot-scope="scope">
          <span v-if="scope.row.finish">{{scope.row.finishTime}}</span>
          <span v-else>------</span>
        </template>
      </el-table-column>
      <el-table-column label="合计保底" width="90" align="center">
        <template slot-scope="scope">
          <span v-if="$route.meta.type==2">申请完本</span>
          <span v-else>{{$route.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="合计非保底" width="90" align="center">
        <template slot-scope="scope">
          <span v-if="$route.meta.type==2">申请完本</span>
          <span v-else>{{$route.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" align="center"
                       minWidth="150"
                       v-if="list_params.query.inspectStatus[0]!=0">
        <template slot-scope="scope">
          <p v-if="scope.row.inspectTime==null">------</p>
          <p v-else>{{scope.row.inspectTime}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" align="center" :resizable="false"
                       :fixed="list.length==0?false:'right'"
                       v-if="operation_Visible">
        <template slot-scope="scope">
          <el-button type="text"  @click="via_Fn(scope.row.id,scope.row.bookId)">通过
          </el-button>
          <span class="split_span">|</span>
          <el-button type="text"  @click="reject_Fn(scope.row.id) ">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  //  import {fetchList, resultList, chapterList, finishList, permission} from '@/api/welfare'//福利审核接口
  import {mapGetters} from 'vuex'
  import {convertDic, getCpInfo, deepClone} from '@/utils'
  import tableMixin from '@/mixins/tableHeight'
  //  import textareaSize from '@/views/components/textareaSize' // textarea
  import searchItem from '../components/searchItem'
  export default {
//    mixins: [tableMixin],
    components: {searchItem},
    data() {
      return {
        tableHeight: '',//表格头的浮动设置的最大高度
        emptyText: this.appConfig.EMPTY_TEXT,//无数据提示
        headerStyle: this.appConfig.HEADER_STYLE,//表头样式

//        permission: permission,//权限
        listLoading: true,//懒加载
        chapterLoading: true,//十条章节加载
        list: null,//内容列表数据
        chapter_list: '',//十条章节数据
        page_list: '',//列表翻页数据
        pageSize: this.appConfig.PAGE_SIZE,//翻页显示页数
        auditId: '',//审核ID
        bookId: '',//作品ID
        inspectStatusSearch: '0',//查询审核状态
        titleParams: {
          title: this.$route.name,
        },//表头信息

        list_params: {
          "query": {
            "type": this.$route.meta.type,
            "bookId": '',
            "authorId": '',
            "inspectStatus": ["0"],
            "open": [],
            "finish": [],
            "cpId": [],
            "signed": []
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
        inspect_params: {
          "inspectStatus": "",
          "remark": '',
          //          "type":this.$route.meta.type
        },//审核通过、驳回传入参数
        finishTime_params: {
          "finishTime": "",
          "inspectStatus": "1"
        },//完本审核选择的通过时间传入参数
        inspectStatus_Dic: [{
          value: '0',
          label: '待审核'
        }, {
          value: '1',
          label: '审核通过'
        }, {
          value: '-1',
          label: '审核不通过'
        }],//审核字典
        operation_Visible: false,//操作功能显隐
        remark_Visible: true,//理由字段在完本审核中的显隐
        page_Visible: true,//无列表数据时翻页显隐
        viaWindow_Visible: false,//通过弹窗显隐
        rejectWindow_Visible: false,//驳回弹窗显隐
        inspectInfo_Visible: false,//审核、驳回信息输入错误提示显隐
        finishTime_Visible: false,//设置完本时间错误提示显隐
        sort_Switch: true,//排序方法转换开关
        element: null,

        word: 0,//通过字数

        rejectRules: {
          remark: [{required: true, trigger: 'blur,change', message: '请填写通过理由，2-30个字'},
            {min: 2, max: 50, message: '请填写通过理由，2-30个字', trigger: 'blur,change'}]
        },
      }
    },
    created() {
//      this.listData()
    },
    computed: {
      //      字典调用方法
      ...mapGetters([
        'cpInfo',
        'dicList'
      ]),
      //cp
      cp_Dic: function () {
        let cplists = getCpInfo(this.dicList, '5', this.cpInfo);
        let cplistsSplice = deepClone(cplists)
        if (cplistsSplice.length > 2) {
          cplistsSplice.splice(0, 1)
        }
//        console.log(cplistsSplice)
        return cplistsSplice//根据权限显示
      },
    },
    /*filters: {
     //理由内容超出12个字
     remarkContent_Fn: function (value) {
     if (value != null && value.length > 24) {
     value = value.slice(0, 22) + '...'
     return value
     }
     return value
     }
     },*/
    methods: {
      //列表数据-接口
      getList() {
//        this.listLoading = true
//        fetchList(this.list_params).then(response => {
//          this.listLoading = false
//          //内容列表数据
//          this.list = response.data.items
//        })
        alert()
      },
      resetForm(formName) {
        this.$children[1].$refs[formName].resetFields();
        this.$children[1].value4 = "";
        this.$refs['listTable'].clearFilter();
        this.$refs['listTable'].clearSort();
        this.listQuery.query = deepClone(this.defaultQuery.query);
        this.listQuery.sort = deepClone(this.defaultQuery.sort)
        this.getList()
      },
      tableFilter_Fn(){

      },
      sort_Fn(){
      },
    }
    /*//审核通过、驳回结果-接口
     inspectData() {
     resultList(this.inspect_params, this.auditId).then(response => {
     if (response.data.status == 200) {
     this.$message({
     message: response.data.msg,
     type: 'success',
     onClose:()=>{
     this.inspect_params.remark = ''//清空审核信息内容
     this.viaWindow_Visible = false;//通过窗口显隐
     this.rejectWindow_Visible = false;//驳回窗口显隐
     this.word = 0//通过字数值
     this.listData()//刷新数据
     }
     })
     }
     }, response => {
     this.inspect_params.remark = ''//清空审核信息内容
     })
     },
     //十条章节&#45;&#45;接口
     chaptertData() {
     this.chapterLoading = true
     chapterList(this.bookId).then(response => {
     this.chapterLoading = false
     this.chapter_list = response.data.items
     })
     },
     //通过完本审核 &#45;&#45; 接口
     finishData() {
     this.finishTime_params.finishTime=this.finishTime_params.finishTime.substring(this.finishTime_params.finishTime.indexOf('/')+1)
     finishList(this.finishTime_params, this.auditId).then(response => {

     if (response.data.status == 200) {
     this.$message({
     message: response.data.msg,
     type: 'success',
     onClose:()=>{
     this.finishTime_params.finishTime = ''//清空设置完本时间
     this.inspectInfo_Visible = false;//输入错误提示
     this.viaWindow_Visible = false;//通过窗口显隐
     this.listData()//刷新数据
     }
     })

     }
     }, response => {
     this.finishTime_params.finishTime = ''//清空设置完本时间
     })
     },
     //查询
     search_Fn(){
     this.emptyText = this.appConfig.SEARCHEMPTY_TEXT//查询无结果提示 查询无结果
     this.list_params.query.inspectStatus = []//先清空
     this.list_params.query.inspectStatus.push(this.inspectStatusSearch)//再添加
     this.listData()//刷新数据
     },
     //重置
     reset_Fn(list_params){
     this.emptyText = this.appConfig.EMPTY_TEXT//无数据提示 暂无数据
     this.$refs[list_params].resetFields();
     this.inspectStatusSearch = "0"//重置表头审核状态
     this.list_params.query.inspectStatus = [0]//重置审核状态
     this.list_params.query.cpId = []//重置cp筛选
     this.list_params.query.open = []//重置上线状态筛选
     this.list_params.page.pageNo = 1//页码
     this.list_params.page.pageSize = 40//每页页数

     this.$refs.listTable.clearFilter()//重置筛选样式
     this.list_params.sort.orderByField = "id"
     this.list_params.sort.orderDirect = "desc"//重置排序顺序
     //两种样式时候
     //        if (this.element != null) {
     //          this.element.innerHTML =  '<div class="cell">申请时间<span class="caret-wrapper">' +
     //            '<i class="sort-caret el-icon-caret-top" style=" top: 5px;"></i>' +
     //            '<i class="sort-caret el-icon-caret-bottom" style="color:#1aaee5; bottom: 7px"></i>' +
     //            '</span></div>'
     //        }//重置排序样式
     this.listData()//刷新数据
     },
     //表格筛选
     tableFilter_Fn: function (key) {
     //cp
     this.emptyText = this.appConfig.SEARCHEMPTY_TEXT
     if (key.cpId) {
     if (key.cpId.indexOf(0) == -1) {
     this.list_params.query.cpId = key.cpId
     } else {
     this.list_params.query.cpId = []
     }
     console.log(this.list_params.query.cpId)
     }

     key.open && (this.list_params.query.open = key.open)//上线状态
     this.listData()
     },
     //排序
     sortClick_Fn(row){
     if (row.sortable == "custom") {
     if (this.sort_Switch) {
     this.list_params.sort.orderDirect == "desc" && (this.list_params.sort.orderDirect = "asc")
     this.sort_Switch = false
     }
     this.list_params.sort.orderByField = row.property
     let classname = row.id//当前单元格的classname
     this.element = document.getElementsByClassName(classname)[0]//当前单元格元素
     //通过改变原排序的内容
     if (this.list_params.sort.orderDirect == "desc") {
     this.element.innerHTML = '<div class="cell">申请时间<span class="caret-wrapper">' +
     '<i class="sort-caret el-icon-caret-top" style="color:#1aaee5; top: 5px;"></i>' +
     '<i class="sort-caret el-icon-caret-bottom" style=" bottom: 7px"></i>' +
     '</span></div>'
     this.list_params.sort.orderDirect = "asc"
     } else if (this.list_params.sort.orderDirect == "asc") {
     this.element.innerHTML = '<div class="cell">申请时间<span class="caret-wrapper">' +
     '<i class="sort-caret el-icon-caret-top" style=" top: 5px;"></i>' +
     '<i class="sort-caret el-icon-caret-bottom" style="color:#1aaee5; bottom: 7px"></i>' +
     '</span></div>'
     this.list_params.sort.orderDirect = "desc"
     } else {
     this.element.innerHTML = '<div class="cell">申请时间<span class="caret-wrapper">' +
     '<i class="sort-caret el-icon-caret-top" style="color:#1aaee5; top: 5px;"></i>' +
     '<i class="sort-caret el-icon-caret-bottom" style=" bottom: 7px"></i>' +
     '</span></div>'
     this.list_params.sort.orderDirect = "asc"
     }
     this.listData()//刷新数据
     }
     },//点击后 排序条件发生变化的事件失效
     sort_Fn(column, order, prop){
     if (this.sort_Switch) {
     this.list_params.sort.orderByField = column.prop
     column.order == 'descending' && (this.list_params.sort.orderDirect = "desc")
     column.order == 'ascending' && (this.list_params.sort.orderDirect = "asc")
     //          column.order == null && (this.list_params.sort.orderDirect = "")//两种样式时候
     column.order == null && (this.list_params.sort.orderDirect = "desc") && (this.list_params.sort.orderByField = "id")
     console.log(column, order, prop)
     this.listData()
     }
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

     //通过事件
     via_Fn(auditid, bookId){
     this.viaWindow_Visible = true//通过窗口显隐
     this.chapter_list = ''//先清空十条章节数据
     this.auditId = auditid
     this.bookId = bookId
     this.inspect_params.inspectStatus = 1//传入的审核状态
     this.$route.meta.type == 2 && (this.chaptertData(this.bookId))//调取最新十个章节
     },
     //驳回事件
     reject_Fn(auditid){
     this.rejectWindow_Visible = true//驳回窗口显隐
     this.auditId = auditid
     this.inspect_params.inspectStatus = -1//传入的审核状态
     },
     //审核、驳回通过
     inspectYes_Fn(formName){
     this.inspect_params.remark = this.inspect_params.remark.replace(/(^\s*)|(\s*$)/g, '');//去除空格
     this.emptyText = this.appConfig.SEARCHEMPTY_TEXT
     if(formName){
     this.$refs[formName].validate((valid) => {
     if (valid) {
     } else {
     console.log('error submit!!')
     return false
     }
     })
     }

     if (this.inspect_params.remark != '') {
     //审核、驳回通过
     if (this.inspect_params.remark.length < 2) {
     this.inspectInfo_Visible = true;//输入错误提示
     } else {
     this.inspectInfo_Visible = false;//输入错误提示
     this.inspectData();//通过驳回
     }
     //          console.log(this.$refs[formName])
     //          this.$refs[formName].validate((valid) => {
     //            if (valid) {
     //              this.inspectData();//通过驳回
     //            } else {
     //              console.log('error submit!!')
     //              return false
     //            }
     //          })
     } else {
     this.inspectInfo_Visible = true;//输入错误提示
     //完本审核通过
     if (this.$route.meta.type == 2) {
     if (this.chapter_list == null) {//无十条数据时候
     return false;
     }
     if (this.finishTime_params.finishTime != '') {////通过完本确定
     this.finishTime_Visible = false;//设置完本时间错误提示
     this.finishData()//完本审核通过
     } else {
     this.finishTime_Visible = true;//设置完本时间错误提示

     }
     }
     }
     },
     //弹窗取消、关闭
     cancel_Fn(done){
     this.word = 0//通过字数值
     this.inspect_params.remark = ''//清空驳回理由值
     this.finishTime_params.finishTime = ''//清空十条章节值
     this.inspectInfo_Visible = false;//通过、驳回错误提示
     this.finishTime_Visible = false//设置完本时间错误提示
     this.viaWindow_Visible = false;//通过窗口显隐
     this.rejectWindow_Visible = false;//驳回窗口显隐
     done && (this.$refs[done].resetFields());
     },

     },

     watch: {
     //作品id
     'list_params.query.bookId': {
     handler: function (val, oldVal) {
     //          let content = val.replace(/[^0-9]/g, '');
     setTimeout(() => {
     this.list_params.query.bookId = val.replace(/[^0-9]/g, '')
     }, 0)
     }
     },
     //作者id
     'list_params.query.authorId': {
     handler: function (val, oldVal) {
     //          let content = val.replace(/[^0-9]/g, '');
     setTimeout(() => {
     this.list_params.query.authorId = val.replace(/[^0-9]/g, '');
     }, 0)
     }
     },
     //通过审核字数
     'inspect_params.remark': {
     handler: function (val, oldVal) {
     this.word = val.length//通过审核字数值
     }
     }

     }*/
  }
</script>
<style lang="scss" scoped>


  /*通过完本审核*/
  .audit_title {
    padding-left: 37px;
    /*width: 100%;*/
    span {
      display: inline-block;
      font-weight: bold;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .audit_span {
    display: inline-block;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /*组件样式*/
  .el-dialog__body {
    padding: 5px 20px;
    /*overflow-x: auto;*/
  }

  .el-radio__input {
    vertical-align: baseline;
  }

  .el-radio-group {
    margin-left: 0;
    border-bottom: 1px solid #ccc;
    width: 100%;
    padding: 8px 10px;
    .el-radio {
      width: 100%;
      margin-left: 0;
    }
  }

  .rejectHeight {
    height: 220px;
  }

  .el-table__body-wrapper {
    position: static;
    .el-table__empty-block {
      position: static;
      .el-table__empty-text {
        top: 66%;
      }
    }
  }

</style>
