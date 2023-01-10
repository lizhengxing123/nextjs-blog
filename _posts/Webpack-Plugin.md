---
title: 'Webpack Plugin'
excerpt: 'Webpack Plugin'
coverImage: '/assets/blog/webpack/webpack.png'
date: '2023-01-05 21:40:40'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/webpack/webpack.png'
type: 'Webpack'
---

## Plugin

通过 `plugin` 可以扩展 `webpack`，加入自定义的构建行为，使 `webpack` 可以执行更广泛的任务，拥有更强的构建能力。

### 工作原理

`webpack` 就像是一条生产线，要经过一系列流程后才能将源文件转换成输出结果。这条生产线上的每个处理流程的指责都是单一的，多个流程之间存在依赖关系，只有当前流程处理完成之后，才能交给下一个流程去处理。插件就像是一个插入到生产线中的功能，在特定的时机对生产线上的资源做处理。`webpack` 通过 `Tapable` 来组织这条复杂的生产线。`webpack` 在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条生产线中，去改变生产线的运作。`webpack` 的事件流机制保证了插件的有序性，使得整个系统扩展性很好。

### Tapable

`Tapable` 为 `webpack` 提供了统一的插件接口类型定义。它统一暴露了三个方法拱插件使用，用于注入不同类型的自定义构建行为：

- `tap` 可以注册同步钩子和异步钩子
- `tapAsync` 回调方式注册异步钩子
- `tapPromise` `Promise` 方式注册异步钩子

### 构建对象

#### compiler

`compiler` 对象中保存着完整的 `webpack` 配置，每次启动 `webpack` 构建时都会创建一个独一无二的对象。在这个对象上我们可以访问到 `webpack` 的主环境配置，如 `loader plugin` 等信息。

#### compilation

`compilation` 对象代表一次资源的构建，`compilation` 实例能够访问所有的模块和它们的依赖。

一个 `compilation` 对象会对构建依赖图中所有模块进行编译，在编译阶段，模块会被加载(`load`)、封存(`seal`)、优化(`optimize`)、分块(`chunk`)、哈希(`hash`)和重新构建(`restore`)

## 自定义插件

每个插件就是一个构造函数，需要在其原型上定义一个 `apply` 方法。

### test-plugin

```js
/*
 * 1. webpack 会先初始化所有的 plugins，也就是调用每个插件的 constructor 方法
 * 2. 创建 compiler 对象
 * 3. 接着会调用每个插件的 apply 方法
 * 4. 执行编译流程，触发各个 hooks
 */
class TestPlugin {
  constructor() {
    console.log("test-plugin")
  }
  apply(compiler) {
    console.log('apply-compiler: ');
  }
}

module.exports = TestPlugin;
```

### 注册hooks

```js
compiler.hooks[钩子名称][钩子类型](插件名称, (钩子传递的参数) => {
  函数体
})
```

- 钩子名称根据文档来确定
- 钩子类型有三种：`tap tapAsync tapPromise`
- 如果是 `tapAsync`，会在最后一个参数传递 `callback`，最后调用 `callback` 来完成钩子调用
- 如果是 `tapPromise`，通过调用 `resolve/reject` 来完成钩子调用

