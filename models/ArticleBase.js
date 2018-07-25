//用户类
var mongoose = require("mongoose");
//Schema对象
var Schema = mongoose.Schema;

//设置schema
var articleBaseSchema = new Schema({
    "accid":Number,
    "title" : String,
    "imgurl" : [{"width":Number,"height":Number,"url":String}],
    "author" : String,
    "keepword":String,
    "readtimes":Number,
    "date" : String,
    "tag": String,
    "type":String,
    "name":String
});
//参数p p.type为类型 p.name为中文名
articleBaseSchema.statics.checkByType = function(p,callback){
    this.find({type:p.type},function(err,results){
        if(err){return;}
        var classParam = {name:p.name,type:p.type,articles:[],alltotal:results.length};
        results.forEach(function(item){
            classParam.articles.push(item.accid);
        });
        callback(classParam);
    });
}
//分页 检索数据库
articleBaseSchema.statics.fetch = function(id,callback){
    if(id){
        this.find({'_id':{'$lt':id}}).limit(8).sort({'_id':-1}).exec(callback);
    }else{
        this.find().limit(8).sort({'_id':-1}).exec(callback);
    }
}
//创建类
var ArticleBase = mongoose.model("articlebase",articleBaseSchema);
//向外暴露
module.exports = ArticleBase;