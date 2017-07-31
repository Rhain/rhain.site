function HoverButton(el){
    this.el = el;
    this.hover = false;
    this.calculatePosition();
    this.attachEventsListener();
}

HoverButton.prototype.calculatePosition = function () {
    TweenMax.set(this.el, {
        x: 0,
        y: 0,
        scale: 1
    });
    var box = this.el.getBoundingClientRect();
    this.x = box.left + (box.width * 0.5);
    this.y = box.top + (box.height * 0.5);
    this.width = box.width;
    this.height = box.height;
};

/* 根据计算鼠标的位置和button圆心的距离 跟 button 一半宽度的比较结果来判断是否hover，如果已经hover过了，把button放大，且增加响应半径 */
HoverButton.prototype.onMouseMove = function (e) {
    var hover =false;
    var hoverArea = (this.hover ? 0.7 : 0.5);
    var x = e.clientX - this.x;
    var y = e.clientY - this.y;
    var distance = Math.sqrt(x*x + y*y);
    if(distance < (this.width *  hoverArea)){
        hover = true;
        if(!this.hover){
            this.hover = true;
        }
        this.onHover(e.clientX, e.clientY);
    }
    if(!hover && this.hover){
        this.onLeave();
        this.hover = false;
    }
};
/* 放大同时移动button的 x y 值 */
HoverButton.prototype.onHover = function (x, y) {
    TweenMax.to(this.el, 0.4, {
        x: (x - this.x) * 0.4,
        y: (y - this.y) * 0.4,
        scale: 1.15,
        ease: Power2.easeOut
    });
    this.el.style.zIndex = 10;
};

HoverButton.prototype.onLeave = function(){
    TweenMax.to(this.el, 0.7, {
        x: 0,
        y: 0,
        scale: 1,
        ease: Elastic.easeOut.config(1.2, 0.4)
    });
    this.el.style.zIndex = 1;
};


HoverButton.prototype.attachEventsListener = function () {
    var self = this;
    window.addEventListener("mousemove", function (e) {
        self.onMouseMove(e);
    });
    window.addEventListener("resize", function (e) {
        self.calculatePosition(e);
    })
};

var btn1 = document.querySelector('li:nth-child(1) button');
new HoverButton(btn1);