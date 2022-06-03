// 文章类别的JS文件
$(function() {
    getCateList();

    //*定义一个开关判断用户点击的是添加还是编辑
    let flag = 0;

    let indexAdd = null;
    //2、点击添加分类按钮
    $('#btn_AddCate').on('click', function() {
        flag = 0;
        indexAdd = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章类别',
            content: $('#dialog-info').html()
        })
    })
    let indexEdit = null;
    let id = 0;
    //3、点击编辑按钮  利用事件委托
    $('tbody').on('click', '#btn_edit', function() {
        flag = 1;
        //获取编辑按钮的id
        id = $(this).attr('data-id');
        // console.log(id)
        indexEdit = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章分类',
            content: $('#dialog-info').html()
        })
        $('#sure').html('确认编辑')

        getCate();
    })

    //发起请求 回显数据
    function getCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/info?id=' + id,
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                //成功  通过form.val赋值
                // console.log(res);
                // layui.form.val('form-val', res.data);
                $('[name=id]').val(res.data.id);
                $('[name=cate_name]').val(res.data.cate_name)
                $('[name=cate_alias]').val(res.data.cate_alias)
            }
        })
    }

    //4、监听表单提交事件  利用事件委托
    $('body').on('submit', '#form-info', function(e) {
        e.preventDefault()
            //判断是点击的添加按钮还是编辑按钮
        if (flag === 0) {
            //添加 发起请求添加数据
            $.ajax({
                method: 'POST',
                url: '/my/cate/add',
                data: $(this).serialize(),
                success(res) {
                    if (res.code !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    //获取成功 提示 关闭 刷新
                    layui.layer.msg(res.message);
                    layui.layer.close(indexAdd)
                    getCateList();
                }
            })
        } else if (flag === 1) {
            //编辑 发起请求更新分类
            $.ajax({
                method: 'PUT',
                url: '/my/cate/info',
                data: $(this).serialize(),
                success(res) {
                    if (res.code !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    //更新成功 提示 关闭 刷新
                    layui.layer.msg(res.message)
                    layui.layer.close(indexEdit)
                    getCateList();
                }
            })
        }
    })

    //5、点击重置 事件委托
    $('body').on('click', '#btn_reset', function() {
        //回显数据
        if (flag === 1) {
            getCate();
        } else if (flag === 0) {
            //清空表单
            $('#form-info')[0].reset();
        }
    })

    //6、删除功能 利用事件委托
    $('tbody').on('click', '#btn_del', function() {
        //获取id
        let id = $(this).attr('data-id');
        layui.layer.confirm('确定删除嘛?', { icon: 3, title: '提示' }, function(index) {
            //发起请求根据id删除
            $.ajax({
                method: 'DELETE',
                url: "/my/cate/del?id=" + id,
                success(res) {
                    if (res.code !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    //成功 提示 刷新
                    layui.layer.msg(res.message)
                    getCateList();
                }
            })
        })
    })
})

//1、获取文章分类列表
function getCateList() {
    $.ajax({
        method: 'GET',
        url: '/my/cate/list',
        success(res) {
            if (res.code !== 0) {
                return layui.layer.msg(res.message)
            }
            //成功  渲染数据要页面 
            let str = template('tpl_table', res);
            $('#tb').html(str);
        }
    })
}