<template>
    <div class="login-container">
        <x-particles id="myParticles" class="particles-background" :config="config"></x-particles>
        <div style="position: absolute; left: 0; right: 0; margin: 40px auto;">
            <img src="~assets/login-mini2.png" style="height: 134px; margin: 20px auto 20px; display: block">
            <el-form class="card-box login-form" autoComplete="on" :model="loginForm" :rules="loginRules"
                     :show-message="false"
                     ref="loginForm" label-position="left">
                <h3 class="title">登录</h3>
                <el-form-item prop="username">
                    <span class="svg-container svg-container_login" style="margin-left: -2px;">
                      <icon-svg icon-class="yonghuming"/>
                    </span>
                    <el-input name="username" v-model.trim="loginForm.username" @keyup.enter.native="handleLogin"
                              autoComplete="on" placeholder="账户名">
                    </el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <span class="svg-container">
                      <icon-svg icon-class="mima"/>
                    </span>
                    <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin"
                              v-model="loginForm.password" autoComplete="on"
                              placeholder="密码"/>
                    <span class='show-pwd' @click='showPwd'><icon :name="eye"
                                                                  style="color:#889AA3;margin-right: 5px;"></icon></span>
                </el-form-item>
                <el-form-item prop="code" style="margin-bottom: 9px;">
                    <div style="position: relative">
                        <span class="svg-container">
                          <icon name="shield" class="shield"></icon>
                        </span>
                        <el-input v-model="loginForm.code" placeholder="验证码" @keyup.enter.native="handleLogin">
                        </el-input>
                        <el-tooltip class="item" effect="dark" content="点击刷新" placement="top">
                            <img style="position: absolute; right: 2px; top:2px; border-radius: 4px;cursor: pointer"
                                 width="80px" height="40px" @click="getCapth" :src="imgSrc"/>
                        </el-tooltip>
                    </div>
                </el-form-item>
                <el-row>
                    <el-col :span="15">
                        <span class="error-color errormsg">{{errorMsg}}</span>
                    </el-col>
                    <el-col :span="9" class="text-right">
                        <el-checkbox v-model="remember">记住登录信息</el-checkbox>
                    </el-col>
                </el-row>
                <el-button type="primary" class="loginBtn" size="large" :loading="loading"
                           @click.native.prevent="handleLogin">{{loading?"登录中...":"登录"}}
                </el-button>
            </el-form>
        </div>
    </div>
</template>

