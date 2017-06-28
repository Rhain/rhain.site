---
title: Faster Page Load Using Lightweight CSS and SVG Animation (Without JavaScript)
---

> [原文](https://dzone.com/articles/faster-page-load-using-lightweight-css-and-svg-ani)

这不是一篇完全的翻译文， 而是看过原文之后，加入自己的理解的翻译文:D

原文首先讲了web页面的动画是多么的棒。但是呢，一般的web动画工具，都需要javascript的动画库和图片文件。这就导致了用户要花宝贵的时间在等待
资源的加载上。如果想要给自己的主页加上一个非常吸引人的动画，那应该要保证页面加载时间在2s内。那么有什么轻量级的解决方案既不会损害网站性能
同时也不会降低用户体验呢？其中一个的解决方案那就是使用css和svg动画，不需要javascript的参与！

#### 行内svg的css动画优缺点

##### 优点

 * svg图片是行内元素，那就意味着没有额外的文件请求
 * 通过css来实现动画，那就不需要额外的javascript动画文件
 * 少量的代码

##### 缺点
 * 需要详细拆解动画。不是导出svg动画就能实现了，必须预先想好哪些形状需要分组，同时每个形状的动画时间，间隔都需要想好。
 * 比较繁琐。需要手动给路径添加class，如果需要改变源图片，那么又需要重新添加一次class
 * IE 不支持svg动画。可以使用静态图片代替。

虽然看起来是有点繁琐，但是相对于它的好处，还是值得的。

下图的动画看看使用svg + css如何来实现：

![](/images/2017/svg-animation/raygun.gif)

svg动画最复杂的部分应该是为了实现动画如何把svg图片中路径归组、分类导出。这就需要把动画拆解了，再根据拆解的动画，把svg的path分组或者单独来处理。

现在来拆解上图的动画。

* 动画都是一个整体在运动，不管进场出场，还是缩放。这就可以把所有的path包含在一个group里面，这样就可以操作整个svg对象了。

```
<g class="artwork" id="artwork" data-name="artwork">
</g>
```
* 枪的旋转和移动相对于射出的光线和发射时的光束是独立，因此我们可以把抢的部分归到一个group里面

```
    <g class="raygun" id="raygun">
    </g>
    <g id="beam">
    </g>
```
* 枪身上的闪光，可以使用蒙板来实现，闪光需要跟枪一起运动，所以把闪光这层放在raygun group里面。 需要注意的闪光是位于底部和枪表面中间。
```
    <g class="raygun" id="raygun">
        <g id="gun-background">
        </g>
        <g id="mask-shine">
            <g style="clip-path: url(#clip-path)">
                <polygon class="sheen" id="sheen" points="392 188 184 188 407 412 616 412 392 188" style="fill: #fff"/>
            </g>
        </g>
        <g id="fin-foreground">
        </g>
    </g>
```

* 使用css 的`stroke-dasharray` 和 `stroke-offset` 来实现发射时的光束效果。

最后从AI里面导出svg文件，再复制svg的内容到html页面中，为需要操作path或者group加上class。这样就可以开始我们的css 动画了。

在实现动画的方式上，我们有两种选择：

1. 每个动画单独处理分为多个animation， 动画的衔接通过 animation-delay 来实现。
2. 所有动画都在一个animation里面，每个动画在某一段时间内处理。

原文作者选择了第二种方式，原因是可以通过一个变量控制整个动画时间。 当然这种方式也有相应的缺点，就是在使用easing function的时候只能使用
1个，不能为每个动画使用单独的easing function。

下面我们来看下每个动画的实现：

1. 首先是整体的动画：
```
.artwork{
    transform-origin: 0;
    animation: artwork 4000ms ease-in-out infinite;
}

@keyframes artwork {
    0%{ /* 首先位于可视区域下方 */
        transform: translateY(800px);
    }
    15%{ /* 0-600ms时，从下方移动到了初始位置 */
        transform: translateY(0);
    }
    20%{ /* 600ms-800ms 保持不变 */
        transform: translateY(0);
    }
    50%{ /* 800ms-2000ms 原样保持不变 */
        transform: scale(1) translateX(0);
    }
    52%{ /* 2000ms-2080ms 缩小至原来0.6倍 向上移动120px 模拟枪发射后 后退的效果 */
        transform: scale(0.6) translate(0, -120px);
    }
    60%{ /* 2080ms-2400ms 向前移动80px 向上移动20px 模拟枪后退恢复原位的效果 */
        transform: scale(0.6) translate(80px, -140px);
    }
    70%{ /* 2400ms-2800ms 想下移动20px 模拟枪后退恢复原位的效果 */
        transform: scale(0.6) translate(80px, -120px);
    }
    80%,100%{ /* 2800ms-3200ms 向上移动680px 移出到视线外 */
        transform: scale(0.6) translate(80px, -800px);
    }
}
```

2. raygun的动画， 需要有旋转和跳跃的效果。
```
.raygun{
    transform-origin: center;
    animation: raygun 4000ms ease-in-out infinite;
}

@keyframes raygun {
    0%{ /* 旋转40度 */
        transform: rotate(40deg);
    }
    15%{ /* 0-600ms 旋转奥-16度 此时raygun 已经从下方移动到了初始位置了 */
        transform: rotate(-16deg);
    }
    25%{ /* 600ms-1000ms 旋转到8度，raygun还在原始位置*/
        transform: rotate(8deg);
    }
    30%{ /* 1000ms-1200ms 旋转到-2度*/
      transform: rotate(-2deg);
    }
    32%,
    36%,
    40%,
    44%,
    48% {
        transform: rotate(-0.5deg);
    }
    34%,
    38%,
    42%,
    46%,
    50% { /* 从1200ms 到 2000ms 这段时间内每隔80ms 交替旋转0.5度和-0.5度 模拟一个蓄力的效果 */
        transform: rotate(0.5deg);
    }
    50%{ /* 2000ms 旋转到初始位置 */
        transform: rotate(0);
    }
    52%{ /* 2000ms-2080ms 旋转-16度，此时raygun发射后往后退。 */
        transform: rotate(-16deg);
    }
    60%{ /* 2080ms-2400ms 旋转到12度， 此时raygun向前同时向上运动*/
        transform: rotate(12deg);
    }
    80%, 100%{ /* 2400ms-3200ms 旋转到-12度，保持到结束*/
        transform: rotate(-12deg);
    }
}
```

3. 枪扳手的动画：
```
.gun-trigger{
    transform-origin: center 20%;
    animation: gun-trigger 4000ms ease-in-out infinite;
}
@keyframes gun-trigger {
    0%,30%{ /* 需要在枪蓄力的过程中有一个扳动的效果。其他的时间保持初始状态 */
        transform: rotate(0);
    }
    46%{ /* 1200ms-1840ms 旋转32度 模拟扳手往后扣动的效果 */
        transform: rotate(32deg);
    }
    48%,100%{ /*1840ms-1920ms 旋转到初始位置，发射完后回归*/
        transform: rotate(0);
    }
}
```

4. 枪身的闪光动画，使用了svg的蒙板来实现：
.sheen{
    animation: sheen 4000ms ease-in-out infinite;
}

@keyframes sheen {
    0%,25%{ /* 0-1000ms还处于视野外 */
        transform: translateX(-320px);
    }
    40%,55%{ /* 1000ms-1600ms的时候，开枪前 闪光从左至右 1600ms-2200ms 保持不动 */
        transform: translateX(320px);
    }
    70%,100%{ /* 2200ms-2800ms 开枪后 闪光从右至左， 2800ms-4000ms 保持不动 */
        transform: translateX(-320px);
    }
}

5. 枪聚能的光环动画：
.gun-charge{
    transform-origin: center;
    animation: gun-charge 4000ms ease-in-out infinite;
}
@keyframes gun-charge {
    0%,20%{ /* 先隐藏 */
        opacity: 0;
        fill: #4193f2;
        transform: scale(1);
    }
    45%{ /* 800ms-1800ms聚能光变大同时透明度增加 发射前 */
        opacity: 0.5;
        fill: #4193f2;
        transform: scale(0.9);
    }
    50%,100%{ /* 发射后聚能光变白，同时缩小消失 */
        opacity: 1;
        fill: white;
        transform: scale(0);
    }
}

6. 发射后散光效果：

```
@keyframes line {
    0%,49%{ /* 发射前都是不可见的*/
        stroke: transparent;
        stroke-dashoffset: 0;
        stroke-dasharray: 5,200;
    }
    50%{ /* 发射后可见*/
        stroke: white;
    }
    55%{ /* 发射后散光扩散，需要注意要实现从内往外扩散的效果 stroke-dashoffset的值设置的负值，会向初始的方向反方向运动 */
        stroke-dashoffset: -80px;
        stroke-dasharray: 20,200;
        stroke: white;
    }
    60%,100%{
        stroke-dashoffset: -120px;
        stroke-dasharray: 5, 200;
        stroke: transparent;
    }
}
```

7. 发射的激光效果：
```
.beam-white{
    animation: white-beam 4000ms ease-in-out infinite;
}
@keyframes white-beam {
    0%,50%{ /* 开始不可见*/
        opacity: 0;
        stroke-dashoffset: 0;
        stroke-dasharray: 400, 2000;
    }
    51%,69%{ /* 发射后可见 激光可见*/
        opacity: 1;
    }
    70%, 100%{ /* 激光向右方收缩 */
        opacity: 0;
        stroke-dashoffset: -500px;
        stroke-dasharray: 0, 2000;
    }
}

.beam-blue{
    animation: blue-beam 4000ms ease-in-out infinite;
}
@keyframes blue-beam {
    0%,55%{ /* 开始不可见*/
        opacity: 0;
        stroke-dashoffset: 0;
        stroke-dasharray: 300, 2000;
    }
    56%,69%{ /* 发射后可见 激光可见 蓝色激光比白色激光延迟点出现*/
        opacity: 1;
    }
    70%, 100%{ /* 激光向右方收缩 */
        opacity: 0;
        stroke-dashoffset: -550px;
        stroke-dasharray: 0, 2000;
    }
}
```
