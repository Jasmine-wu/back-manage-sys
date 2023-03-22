function updatePwd() {
  var layer = layui.layer;

  $(".layui-form").on("submit", function (e) {
    // 2.1 阻止默认提交
    e.preventDefault();
    // 2.2 手动提交更新的密码数据
    $.ajax({
      method: "POST",
      url: "/my/updatepwd",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message);

        // 2.3修改成功以后，重置表单
        $(".layui-form")[0].reset();
      },
    });
  });
}

$(function () {
  var form = layui.form;

  // 1. 自定义密码校验规则
  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    repwd: function (value) {
      const pwd = $(".newpwd").val();
      if (value !== pwd) return "两次密码输入不一致";
    },
  });

  // 2. 修改密码
  updatePwd();
});
