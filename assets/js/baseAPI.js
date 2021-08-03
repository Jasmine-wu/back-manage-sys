// 使用jquery发起请求之前调用预处理函数

$.ajaxPrefilter(function(options) {
    // 预处理：加上baseurl
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    // 预处理：在需要往headers里加token的请求，全部加上token

    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局挂在请求的complete函数：
    // 3 .没有登陆不允许访问需要登陆的页面
    // complete: 1. 不管jquery的ajax请求是成功还是失败都会调用
    //          `2. 响应数据：res.responseJSON
    options.complete = function(res) {

        var data = res.responseJSON;
        if (data.status === 1 && data.message === "身份认证失败！") {
            // 如果未登陆而访问到了当前页面
            // 3.1 强制请清空token
            localStorage.removeItem('token');
            // 3.2 强制跳转到登陆页
            location.href = './login.html';

        }

    }

})