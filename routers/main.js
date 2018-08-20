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


    var contents=[];
    Content.find().sort({_id: -1}).limit(4).then(function(content){
        return contents=content;
    }).then(function(){

        console.log(contents);
        Category.find().then(function(categories){
            res.render('main/index',{
                userInfo:req.userInfo,
                categories:categories,
                content:contents
            });
        });

    });



    //Category.find().then(function(categories){
    //    res.render('main/index',{
    //        userInfo:req.userInfo,
    //        categories:categories
    //    });
    //});



});



module.exports = router;