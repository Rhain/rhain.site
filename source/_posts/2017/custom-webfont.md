---
title: 自定义字体实践
---

我们在开发网页的时候，很多时候会使用字体图标，比如说现在很流行的fontawesome。使用字体图标的好处有很多，在这就不再赘述了。
但是我们经常会碰到一个问题： 引入的字体图标不够用了，想要找到一个符合意思的图标，在图标库中并没有。 这时候我们可能会使用图片，
一般的做法就是把需要用到的图标合成sprite来使用。相对来说会比较繁琐。那我们为何不扩充字体图标库，通过自定义字体来扩充我们的图标库呢？

我们目前开发中也正好碰到有这样的需求，需要自定义字体库。

采用[webfont](https://github.com/itgalaxy/webfont) 来生成我们的自定义字体。不过我们有一个比较特殊的需求是，4个系统，都需要
使用同一个字体以便于维护。同时，不能在修改了字体文件后，都单独复制到每个系统中，或者每次都修改每个系统的字体引入的路径。 同时由于浏览器缓存的
存在，我们需要采用文件名+hash（如：font.sbcsd2.ttf）的方式来避免覆盖式替换。

我们的解决方案是 在生成字体文件的时候，同时生成一个json文件包含了最新生成的文件的hash值， 发布到线上。4个业务系统在构建发布的时候请求
最新字体文件hash值的json，替换html中字体的hash值。


webfont官网并没有提供一个非常好的例子来说明如何使用。 结合webfont的webpack插件我写了一个可以生成hash值的字体脚本。

同时采用vue来展示已经收集的字体图标，可以在页面上直观的看到。

源码参考： [custom-webfont](https://github.com/Rhain/rhain.site/tree/master/source/src/custom-webfont)
