/*
import {onMounted, onUnmounted, ref} from 'vue'

export default function (){
  let self = this;
  if(navigator.getBattery){
    navigator.getBattery().then(function(battery) {
// 判断是否在充电
      self.batteryInfo = battery.charging ? `在充电 : 剩余 ${battery.level * 100}%` : `没充电 : 剩余 ${battery.level * 100}%`;
// 电池充电状态改变事件
      battery.addEventListener('chargingchange', function(){
        self.batteryInfo = battery.charging ? `在充电 : 剩余 ${battery.level * 100}%` : `没充电 : 剩余 ${battery.level * 100}%`;
      });
    });
  }else{
    self.batteryInfo = '不支持电池状态接口';
  }
}
*/
