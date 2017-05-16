---
title: ping pong animation
---

### css animation 练习 2

要实现如下选中的效果：

![](/images/ping-pong-animation/ping-pong.gif)


#### 分析

1. 主要是分析乒乓球运动的轨迹。 可以分为4步来实现，切分开来如下图所示：


![](/images/ping-pong-animation/ball_move.png)


2. 根据乒乓球的运动轨迹，可以计算出球拍需要出现的位置。球拍只做上下移动。


#### 实现

1. 使用css 的`transform` 来变换乒乓球和球拍的位置实现。


#### 关键代码

``` css

@keyframes player_one_move {
    0%, 100%{
        transform: translate(0px, 100px);
    }
    25% {
        transform: translate(0px, 0px);
    }
    50% {
        transform: translate(0px, 0px);
    }
    75%{
        transform: translate(0px, 100px);
    }
}

@keyframes player_two_move {
    0%, 100%{
        transform: translate(0px, -50px);
    }
    25% {
        transform: translate(0px, 10px);
    }
    50% {
        transform: translate(0px, 0px);
    }
    75%{
        transform: translate(0px, 50px);
    }
}

@keyframes ball_move {
    0%, 100% {
        transform: translate(-180px, 30px);
    }
    25% {
        transform: translate(18px, -25px);
    }
    50% {
        transform: translate(-180px, -55px);
    }
    75%{
        transform: translate(18px, 15px);
    }
}

```