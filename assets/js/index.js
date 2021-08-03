$(function() {

    var layer = layui.layer;


    // 1. 渲染用户头像
    getUserinfo();

    function getUserinfo() {
        // 1.1 当用户修改头像，显示用户头像
        $.ajax({

            method: 'GET',
            url: '/my/userinfo',
            // 需要token的地方要加headers
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message);
                // 请求成功
                var data = res.data;

                // 1.2 如果用户头像为空，渲染文字头像
                var uname = data.nickname || data.username;

                if (data.user_pic === null) {
                    // 1.2.1  如果存在昵称，渲染昵称的第一个字为头像,否则渲染username的第一个字
                    renderAvatar(uname[0]);
                } else {
                    // 1.3 渲染图片头像
                    $('.layui-nav-img').attr('src', data.user_pic).show();
                    $('.text-avatar').hide();
                }

                $('.uname').html(`欢迎&nbsp;&nbsp;${uname}`);
            }

        })

    }

    function renderAvatar(first) {
        $('.text-avatar').html(first).show();
        $('.userinfo img').hide();
        $('.layui-nav-img').hide();
    }

    // 2 退出登陆
    $('.logout').on('click', function() {
        // 2.1 弹出确认框
        layer.confirm('是否确认退出？', { icon: 3, title: '提示' }, function(index) {
            layer.close(index);

            //点击确认
            // 2.1 清空本地存储的token
            localStorage.removeItem('token');

            // 2.2 返回到登陆页面
            window.location.href = './login.html';

        });

    })

    // 3 没有登陆不允许访问需要登陆的页面



})