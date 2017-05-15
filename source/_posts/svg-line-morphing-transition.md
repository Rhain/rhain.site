---
title: svg line morphing transition
---

### css animation 练习（一）

要实现如下选中的效果：

![](/images/svg-line-morphing-transition/demo.gif)


#### 分析

此处动画可以分割为四部分来实现：

1. 选中的圆圈先消失
2. 底部直线展开
3. 底部直线消失
4. 新选中的圆圈出现 （3和4 同时进行）

这里需要注意的点：

1. 第一步中圆圈消失的方向， 是逆时针，还是顺时针方向，需要根据当前选中的圆圈和将要选中的圆圈来确定。
2. 第四步中圆圈出现的方向，需要跟直线展开的衔接好。
3. 底部直线的消失和新选中圆圈的出现应该是同时的
4. 底部直线展开的方向，和消失的方向是相反的。 也就是说： 展开的时候，是从左往右，那么消失的时候，则应该是从右往左。
5. 底部直线开始消失时，选中的圆圈开始出现。


#### 实现

1. 圆圈的动画使用svg 的path 动画来实现非常简单。(不了解的，可以参考 [帅气的SVG路径描边动画 (path animation) 实战应用](https://segmentfault.com/a/1190000007811310))同时也需要处理
圆圈消失的方向问题,通过`scaleY(-1)` 来调整。

2. 直线动画如果只是展开的话，可以直接使用width的变换。 但是后面还需要消失。 如果是通过width来实现，实现程度上可能会比较复杂，同时动画操作width会引起页面的reflow，对性能也有一定的影响。
更好的解决办法则是使用 css 的`transfrom: scale`来实现。 scaleX 从0 到1 实现展开， scaleX从1到0 实现消失。 通过`transform-origin` 来控制直线展开和消失的方向。同时`transform`
不会引起页面的reflow，性能上有所提升。

具体实现代码见： [https://github.com/Rhain/rhain.site/tree/master/source/src/svg-line-morphing-transition](https://github.com/Rhain/rhain.site/tree/master/source/src/svg-line-morphing-transition)

#### 关键代码

``` js

    // 计算动画变换的方向
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

```

原文见： [svg-line-morphing-transition](https://www.uiplease.com/post/svg-line-morphing-transition/?utm_campaign=Revue%20newsletter&utm_medium=Newsletter&utm_source=revue)


