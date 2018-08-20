/*后台管理模块

 /user
 /category
 /category/add
 /category/edit
 /category/delete
 /article
 /comment
 * */
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Category = require('../models/category');
var Content = require('../models/content');

router.use(function (req, res, next) {
    if (!req.userInfo.isAdmin) {
        res.send('权限不足！');
        return;
    }
    next();
});
//首页
router.get('/', function (req, res, next) {
    res.render('admin/index', {
        userInfo: req.userInfo
    });
});

//用户管理
/*limit(Num)分页用
 * skip(num)分页用，忽略数据的条数
 *
 * 每页显示5条
 * 1~5 skip:0  当前页-1*limit
 * 5~10 skip:5
 *
 * page不可以为负数，也不能大于总页数
 * */
router.get('/user', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 5;
    var skip = (page - 1) * limit;
    var totalPage = User.count().then(function (count) {
        totalPage = Math.ceil(count / limit);//向上取整
        page = Math.min(page, totalPage);//取值范围
        page = Math.max(page, 1);//限制page的值

        User.find().limit(5).skip(skip).then(function (users) {
            res.render('admin/user_index', {
                userInfo: req.userInfo,
                users: users,
                page: page,
                count: count,
                totalPage: totalPage
            });
        });


    });


});

//分类管理
router.get('/category', function (req, res) {
    var page = Number(req.query.page || 1);
    var limit = 5;
    var skip = (page - 1) * limit;
    var totalPage = Category.count().then(function (count) {
        totalPage = Math.ceil(count / limit);//向上取整
        page = Math.min(page, totalPage);//取值范围
        page = Math.max(page, 1);//限制page的值

        /*1升序 -1降序*/
        Category.find().sort({_id: -1}).limit(5).skip(skip).then(function (categories) {
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,
                page: page,
                count: count,
                totalPage: totalPage
            });
        });


    });


});

//添加分类(跳转)
router.get('/category/add', function (req, res) {
    res.render('admin/category_add', {
        userInfo: req.userInfo
    });
});

//添加分类（post)
router.post('/category/add', function (req, res) {
    var name = req.body.name || '';
    if (name == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '名称不能为空'
        });
    }
    //是否已经存在同名的分类
    Category.findOne({
        name: name
    }).then(function (rs) {
        if (rs) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类已经存在'
            });
            return Promise.reject();
        } else {
            //不存在，可以保存
            return new Category({
                name: name
            }).save();
        }
    }).then(function (newCategory) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '分类保存成功',
            url: '/admin/category'
        });
    });


});


//分类修改
router.get('/category/edit', function (req, res) {

    var id = req.query.id || '';
    //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类不存在'
            });
            return Promise.reject();
        }
        else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        }
    });

});

//分类修改保存
router.post('/category/edit', function (req, res) {

    var id = req.query.id || '';
    var name = req.body.name || '';
    console.log("post" + id);


    Category.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类不存在'
            });
            console.log(category);
        } else {
            if (name == category.name) {
                //不做修改的时候
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                });
                return Promise.reject();
            }
            else {
                //要修改的分类名称是否已经在数据库中
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                });
            }
        }
    }).then(function (sameCategory) {
        if (sameCategory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '已经存在同名的分类'
            });
            return Promise.reject();
        }
        else {
            return Category.update({
                _id: id
            }, {
                name: name
            });
        }
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        });
    });


});

//分类删除
router.get('/category/delete', function (req, res) {
    var id = req.query.id || '';

    Category.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        });
    })
});

//内容首页
router.get('/content', function (req, res) {

    var page = Number(req.query.page || 1);
    var limit = 5;
    var skip = (page - 1) * limit;

    var totalPage = Content.count().then(function (count) {
        totalPage = Math.ceil(count / limit);//向上取整
        page = Math.min(page, totalPage);//取值范围
        page = Math.max(page, 1);//限制page的值

        /*1升序 -1降序*/
        Content.find()
            .sort({_id: -1})
            .limit(5)
            .skip(skip).populate('category')
            .then(function (contents) {
                res.render('admin/content_index', {
                    userInfo: req.userInfo,
                    contents: contents,
                    page: page,
                    count: count,
                    totalPage: totalPage
                });
            });


    });


});
//内容增加跳转
router.get('/content/add', function (req, res) {

    Category.find().then(function (categories) {
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories
        })
    });


});
//内容增加保存
router.post('/content/add', function (req, res) {
    var category = req.body.category;
    var title = req.body.title;
    var content = req.body.content;

    console.log(req.body);
    if (content == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容不能为空'
        });
        return;
    }
    if (title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '标题不能为空'
        });
        return;
    }

    //保存数据
    new Content({
        user:req.userInfo._id.toString(),
        category: category,
        title: title,
        summary: req.body.summary,
        content: content
    }).save().then(function () {
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '保存成功',
                url: '/admin/content'
            });
        });


});
//内容修改（跳转)
router.get('/content/edit', function (req, res) {

    var id = req.query.id || '';
    var categories=[];

    Category.find().then(function (rs) {
        categories = rs;
        console.log(rs);
        //获取要修改的分类信息
       return  Content.findOne({
            _id: id
        }).populate('category');
    }).then(function (content) {
        if (!content) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '该文章不存在'
            });
            return Promise.reject();
        }
        else {
            res.render('admin/content_edit', {
                userInfo: req.userInfo,
                content: content,
                categories:categories
            });
        }
    });


});

//内容修改保存
router.post('/content/edit', function (req, res) {
    var id = req.query.id || '';
    var category = req.body.category;
    var title = req.body.title;
    var content = req.body.content;

    console.log(req.body);
    if (content == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容不能为空'
        });
        return;
    }
    if (title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '标题不能为空'
        });
        return;
    }

    //保存数据
    Content.update({
        _id:id
    },{
        category: category,
        title: title,
        summary: req.body.summary,
        content: content
    }).then(function () {
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '保存成功',
                url: '/admin/content'
            });
        });


});
router.get('/content/delete', function (req, res) {
    var id = req.query.id || '';

    Content.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/content'
        });
    })
});


module.exports = router;