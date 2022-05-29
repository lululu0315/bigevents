// 首页的JS文件
$(function() {
    getUserInfo();

    //3、退出
    $('#btn_exit').on('click', function() {
        layui.layer.confirm('确认退出嘛?', { icon: 3, title: '提示' }, function(index) {
            //退出需要清除token  跳转到登录页
            localStorage.removeItem('token');
            location.href = './login.html';
            layer.close(index);
        });
    })

    //只要点击了发布文章 就清空表单所有值
    $('#pub').on('click', function() {

    })
})

//1、获取登录用户的信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success(res) {
            if (res.code !== 0)
                return layui.layer.msg(res.message);
            //获取成功
            console.log(res)
            renderIco(res.data)
        }
    })
}

//2、渲染用户昵称跟头像
function renderIco(user) {
    //1)先判断用户有没有昵称
    //  如果没有就使用登录名称
    let name = user.nickname || user.username;
    $('#user_name').html(name);

    //2)首先判断用户有没有头像
    //  如果没有就使用名字头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
    } else {
        let first = name[0].toUpperCase();
        console.log(first)
        $('.text-avatar').html(first).show();
    }
}

//点击这个就清空token跳转
$('#pub').on('click', function() {
    localStorage.removeItem('id');
})