---
title: 'Webpack Loader'
excerpt: 'Webpack Loader'
coverImage: '/assets/blog/webpack/webpack.png'
date: '2023-01-04 20:07:32'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/webpack/webpack.png'
type: 'Webpack'
---

## Loader

帮助 `webpack` 将不同类型的文件转换为 `webpack` 可识别的模块

### Loader 分类及执行顺序

`loader` 分为以下几种类型：

- `pre`：前置 `loader`
- `normal`：普通 `loader`
- `inline`：内联 `loader`
- `post`：后置 `loader`

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        // 前置loader
        enforce: "pre"
        test: /\.js$/,
        loader: "loader1"
      },
      {
        // 普通loader
        test: /\.js$/,
        loader: "loader2"
      },
      {
        // 后置loader
        enforce: "pre"
        test: /\.js$/,
        loader: "loader3"
      }
    ]
  }
  // ...
}
```

`loader` 的执行顺序为：

- `pre` > `normal` > `inline` > `post`
- 如果都为普通 `loader`，执行顺序为从后往前


#### 内联 Loader 的写法

在每个 `import` 语句中显式指定 `loader`

```js
// 使用 css-loader 和 style-loader 来处理 ./styles.css 文件
import styles from "style-loader!css-loader?modules!./styles.css"
```

- 使用 `|` 将 `loader` 区分开来
- 使用 `?` 向 `loader` 传递参数

在内联 `loader` 中可以添加不同的前缀来跳过其它类型的 `loader`：

- `!` 跳过 `normal loader`
```js
import styles from "!style-loader!css-loader?modules!./styles.css"
```
- `-!` 跳过 `pre` 和 `normal loader`
```js
import styles from "-!style-loader!css-loader?modules!./styles.css"
```
- `!!` 跳过 `pre` 、 `normal` 和 `post loader`，即只执行设置的这些 `loader`
```js
import styles from "!!style-loader!css-loader?modules!./styles.css"
```

## 自定义 Loader

`loader` 本质上是导出为函数的模块。函数中的 `this` 会在 `webpack` 调用该函数的时候由 `webpack` 指定，会提供许多方法。

起始的 `loader` 只有一个入参为源文件内容，中间的 `loader` 会接收到上一个 `loader` 产生的结果，最后一个 `loader` 的返回结果应为 `String|Buffer` 类型，代表了模块的 `js` 源码，另外还可以传递第二个可选参数 `sourceMap`，类型为 `Object`。

```js
/**
 * @name: test-loader 每个 loader 都是一个函数
 * @param { String|Buffer } content 源文件内容
 * @param { Object } map sourceMap数据
 * @param { any } meta 其它 loader 传递过来的参数
 * @return {*} newContent 返回新的文件内容
 */
module.exports = function(content, map, meta) {
  console.log('test-loader-content: ', content);
  return content
}
```

### 同步 Loader

如果是处理单个结果，可以直接返回。如果有多个处理结果，必须调用 `this.callback()`。

```js
// 处理单个结果
module.exports = function(content, map, meta) {
  return someOperation(content)
}
// 处理多个结果
module.exports = function (content, map, meta) {
  // 第一个参数是 Error 或者 null
  // 第二个参数是处理后的文件内容
  // 第三个参数是 source-map，如果之前传了，需要继续传递下去
  // 第四个参数是 给其它 loader 传递的参数
  this.callback(null, someSyncOperation(content), map, meta);
  // 当调用 callback() 函数时，总是返回 undefined
  return;
};
```

### 异步 Loader

必须调用 `this.async()` 来告知 `loader runner` 等待异步结果，它会返回 `this.callback()` 回调函数，随后 `loader` 必须调用该回调函数，并返回 `undefined`

```js
module.exports = function (content, map, meta) {
  const callback = this.async()
  setTimeout(() => {
    // 一些异步操作
    callback(null, content, map, meta);
  }, 1000)
  return;
};
```

### Raw Loader

通过设置 `raw` 为 `true`，`loader` 接收到的 `content` 类型为 `Buffer`，通常用来处理图片、字体图标等文件。

在其中既可以使用同步写法，也可以使用异步写法，改变的只是 `content` 类型而已。

```js
module.exports = function (content, map, meta) {
  console.log('content: ', content);
  return content;
};
module.exports.raw = true
```

### Pitch Loader

`loader` 总是从后往前执行的，但在执行这些 `loader` 之前，首先会从前往后依次调用每个 `loader` 的 `pitch` 方法

如果有一个 `loader` 的 `pitch` 方法返回了数据，就会直接跳过剩余 `loader` 的 `pitch` 方法，直接执行前一个 `normal loader`

```js
// loader1
module.exports = function (content, map, meta) {
  console.log('normal loader1');
  return content;
};

module.exports.pitch = function() {
 console.log("pitch loader1");
//  return "loader1"
}

