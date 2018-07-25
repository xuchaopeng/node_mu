var Tools = {
    //获取Query的方法
    GetQueryString : function(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
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
    GetAccid:function(){
        var h = window.location.href.split('?')[0];
        var a = h.split('/');
        var i = a[a.length - 1];
        return i;
    },
    ShowArticle:function(){
        var _this = this;
        var accid = _this.GetAccid();
        $.ajax({
            type:'POST',
            url:'/statics/article/',
            data:{
                accid:accid
            },
            dataType:'json',
            success:function(res){
                if(res.status !== '1')return;
                var d = res.data[0];
                var render = tppl($('#template1').html());
                var html = render(d);
                var discription = '';
                $('#content').append(html);
                //文章主题插入图片
                if(d.keepword === '1'){
                    $.each(d.params,function(i,item){
                        if(item.p){
                            discription += '<p>'+item.p+'</p>';
                        }else if(item.img){
                            discription += '<p>'+'<img src="'+item.img+'" alt="" />'+'</p>';
                        }
                    });
                }else{
                    discription = d.discription.replace(/(<\/p>)/,function($1){
                        return $1 + '<p>'+'<img src="'+d.imgurl[0].url+'" alt="" />'+'</p>';
                    });
                }
                $('#content').find('.neirong').append(discription);
            },
            error:function(){}
        });
    },
    TongJi:function(){
        var _this = this;
        var makeUid = function(){
            return (+new Date()) + Math.random().toString(10).substring(2, 6);
        }
        $.ajax({
            type:'post',
            url:'/statics/readnum',
            data:{
                accid:_this.GetAccid(),
                uid:makeUid()
            }
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
        _this.ShowArticle();
        _this.BindEvent();
        _this.TongJi();
    }
}
Tools.init();

