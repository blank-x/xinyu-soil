<template>
  <div class="app-container welfare"
       v-if="list"
       v-loading="listLoading"
       element-loading-text="加载中.." style="z-index: 0">
    <!--进度条-->
    <div style="border-bottom: 1px solid #ccc; margin-bottom: 50px">
      <el-steps :active="computedStatus" style="width: 50%; margin:50px auto;" align-center>
        <el-step :title="typeText1" icon="img">
          <img slot="icon" :src="require('@/assets/lookDetaile/blue1.png')">
        </el-step>
        <el-step :title="typeText2" icon="el-icon-upload">
          <img v-if="list.status>=1||list.status==-1" slot="icon" :src="require('@/assets/lookDetaile/blue2.png')">
        </el-step>
        <el-step :title="typeText3" icon="el-icon-picture">
          <img v-if="list.status==1" slot="icon" :src="require('@/assets/lookDetaile/black3.png')">
          <img v-if="list.status==2" slot="icon" :src="require('@/assets/lookDetaile/blue3.png')">
          <img v-if="list.status==-1" slot="icon" :src="require('@/assets/lookDetaile/blue3.png')">
        </el-step>
      </el-steps>
    </div>
    <!--详情-->
    <div class="content" v-if="!listLoading">
      <!--已申请-->
      <ul class="content_item">
        <li class="content_item_ball"></li>
        <li>{{list.startTime}}</li>
        <li v-if="list.type!=-2">
          <div><span>已申请{{typeText}}稿费</span></div>
          <div>申请人：{{list.operatorName}}</div>
          <div v-if="list.type==-1&&list.bookId">作品ID：{{list.bookId}} {{list.companyDesc}}</div>
          <div v-else>{{typeText}}范围：{{list.companyDesc}}</div>
          <div>月份：{{list.dealMonth | MonthsFilter}}</div>
          <div v-if="list.type==1||list.type==-1">稿费类型：{{list.payLogTypeStr}}</div>
        </li>
        <li v-if="list.type==-2">
          <div><span>已申请{{typeText}}</span></div>
          <div>申请人：{{list.operatorName}}</div>
          <div>作者ID：{{list.authorId}} {{list.companyDesc}}</div>
          <div>兑现月份：{{list.dealMonth | MonthsFilter}}</div>
        </li>
      </ul>
      <!--开始-->
      <ul class="content_item">
        <li class="content_item_ball"></li>
        <li>{{computedTime}}</li>
        <li>
          <div v-if="list.type==1||list.type==-1"><span>开始{{typeText}}稿费</span></div>
          <div v-if="list.type==2||list.type==-2"><span>开始{{typeText}}</span></div>
          <div>任务正在执行中，请耐心等待</div>
        </li>
      </ul>
      <!--计算稿费-->
      <ul v-if="list.type==1" class="content_item" v-for="item in list.jobLogVOList">
        <li class="content_item_ball"></li>
        <li>{{item.formatEndTime}}</li>
        <!--范围成功-->
        <li v-if="item.result!=-1&&!item.bookId">
          <div><span>{{item.statusDesc}}</span></div>
          <div class="result">计算结果：<span style="color: #1aaee5">{{item.resultDesc}}</span></div>
          <div>计算范围:{{list.companyDesc}}</div>
          <div>月份：{{item.dealMonth | MonthsFilter}}</div>
        </li>
        <!--范围失败-->
        <li v-if="item.result==-1&&!item.singleFail">
          <div style="color: red"><span>{{item.statusDesc}}</span></div>
          <div class="result">计算结果：<span style="color: red">{{item.resultDesc}}</span>
            <el-button type="text" style=" padding: 0 10px; font-size: 14px"
                       @click="failDetail_Fn(list.type,item.id)">查看失败详情
            </el-button>
          </div>
          <div>计算范围：<span>{{list.companyDesc}}</span></div>
          <div>月份：{{item.dealMonth | MonthsFilter}}</div>
          <el-button v-if="item.continueRecal"
                     type="primary" size="mini"
                     v-has="permission.recalculate"
                     @click="recalculate_Fn(item.id)">继续计算
          </el-button>
        </li>

      </ul>
      <!--重算稿费-->
      <ul v-if="list.type==-1" class="content_item" v-for="item in list.jobLogVOList">
        <li class="content_item_ball"></li>
        <li>{{item.formatEndTime}}</li>
        <!--范围成功-->
        <li v-if="item.result!=-1&&!item.bookId">
          <div><span>{{item.statusDesc}}</span></div>
          <div class="result">重算结果：<span style="color: #1aaee5">{{item.resultDesc}}</span></div>
          <div>重算范围:{{list.companyDesc}}</div>
          <div>月份：{{item.dealMonth | MonthsFilter}}</div>
        </li>
        <!--范围失败-->
        <li v-if="item.result==-1&&!item.singleFail">
          <div><span>{{item.statusDesc}}</span></div>
          <div class="result">重算结果：<span style="color: red">{{item.resultDesc}}</span>
            <el-button type="text" style=" padding: 0 10px; font-size: 14px"
                       @click="failDetail_Fn(list.type,item.id)">查看失败详情
            </el-button>
          </div>
          <div>重算范围：<span>{{list.companyDesc}}</span></div>
          <div>月份：{{item.dealMonth | MonthsFilter}}</div>
          <el-button v-if="item.continueRecal"
                     type="primary" size="mini"
                     v-has="permission.recalculate"
                     @click="recalculate_Fn(item.id)">继续计算
          </el-button>
        </li>

        <!--单本成功-->
        <li v-if="item.result!=-1&&item.bookId">
          <div><span>{{item.statusDesc}}</span></div>
          <div class="result">重算结果：<span style="color: #1aaee5 ">{{item.resultDesc}}</span></div>
          <div>作品ID：{{item.bookId}} {{list.companyDesc}}</div>
          <div>月份：{{item.dealMonth | MonthsFilter}}</div>
        </li>
        <!--单本失败-->
        <li v-if="item.result==-1&&item.bookId">
          <div><span>{{item.statusDesc}}</span></div>
          <div class="result">{{typeText}}结果：<span style="color: red">失败</span></div>
          <div>作品ID：{{item.bookId}} {{list.companyDesc}}</div>
          <div>月份：{{item.dealMonth | MonthsFilter}}</div>
          <div style="color: red;">失败理由:{{item.resultDesc}}</div>
          <el-button v-if="item.continueRecal"
                     type="primary" size="mini"
                     @click="recalculate_Fn(item.id)">继续计算
          </el-button>
        </li>
      </ul>
      <!--兑现稿费-->
      <ul v-if="list.type==2" class="content_item" v-for="item in list.jobLogVOList">
        <li class="content_item_ball"></li>
        <li>{{item.formatEndTime}}</li>
        <!--范围成功-->
        <li v-if="item.result!=-1">
          <div><span>{{item.statusDesc}}</span></div>
          <div class="result">兑现结果：<span style="color: #1aaee5">{{item.resultDesc}}</span></div>
          <div>兑现范围:{{list.companyDesc}}</div>
          <div>兑现月份：{{item.dealMonth | MonthsFilter}}</div>
          <div v-if="item.remark" style="color: red;">提醒:
            <pre class="pre">{{item.remark}}</pre>
          </div>
        </li>
        <!--范围失败-->
        <li v-if="item.result==-1">
          <div style="color: red"><span>{{item.statusDesc}}</span></div>
          <div class="result">兑现结果：<span style="color: red">{{item.resultDesc}}</span>
            <el-button type="text" style=" padding: 0 10px; font-size: 14px"
                       @click="failDetail_Fn(list.type,item.id)">查看失败详情
            </el-button>
          </div>
          <div>兑现范围：{{list.companyDesc}}</div>
          <div>兑现月份：{{item.dealMonth | MonthsFilter}}</div>
          <el-button v-if="item.continueRecal"
                     type="primary" size="mini"
                     v-has="permission.re_author_cash"
                     @click="recalculate_Fn(item.id)">继续兑现
          </el-button>
          <div v-if="item.remark" style="color: red; margin-top: 5px">提醒:
            <pre class="pre">{{item.remark}}</pre>
          </div>
        </li>

      </ul>
      <!--重新兑现-->
      <ul v-if="list.type==-2" class="content_item" v-for="item in list.jobLogVOList">
        <li class="content_item_ball"></li>
        <li>{{item.formatEndTime}}</li>
        <!--成功-->
        <li v-if="item.result!=-1">
          <div><span>{{item.statusDesc}}</span></div>
          <div class="result">兑现结果：<span style="color: #1aaee5">{{item.resultDesc}}</span></div>
          <div>作者ID：{{list.authorId}} {{list.companyDesc}}</div>
          <div>兑现月份：{{item.dealMonth | MonthsFilter}}</div>
          <div v-if="item.remark" style="color: red">提醒:
            <pre class="pre">{{item.remark}}</pre>
          </div>
        </li>
        <!--失败-->
        <li v-if="item.result==-1">
          <div><span>{{item.statusDesc}}</span></div>
          <div class="result">兑现结果：
            <span style="color: red" v-if="list.jobLogVOList.length>1">{{item.resultDesc}}</span>
            <span style="color: red" v-else>失败</span>
          </div>
          <div>作者ID：{{list.authorId}} {{list.companyDesc}}</div>
          <div>兑现月份：{{item.dealMonth | MonthsFilter}}</div>
          <div style="color: red;" v-if="list.jobLogVOList.length<=1">失败理由:{{item.resultDesc}}</div>
          <el-button v-if="item.continueRecal"
                     type="success" size="mini"
                     v-has="permission.re_author_cash"
                     @click="recalculate_Fn(item.id)">继续兑现
          </el-button>
          <div v-if="item.remark" style="color: red; margin-top: 5px">提醒:
            <pre class="pre">{{item.remark}}</pre>
          </div>
        </li>
      </ul>
    </div>

    <!--查看详情-->
    <el-dialog
      title="查看失败详情"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="860px">
      <el-table
        border fit stripe highlight-current-row
        style="margin-bottom: 30px"
        :data="defeatList"
        v-loading="detailsLoading"
        :header-cell-style='{"background": "#EFF2F7",padding:"5px 0"}'>
        <el-table-column prop="objectIds" label="作品ID" align="center"
                         v-if="list.type==1||list.type==-1"></el-table-column>
        <el-table-column prop="objectName" label="签署人" minWidth="90" align="center"
                         v-if="list.type==2||list.type==-2"></el-table-column>
        <el-table-column prop="remark" label="失败原因" align="center"></el-table-column>
        <el-table-column label="操作" minWidth="90" align="center"
                         v-if="list.type==2||list.type==-2">
          <template slot-scope="scope">
            <el-button type="text" @click="showSignInfo(scope.row.objectId)">查看签署人信息</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--签约详情窗口-->
    <sign-info :detailPop="detailPop"></sign-info>
  </div>
