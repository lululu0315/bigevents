//发布文章的JS文件
$(function() {
    initCate();
    //富文本的内置方法
    initEditor();

    function initCate() {
        //1、初始化分类列表
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                //获取成功 
                let str = template('tpl-pub', res)
                $('[name=cate_id]').html(str);
                layui.form.render();
            }
        })
    }

    //粘贴复制
    // 2、 初始化图片裁剪器
    let $image = $('#image')
        //  裁剪选项
    let options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        //  初始化裁剪区域
    $image.cropper(options)

    //3、点击选择封面的时候模拟点击上传文件按钮
    $('#btn_choose').on('click', function() {
        $('#coverFile').click();
    })

    //4、监听上传按钮的状态
    $('#coverFile').on('change', function(e) {
        //1. 拿到用户选择的文件
        let files = e.target.files;
        if (files.length === 0) {
            return
        }
        //2. 根据选择的文件， 创建一个对应的 URL 地址：
        let newImgURL = URL.createObjectURL(files[0]);
        //3. 先销毁旧的裁剪区域， 再重新设置图片路径， 之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //5、点击存为草稿
    let art_state = '已发布';
    $('#btn_save2').on('click', function() {
        art_state = '草稿';
    })

    //7、定义发布文章的方法
    function publishCate(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //**必须要加**
            contentType: false,
            processData: false,
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                //成功 提示 跳转到文章列表页
                layui.layer.msg(res.message);
                setTimeout(() => {
                    location.href = './art_list.html';
                }, 2000)
            }
        })
    }

    //8、根据列表页传过来的id重新发起请求回显数据
    //分析：需要判断是点击编辑进入的发布文章页面
    //      还是直接点击的发布文章
    let id = JSON.parse(localStorage.getItem('id'));

    //如果能在缓存中查找到id
    if (id) {
        //说明是通过编辑过来的
        //1)根据id重新获取数据
        $.ajax({
            method: 'GET',
            url: '/my/article/info?id=' + id,
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message);
                }
                //成功 通过form.val赋值
                layui.form.val('formData', res.data);
            }
        })

        //6、监听表单的提交事件
        $('#pubart').on('submit', function(e) {
            e.preventDefault();
            // 获取值 将表单传进去
            let fd = new FormData($(this)[0]);
            //额外添加状态值
            fd.append("state", art_state)

            //将封面裁剪后的图片转化为文件对象
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    //将文件对象存储到fd中
                    fd.append('cover_img', blob);
                    //发起请求 
                    UpdateArticle(fd);
                })
        })
    } else {
        //清空表单值
        $('#pubart')[0].reset();
        //点击发布文章进来的
        //6、监听表单的提交事件
        $('#pubart').on('submit', function(e) {
            e.preventDefault();
            // 获取值 将表单传进去
            let fd = new FormData($(this)[0]);
            //额外添加状态值
            fd.append("state", art_state)

            //将封面裁剪后的图片转化为文件对象
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    //将文件对象存储到fd中
                    fd.append('cover_img', blob);
                    //发起请求
                    publishCate(fd);
                })
        })
    }

    //9、定义更新文章的方法
    function UpdateArticle(fd) {
        $.ajax({
            method: 'PUT',
            url: '/my/article/info',
            //如果向服务器提交formData数据
            //必须添加以下两个配置项
            data: fd,
            contentType: false,
            processData: false,
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message);
                localStorage.removeItem('id');
                //跳转到文章列表页面
                location.href = '../article/art_list.html'
            }
        })
    }
})