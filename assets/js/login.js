//登录的JS文件
$(function() {
    //1、点击去注册切换
    $('#link_reg').on('click', function() {
        $('.login_box').hide();
        $('.reg_box').show();
    })

    //2、点击去登录切换
    $('#link_login').on('click', function() {
        $('.reg_box').hide();
        $('.login_box').show();
    })

    //3、校验表单
    layui.form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //校验两次密码是否一致的规则
        repwd: function(value) {
            //通过形参拿到的是确认密码中的内容
            let pwd = $('.reg_box [name=password]').val();
            //比较密码框中的内容
            //如果判断失败则return一个提示消息
            if (pwd !== value) {
                return '两次密码输入不一致!'
            }
        }
    })

    //4、监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        //阻止表单默认事件
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/reg',
            data: $(this).serialize(),
            success(res) {
                if (res.code !== 0)
                    return layui.layer.msg(res.message);
                //注册成功了
                layui.layer.msg(res.message)
                setTimeout(() => {
                    //跳转到登录的页面
                    $('#link_login').click();
                }, 2000)
            }
        })
    })

    //5、监听登录表单的提交事件
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success(res) {
                if (res.code !== 0)
                    return layui.layer.msg(res.message);
                //登录成功
                layui.layer.msg(res.message);
                console.log(res.message)
                    //将服务器返回的token存储起来
                localStorage.setItem('token', res.token);
                //跳转到主页
                setTimeout(() => {
                    location.href = './index.html';
                }, 2000)
            }
        })
    })
})