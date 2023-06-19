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
      <el-table-column label="完结状态" width="90" align="center" prop="finish" column-key="finish"
                       :filters="[{ text: '已完结', value: 'true' }, { text: '连载中', value: 'false' }]"
                       :filter-multiple="false">
        <template slot-scope="scope">
          {{scope.row.finishText}}
        </template>
      </el-table-column>
      <el-table-column label="签约状态" width="90" align="center">
        <template slot-scope="scope">
          {{scope.row.signedText}}
        </template>
      </el-table-column>
      <el-table-column label="当前结算" width="90" align="center">
        <template slot-scope="scope">
          {{scope.row.settlementText}}
        </template>
      </el-table-column>
      <el-table-column label="强制保底" width="90" align="center" prop="force" column-key="force"
                       :filters="[{ text: '强制', value: 'true' }, { text: '不强制', value: 'false' }]"
                       :filter-multiple="false">
        <template slot-scope="scope">

          <span v-if="scope.row.cpId!==6" v-text="scope.row.force?'强制':'不强制'"></span>
          <span v-if="scope.row.cpId==6">------</span>
        </template>
      </el-table-column>
      <el-table-column label="字数" width="90" align="center">
        <template slot-scope="scope">
          {{scope.row.words}}
        </template>
      </el-table-column>
      <el-table-column label="千字价格(元)" min-width="90" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.priceText}}</span>
        </template>
      </el-table-column>
      <el-table-column label="总保底" width="90" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sumMoneyText}}</span>
        </template>
      </el-table-column>
      <el-table-column label="总稿費" width="90" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sumOtherMoneyText}}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" minWidth="150" align="center"
                       prop="createTime" sortable="custom"></el-table-column>
      <el-table-column label="操作" width="110" align="center"
                       :resizable="false"
                       :fixed="list.length==0?false:'right'">
        <template slot-scope="scope">
          <el-button v-if="lockedArr.indexOf(scope.row.cpId)!=-1&&scope.row.cpId!==6"
                     type="text"
                     v-has="permission.force"
                     @click="force_Fn(scope.row.id,scope.row.force)">
            <span v-text="scope.row.force?'取消强制保底':'强制保底'"></span>
          </el-button>
          <el-button v-if="lockedArr.indexOf(scope.row.cpId)==-1&&scope.row.cpId!==6"
                     type="text" disabled>已锁定
          </el-button>
          <span v-if="scope.row.cpId==6" style="color: #303133;display: inline-block;padding: 5px 0">------</span>
        </template>
        <!--<template slot-scope="scope" v-if="scope.row.cpId==6">-->
        <!--<span style="display: inline-block; padding: 5px 0">&#45;&#45;&#45;&#45;&#45;&#45;</span>-->
        <!--</template>-->
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
  import {guaranteeList, fetchForce, permission} from '@/api/guarantee'//接口
  import {locksList} from '@/api/locks'//接口
  import {mapGetters} from 'vuex'
  import tableMixin from '@/mixins/tableHeight'
  import searchItem from './searchPublic'

  import {convertDic, getCpInfo, deepClone} from '@/utils'

  export default {
    mixins: [tableMixin],
    components: {searchItem},
    data() {
      return {
        permission: permission,//权限
        emptyText: '',//无数据提示
        init: true,
        titleParams: {
          title: this.$route.name,
        },//表头信息
        headerStyle: this.appConfig.HEADER_STYLE,//表头样式

        listLoading: true,//懒加载
        list: [],//内容列表数据
        page_list: '',//列表翻页数据
        list_params: {
          "query": {
            "authorId": undefined,
            "beginDate": undefined,
            "bookId": undefined,
            "cpId": undefined,
            "endDate": undefined,
            "finish": undefined,
            "force": undefined,
            "settlement": undefined
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

        lockedArr: []
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
    methods: {
      //列表数据-接口
      getList() {
        this.locks_Fn()
        this.listLoading = true
        guaranteeList(this.list_params).then(response => {
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
      //强制、取消强制保底
      force_Fn(id, state){
        /*fetchForce({
          force: !state,
          id: id
        }).then(response => {
          let msg
          if (!state) {
            msg = '强制结算操作成功'
          } else {
            msg = '取消强制结算操作成功'
          }
          if (response.data.status == 200) {
            if (response.data.items) {
              this.$message({
                message: msg,
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
        })*/

        if (!state) {
          this.$confirm('确定设置为强制保底？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal: false
          }).then(() => {
            fetchForce({force: !state, id: id}).then(response => {
              if (response.data.status == 200) {
                if (response.data.items) {
                  this.$message({message: '强制结算操作成功', type: 'success',
                    onClose: () => {
                      this.getList()//刷新数据
                    }
                  })
                } else {
                  this.$message({message: response.data.msg, type: 'warning',})
                }
              }
            })
          }).catch(() => {
          });
        } else {
          this.$confirm('确定设置为取消强制保底？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal: false
          }).then(() => {
            fetchForce({force: !state, id: id}).then(response => {
              if (response.data.status == 200) {
                if (response.data.items) {
                  this.$message({message: '取消强制结算操作成功', type: 'success',
                    onClose: () => {
                      this.getList()//刷新数据
                    }
                  })
                } else {
                  this.$message({message: response.data.msg, type: 'warning',})
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
        this.list_params.query.finish = undefined
        this.list_params.query.force = undefined
        this.getList()
      },

      //筛选
      tableFilter_Fn(key){
        if (key && key.finish) {
          this.list_params.query.finish = key.finish[0]
        }
        if (key.force) {
          this.list_params.query.force = key.force[0]
        }
        this.getList()
      },
      //排序
      sort_Fn(column){
        console.log(column)
        if (column) {
          this.list_params.sort.orderByField = column.prop
          column.order == 'descending' && (this.list_params.sort.orderDirect = "desc")
          column.order == 'ascending' && (this.list_params.sort.orderDirect = "asc")
          column.order == null && (this.list_params.sort.orderByField = "id")
          this.getList()
        } else {
          this.list_params.sort.orderByField = "id"
          this.list_params.sort.orderDirect = "asc"
        }

      },
    },

    filters: {
      cpFilters: function (value) {
        console.log(value)
        return value
      }
    },

  }
</script>
<style lang="scss" scoped>

</style>
