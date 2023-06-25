// index.js
const app = getApp()
const util = require('../../utils/util.js')

Page({
    data: {
        _b_data: false,
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        canIUseGetUserProfile: false,
        canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
        gData: {}
    },
    // 事件处理函数
    bindViewTap() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    changeHandler() {
        this.setData({
            _b_data: true
        })
        console.log(this)
    },
    onLoad: function () {
        var info = util.getBarInfo();
      
        let menuButtonObject = wx.getMenuButtonBoundingClientRect();
        wx.getSystemInfo({
          success: res => {
            //导航高度
            let statusBarHeight = res.statusBarHeight,
              navTop = menuButtonObject.top,
              navObjWid = res.windowWidth - menuButtonObject.right + menuButtonObject.width, // 胶囊按钮与右侧的距离 = windowWidth - right+胶囊宽度
              navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;
              this.setData({
                gData: {
                  navHeight,
                  navTop,
                  navObjWid,
                  navObjWid
                }
              })
            // this.globalData.navHeight = navHeight; //导航栏总体高度
            // this.globalData.navTop = navTop; //胶囊距离顶部距离
            // this.globalData.navObj = menuButtonObject.height; //胶囊高度
            // this.globalData.navObjWid = navObjWid; //胶囊宽度(包括右边距离)
            // console.log(navHeight,navTop,menuButtonObject.height,navObjWid)
          },
          fail(err) {
            console.log(err);
          }
        })


        wx.nextTick(() => {
            this.setData({
                ff: 333
            })
        })
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }
    },
    getUserProfile(e) {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
          desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            console.log(res)
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        })
      },
      getUserInfo(e) {
        // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
        console.log(e)
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
      }
})
