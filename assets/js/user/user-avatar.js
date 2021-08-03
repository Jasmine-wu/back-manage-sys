// 图片裁剪插件cropper使用要点：
// 1. 导入css/js相关文件
// 2. initCropper（）

var $image = null;
var options = {};
var layer = layui.layer;

function initCropper() {
    // 1 使用cropper
    // 1.1 获取被裁剪元素
    $image = $('#image');
    // 1.2 配置裁剪选项
    options = {
            // 2.2.1 配置裁剪框的宽高比
            aspectRatio: 1,
            // 2.2.2 指定裁剪后的图片在哪里预览
            preview: '.img-preview'
        }
        // 1.3 创建裁剪区域
    $image.cropper(options);
}

function uploadCropperImg() {
    $('#upload-btn').on('click', function() {
        // 2.1 点击实现上传文件
        $('#file').click();

    })
}



$(function() {
    var layer = layui.layer;

    // 更换头像技术点
    // 1 裁剪头像
    initCropper();

    // 2 上传新头像
    // 问题：1.上传头像首先要能选择文件上传，如何实现选择文件功能？
    // 思路：单击button上传时，其实触发的是隐藏的input[type='file']上传文件事件
    // 问题：2. 实现了选择功能以后，如果判断用户是否选择了图片
    // 问题：3. 选择了图片如何更新裁剪区的图片？->更新的是cropper的src iamgeurl
    // 问题：4. 点击确认以后，如果拿到裁剪后的图片并上传？ - 从cropper拿到base64格式的图片字符串->上传服务器
    uploadCropperImg();


    // 2.2 监听file input事件
    $('#file').on('change', function(e) {

        var fileList = e.target.files;
        // 2.2.1 是否选择了照片
        if (fileList.length > 0) {

            // 2.2.1.1 拿到用户选择的文件
            var file = fileList[0]; //是一个File对象
            // 2.2.1.2 根据用户选择的文件创建url地址
            var imgURL = URL.createObjectURL(file);
            // 2.3 更新裁剪区的图片
            // 先销毁旧裁剪区，设置新图片，再创建新的裁剪区
            $image
                .cropper('destroy')
                .attr('src', imgURL)
                .cropper(options);

        } else {

            // 2.2.2
            // 没有选择照片
            return layer.msg('请选择照片')

        }
    })

    // 2.4 点击确认，更新/上传新头像
    $('#confirn-btn').on('click', function() {
        // 2.4.1 拿到图片base64 格式的字符串
        var dataURL = $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            }).toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            // 2.4.2 上传图片
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                console.log(dataURL);
                console.log(res);

                if (res.status !== 0) return layer.msg(res.message);
                layer.msg(res.message);
                // 2.4.2 刷新用户头像
                window.parent.getUserinfo();

            }
        })



    })




})