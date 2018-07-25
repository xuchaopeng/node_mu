function tppl(tpl, data, fast){
  var fn =  function (d, f) {
    if(f){
        fn.$$ = fn.$$ || new Function(fn.$);
        return fn.$$.apply(d);
    }else{
      var i, k = [], v = [];
      for (i in d) {
          k.push(i);
          v.push(d[i]);
      };
      return (new Function(k, fn.$)).apply(d, v);
    }
  };
  if(!fn.$){
    fn.$ = 'var $="";';
    var tpls = tpl.replace(/[\r\t\n]/g, " ").replace(/\'/g,"\\'").split('[:')
      , i = 0
    while(i<tpls.length){
      var p = tpls[i];
      if(i){
        var x = p.indexOf(':]');
        fn.$ += p.substr(0, x);
        p = p.substr(x+2)
      }
      fn.$ += "$+='"+p.replace(/\[\=\:(.*?)\:\]/g, "'+$1+'")+"';";
      i++;
    }
    fn.$ += "return $";
  }

  return data ? fn(data, fast) : fn;
}
(function() {
    //移动端跳pc
    try {
        var browser = {
            versions: function() {
                var u = navigator.userAgent;
                return {
                    iPad: u.indexOf('iPad') > -1,
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/)
                };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        };
        var getAccid = function(){
            var h = window.location.pathname.split('/');
            return h[h.length - 1];
        }();
        function resize() {
            var pathName = window.location.pathname;
            if (/\/detail\//.test(pathName)) { 
                //文章页跳转对应的pc页面
                if (!browser.versions.mobile) { 
                    window.location.href = '/detail/num/'+getAccid;
                }
            }else{
                //其它页面均跳pc端首页
                if (!browser.versions.mobile) {
                  window.location.href = '/';
                }
            }
        }
        resize();
    } catch (e) {}
})();