```js
class TestPlugin {
  constructor() {
    console.log("test-plugin")
  }
  apply(compiler) {
    console.log('apply-compiler: ');
    // 同步钩子 SyncHook，使用 tap 来注册钩子
    compiler.hooks.environment.tap("TestPlugin", () => {
      console.log("compiler-environment");
    });
    // 异步串行钩子 AsyncSeriesHook，可以使用 tap/tapAsync/tapPromise 来注册钩子
    // 异步串行钩子会挨个执行
    // 所以顺序是：
    // 1，compiler-emit-tap
    // 2，1s后 compiler-emit-tapAsync
    // 3，再2s后 compiler-emit-tapPromise
    compiler.hooks.emit.tap("TestPlugin", (compilation) => {
      console.log("compiler-emit-tap");
    });
    // tapAsync 会传递 callback 参数
    compiler.hooks.emit.tapAsync("TestPlugin", (compilation, callback) => {
      // 模拟异步
      setTimeout(() => {
        console.log("compiler-emit-tapAsync");
        callback();
      }, 1000);
    });
    // tapPromise 需要返回 Promise
    compiler.hooks.emit.tapPromise("TestPlugin", (compilation) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("compiler-emit-tapPromise");
          resolve();
        }, 2000);
      });
    });
    // 异步并行钩子 AsyncParallelHook，可以使用 tap/tapAsync/tapPromise 来注册钩子
    // 异步并行钩子会同时执行
    // 所以顺序是：
    // 1，1s后 compiler-make-222
    // 2，再1s后 compiler-make-111
    // 3，再1s后 compiler-emit-333
    compiler.hooks.make.tapAsync("TestPlugin", (compilation, callback) => {
      // 也可以注册 compilation 的钩子
      compilation.hooks.seal.tap("TestPlugin", () => {
        // 在 compiler-emit-333 之后打印
        console.log("compiler-make-seal");
      });
      setTimeout(() => {
        console.log("compiler-make-111");
        callback();
      }, 2000);
    });
    compiler.hooks.make.tapAsync("TestPlugin", (compilation, callback) => {
      setTimeout(() => {
        console.log("compiler-make-222");
        callback();
      }, 1000);
    });
    compiler.hooks.make.tapAsync("TestPlugin", (compilation, callback) => {
      setTimeout(() => {
        console.log("compiler-make-333");
        callback();
      }, 3000);
    });
  }
}

module.exports = TestPlugin;
```

### BannerWebpackPlugin

给打包输出文件添加注释

#### 开发流程

- 在打包输出前添加注释，需要用到 `compiler.hooks.emit`，这个钩子是在打包输出前触发的
- 通过 `compilation.assets` 获取即将输出的资源文件

```js
class BannerWebpackPlugin {
  constructor(options = {}) {
    // 接收选项
    this.options = options
  }
  apply(compiler) {
    // 注册 emit 钩子
    compiler.hooks.emit.tapAsync("BannerWebpackPlugin", (compilation, callback) => {
      // 获取即将输出的资源文件，compilation.assets 是一个对象
      // 该对象的 key 是文件输出路径和名称，如：js/main.js
      // 每个 key 对应的值也是一个对象，对象上有两个方法
      // source 和 size 方法，分别代表资源的内容的大小

      // 需要过滤掉其它文件，只保留 js 和 css 文件
      const exts = ["js", "css"];
      const assets = Object.keys(compilation.assets).filter((asset) => {
        const arr = asset.split(".");
        const ext = arr[arr.length - 1];
        return exts.includes(ext);
      });
      // 遍历这些文件，添加注释
      const prefix = `/*
* Author: ${this.options.author || 'lzx'}
*/
`;
      assets.forEach((asset) => {
        // 获取资源内容
        const source = compilation.assets[asset].source();
        // 更改内容
        const content = prefix + source;
        // 更改资源
        compilation.assets[asset] = {
          source() {
            return content
          },
          size() {
            return content.length
          }
        };
      });
      callback()
    });
  }
}


module.exports = BannerWebpackPlugin;
```

### CleanWebpackPlugin

在打包之前将上次打包内容清空

#### 开发流程

- 使用 `compiler.hooks.emit`钩子，在打包输出前触发
- 通过 `compiler` 对象获取打包输出目录
- 通过 `compiler.outputFileSystem` 操作文件

```js
class CleanWebpackPlugin {
  apply(compiler) {
    // 获取输出路径
    const outputPath = compiler.options.output.path
    // 文件操作模块
    const fs = compiler.outputFileSystem
    // 注册 emit 钩子，打包输出资源之前触发
    compiler.hooks.emit.tapAsync("CleanWebpackPlugin", (compilation, callback) => {
      // 删除文件
      this.removeFile(fs, outputPath)
      callback()
    });
  }

  removeFile(fs, path) {
    // 读取路径下的所有文件
    const fileList = fs.readdirSync(path)
    // 如果文件夹里面无文件，删除文件夹
    if(!fileList.length) {
      fs.rmdirSync(path);
      return 
    }
    // 遍历这些文件
    fileList.forEach(file => {
      // 新的路径
      const filePath = `${path}/${file}`
      // 判断是文件还是文件夹
      const fileStat = fs.statSync(filePath)
      if(fileStat.isDirectory()) {
        // 是文件夹，继续递归
        this.removeFile(fs, filePath)
      } else {
        fs.unlinkSync(filePath)
      }
    })
  }
}

module.exports = CleanWebpackPlugin
```

