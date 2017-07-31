---
title: 编写邮件的最佳实践
---

最近在写发送邮件的模版，搜集下邮件书写需要注意的点。 正好看到一篇非常详细的文章，加上自己的理解，翻译了一下，以备后用。

> 原文：[rock solid html emails](https://24ways.org/2009/rock-solid-html-emails)

在我们讨论如何写邮件的时候，必须了解的，写邮件跟写网页是不一样的。web浏览器的标准一直在持续进步中，但是邮件的一直还是原地踏步。也就是说我们在网页上使用的众多属性比如css3新增的属性等等，在邮件里面是不可用的，或者说是在某些邮件客户端中不可用的。

总的来说，写邮件时应该注意三点：

1. 设计上保持简洁。越是复杂的设计，可能实现在各个不同的邮件客户端表现并不一样，有些甚至是不支持。
2. 使用table布局和行内样式，同时不要使用新的css属性。
3. 多测试。

那么实际编写邮件的时候应该怎么做呢？

* 使用table布局。
很多邮件客户端像Gmail和Outlook2007 对float、margin、padding的支持度很低，需要使用table来布局邮件。内嵌table是支持。在使用table布局的时候需要注意以下几点：
    * 给table cell设置宽度，而不是整个table设置。当我们使用table widths， td widths, td padding 和css padding的时候，在不同的邮件客户端中有不同的表现。 最可靠的方式是给table cell 单独设置宽度，而不是给整个table设置宽度。

        ``` html
            <table cellspacing="0" cellpadding="10" border="0">
                <tr>
                    <td width="80"></td>
                    <td width="280"></td>
                </tr>
            </table>
        ```
    * 不要想着如果不给一个table cell指定宽度，邮件客户端会自动计算出来。同时避免使用百分比的来设置宽度，Outlook 2007对此支持不够好，特别是内嵌table，使用像素来设置宽度。如果想要给table cell添加padding，要么使用table的cellpadding属性或者使用css的padding属性，不要同时使用。
    * 内嵌table比通过设置left、right margin和padding来布局要可靠的多。如果相同的效果可以通过内嵌table来实现，将会在各个邮件客户端有一个统一的表现效果。
    * 使用table容器来设置背景颜色。许多邮件客户端会忽略body上设置的background color或者css 设置的背景颜色。为了避免这种情况，可以把整个邮件包含在一个宽度为100%的table中，同时给这个table设置一个背景颜色。
        ``` html
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                    <td bgcolor=”#000000”>
                        <table>邮件内容...</table>
                    </td>
                </tr>
            </table>
        ```
        也可以使用这种方式来设置背景图片，但是可能有一些邮件客户端不支持，所以最好还是提供一个背景颜色作为后备。
    * 避免在table cell使用不必要的空格。尽可能不要在td标签之间使用空格。有一些邮件客户端在某些场景下会在内容上面或者下面添加额外的padding，可能会破坏邮件的整体表现。

* css 和 字体格式
哪些是邮件里面可以使用的样式？我们可以通过[campaignmonitor](https://www.campaignmonitor.com/css/)这个网站查到。看自己需要支持的邮件客户端，相应的选择使用支持的css属性。同时也需要注意以下几点：

    * 使用行内样式。Gmail不支持head中的style标签和body里面的style标签也不支持link标签。唯一的选择就是使用行内样式。

    * 避免使用fonts和十六进制的缩写。一些邮件客户端不支持font属性。不要像下面这样设置font样式：

        ``` css
            p {
                font:bold 1em/1.2em georgia,times,serif;
            }
        ```
        而是正常的书写：
        ``` css
            p {
                font-weight: bold;
                font-size: 1em;
                line-height: 1.2em;
                font-family: georgia,times,serif;
            }
        ```
        当设置颜色的时候，有一些客户端不支持十六进制的缩写像 `color:#fff`,而应该完整填写为 `color:#ffffff`。

    * 段落。 就像table cell的间距一样， 段落间距可能难以获得一致的效果。有些人使用两个 `<br/>`标签或者通过给div设置行内margin来客服这些缺陷，但是最近的测试显示，大部分客户端已经支持了段落的样式设置。可以使用下面样式：
        ``` css
            p {
                margin: 0 0 1.6em 0;
            }
        ```
        注意使用行内样式。
        如果设计上是高度敏感的，推荐避免使用段落来实现而是使用table cell来。可能需要使用内嵌table和cellpadding来达到你想要的效果。如下：
        ``` html
        <td width="200" style="font-weight:bold; font-size:1em; line-height:1.2em; font-family:georgia,'times',serif;">高度敏感内容</td>
        ```

    * 链接。 有一些客户端会使用默认的颜色重写连接的颜色。可以使用这两步避免被重写。第一，使用行内样式给每个连接设置一个默认样式。
        ``` html
            <a href="http://somesite.com/" style="color:#ff00ff">链接/a>
        ```
        第二步，添加一个额外的span标签。
        ``` html
            <a href="http://somesite.com/" style="color:#ff00ff"><span style="color:#ff00ff">连接</span></a>
        ```

* 邮件中的图片
要记住，图片对于用户来说不一定是会看的到的。所以在设计邮件的时候，一个是要保持简单，一个是要保证重要的内容不要通过图片来展示。

    * 给图片设置大小。 如果忘记给图片设置大小了。 当图片被阻止的时候某些客户端会使用它们自己计算的尺寸，这就可能会破坏邮件的布局。同时也
        要确保图片设置的大小和它的实际大小要相同，有些客户端会忽略设置的大小而使用图片真正的大小。

    * 避免使用png图片。 有一些客户端不支持png图片。使用gif和jpg格式的图片。

    * 给背景图片提供容错颜色。有些客户端不支持背景图片，最好是同时设置一个背景颜色，这在客户端不支持背景图片时，可以显示背景颜色。

    * 给图片标签添加alt 内容。当图片被阻止显示的时候，依然可以通过alt内容显示图片需要展示的信息。

    * hotmail的注意点。hotmail给在图片下面添加额外的padding。可以通过设置`img{display:block}`来移除。

    * 不要使用float。Outlook 2007不支持float属性。可以使用align属性来浮动。
        ``` html
            <img src="image.jpg" align="right">
        ```
        如果在Yahoo!mail中看到很奇怪的图片表现。给图片标签添加`align=top` 属性，一般都可以解决。

* 邮件中的视频
由于不支持javascript或者object标签。邮件中的视频，很长时间只限于gif。然而最近的研究显示html5 video在许多客户端都可以正常使用。那么我们可以这么做，
在使用video不支持的时候，我们可以使用gif作为替代方案。

* 移动端的邮件
随着iPhone和Android的出现以及Palm和RIM改进，移动端的邮件越来越趋向于大一统了。也就是说，我们只需要注意很少的一些地方即可。

    * 邮件宽度小于600px。600px的宽度可以保证在移动端和桌面的邮件客户端都可以表现良好。

    * 注意自动的字体优化。 邮件使用webkit内核会自动字体大小来增加可阅读性。如果测试显示这个特性会损害邮件的设计效果，那么可以通过css来禁止：
        ``` css
            -webkit-text-size-adjust: none;
        ```

最后当然是多测试，看下需要支持的多个邮件客户端表现是啥样子咯。

来一个大概的邮件源码看看：
``` html
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
</head>
<body marginheight="0" topmargin="0" marginwidth="0" leftmargin="0" style="padding:0; margin:0; background: #f4f4f4;">

<table cellPadding="0" cellSpacing="0" border="0" width="100%" style="border: none; width: 100%;">
    <tr>
        <td style="width: 100%; padding: 20px 0; text-align:center; margin: 0 auto;" align="center">
            <table cellPadding="0" cellSpacing="0" border="0"
                   style="width: 750px; margin: 0 auto; background: #fff; border: 1px solid #eeeeee;">
                <tr>
                    <td align="left" valign="middle" style="height:10px;background: #3a7de8">
                    </td>
                </tr>
                <tr valign="top">
                    <td valign="top" align="left"
                        style="padding: 30px 20px 10px 20px;color: #1e1e1e;font-size:14px;font-family: -apple-system,'Segoe UI', Arial,'PingFang SC','Microsoft YaHei',sans-serif;">

                        <table cellSpacing="0" cellPadding="0" border="0" width="100%" style="width: 100%;">
                            <tr>
                                <td style="font-size: 18px; font-weight: bold;">
                                    来自xxxx：
                                </td>
                            </tr>
                        </table>

                        <table cellPadding="0" cellSpacing="0" border="0" style="width: 100%; padding:0; text-align: center; " >
                            <tr>
                                <td align="left" valign="top" style="padding:15px 0 15px 40px; font-size: 14px;">
                                    邮件内容
                                </td>
                            </tr>
                        </table>


                        <table cellSpacing="0" cellPadding="0" border="0" width="100%" style="width: 100%;">
                            <tr>
                                <td align="left" valign="top" style="padding:10px 0 10px 0; font-size: 14px;">
                                    <#if data.replyByEmail>
                                        你可以直接回复这封邮件，或
                                    </#if>
                                    <a style="color:#0033cc" href="${data.targetUrl}" target="_blank">前往查看</a>

                                    <#if data.project?? && data.disableFooter == false>
                                        ，你收到此邮件，是因为xxxx
                                    </#if>
                                </td>
                            </tr>
                        </table>


                        <table cellSpacing="0" cellPadding="0" border="0" width="100%"
                               style="border-top: 1px solid #eeeeee; width: 100%;">
                            <tr>
                                <td align="left" valign="top" style="padding:15px 0 0 0; font-size: 14px; color: #aaaaaa;">
                                    ** 此邮件由xxxx系统自动推送，请勿回复 **
                                </td>
                                <td align="right" style="text-align: right; padding:15px 0 0 0;">
                                    <a href="http://x.code.oa.com" target="_blank">
                                        <img alt="xxx" width="195px" height="22px" src="" style="border:none;"/>
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

</table>
</body>
</html>

```

 PS: 在outlook中设置微软雅黑字体失效，foxmail中没问题。 解决方案：在header中加入样式
 ``` css
    <style type="text/css">
         body {
             font-family: "微软雅黑";
         }
     </style>
 ```