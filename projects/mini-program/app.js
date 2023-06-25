// app.js
App({
    onHide:()=>{
        console.log('hide');
    },
    onShow:()=>{
        console.log('show');

    },
    onLaunch:()=>{
        console.log('launch');
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
          })
    },
    globalData: {
        userInfo: null
    }
})