</template>

<script>
  import {viewDetailsList, fail_detailList, permission, re_author_cashData, recalculateData} from '@/api/settlement'//接口
  import signInfo from '../components/sign_info'//签约详情弹窗
  export default {
    components: {signInfo},
    data() {
      return {
        permission: permission,//权限
        listLoading: false,//懒加载
        detailsLoading: false,//查看详情懒加载
        list: [],
        defeatList: [],
        dialogVisible: false,
        detailPop: {},//查看签约详情
      }
    },
    created() {
      this.getList()
    },
    computed: {

      typeText(){
        if (this.list.type == 1)return '计算'
        if (this.list.type == -1)return '重算'
        if (this.list.type == 2)return '兑现'
        if (this.list.type == -2)return '重新兑现'
      },
      typeText1(){
        if (this.list.type == 1)return '申请计算'
        if (this.list.type == -1)return '申请重算'
        if (this.list.type == 2)return '申请兑现'
        if (this.list.type == -2)return '申请重新兑现'
      },
      typeText2(){
        if (this.list.type == 1)return '计算中'
        if (this.list.type == -1)return '重算中'
        if (this.list.type == 2)return '兑现中'
        if (this.list.type == -2)return '重新兑现中'
      },
      typeText3(){
        if (this.list.type == 1)return '计算完成'
        if (this.list.type == -1)return '重算完成'
        if (this.list.type == 2)return '兑现完成'
        if (this.list.type == -2)return '兑现完成'
      },
      computedTime(){
        var time
        time = this.list.startTime.substring(this.list.startTime.indexOf(" "))
        return time
      },
      computedStatus(){
        if (this.list.status == -1) {
          this.list.status = 3
          return this.list.status
        } else {
          return this.list.status + 1
        }
      }

    },
    methods: {
      //列表数据-接口
      getList() {
        this.listLoading = true
        viewDetailsList(this.$route.params.id).then(response => {
          this.listLoading = false
          this.list = response.data.items
          console.log(this.list)
        })
      },
      //失败详情
      failDetail_Fn(type, id){
        this.detailsLoading = true
        this.dialogVisible = true
        fail_detailList(type, id).then(response => {
          if (response.data.items) {
            this.defeatList = response.data.items
            this.detailsLoading = false
          }
        })
      },
      //      查看签约详情
      showSignInfo(signApplyId) {
        this.dialogVisible = false
        setTimeout(() => {
          this.detailPop = {
            show: true,
            id: signApplyId
          }
        }, 400)

      },
      //继续计算、继续兑现
      recalculate_Fn(id){
        this.listLoading = true
        if (this.list.type == 1 || this.list.type == -1) {
          recalculateData(id).then(response => {
            if (response.data.items) {
              this.$message({
                message: '操作成功，任务正在执行中，请耐心等待', type: 'success',
                onClose: () => {
                  this.getList()
                }
              })
            }
          })
        } else {
          re_author_cashData(id).then(response => {
            if (response.data.items) {
              this.$message({
                message: '操作成功，任务正在执行中，请耐心等待', type: 'success',
                onClose: () => {
                  this.getList()
                }
              })
            }
          })
        }

      },
    },
    filters: {
      filterStatus(value){
        value = value.substring(0, value.length - 2)
        return value
      }
    }
  }
