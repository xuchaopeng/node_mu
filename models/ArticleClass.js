//用户类
var mongoose = require("mongoose");
//Schema对象
var Schema = mongoose.Schema;

//设置schema
var articleClass = new Schema({
	"biaohao":Number,
    "name":String,
    "type":String,
    "articles" : [Number],
    "alltotal":Number
});
//返回type分类的相关参数
articleClass.statics.reclassParam = function(type,callback){
	var param = {};
	switch(type){
		case 'slowlife':
			param.biaohao = 20001;
			param.name = '慢生活';
			param.type = 'slowlife';
			break;
		case 'suiyansuiyu':
			param.biaohao = 20002;
			param.name = '碎言碎语';
			param.type = 'suiyansuiyu';
			break;
		case 'travel':
			param.biaohao = 20003;
			param.name = '旅游';
			param.type = 'travel';
		 	break;
		case 'learn':
			param.biaohao = 20004;
			param.name = '学无止境';
			param.type = 'learn';
			break;
		case 'huaijiu':
			param.biaohao = 20005;
			param.name = '怀旧';
			param.type = 'huaijiu';
			break;
		case 'guanzhu':
			param.biaohao = 20006;
			param.name = '关注';
			param.type = 'guanzhu';
			break;
		case 'other':
			param.biaohao = 20000;
			param.name = '其它';
			param.type = 'other';
			break;
		default:
			break;
	}
	param.articles = [];
	param.alltotal = 0;
	callback(param);
}
//返回所有的分类参数
articleClass.statics.reAllclass = function(callback){
	callback([
		{name:'慢生活',type:'slowlife',biaohao:'20001'},
		{name:'碎言碎语',type:'suiyansuiyu',biaohao:'20002'},
		{name:'旅游',type:'travel',biaohao:'20003'},
		{name:'学无止境',type:'learn',biaohao:'20004'},
		{name:'怀旧',type:'huaijiu',biaohao:'20005'},
		{name:'关注',type:'guanzhu',biaohao:'20006'},
		{name:'其它',type:'other',biaohao:'20000'}
	]);
}
//检查单个分类是否存在 true为存在
articleClass.statics.checkSelf = function(type,callback){
	this.find({type:type},function(err,results){
		if(err){callback(err,false);return;}
		if(results.length === 0){
			callback(null,false);
		}else{
			callback(null,true);
		}
	});
}
articleClass.statics.checkExit = function(leibei,accid,callback){
	this.find({"type":leibei},function(err,results){
		if(err){
			callback(false,null);
			return;
		}
		if(results.length === 0){
			var param = {
				"biaohao":20000,
                "name":'其它',
                "type":"other",
                "articles" : [accid],
                "alltotal":1
			}
			switch(leibei){
				case 'slowlife':
					param.biaohao = 20001;
					param.name = '慢生活';
					param.type = 'slowlife';
					break;
				case 'suiyansuiyu':
					param.biaohao = 20002;
					param.name = '碎言碎语';
					param.type = 'suiyansuiyu';
					break;
				case 'travel':
					param.biaohao = 20003;
					param.name = '旅游';
					param.type = 'travel';
				 	break;
				case 'learn':
					param.biaohao = 20004;
					param.name = '学无止境';
					param.type = 'learn';
					break;
				case 'huaijiu':
					param.biaohao = 20005;
					param.name = '怀旧';
					param.type = 'huaijiu';
					break;
				case 'guanzhu':
					param.biaohao = 20006;
					param.name = '关注';
					param.type = 'guanzhu';
					break;
				default:
					break;
			}

			//不存在 则将配置对象返回
			callback(false,param);
		}else{
			//存在 则将实例对对象返回
			callback(true,results[0]);
		}
	});
}
//创建类
var ArticleClass = mongoose.model("articleclass",articleClass);
//向外暴露
module.exports = ArticleClass;