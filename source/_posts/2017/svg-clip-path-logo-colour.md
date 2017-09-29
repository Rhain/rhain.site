---
title: svg logo 跟随背景色变化而变化
---

> [svg-clip-path-logo-colour](https://eduardoboucas.com/blog/2017/09/25/svg-clip-path-logo-colour.html)

原文本来是通过计算每个区域的logo元素来实现，logo跟随背景色变化。但是在safari上表现不好。改用了svg来实现。

实现方法是使用两个重叠的svg logo，计算上下两个区域logo展示的高度，根据这个高度设置每个svg的mask的高度，让svg logo正好只显示在该区域中。

不过评论中也提到过[midnight.js](http://aerolab.github.io/midnight.js/) 的jquery插件可以更加炫酷的实现这种效果。