</script>
<style lang="scss" scoped>

  .content {
    /*width: 70%;*/
    /*margin: 0 auto;*/
    margin-left: 25%;
    font-size: 14px;
    padding: 0 10px;
    z-index: 0;
    color: #303133;
    & > .content_item:last-child {
      border-left: 2px solid transparent;
    }
    & > .content_item:last-child {
      .content_item_ball {
        &::after {
          top: 2px;
          left: 3px;
          width: 10px;
          height: 10px;
          background: #1aaee5;
        }
      }
    }
    .content_item {
      border-left: 2px solid #ccc;
      padding-left: 20px;
      position: relative;
      margin: 10px 0;
      padding-bottom: 10px;
      li {
        width: 70%;
        list-style: none;
        display: inline-block;
        vertical-align: text-top;
        div {
          margin-bottom: 5px;
          color: #999;
          span {
            color: #303133;
          }
        }
      }
      li:nth-of-type(2) {
        text-align: right;
        padding-right: 10px;
        width: 150px;
      }

      .content_item_ball {
        width: 16px;
        height: 16px;
        background: #fff;
        position: absolute;
        left: -9px;
        top: 0;
        &::after {
          content: '';
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          left: 4px;
          width: 8px;
          height: 8px;
          background: #ccc;
        }
      }
    }
  }

  .pre {
    margin-left: 38px;
    margin-top: -16px;
    font-family: 'Microsoft YaHei';
  }

  .result{
    span{
      max-width: 400px;
      display: inline-table;
    }
  }
</style>
