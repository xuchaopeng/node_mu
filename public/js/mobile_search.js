//工具对象
var Tools = {
    //获取Query的方法
    GetQueryString : function(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  decodeURI(r[2]); return null;
    },
    GetUrl:function(){
        var h = window.location.href.split('?')[0];
        var a = h.split('/');
        var i = a[a.length - 1];
        return i;
    },
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
    Cword:function(){
    	var _this = this;
    	//初始化搜索词
    	var s = _this.GetQueryString('s');
		$('#search_input').attr('value',s);
    },
    GoSearch:function(){
    	var _this = this;
    	//搜搜
    	$.ajax({
			type:'GET',
			url:'/statics/search',
			data:{
				searchwords:encodeURI(_this.GetQueryString('s'))
			},
			dataType:'json',
			success:function(data){
				if(data.status !== '1')return;
				var res = data.data;
				var render = tppl($('#template').html());
				var $cnt = $('#content');
				$('.title_both').html('筛选：全部 ( '+res.length+' )');
				$.each(res,function(i,item){
					$cnt.append(render(item));
				});
			},
			error:function(){
				$('.title_both').html('筛选：无匹配结果，再试试！');
			}
		});
    },
    BindEvent:function(){
    	var _this = this;
    	var $cnt = $("#search_input");
    	$('#btn_ss').on('click',function(){
    		console.log('fdsf');
    		var v = _this.DealkeepWords($cnt.val());
    		console.log(v);
    		window.location.href = '/mobile/search?s='+ v;
    	});
    },
    init:function(){
    	var _this = this;
    	_this.Cword();
    	_this.GoSearch();
    	_this.BindEvent();
    }
}
Tools.init();
