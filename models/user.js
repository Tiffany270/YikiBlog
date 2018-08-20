/**
 * Created by Tiffany270 on 2018/8/16.
 * 模型类模块
 */

var mongoose = require('mongoose');
var userSchema = require('../schemas/users');

module.exports = mongoose.model('User', userSchema);
