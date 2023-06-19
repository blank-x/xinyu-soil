<template>
  <div>
    <header style="background: #1aaee5; z-index:6;">
      <a v-if="this.$route.path=='/manage'" @click="logo_href"><img src="~assets/logo-2x.png" alt="element-logo" class="header-logo" ></a>
      <router-link target="_blank" :to="{ path: '/manage'}"><img src="~assets/logo-2x.png" alt="element-logo" class="header-logo" v-if="this.$route.path!='/manage'"></router-link>
      <div plain size="mini" class="el-menu-demo" round
           v-if="system.name && router!='/manage'"
           style="cursor: default">{{system.name}}</div>
      <div class="avatar-container" >
     <!-- <theme-picker class="theme-switch right-menu-item"></theme-picker>-->
      <el-dropdown trigger="hover">
        <div class="avatar-wrapper">
          <span class="userName">你好，{{name}}</span>
          <img class="user-avatar" :src="this.headImg">
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <div style="margin: -7px 0;width:130px;">
            <a class='inlineBlock' @click="toManage()" v-show="isManage">
              <div>返回系统主页面</div>
            </a>
            <div class="user-info">
              <a class="info" @click="open_Dialog(1,'pwd_params','currentUser')"
              >个人信息
              </a><br/>
              <a class="modify" @click="open_Dialog(2,'pwd_params','currentUser',true)">修改密码</a>
            </div>
            <a class='inlineBlock' style="border-bottom: 0px" @click="logout">退出</a>
          </div>
          <!--<el-dropdown-item divided><span @click="logout">退出登录</span></el-dropdown-item>-->
        </el-dropdown-menu>
      </el-dropdown>
      </div>
      <screenfull class="screenfull right-menu-item"></screenfull>
    </header>
    <!--彈窗-->
    <el-dialog :title="dialogTitle"
               :visible.sync="dialogFormVisible"
               :closeOnClickModal="false"
               @close="close('currentUser')"
               :width="appConfig.DIALOG_WIDTH_SMALL">
      <!--个人信息-->
      <el-form :rules="infoRules"
               :model="currentUser"
               label-width="120px"
               ref="currentUser"
               v-show="dialogClickVisible">
        <el-form-item label="姓名：" prop="realName" style="margin-bottom: 0px!important; margin-top: -10px">
          <span>{{currentUser.realName}}</span>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email" style="margin-bottom: 0px!important;">
          <span>{{currentUser.email}}</span>
        </el-form-item>
        <el-form-item label="所属部门：" style="margin-bottom: 9px!important;">
          <span v-if="currentUser.orgName&&!currentUser.orgName2nd">{{currentUser.orgName}}</span>
          <span v-if="currentUser.orgName&&currentUser.orgName2nd&&!currentUser.orgName3rd">
            {{currentUser.orgName + '/' + currentUser.orgName2nd}}
          </span>
          <span v-if="currentUser.orgName&&currentUser.orgName2nd&&currentUser.orgName3rd">
            {{currentUser.orgName + '/' + currentUser.orgName2nd + '/' + currentUser.orgName3rd}}
          </span>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phone" class="no-required-star">
          <el-input v-model="currentUser.phone" :maxlength="11"
                    style="width: 250px; " placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item label="座机：" prop="telephone" class="no-required-star">
          <el-input placeholder="座机号码, 如9999999" :maxlength="8" v-model="currentUser.telephone" style="width: 250px; ">
            <template slot="prepend">010-</template>
          </el-input>
        </el-form-item>

        <el-form-item label="" style="text-align: right">
          <el-button style="min-width: 60px"
                     @click="close('currentUser')">取消
          </el-button>
          <el-button style="min-width: 60px" type="primary"
                     @click="update_Info('currentUser')">确定
          </el-button>
        </el-form-item>

      </el-form>
      <!--修改密码-->
      <el-form :model="pwd_params"
               :rules="pwdRules"
               label-width="120px"
               ref="pwd_params"
               v-show="!dialogClickVisible">
        <el-alert :title="'您好，首次登录请修改账户默认密码！'" type="warning" show-icon
                  :closable="false" v-if="!close_visible"
                  style="width: 368px; height: 32px; margin: 0 0 20px 42px" ></el-alert>
        <el-form-item label="当前密码:" class="no-required-star" prop="oldPwd" :error="message"
                      :show-message="message_visible">
          <el-input type="password" :maxlength="18" placeholder="请填写当前密码"
                    v-model="pwd_params.oldPwd" auto-complete="off"
                    style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="新密码:" class="no-required-star" prop="pwd">
          <el-input type="password" :maxlength="18" placeholder="6-18位可由字母数字下划线组成"
                    v-model="pwd_params.pwd" auto-complete="off"
                    style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="重复新密码:" class="no-required-star" prop="confirmPwd">
          <el-input type="password"
                    :maxlength="18" v-model="pwd_params.confirmPwd" auto-complete="off"
                    style="width: 240px"></el-input>
        </el-form-item>

        <el-form-item label="" style="text-align: right">
          <el-button style="min-width: 60px"
                     v-if="close_visible"
                     @click="close()">取消
          </el-button>
          <el-button style="min-width: 60px" type="primary"
                     @click="update_pwd('pwd_params')">确定
          </el-button>
        </el-form-item>
        <div style="width: 40px; height: 40px; background: #fff; position: absolute; right: 0; top: 0;"
             v-if="!close_visible"></div>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import Screenfull from 'components/Screenfull'
  import ThemePicker from 'components/ThemePicker'
  import {deepClone, compareSimpleObject} from '@/utils'
  import {putUserInfo, postUserpwd} from '@/api/login'

  export default {
    components: {
      Screenfull,
      ThemePicker
    },
    data() {
      let checkphone = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else {
          let reg = /^1[34578]\d{9}$/
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error('手机号码格式不正确'));
          }
        }
      };
      let checktelephone = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else {
          let reg = /^\d{7,8}$/
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error('座机号码格式不正确'));
          }
        }
      };
      let validatePassnew = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请填写当前密码'));
        } else {
          if (this.pwd_params.pwd !== '') {
            this.$refs.pwd_params.validateField('pwd');
          }
          callback();
          this.message = null
//          let reg = /^\S{6,18}$/
//          if (reg.test(value)) {
//            callback();
//          } else {
//            callback(new Error('密码长度在6-18位之间'));
//          }
        }
      };
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请填写新密码'));
        } else {
          if (this.pwd_params.confirmPwd !== '') {
            this.$refs.pwd_params.validateField('confirmPwd');
          }
          let reg = /^[a-zA-Z0-9][\d_a-zA-Z]{5,18}$/
          if (reg.test(value)) {
            if (value == this.pwd_params.oldPwd) {
              callback(new Error('新密码不能与旧密码一致'));
            } else {
              callback()
            }
//            callback()
          } else {
            callback(new Error('密码6-18位，可由字母、数字和下划线组成'));
          }
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'));
        } else if (value !== this.pwd_params.pwd) {
          callback(new Error('重复新密码与新密码不一致'));
        } else {
          callback();
        }
      };
      return {
        router: this.$route.path,
        iconList: [
          'address-book-o',
          'anchor',
          'archive',
          'area-chart'
        ],
        headImg: require('@/assets/head.png'),//头像
        message: null,
        message_visible: true,
        dialogTitle: '',
        dialogClickVisible: false,//区分点击类型
        dialogFormVisible: false,

        infoold: '',
        info_params: {
          "phone": "",
          "telephone": ""
        },
        pwd_params: {
          "oldPwd": "",
          "pwd": "",
          "confirmPwd": ""
        },
        infoRules: {
          phone: [{validator: checkphone, trigger: 'blur'}],
          telephone: [{validator: checktelephone, trigger: 'blur'}]
        },
        pwdRules: {
          oldPwd: [{validator: validatePassnew, trigger: 'blur,change'}],
          pwd: [{validator: validatePass, trigger: 'blur'}],
          confirmPwd: [{validator: validatePass2, trigger: 'blur'}]
        },
        close_visible: false,
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name',
        'avatar',
        'system',
        'systems',
        'currentUser',
        'isDefaultPass'
      ]),
      isManage(){
        return this.$route.matched[0] && this.$route.matched[0].path !== '/manage'
      }
    },
    created(){
      this.currentUser.telephone && (this.currentUser.telephone = this.currentUser.telephone.slice(this.currentUser.telephone.indexOf('-') + 1))
//      console.log(this.currentUser.telephone)
      if(this.isDefaultPass){
        this.open_Dialog(2,'pwd_params','currentUser')
      }
    },
    methods: {
      toManage(){
        window.location.href = "/#/manage"
      },
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
      },
      // handleSelect(currentIndex){
      //   //获取系统的菜单及按钮权限
      //   this.$store.dispatch('GetSysRources', currentIndex).then((res) => {
      //     if (res.data) {
      //       //   清空头部导航   切换系统的时候
      //       this.$store.dispatch('clearVisitedViews')
      //       let currentSystem = this.systems.filter(function (item) {
      //         return item.id == currentIndex
      //       })[0]
      //       this.$store.dispatch('setCurrentSystem', currentSystem);
      //       const rolesRouterMap = res.data.items;
      //       this.$store.dispatch('GenerateRoutes', {rolesRouterMap}).then(() => { // 生成可访问的路由表
      //         this.$router.addRoutes(this.$store.getters.addRouters) // 动态添加可访问路由表
      //         this.$router.push({path: '/dashboard'})
      //       })
      //     }
      //   })
      // },

      //打开弹窗
      open_Dialog(val, pwd_params, currentUser,close_visible){
        this.infoold = deepClone(this.currentUser)
        this.$refs[currentUser] && (this.$refs[currentUser].resetFields())
        this.$refs[pwd_params] && (this.$refs[pwd_params].resetFields())
        this.dialogFormVisible = true
        if (val == 1) {
          this.dialogClickVisible = true
          this.dialogTitle = '修改个人信息'
        } else {
          this.close_visible=close_visible
          this.dialogClickVisible = false
          this.dialogTitle = '修改密码'
        }
      },
      //修改个人信息
      update_Info(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.info_params.phone = this.currentUser.phone
            if (this.currentUser.telephone != '') {
              this.info_params.telephone = '010-' + this.currentUser.telephone
            } else {
              this.info_params.telephone = this.currentUser.telephone
            }
            if (compareSimpleObject(this.infoold, this.currentUser)) {
              this.$message({message: '未修改任何内容！', type: 'warning'})
              return false
            } else {
              putUserInfo(this.info_params).then(response => {
                if (response.data.status == 200) {
                  this.dialogFormVisible = false
                  this.$message({message: '个人信息修改成功', type: 'success'})
                  setTimeout(() => {
                    window.location.reload()
                  }, 1500)
//                this.$store.dispatch('GetUserInfo')
                } else {
                  this.currentUser.telephone = this.currentUser.telephone.slice(this.currentUser.telephone.indexOf('-') + 1)
                }
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })

      },
      //修改密码
      update_pwd(formName) {
        if (!this.message) {
          this.$refs[formName].validate((valid) => {
            console.log(this.message)
            if (valid) {
              postUserpwd(this.pwd_params).then(response => {
                if (response.data.items) {
                  this.dialogFormVisible = false
                  this.$message({message: '密码修改成功', type: 'success'})
                  setTimeout(() => {
                    this.$store.dispatch('LogOut').then(() => {
                      location.reload()// 为了重新实例化vue-router对象 避免bug
                    })
                  }, 1500)
                } else {
                  this.message = response.data.msg;
//                console.log(this.message)
                }
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          })
        }
      },
      //取消
      close(formName){
        this.$refs[formName] && (this.$refs[formName].resetFields())
        this.dialogFormVisible = false
      },
      logo_href(){
        location.reload()
      }

    },
    watch: {
      //作者简介字数长度
      'pwd_params.pwd': {
        handler: function (val, oldVal) {
          if (val.substring(0, 1) === '_') {
            val = val.substring(1)
          }
          setTimeout(() => {
            this.pwd_params.pwd = val
          }, 0)
        }
      },


    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }

  header {
    height: 60px;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    padding: 0 20px;
    z-index: 1;
    box-sizing: border-box
  }

  .el-menu-demo {
    border:1px solid #fff;
    padding: 6px 15px;
    border-radius: 20px;
    left: 300px;
    position: absolute;;
    top: 16px;
    background: none;
    color: #ffffff;
    border-color: #ffffff;
    font-size: 14px;
    &:hover {
      background: none;
      border-color: #ffffff;
      color: #ffffff;
    }
  }

  .el-menu-list {
    right: 300px;
    position: absolute;;
    top: 0px;
    background: none;
    .el-menu-item {
      font-size: 14px;
      font-weight: bold;
      &:hover {
        background: none;
      }
    }
  }

  .header-logo {
    display: inline-block;
    vertical-align: middle;
    margin-top: 15px;
    width: 261px;
    height: 32px;
  }

  .header-operations {
    display: inline-block;
    float: right;
    padding-right: 100px;
    height: 100%;
    margin: 0
  }

  .header-operations li {
    color: #fff;
    display: inline-block;
    vertical-align: middle;
    padding: 0 10px;
    margin: 0 10px;
    line-height: 60px;
    cursor: pointer
  }

  .userName {
    font-size: 12px;
    color: #fff;
    display: inline-block;
    float: left;
    margin: 13px 5px;
    cursor: pointer
  }

  .header-operations li:last-child {
    cursor: default
  }

  .header-operations .header-download {
    opacity: .4;
    cursor: default
  }

  .header-operations .header-download.is-available {
    opacity: 1;
    cursor: pointer
  }

  .header-operations span {
    opacity: .7
  }

  .header-operations .header-lang {
    cursor: pointer
  }

  .header-operations .header-lang.is-active {
    opacity: 1
  }

  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }

  .errLog-container {
    display: inline-block;
    position: absolute;
    right: 150px;
  }

  .screenfull {
    position: absolute;
    right: 30px;
    top: 18px;
    color: red;
  }

  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 65px;
    top: 6px;
    & .el-dropdown {
      color: #ffffff;
      font-size: 12px;
      cursor: pointer;
    }

    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      padding: 0 30px 0 0;
      .user-avatar {
        width: 36px;
        height: 36px;
        border-radius: 36px;
        vertical-align: middle;
      }

      .el-icon-caret-bottom {
        position: absolute;
        right: 10px;
        top: 16px;
        color: white;
        font-size: 12px;
      }
    }
  }

  .el-menu--horizontal {
    /*border-left: 1px solid #1d9ece;*/
    li {
      &.el-menu-item {
        /*border-right: 1px solid #1d9ece;*/
      }
      &:hover {
        color: #48576a;
        border-bottom-color: #ec9005;
      }
    }
  }

  .inlineBlock {
    color: #303133;
    height: 47px;
    line-height: 48px;
    padding: 0 10px;
    margin: 0 10px;
    border-bottom: 1px solid #e4e7ed;
    &:hover {
      color: #1aaee5
    }
  }

  .el-dialog__header {
    padding-bottom: 0 !important;
  }

  .user-info {
    padding: 16px 10px;
    border-bottom: 1px solid #e4e7ed;
    margin: 0 10px;
    .info {
      margin-bottom: 15px;
      display: inline-block;
      color: #303133;
      &:hover {
        color: #1aaee5;
      }
    }
    .modify {
      &:hover {
        color: #1aaee5;
      }
      color: #303133;
    }
  }
</style>
