---
title: surviveJs webpack 阅读笔记
---

> [SurviveJs - Webpack](https://survivejs.com/webpack/developing/automatic-browser-refresh/)

阅读`surviveJs - Webpack ` 自己不懂或者不知道的地方记录下来。

1. `webpack-dev-server` 是在内存中运行的，也就意味着生成的bundle不会写入到文件，我们可以通过http请求中获取到内容（测试过）。

    如果我们需要把内存中的bundle写入文件。可以使用 ` webpack-disk-plugin`, `write-file-webpack-plugin` 插件。或者 `html-webpack-harddisk-plugin `。

2. webpack 的配置文件里面可以获取到`--env` 的值的：

    ```js
    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    const PATHS = {
      app: path.join(__dirname, 'app'),
      build: path.join(__dirname, 'build'),
    };

    const commonConfig = {
      // Entries have to resolve to files! They rely on Node
      // convention by default so if a directory contains *index.js*,
      // it resolves to that.
      entry: {
        app: PATHS.app,
      },
      output: {
        path: PATHS.build,
        filename: '[name].js',
      },
      plugins: [
        new HtmlWebpackPlugin({
          title: 'Webpack demo',
        }),
      ],
    };

    module.exports = (env) => {
        console.log(env);

        return commonConfig;
    }
    ```

    运行 npm start 任务： `"start": "webpack-dev-server --env development",` 控制台会输出 `development` 值。

    传入webpack配置文件的env对象可以是对象类型，如当我们执行 npm build: `"build": "webpack --env.target production"` 的时候，控制台会输出`{ target: 'production' }`。 也就是说我们可以给env 设置多个值。webpack 底层是依赖 [yargs](http://yargs.js.org/docs/#parsing-tricks-dot-notation)。webpack2 相对于webpack1 不允许通过CLI传自定义的参数了，建议都是通过--env来传递。

3. `http://localhost:8080/webpack-dev-server/`  可以查看webpack-dev-server 的状态。

4. [dotenv ](https://www.npmjs.com/package/dotenv) 可以通过.env 文件方便来定义环境变量。

5. webpack-dev-server 可以监控文件改动自动重启，但是如果改动了webpack.config.js 文件不在监控范围内。我们可以使用`nodemon`来监控我们的配置文件。

    先安装nodemon: `npm install --save-dev nodemon`.
    npm 脚本： `"start": "nodemon --watch webpack.config.js --exec \"webpack-dev-server --env development\""`

6. `[webpack-merge](https://www.npmjs.org/package/webpack-merge)` 用于拼接数组，而不是覆盖。 用于细分配置，通过组合的方式来组合不同环境下的配置文件。

    ```js
    > merge = require('webpack-merge')
    ...
    > merge(
    ... { a: [1], b: 5, c: 20 },
    ... { a: [2], b: 10, d: 421 }
    ... )
    { a: [ 1, 2 ], b: 10, c: 20, d: 421 }
    ```

7. css-loader默认是处理相对路径的，但是不会处理绝对路径(url('/static/img/demo.png')。 如果需要支持这种方式，必须把文件复制到项目中。可以使用[copy-webpack-plugin](https://www.npmjs.com/package/copy-webpack-plugin) 来实现。同样你可以手动复制过来，但是使用copy-webpack-plugin的方式webpack-dev-server 可以识别。

8. 如果想在css-loader 中以其他的方式处理import，那么需要设置importLoaders 属性告诉css loader当碰到import后面有多少个loader需要处理。

    比如在css文件中引入了一个sass文件。

    ```js
    @import "./variables.sass";
    ```
    处理这个sass文件，需要这么配置。

    ```js
    {
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
          },
        },
        'sass-loader',
      ],
    },
    ```
    如果添加了更多的loader，像： postcss-loader,那么需要调整importLoaders 为2.

9. 去除未使用的css。 使用[PurifyCSS](https://www.npmjs.com/package/purifycss)来实现。

    测试使用了purecss。在index.js 中引入

    ```js
    import 'purecss';
    ```

    component.js 中使用到purecss的一个样式：
    ```
    export default (text = 'Hello world') => {
      const element = document.createElement('div');
      element.className = 'pure-button';

      element.innerHTML = text;

      return element;
    };

    ```

    运行`npm run build` 打包后的 app.css 大小是17kb，把pure.css都包含进来了。

    使用purifyCSS：
    1) 安装： `npm install glob purifycss-webpack purify-css --save-dev`
    2) 引入：

    ```js
    const PurifyCSSPlugin = require('purifycss-webpack');


    ...


    exports.purifyCSS = ({ paths }) => ({
      plugins: [
        new PurifyCSSPlugin({ paths }),
      ],
    });
    ```
    注意： 这个插件必须是在 ExtractTextPlugin 插件之后，不然不起作用。

    3). 使用：
    ```js
    const glob = require('glob');

    const parts = require('./webpack.parts');
    ...

    const productionConfig = merge([
      ...

      parts.purifyCSS({
        paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }),
      }),

    ]);
    ```

    此时app.css 只有3kb大小。这对于一些大的ui库来说，还是很有用的。使用purifyCSS 会丢失source map的功能。

10. [isomorphic-style-loader](https://www.npmjs.com/package/isomorphic-style-loader)可以用来优化[关键渲染路径](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/)。优化关键渲染路径是指优先显示与当前用户操作有关的内容。可以用来提升网站的性能。

11. [Stylelint](http://stylelint.io/) 可以用来统一我们的css代码风格。 scss 使用[stylelint-scss](https://www.npmjs.com/package/stylelint-scss)。也可以使用[stylelint-webpack-plugin](https://www.npmjs.com/package/stylelint-webpack-plugin) 来实现相同的功能。

12. webpack loader的加载顺序是从右至左，从下往上的。 比如：

    ```js
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
    ```

    等同于

    ```js
    {
      test: /\.css$/,
      use: ['style-loader'],
    },
    {
      test: /\.css$/,
      use: ['css-loader'],
    },
    ```

    rules 的enforce属性可以跳出这种限制，

    ```js
    {
      // Conditions
      test: /\.js$/,
      enforce: 'pre', // 'post' too

      // Actions
      loader: 'eslint-loader',
    },
    ```
    enforce 设置pre 可以在其他loader执行之前执行。post 则是在build source之后。

13. 给loader设置参数，推荐使用options的方式来：

    ```js
    {
      // Conditions
      test: /\.js$/,
      include: PATHS.app,

      // Actions
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        presets: ['react', 'es2015'],
      },
    },
    ```

    或者使用use：

    ```js
    {
      // Conditions
      test: /\.js$/,
      include: PATHS.app,

      // Actions
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: ['react', 'es2015'],
        },
      },
    },
    ```

    如果需要设置多个loader的参数：

    ```js
    {
      test: /\.js$/,
      include: PATHS.app,

      use: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['react', 'es2015'],
          },
        },
        // Add more loaders here
      ],
    },
    ```

14. webpack不允许任意多个的options配置，可以使用LoaderOptionsPlugin 来解决这个问题。

    ```js
    plugins: [
      new webpack.LoaderOptionsPlugin({
        sassLoader: {
          includePaths: [
            path.join(__dirname, 'style'),
          ],
        },
      }),
    ],
    ```

15. [webpack-spritesmith](https://www.npmjs.com/package/webpack-spritesmith) 可以用来合成雪碧图。需要先使用`SpritesmithPlugin`插件，生成雪碧文件，在使用。

    ```js
    @import '~sprite.sass';

    .close-button {
      sprite($close);
    }

    .open-button {
      sprite($open);
    }
    ```

16. 如果使用了images 和css-loader 的sourcemap选项，必须设置`output.publicPaht`为服务器上的绝对路径，不然images不会生效。

17. 有时候我们的应用可能有多个entry文件，引用的公共库文件可以给每个entry文件生成单独的公共文件。比如说有一个login和app的entry。

    可以如下配置：

    ```js
    const config = {
      ...
      plugins: [
        new webpack.optimize.CommonsChunkPlugin({
          name: 'login',
          chunks: ['login'],
          minChunks: isVendor,
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          chunks: ['app'],
          minChunks: isVendor,
        }),
        // Extract chunks common to both app and login
        new webpack.optimize.CommonsChunkPlugin({
          name: 'common',
          chunks: ['login', 'app'],
          minChunks: (module, count) => count >= 2 && isVendor(module),
        }),
      ],
      ...
    };

    function isVendor({ resource }) {
      return resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.js$/);
    }
    ```

18. webpack 清除构建目录插件[clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin)。 在每次构建前，先清空构建目录。

    ```js
    const CleanWebpackPlugin = require('clean-webpack-plugin');

    ...

    exports.clean = (path) => ({
      plugins: [
        new CleanWebpackPlugin([path]),
      ],
    });
    ```

    ```js
    const productionConfig = merge([

      parts.clean(PATHS.build),

      ...
    ]);
    ```

19. 给build文件添加git版本信息。可以使用[webpack.BannerPlugin](https://webpack.js.org/plugins/banner-plugin/) 和[git-revision-webpack-plugin](https://www.npmjs.com/package/git-revision-webpack-plugin)来实现。
    ```js

    const GitRevisionPlugin = require('git-revision-webpack-plugin');

    exports.attachRevision = () => ({
      plugins: [
        new webpack.BannerPlugin({
          banner: new GitRevisionPlugin().version(),
        }),
      ],
    });
    ```

    ```js
    const productionConfig = merge([
      ...

      parts.attachRevision(),

    ]);
    ```
    这样会在每个build的文件第一行添加了git的版本信息如：`/*! 45a755e */`

20. webpack 默认对使用了ES6 module使用了tree shaking。 但是如果想对外部的包也使用tree shaking,可以使用[babel-plugin-transform-imports ](https://www.npmjs.com/package/babel-plugin-transform-imports)重写import来适配webpack的tree shaking逻辑。


ps: `library` 和 `libraryTarget` 的作用：

```js
output: {
      path: PATHS.build,
      library: 'demo',
      libraryTarget: 'var',
    },
```

会生成：

```js
var Demo =
/******/ (function(modules) { // webpackBootstrap
...
/******/ })
...
/******/ ([
  ...
/******/ ]);
```

也就是产生`var <output.library> = <webpack bootstrap>` 这样的代码。libraryTarget 还有其他的值`window`=>`window["demo"]`, `global`=>`global["demo"]`,`assign`=> demo = , `this`=>`this["demo"]`.`commonjs`=>`exports["demo"]=`, `commonjs2`=>`module.exports=`,`amd`=>

```js
define("Demo", [], function() { return /******/ (function(modules) { // webpackBootstrap
...
```

`umd`=>

```js
(function webpackUniversalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if(typeof define === 'function' && define.amd)
    define("Demo", [], factory);
  else if(typeof exports === 'object')
    exports["Demo"] = factory();
  else
    root["Demo"] = factory();
})(this, function() {
```
`jsonp`=>

```js
Demo(/******/ (function(modules) { // webpackBootstrap
```







































