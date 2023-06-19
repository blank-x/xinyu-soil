<template>
  <div class="app-container">
    <contentTitle :titleParams="{title:'员工角色管理'}" ></contentTitle>
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" ref="listQuery" @submit.native.prevent>
        <el-form-item label="员工姓名 :" prop="query.realName" style="margin-right: 12px">
          <el-input placeholder="可模糊搜索" size="small" v-model.trim="listQuery.query.realName"></el-input>
        </el-form-item>
        <el-form-item label="角色类型 :" prop="query.roleId" style="margin-right: 12px">
          <el-select v-model="listQuery.query.roleId" filterable clearable> <!---->
            <el-option
                    v-for="item in rolesList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  >
          <search @search="handleFilter" :listLoading="listLoading"></search>
        </el-form-item>

        <!--<el-row>-->
          <!--<el-col :span="6">-->
            <!--<el-form-item label="员工姓名 :" prop="query.realName" style="margin-right: 12px">-->
              <!--<el-input placeholder="可模糊搜索" size="small" v-model.trim="listQuery.query.realName"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="6">-->
            <!--<el-form-item label="角色类型 :" prop="query.realName" style="margin-right: 12px">-->
              <!--<el-input placeholder="可模糊搜索" size="small" v-model.trim="listQuery.query.realName"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="6">-->
            <!--<el-form-item  >-->
              <!--<search @search="handleFilter" :listLoading="listLoading"></search>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        <!--</el-row>-->

      </el-form>
    </div>
    <el-table :data="detailList" :max-height="tableHeight" :empty-text="emptyText" v-loading="listLoading" element-loading-text="加载中.." border fit stripe :header-cell-style="this.appConfig.HEADER_STYLE"
              highlight-current-row  @filter-change="getFilter" @sort-change="getSortColumn">
    <!--  <el-table-column align="center" label="序号" type="index" width="50">-->
      <!--</el-table-column>-->
      <el-table-column align="center" label="员工姓名" width="200">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p><label>邮箱: </label>{{scope.row.user.email}}</p>
            <p><label>手机: </label>{{scope.row.user.phone || "------"}}</p>
            <p><label>座机: </label>{{scope.row.user.telephone || "------"}}</p>
            <p><label>部门: </label>{{scope.row.user.orgName || "-------" +'/'+ (scope.row.user.orgName2nd || "-------")}}</p>
            <div slot="reference" class="name-wrapper">
              <el-button type="text" icon="el-icon-document">{{ scope.row.user.realName }}</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色" width="200">
        <template slot-scope="scope">
         <span :class="{'lineThrough':scope.row.role.logicalDel}">{{scope.row.role.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" min-width="150" prop="createTime" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.updateTime }}</span>
        </template>
      </el-table-column>
     <!-- <el-table-column width="150px" align="center" label="状态" column-key="logicalDel" prop="logicalDel"
                       filter-placement="bottom-end" :filters="logical_type" :filter-multiple="false"
                       :filter-method="filterTag">
        <template slot-scope="scope">
          &lt;!&ndash;<el-tag :type="scope.row.logicalDel ? 'danger' : 'success'" close-transition>&ndash;&gt;
            {{scope.row.logicalDel ? '已删除' : '正常'}}
         &lt;!&ndash; </el-tag>&ndash;&gt;
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="操作" width="200" :resizable="false"
                       :fixed="detailList.length==0?false:'right'">
        <template slot-scope="scope">
          <el-button type="text"   v-if="!scope.row.logicalDel"  @click="updataRoleShow(scope.row)"  >修改角色</el-button>
        <!--  <span  v-if="!scope.row.logicalDel" class="split_span">|</span>-->
        <!--  <el-button type="text"  v-if="!scope.row.logicalDel" @click="deleteUsersShow(scope.row)">删除</el-button>-->
          <span type="text"  v-if="scope.row.logicalDel">-------</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination :listQuery="listQuery" :total="totalItems" :listLoading="listLoading" @getList="fetchUserRoleList"></pagination>
    <el-dialog title="修改员工分配角色" :visible.sync="dialogNodeVisible" top="15px"  :width="appConfig.DIALOG_WIDTH_SMALL"  :close-on-click-modal="false">
      <el-form class="small-space" :model="createData"  ref="form1" inline-message>
        <div class="el-transfer-panel" style="width: 100%; margin-top: -5px">
          <p class="el-transfer-panel__header" style="padding-right: 15px"><el-input
                  :placeholder="placeholder"
                  v-model="filterText">
          </el-input></p>
          <div class="el-transfer-panel__body" :style="{overflow: 'auto', height:getDialogHeight}">
            <el-tree v-loading="listRoleLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
                     :default-checked-keys="checkedKeys" class="filter-tree" :data="roleData" :props="defaultProps"
                     show-checkbox default-expand-all node-key="id" :check-strictly="true"
                     :filter-node-method="filterNode" :expand-on-click-node="false" ref="treeRole"
                     :render-content="renderContent"
            >
            </el-tree>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="fetchSaveRoleAllot()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import {
    fetchUserRoleList, //多条件分页查询用户-角色分配列表
    fetchRoleAllotList, //根据id查看用户-角色分配信息
    getUserRoleById,
    saveUserRole,
    deleteUserRole //删除用户接口
  } from '@/api/user' //用户接口
  import { fetchList} from '@/api/role'

  import {cascadeRoleList} from '@/api/role' //角色接口
  import waves from '@/directive/waves.js' // 水波纹指令
  import {parseTime, objectMerge, compareSimpleObject} from '@/utils'
  import tableMixin from '@/mixins/tableHeight'
  export default {
    data() {
      return {
        OrgsList: [],
        pageSize: 10,
        currentPage: 1,
        listQuery: {
          query: {roleId:null},
          sort: {
            orderByField: "createTime",
            orderDirect: "desc"
          },
          page: {
            pageNo: 1,
            pageSize: this.appConfig.DEFAULT_PAGE_SIZE
          }
        },
        filterText: '',
        detailList: [],
        checkedKeys: [],
        currentKeys:[],
        roleData: [],
        defaultProps: {
          value: "id",
          label: "name"
        },
        placeholder:'',
        totalItems: 0,
        listRoleLoading: true,
        dialogNodeVisible: false,
        createData: null,// 修改角色员工所用数据
        emptyText: this.appConfig.EMPTY_TEXT,//无数据提示
        init:true,
          rolesList:[],
          listLoading:true
      }
    },
    mixins:[tableMixin],
    watch: {
      filterText(val) {
        this.$refs.treeRole.filter(val);
      }
    },
    computed: {
      logical_type: function () {
        return [{
          text: '正常',
          value: false
        },
          {
            text: '已删除',
            value: true,
          }
        ]
      },
      getDialogHeight:function () {
        return window.innerHeight - 190 +"px"
      },

    },
    methods: {
      /**
       * 资源节点
       **/
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      //状态筛选
      filterTag(value, row) {
        return row.logicalDel === value;
      },
      /**
       * 重置查询条件
       * @param formName
       */
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.fetchUserRoleList()
      },
      //多条件分页查询组织信息
      fetchUserRoleList() {
        this.listLoading = true;
        fetchUserRoleList(this.listQuery).then(response => {
          this.detailList = response.data.items;
          if (response.data.paginate == null) {
            this.totalItems = 0
          } else {
            this.totalItems = response.data.paginate.totalItemsCount
          }
          if(this.init){
            this.init = false
          }else{
            this.emptyText = this.appConfig.SEARCHEMPTY_TEXT;
          }
            this.listLoading = false
        });
      },
      //查询
      handleFilter() {
        this.listQuery.page.pageNo = 1
        this.fetchUserRoleList()
      },
      getFilter(columnKeys){
        this.listQuery.query.logicalDel = columnKeys['logicalDel'][0]
        this.fetchUserRoleList()
      },
      getSortColumn({column, prop, order}){
        this.listQuery.sort.orderByField = prop || 'createTime',
          this.listQuery.sort.orderDirect = order === 'ascending' ? 'asc' : 'desc',
          this.fetchUserRoleList()
      },
      //删除
      deleteUsersShow(row) {
        this.$confirm('确定将该员工角色信息删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUserRole(row.id).then(
            respone => {
              if (respone.data.items) {
                this.fetchUserRoleList()
                this.$message({
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                })
              }
            })
        })
      },
      //修改角色
      updataRoleShow(rowData) {
        this.createData = Object.assign({}, rowData);
        this.filterText = "";
        this.placeholder =  "为员工"+ this.createData.user.realName+ "分配角色";
        this.dialogNodeVisible = true;
        if (this.$refs.treeRole) {
          this.$refs.treeRole.setCheckedKeys([]);
        }
        this.listRoleLoading = true;
        //获取级联角色数据
        cascadeRoleList().then(response => {
          this.roleData = response.data.items;
        })
        //根据id查看用户-角色分配信息
        getUserRoleById(rowData.user.id).then(response => {
          if (response.data.items) {
            let checkedKeys = [];
            for (var i in response.data.items) {
              checkedKeys.push(response.data.items[i].id)
            }
            this.currentKeys = checkedKeys;
            this.$refs.treeRole.setCheckedKeys(checkedKeys);
            this.listRoleLoading = false
          }
        })
      },
      //保存角色分配
      fetchSaveRoleAllot() {
        let objTemp = {
          list: [],
          "userId": this.createData.userId
        }
        let checkedArray = this.$refs.treeRole.getCheckedKeys();
        for (let i in checkedArray) {
          objTemp.list.push({
            userId: this.createData.userId,
            roleId: parseInt(checkedArray[i])
          });
        }
        if(compareSimpleObject(this.currentKeys, checkedArray)){
          this.$message({
            message: '未修改任何内容',
            type: 'warning',
            duration: 2000
          });
          return;
        }
        saveUserRole(objTemp).then(res => {
          if (res.data.items) {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 2000,
              onClose:()=>{
                this.fetchUserRoleList();
              }
            })
          }
        })
        this.dialogNodeVisible = false;
      },
      renderContent(h, { node, data, store }) {
        return (
          <div style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span> {node.label}</span>
          <span v-show={node.data.logicalDel}>
      <el-tag style="font-size: 12px;" type="info" size="mini">已禁用</el-tag>
          </span>

          </div>);
      },
        getRoleList(){
          let query = {
              query: { },
              sort: {
                  orderByField: 'name',
                  orderDirect: 'desc'
              },
              page: {
                  pageNo: 1,
                  pageSize: this.appConfig.DEFAULT_PAGE_SIZE
              }
          }
            fetchList(query).then(response => {
                this.rolesList = response.data.items
                this.rolesList.unshift({id:null,name:'全部'})
                // this.rolesList.sort((a,b)=>{
                //     return b.name.localeCompare(a.name)
                // })

            })
        }
    },
    created: function () {
        this.getRoleList()

        //获取用户-角色分配列表
      this.fetchUserRoleList()


    }
  }
</script>
<style>
  .add-Orgs-button {
    float: right;
  }

  .pagenation {
    margin-top: 10px;
  }
</style>
