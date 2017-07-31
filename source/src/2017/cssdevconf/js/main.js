var colors = ['#f5d76e','#f7ca18','#f4d03f','#ececec','#ecf0f1xx','#a2ded0'];

setTimeout(function(){

    /* 随机添加星星 初始化 left 和top的值 */
    for (var i=0;i<250;i++) {
        var size = Math.random() * 3;
        var color = colors[parseInt(Math.random()*4)];

        /*
         <span style="opacity: 1; width: 0.830662px; height: 0.830662px; top: 19.7517%; left: 83.1575%; background: rgb(236, 236, 236); box-shadow: rgb(236, 236, 236) 0px 0px 5.97225px;"></span>
         */
        $("#starsBox").append('<span style="opacity: 0; width: ' + size + 'px; height: ' + size + 'px; top: ' + Math.random()*100 + '%; left: ' + Math.random()*100 + '%; background: ' + color + '; box-shadow: 0 0 '+ Math.random()*10 +'px' + color + ';"></span>') ;
    }

    /* 变换透明度 闪烁的效果 */
    $("#starsBox span").each(function () {
        $(this).animate({opacity: "+=1"});
    });

    /* 随机设置星星的 top 和 left 的值， 由于设置了 transition: left 500s linear, top 500s linear;  会产生星星缓慢移动的效果 */
    setTimeout(function () {
        $("#starsBox span").each(function () {
            $(this).css('top', Math.random()*100+'%').css('left', Math.random()*100+'%');
        })
    }, 30);

    /* 1000000 重置位置，重新移动 */
    setInterval(function(){
        $("#starsBox span").each(function () {
            $(this).css('top', Math.random()*100+'%').css('left', Math.random()*100+'%');
        })
    }, 1000000)

}, 8000);