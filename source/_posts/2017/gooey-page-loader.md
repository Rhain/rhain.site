---
title: Gooey page loader
---

### css animation 练习 3

要实现如下选中的效果：

![](/images/2017/gooey-page-loader/gooey.gif)


#### 分析

1. 动画可以分为两部分，前半部分是9个球聚拢的过程，后半部分是9个球分开的过程
2. 以第一行第二个球为参照点，可以计算出其他8个球的位置，设置`position:absolute`，通过`left` `top`来设置好每个球的位置。
3. 通过`transform` 来移动第二行第二个球的位置。后面几个球的比上面的球稍微设置下时间上的延迟，营造水滴慢慢聚拢的效果
4. 如果只是上面这样实现，单单使用div来模拟球，效果会很生硬，没有给人那种水滴融合分离的感觉。 这就是需要在球容器上使用filter来帮忙处理下。

#### 实现

1. 效果都可以通过普通的css 来实现

具体实现代码见：[https://github.com/Rhain/rhain.site/tree/master/source/src/2017/gooey-page-loader](https://github.com/Rhain/rhain.site/tree/master/source/src/2017/gooey-page-loader)

2. 注意在球容器的背景设置filter 才会有水滴融合分散的视觉效果。

```css
.grid{
    filter: url("#goo");
}

<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
    <defs>
        <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
        </filter>
    </defs>
</svg>

```

#### 关键代码

```css

.circel-1{
    left: -30px;
    animation: move1 3s infinite 0.3s;
}
.circel-2{
    animation: move2 3s infinite 0.3s;
}
.circel-3{
    left: 30px;
    animation: move3 3s infinite 0.4s;
}

@keyframes move1 {
    0%, 100%{
        transform: translate3d(0, 0, 0);
    }
    50%{
         transform: translate3d(30px, 30px, 0);
    }
}
@keyframes move2 {
    0%, 100%{
        transform: translate3d(0, 0, 0);
    }
    50%{
        transform: translate3d(0px, 30px, 0);
    }
}

@keyframes move3 {
    0%, 100%{
        transform: translate3d(0, 0, 0);
    }
    50%{
        transform: translate3d(-30px, 30px, 0);
    }
}

```