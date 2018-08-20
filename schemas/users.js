/**
 * Created by Tiffany270 on 2018/8/15.
 */

var mongoose=require('mongoose');

//将保持好的对象暴露出去
module.exports= new mongoose.Schema({
    username:String,
    password:String,
    isAdmin:{
        type:Boolean,
        default:false
    }

});
