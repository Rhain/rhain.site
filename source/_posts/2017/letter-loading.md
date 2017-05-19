---
title: Letter loading
---

### css animation 练习 4

要实现如下选中的效果：

![](/images/2017/letter-loading/letter.gif)


#### 分析

1. 主要是让LODING 这个6个字母分时上下运动，可以通过`transform` 来实现
2. 最主要的是字母向上运动的时候，底部也有颜色填充向上运动后的空间。


#### 实现

1. 字母向上运动时，底部的颜色可以通过使用css3的`box-shadow`来实现。

``` css
box-shadow:0 15px 0 rgb(242, 198, 64);
```

#### 关键代码

```
@keyframes jump {
    0%, 100%{
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-30px);
        box-shadow:0 15px 0 rgb(242, 198, 64);
    }
}

```