//工具对象
var Tools = {
    //获取Query的方法
    GetQueryString : function(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  decodeURI(r[2]); return null;
    },
    //搜索词进行过滤
    DealkeepWords:function(s){
        //过滤掉前后空格
        var value = s.replace(/(^\s*)|(\s*$)/g,'');
        //过滤掉多有的特殊字符
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]") ;
        var rs = ""; 
        for (var i = 0; i < value.length; i++) { 
            rs = rs+value.substr(i, 1).replace(pattern, ''); 
        }
        return rs;
    },
    SetParam:function(type){
        var param = {
            name:'其它',
            type:'other',
            topic:'路漫漫其修远兮，虽风雨兼程，还得走下去！',
            attention:'wo 在关注',
            img:'/public/images/channel_bg.png'
        };
        switch(type){
            case 'slowlife':
                param.name = '慢生活';
                param.type = 'slowlife';
                break;
            case 'suiyansuiyu':
                param.name = '碎言碎语';
                param.type = 'suiyansuiyu';
                break;
            case 'travel':
                param.name = '旅游';
                param.type = 'travel';
                break;
            case 'learn':
                param.name = '学无止境';
                param.type = 'learn';
                break;
            case 'huaijiu':
                param.name = '怀旧';
                param.type = 'huaijiu';
                break;
            case 'guanzhu':
                param.name = '关注';
                param.type = 'guanzhu';
                break;
            default:
                break;
        }
        return param;
    },
    SetGlobal:function(){
        var _this = this;
        window.Global = new Object();
        Global.type = _this.GetQueryString('type');
        Global.param = _this.SetParam(Global.type);
    },
    ShowByParam:function(){
        var _this = this;
        $('#channel').append(tppl($('#template2').html(),Global.param));
    },
    ShowArticleByType:function(){
        $.ajax({
            type:'GET',
            url:'/statics/article-base/'+Global.type,
            dataType:'json',
            success:function(res){
                var render = tppl($('#template1').html());
                var html = '';
                $.each(res.data,function(i,item){
                    html += render(item);
                });
                $('#content').html(html)
            },
            error:function(){}
        });
    },
    BindEvent:function(){
        var _this = this;
        var $cnt = $("#search_input");
        $('#btn_ss').on('click',function(){
            var v = _this.DealkeepWords($cnt.val());
            if(v){
                window.location.href = '/mobile/search?s='+ v;
            }
        });
    },
    init:function(){
        var _this = this;
        //初始化参数
        _this.SetGlobal();
        //设置类型基本信息
        _this.ShowByParam();
        //展示类型文章
        _this.ShowArticleByType();
        //绑定事件
        _this.BindEvent();
    }
}
Tools.init();







