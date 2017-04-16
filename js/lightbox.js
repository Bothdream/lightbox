;(function(){
    var Lightbox = function(obj){
        this.lightbox = obj;
        /*****默认的配置参数*****/
        this.config = {
             "width":700,//lightbox的宽度
             "height":400,//lightbox的高度
             "backgroundColor":"#000000",//遮罩层的颜色
             "opacity":0.75,//遮罩层的透明度
             "scale":1,//图片的放大倍数
             "isChange":true,//是否启用多图切换效果
             "speed":800//动画切换的速度
        };
    };
    /******原型对象*******/
    Lightbox.prototype = {
        /*****外部配置参数*****/
        setConfig:function(config){
            if(config){
                $.extend(this.config,config);
            }
        },
        /*********展示效果*********/
        action:function(){
            var _this_ = this;
            /***页面的滚动高度和滚动宽度***/
            var sw = document.documentElement.scrollWidth + 15, 
                sh = document.documentElement.scrollHeight;

            /*******为所有的图片便签绑定点击事件********/      
            this.lightbox.click(function(){
                var self = $(this);
                /*禁止页面滚动*/
                $("body").css("overflow","hidden");
                /*将遮罩层添加到body*/
                $("<div>").addClass('mask').appendTo($("body")).css({
                  width:sw,
                  height:sh,
                  position:'fixed',
                  top:0,
                  left:0,
                  zIndex:90,
                  opacity:_this_.config.opacity,
                  backgroundColor:_this_.config.backgroundColor
                });
                
                /*将关闭按钮添加到body*/
                $("<div>").addClass('close').appendTo($("body")).css({
                  marginTop:10,
                  marginRight:15,  
                  position:'fixed',
                  top:0,
                  right:0,
                  zIndex:91,
                });

                /****获取配置项的宽度和高度*****/
                var w = _this_.config.width*_this_.config.scale,
                    h = _this_.config.height*_this_.config.scale;    
                
                /*****判断是多图切换还是单图切换******/
                if(!_this_.config.isChange){
                     _this_.picture($(this),w,h);
                }else{
                    
                     _this_.pictures($(this),w,h);
                }

                /*为遮罩层添加点击事件*/
                $('.mask').click(function(){
                   $('.close').remove();
                   $(this).remove();
                   $(".imglist").remove();
                   $("body").css("overflow","");
                });
                 /*为关闭按钮添加点击事件*/
                $('.close').click(function(){
                   $(this).remove();
                   $(".mask").remove();
                   $(".imglist").remove();
                   $("body").css("overflow","");
                });

            });
        },
        /**
         * { function_description }
         *
         * @param      {<type>}  jq      { 点击时的jquery对象（图片） }
         * @param      {number}  w       { 图片配置的宽度 }
         * @param      {number}  h       { 图片配置的高度 }
         */
        picture:function(jq,w,h){
            /*将单张图片添加到div.imglist标签中*/
            var imglist = $('<div>').addClass("imglist").appendTo($("body"));
            /*将div.imglist标签添加到body中*/
            jq.clone(false).appendTo($("div.imglist").eq(0)).css({
                width:w, //设置单张图片的属性
                height:h,
                position:'absolute',
                top:"50%",
                left:"50%",
                zIndex:900,
                marginTop:-h/2,
                marginLeft:-w/2
            });
            
        },
        /**
         * { function_description }
         *
         * @param      {<type>}  jq      { 点击时的jquery对象（图片） }
         * @param      {number}  w       { 图片配置的宽度 }
         * @param      {number}  h       { 图片配置的高度 }
         */
        pictures:function(jq,w,h){
            var _this_ = this;
            /*将div.imglist添加到body标签中*/
            var imglist = $('<div>').addClass("imglist").appendTo($("body")).css({
                 width:w,
                 height:h,
                 position:'fixed',
                 top:"50%",
                 left:"50%",
                 marginLeft:-w/2,
                 marginTop:-h/2,
                 overflow:"hidden",
                 zIndex:10000
            });

            /*将ul标签添加到div.imglist标签中*/
            var len = this.lightbox.size() + "00%";
            //被点击的那张图片的索引和偏移量, 
            //查找点击图片在原来图片集合中的索引：_this_.lightbox.index(self)
            var offsetWidth = this.lightbox.index(jq)*w;
            var ul = $("<ul>").appendTo(imglist).css({
                width:len,
                height:"100%",
                position:'absolute',
                top:0,
                left:-offsetWidth,
                padding:0,
                margin:0
            })

            /******将img标签添加到div.imglist中去*******/
            this.lightbox.each(function(){
                 //将li标签添加到ul中
                 var li = $("<li>").appendTo(ul);
                 //将img标签添加到li标签中
                 $(this).clone(false).appendTo(li);
            });

            //设置div.imglist ul li的样式
            $("div.imglist ul li").css({
                 float:'left'
            })

            //设置div.imglist ul li img的样式
            $("div.imglist ul li img").css({
                 width:w,
                 height:h,
                 display:"block"
            })

            //添加左右按钮
            var leftBtn = $("<div>").addClass('btn pre-btn').appendTo(imglist);
            var rightBtn = $("<div>").addClass('btn next-btn').appendTo(imglist);
            
            /*为左右按钮添加点击事件：查找点击图片在原来图片集合中的索引*/
            //左点击
            var offset = this.lightbox.index(jq);
            leftBtn.click(function(){
                 if(offset <_this_.lightbox.size()-1){
                    ul.animate({left:-(++offset)*w},_this_.config.speed);
                    /***判断右边按钮是否存在**/
                    if(!rightBtn.hasClass('btn next-btn')){
                         rightBtn.addClass("btn next-btn");
                    }
                 }else{
                    $(this).removeClass("btn pre-btn");
                 }

            });
            
            //右点击
            rightBtn.click(function(){
                 if(offset > 0) {
                    ul.animate({left:-(--offset)*w},_this_.config.speed);
                    /***判断左边按钮是否存在**/
                    if(!leftBtn.hasClass('btn next-btn')){
                         leftBtn.addClass("btn pre-btn");
                    }
                 }else{
                    $(this).removeClass("btn next-btn");
                 }

            });
        }
    }
    /*******将插件绑定在window对象上********/
    window['lightbox'] = Lightbox;   
})()