// 重置密码的JS文件
$(function() {
    //1、校验
    layui.form.verify({
        pwd: [/^[\S]{6,12}$/,
            '密码长度必须6-12位，且不能有空格'
        ],
        newPwd: function(value) {
            if (value === $('[name=old_pwd]').val()) {
                return '新旧密码不能一致'
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=new_pwd]').val()) {
                return '两次密码不一致'
            }
        }
    })

    //2、表单的提交事件  
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        //发起请求重置密码
        $.ajax({
            method: 'PATCH',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                //成功  退出登录 清除token
                layui.layer.msg(res.message)
                setTimeout(() => {
                    localStorage.removeItem('token');
                    // 跳转有问题
                    window.parent.location.href = '../login.html';
                }, 1000)
            }
        })
    })
})