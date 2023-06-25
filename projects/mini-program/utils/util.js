const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const getBarInfo = () => {
    const systeminfo = wx.getSystemInfoSync();
    const headerBtnPosi = wx.getMenuButtonBoundingClientRect();  // 右上角关闭小程序的胶囊
    const statusBarHeight = systeminfo.statusBarHeight; // 状态栏高度
    const headerPosi = headerBtnPosi; // 胶囊位置信息
    console.log('headerPosi',headerPosi)
    console.log('statusBarHeight',statusBarHeight)
    const navbarBtn = {
      // 胶囊实际位置，坐标信息不是左上角原点
      height: headerPosi.height,
      width: headerPosi.width,
      top: headerPosi.top - statusBarHeight, // 胶囊top - 状态栏高度
      bottom: headerPosi.bottom - headerPosi.height - statusBarHeight, // 胶囊bottom - 胶囊height - 状态栏height （胶囊实际bottom 为距离导航栏底部的长度）
      right: systeminfo.windowWidth - headerPosi.right // 这里不能获取 屏幕宽度，PC端打开小程序会有BUG，要获取窗口高度 - 胶囊right
    };
    const cusnavH = navbarBtn.height + navbarBtn.top + navbarBtn.bottom; // 导航高度
    const navbarHeight = headerPosi.bottom + navbarBtn.bottom; // 胶囊bottom + 胶囊实际bottom
    const bar = {
      statusBarHeight, // 状态栏高度
      navbarHeight, // 顶部导航栏高度
      navbarBtn, // 导航按钮位置信息
      cusnavH, // 导航高度
      isIphoneX: systeminfo.model.indexOf('iPhone X') != -1,
    };
    return bar;
  };

module.exports = {
  formatTime,
  getBarInfo,
}
