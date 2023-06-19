// require('eventsource-polyfill')// ie 不支持 eventsource
// 如果需要在IE下进行开发，开启这个require
var hotClient = require('webpack-hot-middleware/client?reload=true');
console.log(hotClient);
hotClient.subscribe(function (event) {
    console.log(event);
    if (event.action === 'reload') {
        window.location.reload();
    }
});
