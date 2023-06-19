import {errorType} from './constants'
export function ajax(params){
 
  var xhr = new XMLHttpRequest()
  xhr.open(params.method, params.url, true);
  xhr.setRequestHeader('content-type','application/json')
  xhr.onload = function(e) {
    if(this.status == 200||this.status == 304){
      params.success && params.success()
        // console.log(this.responseText);
    }
  };
  
  xhr.send(JSON.stringify(params.data));
}

export function merge (...args){
  return Object.assign({},...args)
}

export function getBaseInfo(){
  return {
    url:location.href,
    client: navigator.userAgent,
  }
}

export function getErrType(message=''){
  let type = errorType.find(item=>message.includes(item))
  return type
}

export function validateConfig(config){
  return true
  if (!config.appId) {
    console.warn('需要appId');
    return false;
  }
  return true
}

export function getGrammerErr(err){

}
export function getPromiseErr(err){

}
export function getResourceErr(err){

}

export function getResourceSrc(err){
  if(err.target.tagName.toLowerCase() === 'link'){
    return err.target.link
  }
  return err.target.src
}