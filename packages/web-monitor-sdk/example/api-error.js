setTimeout(function(){
  var xhr = new XMLHttpRequest()
  xhr.open('GET','https://sfdfsdfsdfsdfsd/',true)
  xhr.send()
})

setTimeout(function(){
  var xhr = new XMLHttpRequest()
  xhr.timeout = 1000
  xhr.open('GET','http://localhost:8080/payment/testAjaxError',true)
  xhr.send()
})

setTimeout(function(){
  var xhr = new XMLHttpRequest()
  xhr.open('GET','http://localhost:8080/payment/testAjaxError',true)
  xhr.send()
})