// webpack.config.js
module.exports = {
  //...
  module: {
    rules: [
      {
        //...
        use: ['loader1', 'loader2', 'loader3'],
      },
    ],
  },
};
// 执行顺序为
pitch loader1
pitch loader2
pitch loader3
normal loader3
normal loader2
normal loader1
```

如果在 `loader1` 中返回数据：

```js
pitch loader1
```

如果在 `loader2` 中返回数据：

```js
pitch loader1
pitch loader2
normal loader1
```

如果在 `loader3` 中返回数据：

```js
pitch loader1
pitch loader2
pitch loader3
normal loader2
normal loader1
```

### Loader 常用 API

[Loader API](https://webpack.docschina.org/api/loaders/#asynchronous-loaders)

- `this.callback` 同步调用返回多个结果
- `this.async` 异步 `loader` 中返回 `callback` 回调函数
- `this.getOptions` 获取 `loader` 的 `options`
- `this.emitFile` 产生一个文件
- `this.utils.contextify` 返回一个相对路径
- `this.utils.absolutify` 返回一个绝对路径

### clean-log-loader

清除代码中的 `console.log(xxx)`

```js
module.exports = function(content) {
  return content.replace(/console\.log\(.*\);?/g, "")
}
```

### banner-loader

在文件顶部加上作者等信息注释

```js
const schema = require('./schema.json')
module.exports = function(content) {
  // schema 参数是对 options的验证规则
  // 并且需要符合 JSON Schema 的规则
  const { author } = this.getOptions(schema)
  const prefix = `
    /*
    * Author: ${author}
    */
  `
  return prefix + content
}
```

需要 `schema.json` 文件，来验证 `options`

```js
// schema.json
{
  // options 类型
  "type": "object",
  // options 的属性
  "properties": {
    "author": {
      // 字段的属性
      "type": "string"
    }
  },
  // 不允许在 options 中添加其它属性
  "additionalProperties": false
}
```

```js
// webpack.config.js
...
{
  test: /\.js$/,
  loader: path.resolve(__dirname, "./loaders/banner-loader/index.js"),
  options: {
    author: "里斯", // 传入其它类型会报错
    // age: 20, // 传入另外的属性也会报错
  }
},
...
```

### babel-loader

简单的 `babel-loader`，借助 `@babel/core` 来进行代码转换，使用 `@babel/preset-env` 智能预设将 `es6+` 语法转换为 `es5`

```js
const babel = require("@babel/core")
const schema = require("./schema.json")

module.exports = function(content) {
  // 异步 loader
  const callback = this.async();
  const options = this.getOptions(schema);
  // 使用 babel/core 将代码进行转换
  // 这是一个异步方法
  babel.transform(content, options, function (err, result) {
    // result => { code, map, ast }
    if(err) {
      callback(err)
    } else {
      callback(null, result.code)
    }
  });
}
```

### file-loader

使用 `raw-loader` 来处理图片、字体等文件

```js
const loaderUtils = require("loader-utils")

module.exports = function(content) {
  // 1.根据文件内容生成带hash值的文件名
  // 使用 webpack 提供的工具函数来生成 hash
  const interpolateName = loaderUtils.interpolateName(
    this, // loader 上下文
    "[hash].[ext][query]", // 名称
    {
      content,
    } // 配置项
  );

  // 2.将文件输出出去
  this.emitFile(interpolateName, content)
  
  // 3.最后导出文件路径
  return `module.exports = ${interpolateName}`

  // 后续可以通过传配置来自定义文件名称及目录
}

// 处理的字体、图片等数据，都是 Buffer 数据
// 需要使用 Raw Loader
module.exports.raw = true
```

在 `webpack.config.js` 中需要使用 `type: 'javascript/auto'` 来阻止 `webpack` 的默认处理，使用我们自定义的 `loader`

```js
// webpack.config.js
...
{
  test: /\.(png|jpe?g|gif)$/,
  loader: path.resolve(__dirname, "./loaders/file-loader/index.js"),
  type: "javascript/auto"
},
...
```

### style-loader

采用 `pitch loader` 和 `inline loader` 实现

```js
module.exports = function() {

}

module.exports.pitch = function(remainingRequest) {
  // remainingRequest 是剩余的还需要处理的loader，其为绝对路径的内联 loader
  // 我们需要将绝对路径转换为相对路径
  const relativePath = remainingRequest
    .split("!")
    .map((absolutePath) => {
      // this.context 当前上下文
      // absolutePath 绝对路径
      // 返回 absolutePath 相对于当前上下文的相对路径
      return this.utils.contextify(this.context, absolutePath);
    })
    .join("!");
  // 需要执行脚本
  // 使得后面的 normal loader 都不执行
  // 改用 inline loader 进行执行
  // !!${relativePath} 会跳过 `pre` 、 `normal` 和 `post loader`，即只执行内联中的这些 `loader`
  const script = `
    import style from "!!${relativePath}"
    const el = document.createElement("style")
    el.innerHTML = style
    document.head.appendChild(el)
  `;
  // 终止后面的 loader 执行
  return script;
}
```