<script>
  import { isvalidUsername } from '@/utils/validate'
  import { getCapthUrl } from '@/utils'
  import socialSign from './socialsignin'
  import defConfig from '@/config/particles'
  import { getRemeberUser,setRemeberUser,removeRemeberUser} from '@/utils/auth'
  export default {
    components: {socialSign},
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!value) {
          this.errorMsg = '请输入用户名'
          callback(new Error())
        } else {
          this.errorMsg = ''
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        this.$refs.loginForm.validateField('username')
        if (this.errorMsg)return
        if (!value) {
          this.errorMsg || (this.errorMsg = '请输入密码')
          callback(new Error())
          return
        }
        if (value.length < 6) {
          (this.errorMsg = '密码不能小于6位')
          callback(new Error())
        } else {
          this.errorMsg = ''
          callback()
        }
      }
      const validateCode = (rule, value, callback) => {
        this.$refs.loginForm.validateField('username')
        this.$refs.loginForm.validateField('password')
        if (this.errorMsg)return
        if (!value) {
          (this.errorMsg = '请输入验证码')
          callback(new Error())
          return
        }
        if (!value || value.length != 4) {
          (this.errorMsg = '请输入正确的验证码')
          callback(new Error())
        } else {
          this.errorMsg = ''
          callback()
        }
      }
      return {
        config: {},
        loginForm: {
          username: getRemeberUser()?getRemeberUser().username : null,
          password: getRemeberUser()?getRemeberUser().password : null,
          code: '',
        },
        remember:getRemeberUser()?getRemeberUser().remember: '',
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePassword}],
          code: [{required: true, trigger: 'blur', validator: validateCode}]
        },
        pwdType: 'password',
        imgSrc: '',
        loading: false,
        showDialog: false,
        errorMsg: '',
        eye: 'eye-slash'
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
          this.eye = 'eye'
        } else {
          this.pwdType = 'password'
          this.eye = 'eye-slash'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('LoginByUsername', this.loginForm).then((res) => {
              if (res.data.items !== true) {
                this.errorMsg = res.data.msg
                if (res.data.msg === '验证码已过期') {
                  this.getCapth()
                }
              } else {
                this.errorMsg = ''
                //设置是否用默认密码登录
                if(this.loginForm.password === 'Motie1234'){
                  this.$store.dispatch('setDefaultPass', true);
                }
                if(this.remember){
                  setRemeberUser(JSON.stringify({
                    username:this.loginForm.username,
                    password:this.loginForm.password,
                    remember:this.remember,
                  }))
                }else{
                  removeRemeberUser()
                }
                this.$router.push({path: '/manage', query:{ redirect: this.$route.query.redirect}})
              }
              this.loading = false
            }).catch((err) => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },

      getCapth() {
        this.imgSrc = getCapthUrl('/users/captcha?' + new Date().getTime())
      },
      afterQRScan() {
        // const hash = window.location.hash.slice(1)
        // const hashObj = getQueryObject(hash)
        // const originUrl = window.location.origin
        // history.replaceState({}, '', originUrl)
        // const codeMap = {
        //   wechat: 'code',
        //   tencent: 'code'
        // }
        // const codeName = hashObj[codeMap[this.auth_type]]
        // if (!codeName) {
        //   alert('第三方登录失败')
        // } else {
        //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
        //     this.$router.push({ path: '/' })
        //   })
        // }
      }
    },
    created() {
      //this.$store.dispatch('GetCaptCha', this.loginForm).then();
      this.getCapth()
      console.log(this.$store.captcha)
      this.config = defConfig
    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
    @import "src/styles/mixin.scss";

    $dark_gray: #889aa4;
    $light_gray: #454545;
    $text_gray: #54b0e2;
    .particles-background {
        background: #f7fafc;
        height: 100%;
        width: 100%;
        position: absolute;
    }

    .login-container {
    @include relative;
        height: 100vh;
        border-top: 10px solid #aacd06;
        border-bottom: 10px solid #1aaee5;
    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
        -webkit-text-fill-color: #454545 !important;
    }
    input {
        background: #ffffff;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 8px 5px 8px 15px;
        color: $light_gray;
        height: 32px;
    }
    .el-input {
        display: inline-block;
        width: 70%;
    }
    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;
    }
    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    &_login {
         font-size: 20px;
     }
    }
    .title {
        font-size: 18px;
        font-weight: 600;
        color: $text_gray;
        margin: 0px auto 20px auto;
        text-align: center;
    }
    .login-form {
        position: absolute;
        height: 340px;
        background: #ffffff;
        padding: 25px 35px 15px 35px;
        left: 0;
        right: 0;
        width: 360px;
        margin: 16px auto 0;
        box-shadow: 0 0 10px rgba(239, 242, 247,.8);
    }
    .el-form-item {
        border: 1px solid #dddddd;
        background: #ffffff;
        border-radius: 5px;
    }
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
    }
    .thirdparty-button {
        position: absolute;
        right: 35px;
        bottom: 28px;
    }
    .loginBtn {
        margin-top: 8px;
        box-shadow: 0 2px 2px rgba(81, 172, 224, 0.7);
        width: 100%;
        margin-bottom: 30px;
        background-color: #69c8ed;
        border: 0px;
        background: -moz-linear-gradient(left, #49CDF1, #29AFE3);
        background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#49CDF1), to(#29AFE3));
    &:hover{
         background: -moz-linear-gradient(left, #59d9f1, #4da2e3);
         background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#59d9f1), to(#4da2e3));
     }
    }
    .errormsg {
        display: block;
        font-size: 14px;
        min-width: 14px;
        height:14px;
    }
    .shield{
        width:14px;
        height:14px;

    }
    }
</style>

