/**
 * Created by Tiffany270 on 2018/8/16.
 * 内容模块
 */

var mongoose = require('mongoose');
var contentSchema = require('../schemas/content');

module.exports = mongoose.model('Content', contentSchema);
