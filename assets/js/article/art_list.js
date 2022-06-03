// 文章列表的JS文件
$(function() {
    select();
    //1、渲染下拉列表
    function select() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                let str = template('tpl-cate', res)
                $('[name=cate_id]').html(str);
                //内置方法渲染
                layui.form.render();
            }
        })
    }

    //要先定义数据
    let data = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据 默认每页显示两条
        cate_id: '', //文章的分类id
        state: '' //文章的发布状态
    }
    initTable();
    //2、渲染列表
    function initTable() {
        //发起请求渲染
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data,
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message)
                }
                //成功
                let str = template('tpl-table', res)
                $('tbody').html(str);
                layui.form.render();
                renderPage(res.total)
            }
        })
    }

    //定义美化事件的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);

        let yy = dt.getFullYear();
        let mm = padZero(dt.getMonth() + 1);
        let dd = padZero(dt.getDate());

        let h = padZero(dt.getHours());
        let m = padZero(dt.getMinutes());
        let s = padZero(dt.getSeconds());

        return `${yy}-${mm}-${dd}\t${h}:${m}:${s}`;
    }

    //定义补零的函数
    function padZero(num) {
        return num > 10 ? num : '0' + num
    }

    //3、筛选 
    // 监听表单的提交事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //将两个框的值传给data重新获取数据
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        // console.log(cate_id)
        // console.log(state)
        data.cate_id = cate_id;
        data.state = state;
        //重新查询
        initTable();
    })

    //4、渲染分页的方法
    function renderPage(total) {
        //获取文章的个数
        // console.log(total)
        let laypage = layui.laypage;

        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: data.pagesize, //每页显示几个
            curr: data.pagenum, //默认显示那一页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [1, 3, 5, 10],
            //1、分页发生切换的时候触发jump回调
            //2、只要调用了laypage.render()方法就会触发jump回调
            jump: function(obj, first) {
                // console.log(obj.curr)
                //将最新的页码值赋值到查询参数data上
                data.pagenum = obj.curr;
                data.pagesize = obj.limit;
                //可以通过first的值来判断是通过哪种方式触发的jump回调
                //如果first的值为true 证明是方式2触发的
                //如果first的值为undefined  证明是方式1触发的
                if (!first) {
                    //根据最新的数据
                    initTable();
                }
            }
        })
    }

    //5、删除文章
    //通过代理事件
    $('body').on('click', '#btn_del', function() {
        let id = $(this).attr('data-id'); //获取ID
        let len = $("#btn_del").length; //获取当前页面删除按钮的个数
        console.log(len)
            //询问
        layui.layer.confirm('确定删除嘛?', { icon: 3, title: '提示' }, function(index) {
            //发起请求
            $.ajax({
                method: 'DELETE',
                url: '/my/article/info?id=' + id,
                success(res) {
                    if (res.code !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    //成功 提示  刷新
                    layui.layer.msg(res.message);
                    //如果删除按钮的个数<=1  则显示上一页的数据
                    if (len <= 1) {
                        data.pagenum = data.pagenum === 1 ? 1 : data.pagenum - 1
                    }
                    initTable();
                }
            })
            layer.close(index);
        })
    })

    //6、点击编辑文章按钮  需要通过事件委托
    $('body').on('click', '.btn_edit', function() {
        //获取当前文章的id 
        let id = $(this).attr('data-id');
        // console.log(id)
        //存储在本地  不然跳转页面获取不到
        localStorage.setItem('id', id);
        //跳转页面
        location.href = './art_pub.html';
    })
})