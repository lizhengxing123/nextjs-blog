---
title: 'Webpack 基础'
excerpt: '学习 Webpack'
coverImage: '/assets/blog/webpack/webpack.png'
date: '2022-12-05 20:12:08'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/webpack/webpack.png'
type: 'Webpack'
---

`webpack` 是一个用于现代 `JavaScript` 应用程序的静态模块打包工具。

[官方文档](https://webpack.docschina.org/concepts/#entry)

## 入口 - entry

入口(`entry`)指示 `webpack` 应该使用哪个模块来作为构建其内部依赖图的开始。**使用相对路径**

### 单个入口（简写）语法

```js
module.exports = {
  entry: "./src/main.js"
}
// 是以下形式的简写
module.exports = {
  entry: {
    main: "./src/main.js"
  }
}
```

也可以将一个文件路径数组传给 `entry` 属性，这将创建多个入口。这在将多个依赖文件的依赖关系绘制在一个 `chunk` 中很有用。

```js
module.exports = {
  entry: ["./src/main.js", "./src/index.js"],
  output: {
    filename: "bound.js"
  }
}
```

### 对象语法

```js
module.exports = {
  entry: {
    app: "./src/app.js",
    adminApp: "./src/adminApp.js",
  }
}
```

用于描述入口的对象里面可以使用以下属性：

- `dependOn`：当前入口所依赖的入口。它们必须在当前入口加载前被加载
- `filename`：指定要输出的文件名称
- `import`：启动时要加载的模块
- `library`：指定 `library`，为当前 `entry` 构建一个 `library`
- `runtime`：运行时 `chunk` 的名字。如果设置了，就会创建一个新的运行时 `chunk`。可将其设置为 `false` 来避免一个新的运行时 `chunk`
- `publicPath`：当该入口的输出文件在浏览器中被引用时，为它们指定一个公共的 `URL` 地址

> 需要注意以下情况
> 1. `runtime` 和 `dependOn` 不能在同一个入口上同时使用，意味着对象中这两个属性只能有一个，或者都没有
> 2. `runtime` 不能指向已经存在的入口名称
> 3. `dependOn` 不能是循环引用的

```js
module.exports = {
  entry: {
    a1: "./src.a1.js",
    a2: {
      dependOn: "a1",
      import: "./src.app.js"
    }
  }
}
// runtime 和 dependOn 不能在同一个入口上同时使用
// 以下代码会报错
module.exports = {
  entry: {
    a1: "./src.a1.js",
    a2: {
      dependOn: "a1",
      runtime: 'x1',
      import: "./src.app.js"
    }
  }
}
// `runtime` 不能指向已经存在的入口名称
// 以下代码会报错
module.exports = {
  entry: {
    a1: "./src.a1.js",
    a2: {
      runtime: 'a1',
      import: "./src.app.js"
    }
  }
}
// `dependOn` 不能是循环引用的
// 以下代码会报错
module.exports = {
  entry: {
    a1: {
      dependOn: 'a2',
      import: "./src.a1.js"
    },
    a2: {
      dependOn: 'a1',
      import: "./src.app.js"
    }
  }
}
```

### 实际用例

- 分离应用程序`app`和第三方库`vendor`入口

```js
module.exports = {
  entry: {
    app: "./src/app.js",
    vendor: "./src/vendor.js"
  }
}
```

- 多页面应用程序

```js
module.exports = {
  entry: {
    pageOne: "./src/pageOne.js",
    PageTwo: "./src/PageTwo.js",
    pageThree: "./src/pageThree.js",
  }
}
```
> 每个 HTML 文档只使用一个入口起点

## 输出 - output

输出属性告诉 `webpack` 在哪里输出它所创建的 `bundle`，以及如何命名这些文件。**即使存在多个`entry`，但也只能指定一个`output`配置**

### 用法

**`path`需要使用绝对路径**

```js
module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "bundle.js"
  }
}
```
> 此配置将一个单独的 `bundle.js` 文件输出到 `dist` 目录中

- 多个入口，使用占位符来确保每个文件具有唯一的名称

```js
const path = require('path')
module.exports = {
  entry: {
    app: "./src/app.js",
    vendor: "./src/vendor.js"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  }
}
// 输出 /dist/app.js /dist/vendor.js
```

- 对资源使用 `CDN` 和 `hash`

```js
module.exports = {
  ...
  output: {
    path: "/home/proj/cdn/assets/[fullhash]",
    // 输出文件在浏览器中被引用时，为它们指定一个公共的 `URL` 地址
    publicPath: "https://cdn.example.com/assets/[fullhash]/"
  }
}
```
> 如果不知道最终输出文件的 `publicPath` 地址是多少，可以将其留空，
> 在运行时通过入口起点文件中的`__webpack_public_path__`来动态设置

## loader

`loader` 用于对模块的源代码进行转换，它可以在加载模块时预处理文件。

### 用法

`loader` 从后往前执行

```js
module.exports = {
  module: {
    rules: [
      // 转换 css
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          { loader: 'sass-loader' },
        ],
      },
      // 转换 ts
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }
    ]
  }
}
```

### 特性

- `loader`支持链式调用。一组链式的`loader`按照相反的顺序来执行，前一个`loader`将其转换完的结果传递给下一个`loader`，链中的最后一个`loader`返回所期望的`JavaScript`
- `loader`可以是同步的，也可以是异步的
- `loader`运行在`Node.js`中，并且能够执行任何操作
- `loader`可以通过`options`对象配置
- `module.rules`中的`loader`字段可以直接引用一个模块
- `plugin`可以为`loader`带来更多的特性
- `loader`可以产生额外的任意文件

## 插件 - plugins

插件是 `webpack` 的支柱功能，插件能够解决 `loader` 无法实现的其他事，功能更加强大。

### 剖析

插件是一个具有 `apply` 方法的 `JavaScript` 对象。`apply` 方法会被 `webpack compiler` 调用，并且在整个编译声明周期都可以访问 `compiler` 对象。

```js
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log('webpack 构建正在启动！');
    });
  }
}

module.exports = ConsoleLogOnBuildWebpackPlugin;
```

### 用法

- 配置方式

```js
const path = require("path")
const webpack = require('webpack'); // 访问内置的插件
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: "./src/main.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    // 用于自定义编译过程中的进度报告
    new webpack.ProgressPlugin(),
    // 生成 HTML 文件，并在其中引入打包之后的js
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ]
}
```

- `Node API` 方式：可以通过配置中的 `plugins` 属性传入插件

```js
const webpack = require('webpack'); // 访问 webpack 运行时(runtime)
const configuration = require('./webpack.config.js');

let compiler = webpack(configuration);

new webpack.ProgressPlugin().apply(compiler);

compiler.run(function (err, stats) {
  // ...
});
```

## 模式- mode

- `development`：开发模式
- `production`：生产模式（默认）
- `none`：不使用任何默认优化选项

> 如果要根据 `webpack.config.js` 中的 `mode` 变量更改打包行为，则必须将配置导出为函数，函数返回值为配置对象