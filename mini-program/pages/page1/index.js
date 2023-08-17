// pages/page1/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        number: Math.random(),
        msg:'hello',
        aaa: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.request({
            url: 'https://667u991j20.zicp.fun/ajax/testAjax',
            method: 'get',
            success: (res)=>{
                console.log(res)
                this.setData({
                    msg: res.data
                })
            }
          })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    bindgetphonenumber(){
        console.log(e.detail.code)
    },
    bindTap(e){
        console.log(e)
    },
    inputHandler(e){
        console.log(e.detail.value,1)
        this.setData({
            msg: e.detail.value
        })
    },
    getData(){
        wx.request({
          url: 'https://667u991j20.zicp.fun/ajax/testAjax',
          method: 'get',
          success: (res)=>{
              console.log(res)
              this.setData({
                  msg: res.data
              })
          }
        })
    }
})