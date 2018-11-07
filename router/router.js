var Article = require("../models/Article.js");
var ArticleBase = require("../models/ArticleBase.js");
var ArticleClass = require("../models/ArticleClass.js");
var Audio = require("../models/Audio.js");
var Tools = require("../models/Tools.js");
var formidable = require('formidable');
var axios = require('axios');

//初始化所有的分类
exports.allType = function() {
        var typedata = ['slowlife', 'suiyansuiyu', 'travel', 'learn', 'huaijiu', 'guanzhu', 'other'];
        var reCheck = function(typedata) {
            ArticleClass.checkSelf(typedata[0], function(err, br) {
                if (err) return;
                if (br) {
                    typedata.splice(0, 1);
                    //存在继续next检查
                    if (typedata.length > 0) { reCheck(typedata); }
                } else {
                    //不存在则new它
                    ArticleClass.reclassParam(typedata[0], function(param) {
                        var c = new ArticleClass(param);
                        c.save(function(err) {
                            if (err) { /*console.log(param.type+'保存失败');*/
                                return;
                            }
                            typedata.splice(0, 1);
                            if (typedata.length > 0) { reCheck(typedata); }
                        });
                    });
                }
            });
        }
        reCheck(typedata);
    }
    //刷新 文章分类数据库
exports.doRefresh = function(req, res) {
        var querystring = req.query;
        if (querystring && querystring.password === '12241118') {
            //分类数据更新
            ArticleClass.reAllclass(function(allclass) {
                var classLen = allclass.length;
                allclass.map(function(list, classindex) {
                    ArticleBase.checkByType(list, function(parm) {
                        //更新文章分类
                        var conditions = { type: parm.type },
                            options = { multi: true };
                        var update = { $set: { "articles": parm.articles, "alltotal": parm.alltotal } };
                        ArticleClass.update(conditions, update, options, function(err, r) {
                            if (classindex === classLen - 1) { /*console.log('文章分类更新成功');*/ }
                        });
                    });
                });
            });
            res.json({ status: '1' });
        } else {
            res.json({ status: '0' });
        }
    }
    //爬虫技术
