// 文章列表
var q = {
  pagenum: 1, // 默认显示第一页
  pagesize: 2, // 默认一页显示两条
  cate_id: "",
  state: "",
};

var layer = layui.layer;
var form = layui.form;
var laypage = layui.laypage;

$(function () {
  renderArticleL();

  // 1. 动态渲染选择分类下拉框
  initCatesSlt();

  // 2. 根据筛选结果渲染文章列表
  $(".layui-form").submit(function (e) {
    e.preventDefault();

    // 2.1 获取cate-id/state
    q.cate_id = $("#cates-slt").val();
    q.state = $("#states-slt").val() === "0" ? "已发布" : "草稿";

    // 2.2
    renderArticleL();
  });

  // 4. 编辑文章
  // 5. 删除文章
  initDelete();
});

function initCatesSlt() {
  $.ajax({
    method: "GET",
    url: "/my/article/list",
    success: function (res) {
      if (res.status !== 0) return layer.msg(res.message);

      var htmlStr = template("tpl-cates-list", res);
      $("#cates-slt").html(htmlStr);
      // layui组件的部分如果是动态渲染的，需调用form.render()
      form.render();
    },
  });
}

function renderArticleL() {
  $.ajax({
    method: "GET",
    url: "/my/article/list",
    data: q,
    success: function (res) {
      if (res.status !== 0) return layer.msg(res.message);
      var htmlStr = template("tpl-artc-list", res);
      $("tbody").html(htmlStr);
      // 3 初始化分页
      initPage(res.total);
    },
  });
}

function initPage(total) {
  laypage.render({
    elem: "page-box",
    // 总条数
    count: total,
    // 每页显示几条
    limit: q.pagesize,
    // 当前选中第几页
    curr: q.pagenum,
    // layout可选条目limit，自定义选项值l
    limits: [2, 5, 10, 15],
    // count：可显示总条数区；limit：可选条目区; skip: 可快捷跳转
    layout: ["count", "limit", "skip", "prev", "page", "next"],
    jump: function (obj, first) {
      //拿到当前页
      q.pagenum = obj.curr;

      // 问题2: layout里的limit选择每页显示多少条时，并咩有刷新UI？
      q.pagesize = obj.limit;

      // 问题1:注意死循环问题
      // 两种情况会触发jump回调：
      // 1. 点击页面
      // 2. 调用laypage.render

      // 判断是哪种方式触发的jump回调
      // console.log(first);
      // first=true --> 第二种

      if (!first) {
        renderArticleL();
      }
    },
  });
}

//

function initDelete() {
  // 动态创建的元素要用代理方式绑定方法
  $("tbody").on("click", "#delete-btn", function () {
    // 解决问题3:
    // 获取当前页delete按钮还有多少个？= 还有多少条数据
    var nums = $("#delete-btn").length;

    var atcID = $(this).attr("data-id");
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/delete/" + atcID,
        success: function (res) {
          if (res.status !== 0) return layer.msg(res.message);
          layer.msg("删除文章成功");

          // 问题3: 当有四页面数据，我们删除了某页面的全部数据，页面会跳动到上一页，但UI没刷新
          // 解决：判断当前页是否还有剩余数据，如果有，让页码值-1，再renderArticleL

          // 如果nums=1,说明删完这条就没数据了，这是让页码值-1
          if (nums === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }

          renderArticleL();
        },
      });

      layer.close(index);
    });
  });
}
