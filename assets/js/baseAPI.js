// 使用jquery发起请求之前调用预处理函数

$.ajaxPrefilter(function(options) {
    // 预处理：加上baseurl
    options.url = 'http://www.liulongbin.top:3007' + options.url;

})