---
title: 书写易读代码
---

函数式编程有非常陡的学习曲线。相对于命令式编程有很多新的概念，像`composition, identities, functors, monads, contravariants` 等等。想要把函数式编程融入到日常的开发中，还是有点难度的，特别是对于习惯了命令式编程的人来说。

但是函数式编程的好处是让你书写声明式的代码：描述你做什么，而不是描述你怎么做的。这就意味着你可以很容易的理解一段代码是干什么的，而不需要去了解它是怎么实现的。

书写易读的代码不正式我们程序员所追求的么？

那么我们如何在平常写代码的时候声明式的去写代码呢。

就拿循环来说。命令式的循环写法：

```javascript

function loop(arr) {
    for(let i = 1; i < arr.length; i++){
        arr[i] *= 2;
        if(arr[i] % 2 === 0){
            doSomething(arr[i]);
        }
    }

}

```

上面的代码做了啥？ 从数组第二个元素开始，每个元素乘2，如果正好可以被2 整除则在单独处理。在处理过程中，原数组也被修改了，这可能是你并不想要的因为这个数组可能在其他地方也需要使用。而且，这段代码第一眼是比较难理解的，它是使用命令式的方式来写的。我们很容易使用声明式的方式来重写这段代码。

``` javascript
function loop(arr){
    const evenNumbers = n > n % 2 === 0;
    arr.slice(1)
        .map(v => v * 2)
        .filter(evenNumbers)
        .forEach(v => doSomething(v))
}

```

上面的代码就从函数名就可以知道代码做了啥，我也不需要它是如何实现的。同时也不会修改原数组，不会引入副作用。

在来一个列子，从json数组中获取数据，有json 数据如下：
``` javascript
[
    {
        "country": "NL",
        "points": 12
    },
    {
        "country": "BE",
        "points": 3
    },
    {
        "country": "NL",
        "points": 0
    },
    ...
]
```
如果我要计算NL的分数。使用命令式的方式可能是这样写：

``` javascript
function count(votes){
    let score = 0;
    for(let i = 0;i < votes.length; i++){
        if(votes[i].country === 'NL'){
            score += vote[i].points;
        }
    }

    return score;
}

```
使用声明式的方式来重写：

``` javascript
function count(votes){
    const sum = (a, b) => a + b;
    votes.filter(v => v.country === 'NL')
          .map(vote => vote.points)
          .reduce(sum);
}
```


还有就是我们在写if else的时候可以使用三元操作符来提升我们的代码可阅读行。

``` javascript
if(condition){
    doSomething1();
}else{
    doSomething2();
}

const value = condition ? doSomething1() :  doSomething2();

```

比如说我们有一个这样的判断判断元素是否在可视区域内：

``` javascript
const box = element.getBoundingClientRect();

if (box.top - document.body.scrollTop > 0 && box.bottom - document.body.scrollTop < window.innerHeight) {
    reveal();
} else {
    hide();
}
```

如果换成三元符则可以重构成：
``` javascript
const box = element.getBoundingClientRect();
const isInViewport =
    box.top - document.body.scrollTop > 0 &&
    box.bottom - document.body.scrollTop < window.innerHeight;

isInViewport ? reveal() : hide();
```

代码可读性提升了一个档次。

在开看下如果是判断多个元素，命令式写法：

``` javascript
elements
    .forEach(element => {

        const box = element.getBoundingClientRect();

        if (box.top - document.body.scrollTop > 0 && box.bottom - document.body.scrollTop < window.innerHeight) {
            reveal();
        } else {
            hide();
        }

    });
```

重构成声明式写法：
``` javascript
const isInViewport = element => {
    const box = element.getBoundingClientRect();
    const topInViewport = box.top - document.body.scrollTop > 0;
    const bottomInViewport = box.bottom - document.body.scrollTop < window.innerHeight;
    return topInViewport && bottomInViewport;
};

elements
    .forEach(elem => isInViewport(elem) ? reveal() : hide());
```

那么isInViewport 则可以很容易抽成一个util方法了。
``` javascript
import { isInViewport } from 'helpers';

elements
    .forEach(elem => isInViewport(elem) ? reveal() : hide());
```

可以看到采用声明式的思想来写代码可以写出非常易懂的代码。不过这也有所局限，目前的例子都是基于Array的提供的方法来做的。当然js也是可以函数式来编程的。不过大部分的开发还是采用命令式来写代码的，不过在写命令式的时候可以多想想融入函数式的思想，把自己写的代码很容易让别人看懂，这就很不一样了。