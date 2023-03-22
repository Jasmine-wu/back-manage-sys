$(function () {
  var layer = layui.layer;
  var form = layui.form;

  // 1. 获取用户基础资料
  getUserinfo();

  // 2. 提交用户修改
  updateUserinfo();

  // 3. 重置
  reset();

  function getUserinfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message);

        // 1.1 默认显示已存在的基础信息：
        // layui提供的一次性填充表单数据
        form.val("userinfo-form", res.data);
      },
    });
  }

  function updateUserinfo() {
    $(".layui-form").on("submit", function (e) {
      // 3.1 阻止表单默认行为
      e.preventDefault();

      // 3.2 手动提交修改
      $.ajax({
        method: "POST",
        url: "/my/userinfo",
        data: $(this).serialize(),
        success: function (res) {
          if (res.status !== 0) return layer.msg(res.message);
          // 3.1 更新基础信息表单UI
          getUserinfo();
          // 3.2 更新用户头像显示
          // 涉及到的知识点: 在iframe里面如何调用父页面的方法？
          // window :当前frame所代表的小小的窗口
          // window iframe的父页面
          // 注意：要想在iframe调用到父页面里的方法,前提是，父页面里的方法是公开的方法。方法的定义要放到$(function(){})
          window.parent.getUserinfo();
        },
      });
    });
  }

  function reset() {
    $(".reset").on("click", function (e) {
      // 3.1 阻止表单默认行为
      e.preventDefault();

      // 3.2 手动重置
      getUserinfo();
    });
  }
});