exports.detalJiekou = function(req, res) {
    //接口爬虫
    Tools.detalJiekou(function(err, results) {
        if (err) {
            return;
        }
        //后端静态
        Tools.dealPa(results, function(xcp) {
            //xcp 改变量在下面有用到
            var xcpLen = xcp.length;
            var xcpindex = 0;
            xcp.forEach(function(list, index) {
                ArticleBase.find({
                    accid: list.replace(/http:\/\/mini.eastday.com\/a\/(\d+)\.html/, function(match, $1) {
                        return $1
                    })
                }, function(err, resbase) {
                    if (err) return;
                    if (resbase.length > 0) {
                        return;
                    }
                    Tools.detalPage(list, function(data) {
                        //迭代拉去多页新闻
                        var reDeal = function(data) {
                            if (data.ukArry.length > 0) {
                                Tools.detalNextPage(data, function(r) { reDeal(r); });
                            } else {
                                var urlFile = './public/data/' + data.accid + '.json';
                                //全部页码拉取成功 写入文件
                                Tools.write_file(data, urlFile, function(err, r) {
                                    if (r) {
                                        Tools.readJson([urlFile], function(obj) {
                                            //设置文章的accid 唯一标识
                                            var accid = obj.accid;
                                            //创建文章集合
                                            var a = new Article(obj);
                                            //创建文章基本信息集合
                                            var b = new ArticleBase(obj);
                                            //保存文章
                                            a.save(function(err) {
                                                if (err) {
                                                    console.log(err);
                                                    return;
                                                }
                                                //保存文章基本信息
                                                b.save(function(err) {
                                                    if (err) {
                                                        return;
                                                    }
                                                    xcpindex++;
                                                    if (xcpindex === xcpLen) {
                                                        /*console.log('文章、文章基本信息已存入数据库');*/
                                                        //爬取文章、文章基本信息已存入数据库
                                                        ArticleClass.reAllclass(function(allclass) {
                                                            var classLen = allclass.length;
                                                            // console.log(allclass);
                                                            allclass.map(function(list, classindex) {
                                                                ArticleBase.checkByType(list, function(parm) {
                                                                    // console.log(parm);
                                                                    //更新文章分类
                                                                    var conditions = { type: parm.type },
                                                                        options = { multi: true };
                                                                    var update = { $set: { "articles": parm.articles, "alltotal": parm.alltotal } };
                                                                    ArticleClass.update(conditions, update, options, function(err, r) {
                                                                        if (classindex === classLen - 1) { /*console.log('文章分类更新成功');*/ }
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    }
                                                });
                                            });
                                        });
                                    }
                                });
                            }
                        }
                        reDeal(data);
                    });
                })
            });
        });
    });
}
exports.detalJiekou_v1 = function(req, res) {
        Tools.detalJiekou_v1(function(err, result) {
            if (err) {
                return;
            }
            Tools.dealPa_v1(result, function(xcp) {
                console.log('haha');
                res.json(xcp.length);
            });
        });
    }
//展示首页
exports.showIndex = function(req, res) {
    res.render("index.ejs")
}
//手机端首页
exports.showMindex = function(req, res) {
    res.render("mobile/index.ejs");
}
//手机端详情页
exports.showDetail = function(req, res) {
    res.render('mobile/detail.ejs');
}
//手机端二级页
exports.showChannel = function(req, res) {
    res.render('mobile/channel.ejs');
}
//手机端搜索页
exports.showSearch = function(req, res) {
    res.render('mobile/search.ejs');
}
//展示detail文章页
exports.showArticle = function(req, res) {
    var id = req.params["id"];
    Tools.read_total(function(d) {
        res.render("detail.ejs", {
            item: {},
            types: d.types,
            total: d.total
        });
    });
}
//展示归档页
exports.showArchive = function(req, res) {
    res.render('archive.ejs');
}
//展示总分类页
exports.showArticleClass = function(req, res) {
    ArticleClass.find({}, function(err, results) {
        var data = {};
        if (err) {
            res.send('请求出错!');
            return;
        }
        data.data = results;
        res.render('article-class.ejs', {
            data: results
        });
    });
}
//显示分类页 
exports.showFenLei = function(req, res) {
    var id = req.params['id'];
    ArticleClass.find({ type: id }, function(err, results) {
        if (err) {
            res.send('无该分类页面');
            return;
        }
        //读取文章总计及分类
        Tools.read_total(function(d) {
            res.render('article-fenlei.ejs', {
                types: d.types,
                total: d.total
            });
        })
    });
}
//展示关于about页
exports.showAbout = function(req, res) {
    res.render("about.ejs");
}
//后台编辑页
exports.showReg = function(req, res) {
    res.render("reg.ejs");
}
//post请求接口 增加数据
exports.doAdd = function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.json({ 'status': '-1', 'prompt': 'Data acquisition failure' });
            return;
        }
        //设置文章的accid 唯一标识
        var accid = Tools.madeuk();
        fields.accid = accid;
        //根据文章的type设置中文name
        fields.name = Tools.getNameByType(fields.type);
        fields.readtimes = 1;
        //处理图片url数组
        var imgStr = fields.imgurl.split('&&&');
        var imgArray = new Array();
        for (var c = 0, cl = imgStr.length; c < cl; c++) {
            imgArray.push({ 'width': 0, height: 0, 'url': imgStr[c] });
        }
        fields.imgurl = imgArray;
        //创建文章集合
        var a = new Article(fields);
        //创建文章基本信息集合
        var b = new ArticleBase(fields);
        //保存文章
        a.save(function(err) {
            if (err) {
                res.json({ 'status': '-1', 'prompt': 'Article save failed' });
                return;
            }
            //保存文章基本信息
            b.save(function(err) {
                if (err) {
                    res.json({ 'status': '-1', 'prompt': 'Articlebase save failed' });
                    return;
                }
                //检查文章分类是否存在
                ArticleClass.checkExit(fields.type, accid, function(exit, result) {
                    if (exit) {
                        //文章分类存在
                        var conditions = { name: result.name },
                            options = { multi: true };
                        result.articles.push(accid);
                        var update = { $set: { "articles": result.articles, "alltotal": (result.alltotal + 1) } };
                        ArticleClass.update(conditions, update, options, function(err, r) {
                            if (err) {
                                res.json({ 'status': '-1', 'prompt': 'Article classification update failed' });
                                return;
                            }
                            //返回处理状态
                            res.json({ 'status': '1', 'prompt': 'success' });
                            Tools.read_total(function(totalAtypes) {
                                //更新并写入文件
                                totalAtypes.total = totalAtypes.total + 1;
                                Tools.write_total(totalAtypes);
                            });
                        });
                    } else {
                        //文章分类不存在 
                        if (result == null) return;
                        var c = new ArticleClass(result);
                        c.save(function(err) {
                            if (err) {
                                res.json({ 'status': '-1', 'prompt': 'Article classification creation failed' });
                                return;
                            }
                            res.json({ 'status': '1', 'prompt': 'success' });
                            //把articls的总数 及type的总数存入文件 方便后续使用改数据，而不用去大量检索数据库
                            Tools.read_total(function(totalAtypes) {
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
}
//post请求接口 配置编辑音频源接口
exports.doAddAudio = function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.json({ 'status': '-1', 'prompt': 'Audio Data acquisition failure' });
            return;
        }
        var accid = Tools.madeuk();
        fields.accid = accid;
        var a = new Audio(fields);
        a.save(function(err) {
            if (err) {
                res.json({ 'status': '-1', 'prompt': 'Audio save failed' });
                return;
            }
            res.json({ 'status': '1', 'prompt': 'success' });
        });
    });
}
//get 音频源接口
exports.doAudio = function(req, res) {
    Audio.find({}, function(err, results) {
        if (err) {
            res.json({ 'status': '-1', 'prompt': 'Audio search failure' });
            return;
        }
        res.json({ 'status': '1', 'data': results });
    });
}
//get 文章搜索接口
exports.doSearch = function(req, res) {
    var s = decodeURIComponent(req.query['searchwords']);
    ArticleBase.find({}, function(err, results) {
        if (err) {
            res.json({ 'status': '-1', 'prompt': 'Data search failure' });
            return;
        }
        res.json({ 'status': '1', 'data': results });
    });
}
//post请求接口 阅读统计
exports.doReadNum = function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.send('-1');
            return;
        }
        //文章的accid
        var cid = fields.accid;
        Article.find({ accid: cid }, function(err, result) {
            if (err) {
                res.send('-1');
                return;
            }
            var num = result[0].readtimes;
            if (typeof num !== 'undefined') {
                num = num + 1;
            } else {
                num = 0;
            }
            var newvalue = { $set: { 'readtimes': num } };
            //改变阅读量
            Article.update({ 'accid': cid }, newvalue, function(err) {
                if (err) {
                    res.send('-1');
                } else {
                    res.send('1');
                }
            });

        });
    })
}
/*get 外放文章基本信息接口*/
exports.doBase = function(req, res) {
    var _id = req.query.acc_id;
    //获取集合总数
    ArticleBase.count({}, function(err, count) {
        //分页检索
        ArticleBase.fetch(_id, function(err, results) {
            var data = new Object();
            if (err) {
                data.status = '-1';
                res.json(data);
                return;
            }
            data.status = '1';
            data.allnumber = count;
            data.data = results;
            //获取所有的分类
            ArticleClass.reAllclass(function(typeArry) {
                data.types = typeArry;
                res.json(data);
            });
        });
    });
}
/*get 根据type获取该类型的文章集合*/
exports.doBaseByType = function(req, res) {
    var type = req.params['type'];
    ArticleBase.find({ type: type }, function(err, results) {
        if (err) {
            res.json({ 'status': '-1', 'prompt': 'Classification failure' });
            return;
        }
        res.json({ 'status': '1', 'data': results, 'name': Tools.getNameByType(type), 'prompt': 'success' });
    });
}
//get 外放文章分类接口 
exports.doClass = function(req, res) {
    ArticleClass.find({}, function(err, results) {
        var data = {};
        if (err) {
            data.status = '-1';
            res.json(data);
            return;
        }
        data.status = '1';
        data.data = results;
        res.json(data);
    });
}
//post 外放单一文章信息接口
exports.checkArticle = function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.json({ 'status': '-1', 'prompt': 'Data acquisition failure' });
            return;
        }
        Article.find(fields, function(err, results) {
            if (err) {
                res.json({ 'status': '-1', 'prompt': 'Data check failure' });
                return;
            }
            var data = {};
            data.status = '1';
            data.data = results;
            res.json(data);
        });
    });
}
//分页外放文章信息接口 一次8条
exports.checkArticleByPage = function(req,res){
    var _id = req.query.acc_id;
    Article.count({}, function(err, count) {
        //分页检索
        Article.fetch(_id, function(err, results) {
            var data = new Object();
            if (err) {
                data.status = '-1';
                res.json(data);
                return;
            }
            data.status = '1';
            data.allnumber = count;
            data.data = results;
            //获取所有的分类
            ArticleClass.reAllclass(function(typeArry) {
                data.types = typeArry;
                res.json(data);
            });
        });
    });
}
exports.checkArticleByType = function(req,res){
    var _id = req.query.acc_id;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    Article.fetchByType(_id,function(err,results){
        if(err){
            res.json({'status': '1', 'prompt': '数据检索失败'})
            return;
        }
        res.json({'status': '1', 'prompt': 'success',data:results})
    })
}
//音乐播放器代理接口
exports.recommendJk = function(req,res){
    var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    axios.get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    }).then((response) => {
      res.json(response.data)
    }).catch((e) => {
      res.json('error')
    })
}
