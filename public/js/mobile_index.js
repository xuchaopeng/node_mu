(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if(clientWidth>=620){
                docEl.style.fontSize = '20px';
            }else if(clientWidth <=320){
                docEl.style.fontSize = '17px';
            }else{
                docEl.style.fontSize = 20 * (clientWidth / 375) + 'px';
            }
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

$(function(){
    //首页touchpubu
    (function(){
        var $pubuCnt = $('.cover_bottom');
        var $pubu = $('.pubu_cnt');
        var pubuCnt = $pubuCnt[0];
        var icon = {
            startY : 0,
            endY:0
        };
        var deal = function(icon,o){
            var z = parseInt(icon.endY - icon.startY);
            if(z >= 0){return;}
            if(o){
                if(z <= -30){
                    $pubu.css('transform','translateY(-100%)');
                }else{
                    $pubu.css('transform','translateY(0)');
                }
                return;
            }
            $pubu.css('transform','translateY('+z+'px)');
        }
        pubuCnt.addEventListener('touchstart',function(event){
            event.preventDefault();
            event.stopPropagation();
            icon.startY = event.touches[0].pageY;
        },false);
        pubuCnt.addEventListener('touchmove',function(event){
            event.preventDefault();
            event.stopPropagation();
            icon.endY = event.touches[0].pageY;
            deal(icon,false);
        },false);
        pubuCnt.addEventListener('touchend',function(event){
            event.preventDefault();
            event.stopPropagation();
            deal(icon,true);
        },false);
    })();
    //ajax请求笔记
    (function(){
        var lock = false;
        var param = {
            acc_id:'',
            pagenum:1
        }
        var requiredata = function(){
            $.ajax({
                type:'GET',
                url:'/statics/article-base',
                data:param,
                dataType:'json',
                success:function(res){
                    var render = tppl($('#template').html());
                    var html = '';
                    var len = res.data.length;
                    $.each(res.data,function(i,item){
                        if(!item.title)return;
                        html += render(item);
                        if(i === len -1){
                            param.acc_id = item._id;
                        }
                    });
                    $('#content').append(html);
                    if(res.allnumber > param.pagenum*8){
                        lock = false;
                        param.pagenum += 1;
                    }
                },
                error:function(){}
           });
        }
        if(!lock){
            lock = true;
            requiredata();
        }
        $(window).on('scroll',function(e){
            var st = $(window).scrollTop(),wh = $(window).height(),dh = $(document).height();
            if(!lock && dh <= parseFloat(st + wh) + 300){
                lock = true;
                requiredata();
            }
        });
    })();
     //音随机播放
    (function(){
        var $body = $('body');
        $.ajax({
            type:'GET',
            url:'/statics/audio',
            dataType:'json',
            success:function(res){
                if(res.status !== '1')return;
                var data = res.data;
                var len = data.length;
                var index = parseInt(Math.random()*len);
                if(len === 0)return;
                $body.append('<audio id="audio" src="'+data[index].source+'" loop="loop" autoplay="autoplay"><\/audio>');
                if($('#audio').length === 1){
                    var body = $('body')[0];
                    var lock = false;
                    body.addEventListener('touchstart',function(){
                        if(lock)return;
                        $('#audio')[0].play();
                    });
                }
            },
            error:function(){}
        });
    })();
    //搜索交互
    (function(){
        var $b = $('#btn_ss');
            $p = $('.psearch'),
            $z = $('.pwz'),
            $c = $('.cancle'),
            $pb = $('#ci_search'),
            $pb_input = $pb.find('input'),
            $pb_i = $pb.find('.search_cnt i');
        var dealIt = function(s){
            //过滤掉前后空格
            var value = s.replace(/(^\s*)|(\s*$)/g,'');
            //过滤掉多有的特殊字符
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]") ;
            var rs = ""; 
            for (var i = 0; i < value.length; i++) { 
                rs = rs+value.substr(i, 1).replace(pattern, ''); 
            }
            return rs;
        }
        $b.on('click',function(){
            if($p.hasClass('show')){
                var s = dealIt($p.val());
                window.location.href = '/mobile/search?s='+ s;
            }else{
                $p.addClass('show');
                $c.addClass('show');
                $z.hide();
            }
        });
        $pb_i.on('click',function(){
            var s = dealIt($pb_input.val());
            window.location.href = '/mobile/search?s='+ s;
        });
        $c.on('click',function(){
            $p.removeClass('show');
            $c.removeClass('show');
            $z.show();
        });
    })();
});
