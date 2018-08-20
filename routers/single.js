/*首页
 /
 /register
 /login
 /comment
 /comment/post
 */
var express = require('express');
var router = express.Router();
var Category = require("../models/category");
var Content = require('../models/content');


router.get('/', function (req, res, next) {

    var contentId = req.query.id;
    var contents = '';

    Content.findOne({
        _id: contentId
    }).populate('category').then(function (content) {
        content.views++;
        content.save();
       return contents = content;
    }).then(function(){
        Category.find().then(function (categories) {
            console.log(contents);
            res.render('blog/single', {
                userInfo: req.userInfo,
                categories: categories,
                contents: contents
            });
        });



    });


});


module.exports = router;