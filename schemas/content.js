/**
 * Created by Tiffany270 on 2018/8/15.
 */

var mongoose=require('mongoose');

module.exports= new mongoose.Schema({
    title:String,
    category:{//是一个关联字段
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    summary:{
        type:String,
        default:''
    },
    content:{
        type:String,
        default:''
    },
    addTime:{
        type:Date,
        default:new Date()
    },
    //阅读量
    views:{
        type:Number,
        default:0
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});
