---
title: 调试javascript小技巧
---

大部分的建议适用于Chrome Inspector 和Firefox。只记录我不太了解的方式:D.

1. 'debugger'.

    在代码中插入`debugger`,Chrome在执行代码的时候会自动停止在当前代码行。也就是说可以快速在编辑器中设置断点，而不用在chrome去找到代码文件设计断点。

    ```js
    if (thisThing) {
        debugger;
    }
    ```

2. 用表格展示对象
    有时候我们有一些非常复杂的对象需要展示，我们可以使用console.log() 展示。但是可以使用console.table来展示，会比console.log更加易读。

    ```js
    var animals = [
        { animal: 'Horse', name: 'Henry', age: 43 },
        { animal: 'Dog', name: 'Fred', age: 13 },
        { animal: 'Cat', name: 'Frodo', age: 18 }
    ];

    console.table(animals);
    ```

    会输出：
    ![](/images/2017/javascript-tips/tips-2.png)

3. 快速找到DOM元素

    Chrome会把最后5个点击的DOM元素保存到内存中，所以你最后点击的DOM元素，可以通过$0来获取，倒数第二个可以用$1,以此类推。如果你依序点击了下面的DOM节点，‘item-4′, ‘item-3’, ‘item-2’, ‘item-1’, ‘item-0’ ，那么可以在控制台很快速的获取到这5个节点。

    ![](/images/2017/javascript-tips/tips-3.png)

4. 使用console.time() and console.timeEnd()计算函数执行时间。如果想要一段代码执行的准确时间，可以使用console.time() and console.timeEnd()来实现。

    如有下面一段代码：

    ```js
    console.time('Timer1');

    var items = [];

    for(var i = 0; i < 100000; i++){
       items.push({index: i});
    }

    console.timeEnd('Timer1');
    ```

    会输出：
    ![](/images/2017/javascript-tips/tips-4.png)

5. 获取一个函数的堆栈。console.trace() 可以很方便的获取一个函数的函数调用信息。

    比如有一下代码：

    ```js
    var car;
    var func1 = function() {
        func2();
    }

    var func2 = function() {
        func4();
    }
    var func3 = function() {
    }

    var func4 = function() {
        car = new Car();
        car.funcX();
    }
    var Car = function() {
        this.brand = ‘volvo’;
        this.color = ‘red’;
        this.funcX = function() {
            this.funcY();
        }

        this.funcY = function() {
            this.funcZ();
        }

        this.funcZ = function() {
            console.trace(‘trace car’)
        }
    }
    func1();
    var car;
    var func1 = function() {
        func2();
    }
    var func2 = function() {
        func4();
    }
    var func3 = function() {
    }
    var func4 = function() {
        car = new Car();
        car.funcX();
    }
    var Car = function() {
        this.brand = ‘volvo’;
        this.color = ‘red’;
        this.funcX = function() {
            this.funcY();
        }
        this.funcY = function() {
            this.funcZ();
        }
        this.funcZ = function() {
            console.trace(‘trace car’)
        }
    }
    func1();
    ```

    会输出：
    ![](/images/2017/javascript-tips/tip-5.png)

6. 快速debug函数

    一般我们debug函数有两种方法：一是在chrome inspector中到代码设置断点。二是在脚本中添加debugger。

    但是有一种更加快速的方法。在控制台执行debug(funcName)，脚本执行到这个函数的会将会停下来。不过这个方法不适用在私有和匿名方法。

    比如有下面的代码：

    ```js
    var func1 = function() {
        func2();
    };

    var Car = function() {
        this.funcX = function() {
            this.funcY();
        }

        this.funcY = function() {
            this.funcZ();
        }
    }

    var car = new Car();
    ```

    在控制台输入`debug(car.funcY)`,当脚本执行到car.func时会进入debug模式。
    ![](/images/2017/javascript-tips/tips-6.png)

7. 观察函数调用和传入的参数

    在Chrome的控制台，我们可以监控一个函数，当它被调用的时候，会记录下来，同时会显示传入的参数值。

    有这段代码：

    ```js
    var func1 = function(x, y, z) {
    //....
    };
    ```
    会输出：

    ![](/images/2017/javascript-tips/tips-7.png)

    这是一种非常方便的方式用于观察传入函数参数的值。

8. 断点DOM 节点变化。

    有时候DOM的节点的属性改变了，但是我们却不知道为啥。当DOM节点变化的时候，Chrome可以暂时脚本。在Chrome Inspector中右键一个元素，选择一个断点方式。

    ![](/images/2017/javascript-tips/tips-8.png)

    > 原文：[javascript-debugging-tips](https://raygun.com/javascript-debugging-tips)