<template>
    <div class="app-container calendar-list-container">
        <contentTitle :titleParams="{title:'角色列表',createItem:true,createText:'添加',permission:{add:permission.addRole}}" @createHandler="showRoleDialog('create',0)" ></contentTitle>
        <div class="filter-container">
            <el-form :inline="true" :model="listQuery" ref="listQuery" @submit.native.prevent>
                <el-form-item label="角色名称 :" prop="query.name" style="margin-right: 12px">
                    <el-input placeholder="可模糊搜索" size="small" v-model.trim="listQuery.query.name"></el-input>
                </el-form-item>
                <el-form-item  >
                    <search @search="handleFilter" :listLoading="listLoading"></search>
                  <!--  <reset  @reset="resetForm('listQuery')"></reset>-->
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="roleList"  :max-height="tableHeight" :empty-text="emptyText"  v-loading="listLoading" element-loading-text="加载中.." border stripe :header-cell-style="this.appConfig.HEADER_STYLE"
                  style="width: 100%" @filter-change="getFilter" @sort-change="getSortColumn">
            <el-table-column align="center" label="角色名称" prop="name">
            </el-table-column>
            <el-table-column min-width="160px" align="center" label="所属父级角色">
                <template slot-scope="scope">
                    <div v-if="scope.row.parents">
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item v-for="parent in scope.row.parents" :key="Math.random()" style="font-size: 12px;">
                                {{parent.name}}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <div v-if="scope.row.parents.length==0">
                        ----
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="是否突破父级权限" prop="authorId">
                <template slot-scope="scope">
                    {{scope.row.breakParentLimit?'是':'否'}}
                </template>
            </el-table-column>
            <el-table-column width="160px" align="center" label="添加时间" prop="createTime" sortable="custom">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column column-key="logicalDel" prop="logicalDel" width="110px" align="center" label="状态"
                             filter-placement="bottom-end"
                             :filters="logical_type" :filter-multiple="false">
                <template slot-scope="scope">
                    <!--<el-tag :type="scope.row.logicalDel ? 'danger' : 'success'" close-transition>-->
                        {{scope.row.logicalDel?'已禁用':'正常'}}
                    <!--</el-tag>-->
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="210px" :resizable="false"
                             :fixed="roleList.length==0?false:'right'">
                <template slot-scope="scope">
                    <el-button type="text"  v-if="!scope.row.logicalDel" @click="showRoleDialog('update',scope.row)" >修改</el-button>
                    <span  v-if="!scope.row.logicalDel" class="split_span">|</span>
                    <el-button type="text"  v-if="!scope.row.logicalDel" @click="deleteRole(scope.row)" >禁用</el-button>
                    <span  v-if="!scope.row.logicalDel" class="split_span">|</span>
                    <el-button type="text"  v-if="!scope.row.logicalDel" @click="showResourceDialog(scope.row)" >设置资源权限</el-button>
                    <el-button type="text"  v-if="scope.row.logicalDel" @click="enableRole(scope.row)" >启用</el-button>
                    <span  v-if="scope.row.logicalDel" class="split_span">|</span>
                    <el-button type="text"  v-if="scope.row.logicalDel" @click="showResourceDialog(scope.row)" >查看资源权限</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination :listQuery="listQuery" :total="total" :listLoading="listLoading" @getList="getList"></pagination>
        <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false"  :width="appConfig.DIALOG_WIDTH_SMALL"  :visible.sync="dialogFormVisible">
            <el-form ref="roleForm2" :model="temp" label-position="right" label-width="140px" :rules="createRoleRules" style="margin-bottom: -20px">
                <el-form-item  label="角色名称:" class="no-required-star"  prop="name" >
                <el-input v-model="temp.name" placeholder="请输入角色名称"  :maxlength="8" style="width: 240px; ">
                </el-input>
                </el-form-item >
                <el-form-item  label="父级角色:" prop="parentIds"  class="no-required-star" :rules="[{ required: true, message: '请选择父级角色'}]"  >
                    <el-cascader change-on-select :options="cascaderRoleList" v-model="temp.parentIds" :props="props"
                                 style="width: 240px; ">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="突破父级权限:" class="no-required-star" prop="breakParentLimit"  :rules="[{ required: true, message: '请选择是否突破父级权限'}]">
                    <el-radio v-model="temp.breakParentLimit" :label=true >是</el-radio>
                    <el-radio v-model="temp.breakParentLimit" :label=false >否</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="dialogStatus === 'create'" type="primary" @click="submitForm('roleForm2')">添 加</el-button>
                <el-button v-if="dialogStatus === 'update'" type="primary" @click="submitupdateForm('roleForm2')">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="(temp.logicalDel?'查看':'设置')+'资源权限'" :visible.sync="dialogNodeVisible" top="15px" :width="appConfig.DIALOG_WIDTH_MAX">
            <div class="el-transfer-panel mb-18" style="width: 100%;">
                <p class="el-transfer-panel__header" style="padding-right: 15px"><el-input
           placeholder="输入关键字进行过滤"
           v-model="filterText">
            </el-input></p>
                <div class="el-transfer-panel__body" :style="{overflow: 'auto', height:getDialogHeight}">
                  <el-tree
                        v-loading="isNodeLoading"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        class="filter-tree"
                        :data="resourceList"
                        :props="defaultProps"
                        show-checkbox
                        :default-expand-all="false"
                        node-key="id"
                        :check-strictly="true"
                        :default-checked-keys ="checkedKeys"
                        :default-expanded-keys="expandedKeys"
                        :filter-node-method="filterNode"
                        :render-content="renderContent"
                        :expand-on-click-node="false"
                        ref="tree">
                </el-tree>
                </div>
            </div>
            <div slot="footer" class="dialog-footer"  v-if="!temp.logicalDel">
                <el-button  type="primary" @click="fetchSaveRoleResources()">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import { fetchList, deleteRole,fetchAddRole,updateRole,enableRole,cascadeRoleList,existRoleName,permission} from '@/api/role' //角色接口
  import { fetchAllResources,fetchSelectedResources,fetchSaveRoleResources} from '@/api/resources' //资源接口
  import { fetchDicList} from '@/api/common' //接口
  import { sonsTree, compareSimpleObject, deepClone} from '@/utils' //接口
  import waves from '@/directive/waves.js'// 水波纹指令
  import axios from  'axios'
  import { mapGetters } from 'vuex'
  import { parseTime, convertDic } from '@/utils'
  import tableMixin from '@/mixins/tableHeight'
  // arr to obj
  export default {
    name: 'role_manage', //角色列表
    directives: {
      waves
    },
    mixins:[tableMixin],
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    data() {
      const validateRoleName = (rule, value, callback) => {
        if(this.initRoleName == value){
          callback();
        }else {
          existRoleName(value).then(res=>{
            if(res.data.items){
              callback(new Error('命名角色重复，请修改'))
            }else{
              callback();
            }
          })
        }
      }
      return {
        createRoleRules:{
          name:[{ required: true,  message: '角色名称1-8个字'}, { min: 1, max: 8, message: '角色名称1-8个字', trigger: 'blur,change'},{validator: validateRoleName,trigger: 'change'}]
        },
        permission:permission,
        cascaderRoleList:[],
        roleList: [],
        total: null,
        resourceList:null,
        checkedKeys:[],
        expandedKeys:[], //默认展开1，2级
        isGetParentRes:false,
        parentResList:[],
        listLoading: true,
        isNodeLoading:true,
        flterValue: [],
        listQuery: {
          query: {
          },
          sort: {
            orderByField: 'createTime',
            orderDirect: 'desc'
          },
          page: {
            pageNo: 1,
            pageSize: this.appConfig.DEFAULT_PAGE_SIZE
          }
        },
        temp: {},
        currentTemp:{},
        dialogFormVisible: false,
        diglogInfoVisible: false,
        dialogStatus: '',
        textMap: {
          update: '修改角色',
          create: '添加角色',
        },
        dialogNodeVisible: false,
        currentRow:{},
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        props: {
          value: "id",
          label: "name",
          disabled:'logicalDel'
        },
        initRoleName:"",
        emptyText: this.appConfig.EMPTY_TEXT,//无数据提示
        init:true
      }
    },
    computed: {
      ...mapGetters([
        'dicList'
      ]),
      logical_type: function () {
        return [
          {
            text: '正常', value: false
          },
          {
            text: '已禁用', value: true,
          }
        ]
      },
      getDialogHeight:function () {
        return window.innerHeight - (this.currentRow.logicalDel?150:190) +"px"
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    created() {
      this.getList();
    },
    methods: {
      /**
       * 显示资源设置彈窗
       * */
      showResourceDialog(row){
        this.currentRow = row;
        this.isNodeLoading = true;
        if(row.id){
          if(this.$refs.tree){
            this.$refs.tree.setCheckedKeys([]);
          }
          this.dialogNodeVisible = true;
          this.temp = Object.assign({},row);
          //查询角色已有的资源
          axios.all([fetchAllResources(),fetchSelectedResources(row.id),fetchSelectedResources(row.parentId)]).then(
            axios.spread((res,resSelect,resParent)=>{
              if(res.data.items){
                let itemList = res.data.items;
                for(let v of itemList){
                    if(this.currentRow.logicalDel) {
                      v['disabled'] = true
                    }
                    if(!this.currentRow.breakParentLimit && resParent.data.items.length >0){
                      if(resParent.data.items.map(v=>{ return v.id}).indexOf(v['id'])==-1){
                        v['disabled'] = true
                      }
                    }
                    if(v.type < 3){
                      this.expandedKeys.push(v.id);
                    }
                }
                this.resourceList = sonsTree(itemList,0);
               }
              if(resSelect.data.items){
                let checkedKeys = [];
                for(var i in resSelect.data.items){
                  checkedKeys.push(resSelect.data.items[i].id)
                }
                this.$refs.tree.setCheckedKeys(checkedKeys);
                this.isNodeLoading = false
              }
            }))
        }
      },
      /**
       * 资源节点
       **/
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1 || data.path.indexOf(value) !== -1;
      },
      renderContent(h, { node, data, store }) {
        return (
          <div style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span> {node.label}---【{node.data.httpMethod.toLowerCase()}{node.data.path}】     <el-tag style="font-size: 12px;" type="info" size="mini"  v-show={node.data.logicalDel}>已禁用</el-tag></span>
        <span v-show={node.level==1}>
        <el-tag style="font-size: 12px;" type="info" size="mini" > 平台</el-tag>
        </span>
          <span v-show={node.level==2}>
             <el-tag style="font-size: 12px;" type="" size="mini" > 模块</el-tag>
          </span>
          <span v-show={node.level==3}>
          <el-tag style="font-size: 12px;" type="warning" size="mini">页面</el-tag>
          </span>
          <span v-show={node.level==4}>
             <el-tag style="font-size: 12px;" type="success" size="mini">功能</el-tag>
          </span>
        </div>);
      },
      /**
       * 全选或反选 Tree
       */
      //todo
      selected(node,type){
      },
      /**
       * 保存角色资源
       **/
      fetchSaveRoleResources(){
        let objTemp ={
          list: [],
          "roleId":this.temp.id
        }
        let checkedArray = this.$refs.tree.getCheckedKeys();
        for(let i in checkedArray){
          objTemp.list.push(
            { resourceId: parseInt(checkedArray[i]),
              roleId: this.temp.id
            });
        }
        fetchSaveRoleResources(objTemp).then(res => {
          if (res.data.items) {
            this.dialogNodeVisible = false;
            this.$message({
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
          }
        })
      },
      /**
       * 重置查询条件
       * @param formName
       */
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.getList()
      },

      /**
       * 获取角色列表数据
       */
      getList() {
        this.listLoading = true
        //时间转换
        fetchList(this.listQuery).then(response => {
          this.roleList = response.data.items
          if (response.data.paginate == null) {
            this.total = 0
          } else {
            this.total = response.data.paginate.totalItemsCount
          }
          if(this.init){
            this.init = false
          }else{
            this.emptyText = this.appConfig.SEARCHEMPTY_TEXT;
          }
          this.listLoading = false
        })
      },
      /**
       * 添加或修改角色
       */
      showRoleDialog(status,temp){
        if(this.cascaderRoleList.length == 0){
            cascadeRoleList().then(response => {
                this.cascaderRoleList = response.data.items;
                this.showDialog(status,temp)
             })
          }else{
                this.showDialog(status,temp)
          }
      },
      showDialog(status,temp){
        this.$nextTick(()=>{
          this.$refs['roleForm2'].resetFields();
        })
        if(status == 'update'){
          this.temp = Object.assign({},temp)
          this.initRoleName = temp.name;
          if(this.temp.parentId != 0){
            this.temp.parentIds = this.temp.parents.map(v => v.id);
          }else{
            this.temp.parentIds = [0];
          }
          this.currentTemp = deepClone(this.temp);
        }else{
             this.resetTemp();
        }
        this.dialogStatus = status
        this.dialogFormVisible = true;
      },
      resetFrom(formName){
          this.$refs[formName].resetFields();
      },
      resetTemp(){
        this.temp = {
          breakParentLimit:false,
          parentIds:[],
          name:''
        }
      },
      /**
       * 禁用角色
       * @param row
       */
      deleteRole(row){
        this.$confirm('确定将该角色设置为禁用状态', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false
        }).then(() => {
          deleteRole(row.id).then(
            respone => {
              if (respone.data.items) {
                this.getList();
                this.$message({
                  message: '禁用成功',
                  type: 'success',
                  duration: 2000
                })
              }
            })
        })
      },
      /**
       * 启用角色
       * @param row
       */
      enableRole(row){
        this.$confirm('确定将该角色设置为启用状态', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false
        }).then(() => {
            enableRole(row.id).then(res=>{
              if (res.data.items) {
                this.getList();
                this.$message({
                  message: '启用成功',
                  type: 'success',
                  duration: 2000
                })
              }else{
                this.$message({
                  type: 'warning',
                  message: res.data.msg
                });
              }
            })
        })
      },
      /**
       * 新增角色
       * @param formName
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.temp.parentId = this.temp.parentIds[this.temp.parentIds.length -1];
            fetchAddRole(this.temp).then(
              respone => {
                if (respone.data.items) {
                  this.dialogFormVisible = !this.dialogFormVisible
                  this.$message({
                    message: '添加成功',
                    type: 'success',
                    duration: 2000
                  });
                  this.temp.parentId = "";
                  this.getList();
                }
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      /**
       * 更新角色
       * @param formName
       */
      submitupdateForm(formName) {

        if(compareSimpleObject(this.currentTemp, this.temp)){
          this.$message({
            message: '未修改任何内容',
            type: 'warning',
            duration: 2000
          });
          return;
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.temp.parentId = this.temp.parentIds[this.temp.parentIds.length -1];
            updateRole(this.temp).then(
              respone => {
                if (respone.data.items) {
                  this.dialogFormVisible = !this.dialogFormVisible
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 2000
                  });
                  this.getList();
                }
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      getFilter(columnKeys){
        this.listQuery.query.logicalDel = columnKeys['logicalDel'][0]
        this.getList()
      },
      getSortColumn({column, prop, order}){
        this.listQuery.sort.orderByField = prop || 'createTime',
        this.listQuery.sort.orderDirect = order === 'ascending' ? 'asc' : 'desc',
        this.getList()
      },
      handleFilter() {
        this.listQuery.page.pageNo = 1
        this.getList()
      },
    }
  }
</script>
<style lang="scss"  slot-scope="scoped">
  .el-breadcrumb__inner{
    font-weight: 400!important;
    cursor: default!important;
    color: #606266!important;
    line-height: 20px;
    a{
      font-weight: 300!important;
    }
  }
</style>
