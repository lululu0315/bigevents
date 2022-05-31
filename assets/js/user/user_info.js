// 用户基本信息的JS文件
$(function() {
    // 1、表单验证
    layui.form.verify({
        nickname: function(value) {
            if (value.length > 6)
                return '昵称长度必须在1-6个字符之间'
        }
    })
    initUserInfo();
    //2、获取用户信息用于回显数据
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                //成功
                console.log(res)
                    //使用form.val为表单赋值
                layui.form.val('formUserInfo', res.data)
            }
        })
    }

    //3、点击重置按钮的时候恢复到一开始的数据
    $('#btn_reset').on('click', function(e) {
        e.preventDefault();
        layui.layer.msg('重置成功')
        initUserInfo();
    })

    //4、提交更新用户信息
    //表单提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        // updateUserInfo();
        $.ajax({
            method: 'PUT',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success(res) {
                console.log($(this).serialize())
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                //更新成功  需要重新渲染页面数据
                layui.layer.msg(res.message);
                window.parent.getUserInfo();
            }
        })
    })
})