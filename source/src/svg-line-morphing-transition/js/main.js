//utils

function getEl(el) {
    return document.querySelector(el);
}

function getAll(el) {
    return document.querySelectorAll(el);
}

function getIndex(el, arr) {
    return arr.indexOf(el);
}

var container = getEl(".container");
var circleLine = getEl("#circle-line");
var straightLine = getEl(".straight-line");
var circleLinePath = getEl("#circle-line-path");
var controls = getEl(".controls");
var dots = getAll(".dot");
var images = getAll(".image-wrapper");
var imagesWrapper = getEl("#images-wrapper");

// 把类数组转换为数组
dots = [].slice.call(dots);

var staticAnimProps = {
    duration: .3,
    translateVal: 80
}

var dynamicAnimProps = {
    // 控制圆圈收缩的方向， 从右往左或者是从左往右
    flipCircle: true,
    // 方向
    direction: "right",
    imageDirection: "x",
    straightLine: {
        pos: 0,
        origin: "right",
        width: 0
    },
    translateVal: 0,
    // 圆圈的位置
    circleLinePos: 0,
    // 变换前直线位置
    oldLinePos: 0,
    // 变换后直线位置
    newLinePos: 0
}

dots.forEach(function (dot, index, array) {
    var thisArray = array;
    dot.addEventListener('click', function () {
        if(!this.classList.contains('active')){

            // 移动圆圈到点击的dot上
            dynamicAnimProps.circleLinePos = this.offsetLeft - 12;

            // 选中的dot
            var activeDot = controls.querySelector('.active');

            // 得到直线的开始和结束位置
            dynamicAnimProps.oldLinePos = activeDot.offsetLeft;
            dynamicAnimProps.newLinePos = this.offsetLeft;

            activeDot.classList.remove('active');
            this.classList.add('active');

            // 右方向变换
            if(getIndex(this, thisArray) > getIndex(activeDot, thisArray)){

                dynamicAnimProps.direction = 'right';

                // 计算直线长度 和直线开始所在的位置
                dynamicAnimProps.straightLine.width = dynamicAnimProps.newLinePos - dynamicAnimProps.oldLinePos + 2.5;
                dynamicAnimProps.straightLine.pos = dynamicAnimProps.oldLinePos + 5;
                dynamicAnimProps.flipCircle = false;
                dynamicAnimProps.straightLine.origin = 'left';
                dynamicAnimProps.translateVal = staticAnimProps.translateVal;
            }else { // 左方向变换
                dynamicAnimProps.direction = "left";

                // 计算直线长度 和直线开始所在的位置
                dynamicAnimProps.straightLine.width = -(dynamicAnimProps.newLinePos - dynamicAnimProps.oldLinePos - 2.5);
                dynamicAnimProps.straightLine.pos = dynamicAnimProps.newLinePos + 5;
                dynamicAnimProps.flipCircle = true;
                dynamicAnimProps.straightLine.origin = 'right';
                dynamicAnimProps.translateVal = -staticAnimProps.translateVal;
            }
            animateLine(staticAnimProps, dynamicAnimProps);
            animateImages(getIndex(activeDot,thisArray), getIndex(this, thisArray), dynamicAnimProps.direction, dynamicAnimProps.translateVal)

        }
    })
});

// 变换图片
function animateImages(oldIndex, newIndex, direction, translateVal) {
    var t1 = new TimelineMax({
        onComplete: function () {
            images[oldIndex].style.transform = '';
            images[newIndex].style.transform = '';
        }
    });
    t1.to(images[oldIndex], .3, {
        [dynamicAnimProps.imageDirection]: -translateVal,
        opacity:0
    }).set(images[newIndex], {
        [dynamicAnimProps.imageDirection]: translateVal
    }, .15).to(images[newIndex], .3, {
        [dynamicAnimProps.imageDirection]: 0,
        opacity: 1
    })
}

// 变换圆圈和直线
function animateLine(staticAnimProps, dynamicAnimProps) {
    var t = new TimelineMax({
        onStart: function () {
            controls.classList.add('disabled');

            (dynamicAnimProps.flipCircle) ? circleLine.className = 'flip' : undefined;

            // 初始化直线所在的位置，宽度以及transform-origin
            straightLine.style.cssText = `
                width: ${dynamicAnimProps.straightLine.width}px;
                left: ${dynamicAnimProps.straightLine.pos}px;
                transform-origin: ${dynamicAnimProps.straightLine.origin};
                `;
        },
        onComplete: function () {
            controls.classList.remove('disabled');

            circleLine.className = '';
            // 结束后 直线在选中的圆点位置
            straightLine.style.left = dynamicAnimProps.newLinePos + 'px';
        }
    });

    t.to(circleLinePath, staticAnimProps.duration, {
        // 先动 选中的圆圈动画
        css: {
            'stroke-dashoffset': 105
        }
    }).to(straightLine, staticAnimProps.duration/2, {
        // 直线scale 从0到1
        scaleX: 1,
        onComplete: function () {

            // 结束后转变transform-origin 以及调整圆圈到选中dot的位置
            this.target.style.transformOrigin = dynamicAnimProps.direction;
            circleLine.style.left = dynamicAnimProps.circleLinePos + 'px';
        }
    },0.15).to(straightLine, staticAnimProps.duration, {
        // 缩小直线，从 1 到 0
        scaleX: 0
    }).to(circleLinePath, staticAnimProps.duration, {
        // 圆圈动画
        onStart: function () {
            // 调整圆圈转动方向 跟直线缩小方向相同
            (dynamicAnimProps.flipCircle) ? circleLine.className = '' : circleLine.className = 'flip';
        },
        // 提前动画
        delay: -staticAnimProps.duration,
        css: {
            'stroke-dashoffset': 0
        }
    })
}