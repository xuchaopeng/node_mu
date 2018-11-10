//用户类
var mongoose = require("mongoose");
//Schema对象
var Schema = mongoose.Schema;

//设置schema
var articleClass = new Schema({
    "biaohao": Number,
    "name": String,
    "type": String,
    "articles": [Number],
    "alltotal": Number
});
//返回type分类的相关参数
articleClass.statics.reclassParam = function(type, callback) {
    var param = {};
    switch (type) {
        case 'yule':
            param.biaohao = 20001;
            param.name = '娱乐频道';
            param.type = 'yule';
            break;
        case 'toutiao':
            param.biaohao = 20002;
            param.name = '推荐';
            param.type = 'toutiao';
            break;
        case 'junshi':
            param.biaohao = 20003;
            param.name = '军事频道';
            param.type = 'junshi';
            break;
        case 'shipin':
            param.biaohao = 20004;
            param.name = '视频频道';
            param.type = 'shipin';
            break;
        case 'shehui':
            param.biaohao = 20005;
            param.name = '社会频道';
            param.type = 'shehui';
            break;
        case 'keji':
            param.biaohao = 20006;
            param.name = '科技频道';
            param.type = 'keji';
            break;
        case 'tiyu':
            param.biaohao = 20007;
            param.name = '体育频道';
            param.type = 'tiyu';
            break;
        case 'qiche':
            param.biaohao = 20008;
            param.name = '汽车频道';
            param.type = 'qiche';
            break;
        case 'caijing':
            param.biaohao = 20009;
            param.name = '财经频道';
            param.type = 'caijing';
            break;
        case 'jiankang':
            param.biaohao = 200010;
            param.name = '健康频道';
            param.type = 'jiankang';
            break;
        case 'redian':
            param.biaohao = 200011;
            param.name = '热点频道';
            param.type = 'redian';
            break;
        case 'guonei':
            param.biaohao = 200012;
            param.name = '国内频道';
            param.type = 'guonei';
            break;
        case 'guoji':
            param.biaohao = 200013;
            param.name = '国际频道';
            param.type = 'guoji';
            break;
        case 'shishang':
            param.biaohao = 200014;
            param.name = '时尚频道';
            param.type = 'shishang';
            break;
        case 'lishi':
            param.biaohao = 200015;
            param.name = '历史频道';
            param.type = 'lishi';
            break;
        case 'youxi':
            param.biaohao = 200016;
            param.name = '游戏频道';
            param.type = 'youxi';
            break;
        case 'qinggan':
            param.biaohao = 200017;
            param.name = '情感频道';
            param.type = 'qinggan';
            break;
        case 'jiaju':
            param.biaohao = 200018;
            param.name = '家居频道';
            param.type = 'jiaju';
            break;
        case 'xingzuo':
            param.biaohao = 200019;
            param.name = '星座频道';
            param.type = 'xingzuo';
            break;
        case 'kexue':
            param.biaohao = 200020;
            param.name = '科学频道';
            param.type = 'kexue';
            break;
        case 'hulianwang':
            param.biaohao = 200021;
            param.name = '互联网频道';
            param.type = 'hulianwang';
            break;
        case 'shuma':
            param.biaohao = 200022;
            param.name = '数码频道';
            param.type = 'shuma';
            break;
        case 'waihui':
            param.biaohao = 200023;
            param.name = '外汇频道';
            param.type = 'waihui';
            break;
        case 'gupiao':
            param.biaohao = 200024;
            param.name = '股票频道';
            param.type = 'gupiao';
            break;
        case 'qihuo':
            param.biaohao = 200025;
            param.name = '期货频道';
            param.type = 'qihuo';
            break;
        case 'jijin':
            param.biaohao = 200026;
            param.name = '基金频道';
            param.type = 'jijin';
            break;
        case 'licai':
            param.biaohao = 200027;
            param.name = '理财频道';
            param.type = 'licai';
            break;
        case 'dianying':
            param.biaohao = 200028;
            param.name = '电影频道';
            param.type = 'dianying';
            break;
        case 'dianshi':
            param.biaohao = 200029;
            param.name = '电视频道';
            param.type = 'dianshi';
            break;
        case 'zongyi':
            param.biaohao = 200030;
            param.name = '综艺频道';
            param.type = 'zongyi';
            break;
        case 'bagua':
            param.biaohao = 200031;
            param.name = '八卦频道';
            param.type = 'bagua';
            break;
        case 'youmo':
            param.biaohao = 200032;
            param.name = '幽默频道';
            param.type = 'youmo';
            break;
        case 'sex':
            param.biaohao = 200033;
            param.name = '两性频道';
            param.type = 'sex';
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
articleClass.statics.reAllclass = function(callback) {
    callback([
        { "name": "娱乐频道", "type": "yule", "biaohao": 20001 }, { "name": "推荐", "type": "toutiao", "biaohao": 20002 }, { "name": "军事频道", "type": "junshi", "biaohao": 20003 }, { "name": "视频频道", "type": "shipin", "biaohao": 20004 }, { "name": "社会频道", "type": "shehui", "biaohao": 20005 }, { "name": "科技频道", "type": "keji", "biaohao": 20006 }, { "name": "体育频道", "type": "tiyu", "biaohao": 20007 }, { "name": "汽车频道", "type": "qiche", "biaohao": 20008 }, { "name": "财经频道", "type": "caijing", "biaohao": 20009 }, { "name": "健康频道", "type": "jiankang", "biaohao": 20010 }, { "name": "热点频道", "type": "redian", "biaohao": 20011 }, { "name": "国内频道", "type": "guonei", "biaohao": 20012 }, { "name": "国际频道", "type": "guoji", "biaohao": 20013 }, { "name": "时尚频道", "type": "shishang", "biaohao": 20014 }, { "name": "历史频道", "type": "lishi", "biaohao": 20015 }, { "name": "游戏频道", "type": "youxi", "biaohao": 20016 }, { "name": "情感频道", "type": "qinggan", "biaohao": 20017 }, { "name": "家居频道", "type": "jiaju", "biaohao": 20018 }, { "name": "星座频道", "type": "xingzuo", "biaohao": 20019 }, { "name": "科学频道", "type": "kexue", "biaohao": 20020 }, { "name": "互联网频道", "type": "hulianwang", "biaohao": 20021 }, { "name": "数码频道", "type": "shuma", "biaohao": 20022 }, { "name": "外汇频道", "type": "waihui", "biaohao": 20023 }, { "name": "股票频道", "type": "gupiao", "biaohao": 20024 }, { "name": "期货频道", "type": "qihuo", "biaohao": 20025 }, { "name": "基金频道", "type": "jijin", "biaohao": 20026 }, { "name": "理财频道", "type": "licai", "biaohao": 20027 }, { "name": "电影频道", "type": "dianying", "biaohao": 20028 }, { "name": "电视频道", "type": "dianshi", "biaohao": 20029 }, { "name": "综艺频道", "type": "zongyi", "biaohao": 20030 }, { "name": "八卦频道", "type": "bagua", "biaohao": 20031 },{ "name": "幽默频道", "type": "youmo", "biaohao": 20032 },{ "name": "两性频道", "type": "sex", "biaohao": 20033 }, { "name": "其它", "type": "other", "biaohao": 20000 }
    ]);
}
//检查单个分类是否存在 true为存在
articleClass.statics.checkSelf = function(type, callback) {
    this.find({ type: type }, function(err, results) {
        if (err) { callback(err, false); return; }
        if (results.length === 0) {
            callback(null, false);
        } else {
            callback(null, true);
        }
    });
}
articleClass.statics.checkExit = function(leibei, accid, callback) {
    this.find({ "type": leibei }, function(err, results) {
        if (err) {
            callback(false, null);
            return;
        }
        if (results.length === 0) {
            var param = {
                "biaohao": 20000,
                "name": '其它',
                "type": "other",
                "articles": [accid],
                "alltotal": 1
            }
            switch (leibei) {
                case 'yule':
                    param.biaohao = 20001;
                    param.name = '娱乐频道';
                    param.type = 'yule';
                    break;
                case 'toutiao':
                    param.biaohao = 20002;
                    param.name = '推荐';
                    param.type = 'toutiao';
                    break;
                case 'junshi':
                    param.biaohao = 20003;
                    param.name = '军事频道';
                    param.type = 'junshi';
                    break;
                case 'shipin':
                    param.biaohao = 20004;
                    param.name = '视频频道';
                    param.type = 'shipin';
                    break;
                case 'shehui':
                    param.biaohao = 20005;
                    param.name = '社会频道';
                    param.type = 'shehui';
                    break;
                case 'keji':
                    param.biaohao = 20006;
                    param.name = '科技频道';
                    param.type = 'keji';
                    break;
                case 'tiyu':
                    param.biaohao = 20007;
                    param.name = '体育频道';
                    param.type = 'tiyu';
                    break;
                case 'qiche':
                    param.biaohao = 20008;
                    param.name = '汽车频道';
                    param.type = 'qiche';
                    break;
                case 'caijing':
                    param.biaohao = 20009;
                    param.name = '财经频道';
                    param.type = 'caijing';
                    break;
                case 'jiankang':
                    param.biaohao = 200010;
                    param.name = '健康频道';
                    param.type = 'jiankang';
                    break;
                case 'redian':
                    param.biaohao = 200011;
                    param.name = '热点频道';
                    param.type = 'redian';
                    break;
                case 'guonei':
                    param.biaohao = 200012;
                    param.name = '国内频道';
                    param.type = 'guonei';
                    break;
                case 'guoji':
                	param.biaohao = 200013;
                    param.name = '国际频道';
                    param.type = 'guoji';
                case 'shishang':
                    param.biaohao = 200014;
                    param.name = '时尚频道';
                    param.type = 'shishang';
                    break;
                case 'lishi':
                    param.biaohao = 200015;
                    param.name = '历史频道';
                    param.type = 'lishi';
                    break;
                case 'youxi':
                    param.biaohao = 200016;
                    param.name = '游戏频道';
                    param.type = 'youxi';
                    break;
                case 'qinggan':
                    param.biaohao = 200017;
                    param.name = '情感频道';
                    param.type = 'qinggan';
                    break;
                case 'jiaju':
                    param.biaohao = 200018;
                    param.name = '家居频道';
                    param.type = 'jiaju';
                    break;
                case 'xingzuo':
                    param.biaohao = 200019;
                    param.name = '星座频道';
                    param.type = 'xingzuo';
                    break;
                case 'kexue':
                    param.biaohao = 200020;
                    param.name = '科学频道';
                    param.type = 'kexue';
                    break;
                case 'hulianwang':
                    param.biaohao = 200021;
                    param.name = '互联网频道';
                    param.type = 'hulianwang';
                    break;
                case 'shuma':
                    param.biaohao = 200022;
                    param.name = '数码频道';
                    param.type = 'shuma';
                    break;
                case 'waihui':
                    param.biaohao = 200023;
                    param.name = '外汇频道';
                    param.type = 'waihui';
                    break;
                case 'gupiao':
                    param.biaohao = 200024;
                    param.name = '股票频道';
                    param.type = 'gupiao';
                    break;
                case 'qihuo':
                    param.biaohao = 200025;
                    param.name = '期货频道';
                    param.type = 'qihuo';
                    break;
                case 'jijin':
                    param.biaohao = 200026;
                    param.name = '基金频道';
                    param.type = 'jijin';
                    break;
                case 'licai':
                    param.biaohao = 200027;
                    param.name = '理财频道';
                    param.type = 'licai';
                    break;
                case 'dianying':
                    param.biaohao = 200028;
                    param.name = '电影频道';
                    param.type = 'dianying';
                    break;
                case 'dianshi':
                    param.biaohao = 200029;
                    param.name = '电视频道';
                    param.type = 'dianshi';
                    break;
                case 'zongyi':
                    param.biaohao = 200030;
                    param.name = '综艺频道';
                    param.type = 'zongyi';
                    break;
                case 'bagua':
                    param.biaohao = 200031;
                    param.name = '八卦频道';
                    param.type = 'bagua';
                    break;
                case 'youmo':
                    param.biaohao = 200032;
                    param.name = '幽默频道';
                    param.type = 'youmo';
                    break;
                case 'sex':
                    param.biaohao = 200033;
                    param.name = '两性频道';
                    param.type = 'sex';
                    break;
                default:
                    break;
            }

            //不存在 则将配置对象返回
            callback(false, param);
        } else {
            //存在 则将实例对对象返回
            callback(true, results[0]);
        }
    });
}
//创建类
var ArticleClass = mongoose.model("articleclass", articleClass);
//向外暴露
module.exports = ArticleClass;