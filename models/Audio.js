//用户类
var mongoose = require("mongoose");
//Schema对象
var Schema = mongoose.Schema;

//设置schema
var audioSchema = new Schema({
    "accid":Number,
    "name":String,
    "source":String,
    "imgurl":Number,
    "discription" : String,
    "type":String,
    "date" : String
});
//创建类
var Audio = mongoose.model("audio",audioSchema);
//向外暴露
module.exports = Audio;