/*
 * nohup node servier.js & 后台一直运行
 * mongod --dbpath=xxx --prot=27018
 * */

var express = require('express');

var swig = require('swig');//模板
var mongoose = require('mongoose');//数据库
var bodyParser = require('body-parser');//处理Post数据的中间件
var Cookies = require('cookies');
var User = require('./models/user');

var app = express();

//静态资源
app.use('/public', express.static(__dirname + '/public'));

//模板引擎
app.engine('html', swig.renderFile);//后缀+解析模板内容的方法
app.set('views', './views');//模板文件存放的目录
app.set('view engine', 'html');//注册所使用的模板引擎
swig.setDefaults({cache: false});//消除模板缓存

//body-parser设置
app.use(bodyParser.urlencoded({extended: true}));

//cookies设置中间件
app.use(function (req, res, next) {
    req.cookies = new Cookies(req, res);
    req.userInfo = {};
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            //获取当前登录的用户类型
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            });
        } catch (e) {
            next();
        }

    } else {
        next();
    }
});

app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));
app.use('/list', require('./routers/list'));
app.use('/single', require('./routers/single'));


mongoose.connect('mongodb://localhost:27018/blog', function (err) {
    if (err) {
        console.log('失败');
    }
    else {
        console.log('成功');
        app.listen(8081);
    }
});
