/*首页
 /
 /register
 /login
 /comment
 /comment/post
 */
var express = require('express');
var router = express.Router();
var Category=require("../models/category");
var Content = require('../models/content');


router.get('/', function (req, res, next) {



    var categoryId = req.query.id;
    var contents=[];
    Content.find({
        category:categoryId
    }).then(function(content){
       return contents=content;
    }).then(function(){

        console.log(contents);
        Category.find().then(function(categories){
            res.render('blog/list',{
                userInfo:req.userInfo,
                categories:categories,
                content:contents
            });
        });

    });







});



module.exports = router;