### AnalyzeWebpackPlugin

分析 `webpack` 打包资源大小，并输出文件

#### 开发流程

- 在 `compiler.hooks.emit` 钩子中处理
- 获取资源的大小，并输出一个分析文件

```js
class AnalyzeWebpackPlugin {
  apply(compiler) {
    // 注册钩子
    compiler.hooks.emit.tap("AnalyzeWebpackPlugin", (compilation) => {
      // 获取静态资源
      const assets = Object.entries(compilation.assets);
      // md 表格前缀
      let content = `| 资源名称 | 资源大小 |
| -- | -- |`;
      // 遍历静态资源
      assets.forEach(([filename, file]) => {
        content += `\n| ${filename} | ${Math.ceil(file.size() / 1024)}kb |`;
      });
      // 输出 md 文件
      compilation.assets["analyze.md"] = {
        source() {
          return content;
        },
        size() {
          return content.length;
        },
      };
    });
  }
}

module.exports = AnalyzeWebpackPlugin
```

### InlineChunkWebpackPlugin

将比较小的 `js` 文件放到 `html` 文件中，减少请求数量

#### 开发流程

- 借助 `html-webpack-plugin` 在输出 `html` 的时候，将 `js` 代码插入进去
- 删除多余的已经插入到 `html` 中的 `js` 文件

```js
// 引入 html-webpack-plugin 需要下载 safe-require
const HtmlWebpackPlugin = require("safe-require")("html-webpack-plugin");

class InlineChunkWebpackPlugin {
  constructor(regs) {
    this.regs = regs;
  }
  // 通过验证
  isValid(path) {
    return this.regs.some((reg) => reg.test(path));
  }

  apply(compiler) {
    // compilation 是同步钩子，表示在 compilation 创建之后执行
    compiler.hooks.compilation.tap(
      "InlineChunkWebpackPlugin",
      (compilation) => {
        // 注册 HtmlWebpackPlugin 里面的钩子
        const hooks = HtmlWebpackPlugin.getHooks(compilation);
        // alterAssetTagGroups - 将标签分组之后执行
        hooks.alterAssetTagGroups.tap("InlineChunkWebpackPlugin", (assets) => {
          // 处理 headTags 和 bodyTags 里面的内容
          assets.headTags = this.getInlineChunk(
            assets.headTags,
            compilation.assets
          );
          assets.bodyTags = this.getInlineChunk(
            assets.bodyTags,
            compilation.assets
          );
        });
        // 删除已经转换后的文件
        // afterEmit html 文件输出后
        hooks.afterEmit.tap("InlineChunkWebpackPlugin", () => {
          Object.keys(compilation.assets).forEach((filePath) => {
            if(this.isValid(filePath)) {
              // 删除匹配的文件
              delete compilation.assets[filePath]
            }
          })
        });
      }
    );
  }
  getInlineChunk(tags, assets) {
    /*
      普通的 script 标签，有链接
      {
        tagName: 'script',
        voidTag: false,
        meta: { plugin: 'html-webpack-plugin' },
        attributes: { defer: true, type: undefined, src: 'js/chunk-main.js.js' }
      }
      需要修改成
      {
        tagName: 'script',
        innerHTML: 文件内容, // 给标签内注入内容
        closeTag: true // 闭合标签
      }
    */
    return tags.map(tag => {
      // 不是 script 标签
      if (tag.tagName !== "script") return tag;
      // 不是外部 script
      const filePath = tag.attributes.src;
      if (!filePath) return tag;
      // 不匹配验证规则
      if (!this.isValid(filePath)) return tag;
      // 返回转换后的对象
      return {
        tagName: "script",
        innerHTML: assets[filePath].source(),
        closeTag: true,
      };
    })
  }
}


module.exports = InlineChunkWebpackPlugin;
```