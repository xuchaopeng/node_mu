var express = require("express");
var app = express();
var router = require('./router/router.js');

//数据库连接
var mongoose = require('mongoose');
//链接数据库，注意/后面的是数据库名字，如果数据不存在会自动创建
mongoose.connect('mongodb://localhost/myboke');

//设置模板引擎
app.set("view engine","ejs");

//初始化所有的分类
router.allType();
//pc端路由清单
app.get("/",router.showIndex); //显示首页
app.get("/index.html",router.showIndex); //显示首页
app.get("/about",router.showAbout); // 显示关于我们
app.get("/archive",router.showArchive); // 显示归档页
app.get("/article-class",router.showArticleClass); // 显示总分类页
app.get("/article-class/:id",router.showFenLei); //显示分类页
app.get('/reptile',router.detalJiekou_v1);
//15分钟爬取一次
setTimeout(function(){
	router.detalJiekou();
},2000);
setInterval(function(){
	router.detalJiekou();
},1000*60*15);
//手机端路由清单
app.get("/mobile",router.showMindex); // 手机端首页
app.get('/mobile/search',router.showSearch); // 手机端搜索页
app.get('/mobile/detail/:id',router.showDetail); //手机端详情页
app.get('/mobile/channel',router.showChannel); //手机端详情页
//接口路由清单
app.get("/reg",router.showReg); // 显示后台编辑页
app.post("/statics/add",router.doAdd); //  ajax接口添加数据
app.get('/statics/search',router.doSearch); //ajax搜索接口
app.post('/statics/readnum',router.doReadNum); // ajax阅读统计接口
app.post('/statics/article',router.checkArticle); // ajax返回单一文章的信息
app.get('/statics/articlebypage',router.checkArticleByPage); // ajax分页外放文章信息接口 一次8条
app.get("/statics/article-base",router.doBase); // 文章基本信息外放接口
app.get("/statics/article-base/:type",router.doBaseByType); // 根据type获取该类型的 基本信息外放接口
app.get("/statics/article-class",router.doClass); // 文章分类信息外放接口 一次8条
app.post("/statics/add/audio",router.doAddAudio); //音频播放源编辑接口
app.get("/statics/audio",router.doAudio); //音频播放源外放接口

//刷新文章分类 数据库
app.get('/statics/refresh',router.doRefresh); // 刷新数据库 
app.get("/detail/num/:id",router.showArticle); // 显示文章页
//静态资源
app.use("/public",express.static("public"));
//监听
app.listen(8090);
