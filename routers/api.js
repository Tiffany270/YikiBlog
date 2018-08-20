/*apiģ模块*/

var express = require('express');
var router = express.Router();
var User = require('../models/user');

//统一响应格式
var responseData;
router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: '',
        userInfo: ""
    };
    next();
});

//注册
/*
 * 密码不为空
 * 用户名不为空
 * 两次密码要一致
 * 用户名已注册
 *
 * */
router.post('/user/register', function (req, res) {
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if (username == '') {
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    if (password == '') {
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    if (password != repassword) {
        responseData.code = 3;
        responseData.message = '密码不一致';
        res.json(responseData);
        return;
    }

    User.findOne({
        username: username
    }).then(function (userInfo) {
        console.log(userInfo);
        if (userInfo) {
            //已经存在用户名
            responseData.code = 4;
            responseData.message = '已经存在该用户';
            res.json(responseData);
            return;
        }
        //保存用户信息到数据库中
        var user = new User({
            username: username,
            password: password
        });
        return user.save();

    }).then(function (newUserInfo) {
        console.log(newUserInfo);
        responseData.message = '注册成功';
        res.json(responseData);


    });


});

//登录
router.post('/user/login', function (req, res) {

    console.log(req.body);

    var username = req.body.username;
    var password = req.body.password;
    if (username == '') {
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    if (password == '') {
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }

    //查询用户名+密码是否存在数据库中
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        if (!userInfo) {
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        } else {
            //登录成功
            responseData.message = '登录成功';
            responseData.userInfo = {
                _id: userInfo._id,
                username: userInfo.username
            };
            //发送cookies
            req.cookies.set('userInfo',JSON.stringify({
                _id: userInfo._id,
                username: userInfo.username
            }));
            res.json(responseData);
            return;
        }
    })


});


//退出
router.get('/user/logout',function(req,res){
    req.cookies.set('userInfo',null);
    res.json(responseData);
    return;
});

module.exports = router;