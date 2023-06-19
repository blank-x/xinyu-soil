import type {Animal} from './ffa'
import ipp from 'ipaddr.js'
import tapable from 'tapable'
declare const a:number;
type fa = number
type f = (aaa:fa)=>void

const fn:f = (arg)=>{
  console.log(arg);
}
fn(a)
ipp.isValid('sdsd')
declare class name111 {
  aaa():void
}

declare const enum Directions {
  Up,
  Down,
  Left,
  Right
}


declare namespace jQuery {
  const a =12

  interface AjaxSettings {
    method?: 'GET' | 'POST'
    data?: any;
  }
  function ajax(url: string, settings?: AjaxSettings): void;
  namespace fn {
    function extend(object: any): void;
  }
}
jQuery.ajax('/api/get_something');
jQuery.fn.extend({
  check: function() {
    return this.each(function() {
      this.checked = true;
    });
  }
});

const dfds:Animal = {
  sayHi(){
    return ''
  }

}
