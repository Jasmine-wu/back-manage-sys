// 一：切换登陆注册
$(function() {

    // 自定义表单验证规则
    // 1.先拿到form对象
    var form = layui.form;
    var layer = layui.layer;


    $('.link-register').click(function() {
        // 清空表单数据
        $("#login-form")[0].reset();

        $(".login").hide();
        $(".register").show();
    })

    $('.link-login').click(function() {
        // 清空表单数据
        $("#reg-form")[0].reset();

        $('.register').hide();
        $(".login").show();

    });


    // 2:
    form.verify({

        uname: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }

        },
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            const pwd = $(".register [name=password]").val();
            if (value !== pwd)
                return '两次密码输入不一致';
        }

    });

    // 二：监听注册表单提交事件
    $('#reg-form').on('submit', function(e) {

        // 1. 先阻止默认提交行为
        e.preventDefault();
        // 2. 提交数据
        var data = {
            username: $('.register [name=username]').val(),
            password: $('.register [name=password]').val()
        };

        // 3 发送用户注册请求
        $.post('/api/reguser', data, function(res) {
            console.log(res);
            if (res.status !== 0) return layer.msg(`${res.message}`);

            // 3.2 注册成功弹出提示信息，弹出层
            layer.msg('注册成功');

            // 清空表单
            $("#reg-form")[0].reset();

            // // 3.3 自动跳转到登陆表单
            $('.link-login').click();


        })

    })

    // 三：监听登陆表单的提交事件
    $('#login-form').on('submit', function(e) {

        // 1. 先阻止默认提交行为
        e.preventDefault();

        // 2. 一次性拿到登陆提交数据
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) return alert(`${res.message}`);
                // 3.将服务器返回的用户token保存本地
                localStorage.setItem('token', res.token);

                layer.msg('登陆成功', function() {

                    // 清空表单
                    $("#login-form")[0].reset();

                    // 4.跳转页面
                    window.location.href = './index.html';

                });
            }

        })
    })

})