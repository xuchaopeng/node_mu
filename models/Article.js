//用户类
var mongoose = require("mongoose");
//Schema对象
var Schema = mongoose.Schema;

//设置schema
var articleSchema = new Schema({
  "accid": Number,
  "title": String,
  "discription": String,
  "params": [Schema.Types.Mixed],
  "imgurl": [{ width: Number, height: Number, url: String }],
  "author": String,
  "keepword": String, // 0为人工编辑  1为爬虫自动获取
  "readtimes": Number,
  "date": String,
  "tag": String,
  "type": String,
  "name": String
});
//提供一个静态方法，静态方法就是类名直接打点调用的方法
articleSchema.statics.checkExist = function (email, callback) {
  //this是类名，不是schema
  this.find({ "email": email }, function (err, results) {
    if (results.length == 0) {
      callback(false);
    } else {
      callback(true);
    }
  });
}
//分页 检索数据库
articleSchema.statics.fetch = function (id, callback) {
  if (id) {
    this.find({ '_id': { '$lt': id } }).limit(8).sort({ '_id': -1 }).exec(callback);
  } else {
    this.find().limit(8).sort({ '_id': -1 }).exec(callback);
  }
}
//分类型  分页检索数据库
articleSchema.statics.fetchByType = function (id, type, callback) {
  if (id) {
    this.find({ '_id': { '$lt': id } }).where('type', type).limit(2).exec(callback)
  } else {
    this.find().where('type', type).limit(2).exec(callback)
  }
}
//创建类
var Article = mongoose.model("article", articleSchema);
//向外暴露
module.exports = Article;