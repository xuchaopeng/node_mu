var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/axitong');
//Schema对象
var Schema = mongoose.Schema;

//创建一个模型类
var Order = new Schema({
	
});
//axitong数据库下 有一个students集合
var Student = mongoose.model('order',{
	"name":String,
	"xuehao":Number,
	"age":Number
});

//实例化
var xiaoming = new Student({
	"name" : '小小',
	"xuehao" : 10001, 
	"age" : 19
});

//持久化
xiaoming.save();



var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var querystring = require('querystring');
var server = http.createServer(function(req,res){
	//得到用户的输入路径及文件名
	var pathname = url.parse(req.url).pathname;
	//req表示用户的访问
	switch(pathname){
		case '/':
		case '/index.html':
			fs.readFile('./page/index.html',function(error,data){
				if(error){return;}
				res.end(data);
			});
			break;
		case '/tongji':
			var result = '';
			//得到post请求
			req.on('data',function(dataitem){
				result += dataitem;
			});
			//全部报文发送完毕之后
			req.on('end',function(error){
				if(error)return;
				//全部字符串拼成对象
				var resultobj = querystring.parse(result);
				//准备要写入的文本
				var str = '';
				str += "******\n";
				str += "【username】"+resultobj.name + '\n';
				str += "【IP】"+req.connection.remoteAddress + '\n';
				str += "【password】"+resultobj.password + '\n';
				str += "【留言】" + resultobj.liuyan + '\n';
				//追加的文件
				fs.appendFile("./count.txt",str,function(err){
					if(err){
						res.writeHead(501,{"content-Type":"text/html;charset=utf-8"});
						res.end('WRONG');
					}
					//显示给用户的内容
					res.writeHead(200,{"content-Type":"text/html;charset=utf-8"});
					res.end('OK');
				});	
			});
			break;
		case '/channel':
			fs.readFile('./page/channel.html',function(error,data){
				res.end(data);
			});
			break;
		case '/detail':
			fs.readFile('./page/detail.html',function(error,data){
				res.end(data);
			});
			break;
		default:
			fs.readFile('./' + pathname,function(error,data){
				if(error){
					res.writeHead(404,{"content-Type":"text/html;charset=utf-8"});
					res.end("亲,木有这个页面呢")
				}
				res.writeHead(200,{"content-Type":"text/html;charset=utf-8"});
				res.end(data);
			});
		  	break;
	}
});
server.listen(8090);
//读取文件夹
/* Tools.read_dir(function(dirArry){
     Tools.readJson(dirArry,function(obj){
         //设置文章的accid 唯一标识
         var accid = obj.accid;
         //创建文章集合
         var a = new Article(obj);
         //创建文章基本信息集合
         var b = new ArticleBase(obj);
         //保存文章
         a.save(function(err){
             if(err){console.log(err);return;}
             //保存文章基本信息
             b.save(function(err){
                 if(err){return;}
                 //检查文章分类是否存在
                 ArticleClass.checkExit(obj.type,accid,function(exit,result){
                     if(exit){
                         //文章分类存在
                         var conditions = { name: result.name},options = {multi:true};
                         result.articles.push(accid);
                         var update = {$set:{"articles":result.articles,"alltotal":(result.alltotal+1)}};
                         ArticleClass.update(conditions,update,options,function(err,r){
                             if(err){return;}
                             Tools.read_total(function(totalAtypes){
                                 //更新并写入文件
                                 totalAtypes.total = totalAtypes.total + 1;
                                 Tools.write_total(totalAtypes);
                             });
                         });
                     }else{
                         //文章分类不存在 
                         if(result == null)return;
                         var c = new ArticleClass(result);
                         c.save(function(err){
                             if(err){return;}
                             //把articls的总数 及type的总数存入文件 方便后续使用改数据，而不用去大量检索数据库
                             Tools.read_total(function(totalAtypes){
                                 totalAtypes.types.push(result.type);
                                 totalAtypes.total = totalAtypes.total + 1;
                                 //更新并写入文件
                                 Tools.write_total(totalAtypes);
                             });
                         });
                     }
                 });
             });
         });
     });
 });*/