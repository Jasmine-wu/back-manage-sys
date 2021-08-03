$(function() {

    // 1. 渲染用户头像
    getUserinfo();

    // 2 退出登陆
    logout();

    // 3 没有登陆不允许访问需要登陆的页面

})

var layer = layui.layer;

function getUserinfo() {

    // 1.1 当用户修改头像，显示用户头像
    $.ajax({

        method: 'GET',
        url: '/my/userinfo',
        // 需要token的地方要加headers
        success: function(res) {
            if (res.status !== 0) return layer.msg(res.message);
            // 请求成功
            renderAvatar(res.data);
        }

    })
}

function renderAvatar(data) {
    // 1.2.1 获取用户名
    var uname = data.nickname || data.username;

    if (data.user_pic === null) {
        // 1.2.2 渲染文字头像 
        $('.layui-nav-img').hide();
        $('.text-avatar').html(uname[0]).show();
    } else {
        // 1.2.3 渲染图片头像
        $('.text-avatar').hide();
        $('.layui-nav-img').attr('src', data.user_pic).show();
    }

    $('.uname').html(`欢迎&nbsp;&nbsp;${uname}`);

}

function logout() {
    $('.logout').on('click', function() {
        // 2.1 弹出确认框
        layer.confirm('是否确认退出？', { icon: 3, title: '提示' }, function(index) {

            //点击确认
            // 2.1 清空本地存储的token
            localStorage.removeItem('token');

            // 2.2 返回到登陆页面
            window.location.href = './login.html';

        });

    })
}