---
title: Snap Animation States 介绍
---

### Snap Animation States 介绍

[官网](https://bkdiehl.github.io/)

> A Snap.svg plugin that lets you load and animate svgs using a simple schema.

从官网介绍来看，我的理解是Snap Animation States更加方便的使用Snap svg 加载svg和制作svg动画。从我的使用体验上来讲，使用起来确实要得心应手。


#### 使用

在html文档底部引入[Snap.svg 0.4.1](https://cdnjs.com/libraries/snap.svg/0.4.1)和snap-animation-states.js。 不需要依赖jquery。

```
<script type="text/javascript" src="js/snap.svg.js">
<script type="text/javascript" src="js/snap-animation-states.js">
```

#### 设置html

svg需要一个容器元素。如下：

```
<i class="icon-hamburger"></i>
<i class="my-svg-selector"></i>
```

#### 调用插件

```
(function() {
    SnapStates({ ...schema... })
})();
```

参数配置：

* `selector: string` css 选择器 - 如: ".icon-hamburger"
* `svg: string` svg 字符串或者引用的svg文件路径
* `easing: string` "linear", "easein", "easeout", "easeinout", "backin", "backout", "bounce", "elastic" 动画函数
* `transitionTime: int` 每个变换的变换时间  一个状态如果有3个变化，变换时间设置为500ms，那么总共需要1500ms
* `initState: string` 插件被调用时的初始状态
* `states: obj` 包含需要变换的状态。每个状态包含一个变换数组。
	- `key: state name` `prop: array of transform objects`
		* `id: int/string/arr` 状态中id需要是唯一的. 如果变换需要延迟一段时间, 可以设置为带有延迟时间的数组: [id, timeout:int]
		* `waitFor: int/string/arr` 设置需要等待前一个变换完成的id.  如果变换需要延迟一段时间, 可以设置为带有延迟时间的数组: [id, timeout: int]
		* `element: string` 变换的元素
		* `x: int` x坐标位移， 相对于开始位置的x坐标
		* `y: int` y坐标位移相对于开始位置的y坐标
		* `r: int/array`  旋转
			- r:180 以自己中心为旋转点旋转180度
			- r:[180, 30, 30] 围绕 30，30 旋转180度
		* `s: int/array` 缩放
			- s:0.5 缩小0.5倍
			- s:[0.5, 1] x轴缩小0.5倍，y轴不变
			- s:[0.5, 0.5, 30, 30] 围绕坐标30，30 缩小0.5倍
		* `attr: obj` svg自带的所有属性值
		* `path: string` 表示svg中d属性
		* `drawPath: int/obj`
			- int: 按百分比来画路径. 0 是没有路径，100是全路径
			- obj: {min: minPath max: maxPath} 在min和max之间随机一个长度的路径。
		* `transitionTime: int/obj`
			- int: 复写基本的变换时间
			- obj: {min: minTime max: maxTime}  在min和max之间随机一个变换时间
		* `easing: string` 变换函数
		* `repeat: obj` 重复动画
			- `loop :bool` 是否无限循环
			- `loopDuration :int` 在一定时间后结束循环
			- `times: int` 重复固定次数

* `events:array of objects`  事件
	- `event: string` 兼容所有的js事件
	- `state: string/array`
		* string: 当事件触发时，引起的state变化
		* array: used for toggle events. ["state1", "state2"] can be toggled when the event happens
	- `selector: string` a css selector used to indicate where to watch for the event - ex: an svg inside an anchor tag.  The anchor tag will receive the selector so that when the anchor is clicked the svg animation runs.

一些加上中文注释的例子：

[Snap states 例子注释版](https://github.com/Rhain/rhain.site/tree/master/source/src/2017/snap-animation-states)