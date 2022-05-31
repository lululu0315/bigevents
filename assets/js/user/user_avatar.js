// 上传头像的JS文件
$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //1、点击上传按钮
    $('#btn_file').on('click', function() {
        $('#file').click();
    })

    //2、监听文件的状态
    $('#file').on('change', function(e) {
        let files = e.target.files;
        // console.log(files.length);
        //判断是否为空
        if (files.length <= 0) {
            return layui.layer.msg('用户取消了上传文件')
        }
        //拿到用户选择的第一个文件
        let file = e.target.files[0];
        //根据选择的文件创建一个对应的url地址
        let newImgURL = URL.createObjectURL(file);
        //重新初始化裁剪区
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 2、 监听提交事件
    $('#btn_upload').on('click', function() {
        const dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            method: 'PATCH',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                //成功
                layui.layer.msg(res.message);
                //重新渲染页面
                window.parent.getUserInfo();
            }
        })
    })
})