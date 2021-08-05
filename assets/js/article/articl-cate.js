var layer = layui.layer;
var addIndex = null;
var modifyIndex = null;
var form = layui.form;


(function() {

    // 1. 通过模版渲染UI
    renderCatesList();
    // 2. 添加文章分类
    addCate();

    // 3. 编辑当前分类
    editCate();

    // 4. 删除当前分类
    deleteCate();

})();

function renderCatesList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {

            if (res.status !== 0) return layer.msg(res.message);

            // 渲染模版,刷新UI
            var htmlStr = template('cates', res);
            $('#artic-body').html(htmlStr);

        }
    })
}

function addCate() {
    $('#add-btn').on('click', function() {

        // 2.2 弹出提交表单层
        addIndex = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '300px'],
            // 2.3 放一个表格模版
            // content: template("dialog-cates", null)：//没有模版数据这样是不可以的
            content: $("#add-dialog").html()
        });

    })

}

// 2.4 确认提交添加分类
// 注意点： 给弹出层添加事件怎么添加？ 弹出层是放在模版里的，点击添加分类时才有的
// 直接绑定事件不绑定不上，需通过代理，比如
$("body").on('click', '#confirm-btn', function(e) {

    // 阻止默认提交
    e.preventDefault();

    // 2.5 拿到表单数据
    $.ajax({
        method: 'POST',
        url: '/my/article/addcates',
        data: $("#add-form").serialize(),
        success: function(res) {

            if (res.status !== 0) return layer.msg(res.message);
            layer.msg(res.message);
            // 2.5 刷新分类列表
            renderCatesList();

            // 2.6 关闭弹出层
            layer.close(addIndex);
        }
    })
})

var cateID = null;

function editCate() {

    // 3.1 问题：模版引擎动态渲染出来的元素这样绑定事件也是无效的，需通过代理
    // $('#edit-btn').on('click', function() {
    //     console.log('click');
    // })
    $("tbody").on('click', '#edit-btn', function(e) {
        cateID = $(this).attr('data-id');

        // 3.2 先弹出修改分类表单层
        modifyIndex = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '300px'],
            // content: template("dialog-cates", null)：//没有模版数据这样是不可以的
            content: $("#modify-dialog").html()
        });

        // 3.3 通过Id获取当前分类信息
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + cateID,
            success: function(res) {

                if (res.status !== 0) return layer.msg(res.message);

                // 3.4 将分类信息填充到弹出的修改分类表单上
                // 问题如何填充layui弹出层上表单的数据?
                // 表单的id=modify-form
                form.val('modify-form', res.data);

            }
        })


    })
}

// 3.5 确定修改分类
$("body").on('click', '#confirm-m-btn', function(e) {

    // 3.6 阻止默认提交
    e.preventDefault();

    // 3.7 手动提交修改后的分类数据
    // method；1.8以后才有
    $.ajax({
        method: 'POST',
        url: '/my/article/updatecate/',
        data: $('#modify-form').serialize(),
        success: function(res) {

            if (res.status !== 0) return layer.msg(res.message);

            layer.msg(res.message)
                // 3.7 重新渲染分类列表
            renderCatesList();

            // 3.8 修改成功关闭弹框
            layer.close(modifyIndex);

        }
    })
})


function deleteCate() {
    // 4.1
    $("tbody").on('click', '#delete-btn', function(e) {

        // 4.2 
        e.preventDefault();
        // 4.3 获取当前分类id
        var cateId = $(this).attr("data-id");
        // 4.4 弹出谈框确认是否真的要删除？
        layer.confirm('确认要删除该分类？', { icon: 3, title: '提示' }, function(index) {
            //点击确认时的回调函数
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + cateId,
                success: function(res) {

                    if (res.status !== 0) return layer.msg(res.message);

                    layer.msg(res.message)
                        // 3.5 重新渲染分类列表
                    renderCatesList();
                }
            })
            layer.close(index);
        });

    })

}