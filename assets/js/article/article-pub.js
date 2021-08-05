var layer = layui.layer;
var form = layui.form;
var $image = null;
var options = null;
var atcState = '已发布';
$(function() {

    // 1. 动态渲染选择分类下拉框
    renderCatesSelt();

    // 2. 渲染富文本编辑器
    renderEditor();

    // 3。 渲染图片裁剪框
    initCropper();

    // 4. 选择封面
    initSelectImg();

    $('#save-btn').on('click', function() {
        atcState = '草稿'
    });

    // 5. 发布/存为草稿()
    // state状态控制是发布还是存为草稿
    uploadArticle();

})

function renderCatesSelt() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {

            if (res.status !== 0) return layer.msg(res.message);

            var htmlStr = template('tp-cates-select', res);
            $('[name=cate_id]').html(htmlStr);
            // layui组件的部分如果是动态渲染的，需调用form.render()
            form.render();
        }
    })
}

function renderEditor() {
    // 2.3 初始化富文本编辑器
    initEditor()
}

function initCropper() {
    // 1. 初始化裁剪
    $image = $('#image');
    // 2. 设置裁剪选项
    options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 3. 初始化裁剪区域
    $image.cropper(options)

}

function initSelectImg() {

    // 4.1 选择文件功能
    $('#selt-img-btn').on('click', function() {
        $('#cover-file').click();
    });

    // 4.2 监听选择文件事件更新裁剪区域
    $('#cover-file').change(function(e) {
        var files = e.target.files;

        if (files.length > 0) {
            var file = files[0];
            var imgURL = URL.createObjectURL(file);
            $image
                .cropper('destroy')
                .attr('src', imgURL)
                .cropper(options);
        }
    })

}

function uploadArticle() {
    // 监听表单提交事件
    $('#atc-form').submit(function(e) {

        e.preventDefault();


        // 1. 准备请求体数据
        // 如果服务器请求体是FormData格式的，可直接通过表单对象自身创建FormData对象，传输fd
        var fd = new FormData($(this)[0]);

        // 1.2 
        fd.append('state', atcState);

        // 1.3.将裁剪对象图片转化成base64格式的字符串
        // 文件转base64格式：优点，比如说图片，加载速度会快。缺点：体积会大34%
        // 总结：小图片/小于100k的图片可转base64格式字符串
        // var dataURL = $image.cropper('getCroppedCanvas', { 
        //     width: 100,
        //     height: 100
        // }).toDataURL('image/png') 

        // 1.3.将裁剪图片转成blob二进制文件
        $image
            .cropper('getCroppedCanvas', {
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // blob即转化后的文件对象
                fd.append('cover_img', blob);

                // 2. 发送请求(注意，要图片转换完了再发送)
                $.ajax({
                    method: 'POST',
                    url: '/my/article/add',
                    data: fd,
                    // 注意：如果提交的数据是fd格式的，必须加两个属性：
                    contentType: false,
                    processData: false,

                    success: function(res) {
                        console.log(res);

                        if (res.status !== 0) return layer.msg('发布失败');
                        layer.msg('发布成功');

                        // 3. 跳转到文章页面
                        // location.href = '/article/article-list.html';

                    }
                })

            });

        // fd对象是可遍历的
        // fd.forEach(function(value, key) {
        //     console.log(value, key);
        // })
    });

}