var fs = require('fs');
var path = require('path');
//爬虫依赖
var superagent = require('superagent');
var cheerio = require('cheerio');
var request = require('request');

//转type
var getZhType =  function(name){
    var all = {'yule': '娱乐频道',
        'toutiao': '推荐',
        'junshi': '军事频道',
        'shipin': '视频频道',
        'shehui': '社会频道',
        'keji': '科技频道',
        'tiyu': '体育频道',
        'qiche': '汽车频道',
        'caijing': '财经频道',
        'jiankang': '健康频道',
        'redian': '热点频道',
        'guonei': '国内频道',
        'guoji': '国际频道',
        'shishang': '时尚频道',
        'lishi': '历史频道',
        'youxi': '游戏频道',
        'qinggan': '情感频道',
        'jiaju': '家居频道',
        'xingzuo': '星座频道',
        'kexue': '科学频道',
        'hulianwang': '互联网频道',
        'shuma': '数码频道',
        'waihui': '外汇频道',
        'gupiao': '股票频道',
        'qihuo': '期货频道',
        'jijin': '基金频道',
        'licai': '理财频道',
        'dianying': '电影频道',
        'dianshi': '电视频道',
        'zongyi': '综艺频道',
        'bagua': '八卦频道',
        'other':'其它'}
    var type = 'other';
    for(var k in all){
        if(all[k] === name){
            type = k;
        }
    }
    return type
}
//生产uk的方法
exports.madeuk = function() {
    var now = new Date();
    var m = now.getMonth() + 1 < 10 ? '0' + String(now.getMonth() + 1) : now.getMonth() + 1;
    return '' + now.getFullYear() + m + now.getDate() + now.getHours() + now.getMinutes() + now.getSeconds();
}
//处理文章的type
exports.getNameByType = function(type) {
    var name = '其它';
    switch (type) {
        case 'slowlife':
            name = '慢生活';
            break;
        case 'suiyansuiyu':
            name = '碎言碎语';
            break;
        case 'travel':
            name = '旅游';
            break;
        case 'learn':
            name = '学无止境';
            break;
        case 'huaijiu':
            name = '怀旧';
            break;
        case 'guanzhu':
            name = '关注';
            break;
        default:
            break;
    }
    return name;
}
//写总计文件 
exports.write_total = function(content) {
    var str;
    if (typeof content === 'object') {
        str = JSON.stringify(content);
    } else {
        str = content;
    }
    fs.writeFile('./public/total.json', str, function(err) {
        if (err) {
            console.log(err);
            return;
        }
    });
}
//读总计文件
exports.read_total = function(fn) {
    fs.readFile('./public/total.json', 'utf-8', function(err, data) {
        if (err) {
            console.log(err);
            return;
        }
        if (data) {
            var o = JSON.parse(data);
            if (!o.types) {
                o.types = [];
            }
            if (!o.total) {
                o.total = 0;
            }
            fn(o);
        } else {
            var o = {};
            o.types = [];
            o.total = 0;
            fn(o);
        }
    });
}
//读取文件夹
exports.read_dir = function(fn) {
    fs.readdir('./public/data', function(err, menu) {
        if (!menu) return;
        var dirArry = [];
        menu.forEach(function(ele) {
            dirArry.push('./public/data/' + ele);
        });
        //文件数组回传
        fn(dirArry);
    });
}
//写入文件
exports.write_file = function(content,url,fn){
	var str;
    if (typeof content === 'object') {
        str = JSON.stringify(content);
    } else {
        str = content;
    }
    fs.writeFile(url,str,function(err) {
        if (err) {fn(err,true);return;}
        fn(null,true);
    });
}
//读取文章对象
exports.readJson = function(dirArry, fn) {
    dirArry.map(function(item) {
        fs.readFile(item, 'utf-8', function(err, r) {
            (function(r) {
                var s = JSON.parse(r);
                //将获取的对象回传
                fn(s);
            })(r)
        });
    })
}
//中介方法 处理爬虫接口返回数据
exports.dealPa = function(result,fn) {
	var urlArry = [];
	var topJson = JSON.parse(result.body.replace(/^(instationTop50\()|\)$/g,''));
	topJson.data.forEach(function(list,i){
		if(list.url)urlArry.push(/^http/.test(list.url) ? list.url : 'http:'+list.url);
	});
	fn(urlArry);
}
exports.dealPa_v1 = function(result,fn){
    var tpJson = JSON.parse(result.body);
    fn(tpJson.data);
}
//单页面爬虫方法 url地址 fn对象 
exports.detalPage = function(url,fn) {
    //删掉空格
    var replaceText = function(text) {
        if (text) { return text.replace(/\n/g, "").replace(/\s/g, ""); }
    }
    //解析页面uk
    var getUk = function(url) {
        var item = url.replace('.html', '').split('/');
        return item[item.length - 1];
    }
    //分析当前页码
    var getPages = function(parry){
    	var a = [];
    	if(parry.length === 0)return a;
    	var max = Math.max.apply(null,parry);
    	for(var i = 2 ; i <= max ; i++){
    		a.push(i)
    	}
    	return a;
    }
    var accid = getUk(url);
    var curl = './public/data/' + accid + '.json'; //得到文件存放地址
    //爬取内页
    superagent.get(url).end(function(err, resp) {
        if (err) { return; }
        var $ = cheerio.load(resp.text);
        //图片数组
        var imgArry = [];
        $('.widt_ad').each(function(i, elem) {
            var _this = $(elem);
            var $img = _this.find('img');
            imgArry.push({
                width: $img.attr('width') * 1,
                height: $img.attr('height') * 1,
                url: $img.attr('src')
            });
        });
        //文章主题内容
        var pArray = [];
        $('#J-contain_detail_cnt p,#J-contain_detail_cnt div').each(function(i, elem) {
            var o = {};
            if (elem.children.length === 0) return;
            if (elem.name == 'div') {
                o.img = $(elem.children[0]).attr('src');
                if (o.img) pArray.push(o);
            } else if (elem.name == 'p') {
                o.p = replaceText(elem.children[0].data);
                if (o.p) pArray.push(o);
            }
        });
        //标签
        var tagStr = '';
        $('.article_tags ul.tagcns li a').each(function(i, elem) {
            var _this = $(elem);
            tagStr += '||' + _this.text();
        });
        //日期
        var date = '';
        if ($('.share_cnt_p  .fl i')[0]) {
            date = $('.share_cnt_p  .fl i')[0].children[0].data.split(' ')[0];
        } else {
            date = '2018-04-25';
        }
        //作者
        var author = '';
        var authorIt = $('.share_cnt_p  .fl i')[1];
        if (authorIt && authorIt.children.length !== 0) {
            author = replaceText(authorIt.children[0].data);
        } else {
            author = 'Peng.c';
        }
        if(author == 0) {author = 'Peng.c';}
        //文章类型
        var aName = '其它';
        if($('.detail_position').find('a')[1]){
        	aName = replaceText($('.detail_position').find('a')[1].children[0].data);
        }
        //解析下一页的uk
        var ukArry = [];
        var $pageAs = $('.pagination a');
        $('.pagination a').each(function(i,elem){
        	var _this = $(this);
        	var href = _this.attr('href');
        	if(href && href.split('?')[0].indexOf(accid) > -1){
        		var h = href.split('?')[0];
        		ukArry.push(h.replace('.html','').split('-')[1]);
        	}
        });
        var data = {
            "accid": accid,
            "title": replaceText($('.title_detail').find('h1 span').text()),
            "discription": replaceText($('#J-contain_detail_cnt').text()),
            "params": pArray,
            "imgurl": imgArry,
            "author": author,
            "keepword": '1',
            "readtimes": 0,
            "date": date,
            "tag": tagStr,
            "type": getZhType(aName),
            "name": aName,
            "ukArry":getPages(ukArry)
        }
        fn(data)
    });
}
//下一页的爬虫方法
exports.detalNextPage = function(data,fn){
	var url	= 'http://mini.eastday.com/a/'+data.accid+'-'+data.ukArry[0]+'.html';
	data.ukArry.shift();
	//删掉空格
    var replaceText = function(text) {
        if (text) { return text.replace(/\n/g, "").replace(/\s/g, ""); }
    }
	superagent.get(url).end(function(err, resp) {
        if (err) { data.ukArry = [];fn(data);return; }
        var $ = cheerio.load(resp.text);
        //图片数组
        var imgArry = [];
        $('.widt_ad').each(function(i, elem) {
            var _this = $(elem);
            var $img = _this.find('img');
            imgArry.push({
                width: $img.attr('width') * 1,
                height: $img.attr('height') * 1,
                url: $img.attr('src')
            });
        });
        //文章主题内容
        var pArray = [];
        $('#J-contain_detail_cnt p,#J-contain_detail_cnt div').each(function(i, elem) {
            var o = {};
            if (elem.children.length === 0) return;
            if (elem.name == 'div') {
                o.img = $(elem.children[0]).attr('src');
                if (o.img) pArray.push(o);
            } else if (elem.name == 'p') {
                o.p = replaceText(elem.children[0].data);
                if (o.p) pArray.push(o);
            }
        });
        data.imgurl = data.imgurl.concat(imgArry);
        data.params = data.params.concat(pArray);
        fn(data)
    });
}
//ajax接口爬虫
exports.detalJiekou = function(fn) {
    var aUrl = 'http://mini.eastday.com/json/index/instationTop50.json';
    request(aUrl, function(err, result) {
        if (err) { fn(err, null); return; }
        fn(null, result);
    });
}
//今日头条图片接口
exports.detalJiekou_v1 = function(fn){
    //今日头条的 图片主页地址https://www.toutiao.com/ch/gallery_photograthy/
    var aUrl = 'https://www.toutiao.com/api/pc/feed/?category=gallery_photograthy&utm_source=toutiao&max_behot_time=0&as=A1250A5E852CB61&cp=5AE5CC1BD691AE1&_signature=RcEB0QAAHya5uOutkvtuP0XBAc';
    request(aUrl, function(err, result) {
        if (err) { fn(err, null); return; }
        fn(null, result);
    });
}