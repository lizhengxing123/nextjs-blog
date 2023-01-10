---
title: 'Webpack 高级'
excerpt: '学习 Webpack 高级知识'
coverImage: '/assets/blog/webpack/webpack.png'
date: '2023-01-07 11:32:10'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/webpack/webpack.png'
type: 'Webpack'
---

## Webpack 高级

### 提升开发体验

使用 `Source Map` 让开发和上线时代码报错能有更准确的提示

- 开发环境使用`cheap-module-source-map`，没有列信息，只有行信息
- 生产环境使用`source-map`，生成一个单独的文件

### 提升打包构建速度

- 使用 `HMR` 开启热模块替换
- 使用 `oneOf`，在 `loader` 匹配到的时候就不会继续遍历了
- 使用 `exclude` 排除某些文件，使用 `include` 只检测某些文件
- 使用 `cache` 对 `eslint` 和 `babel` 的处理结果进行缓存
- 使用 `thread` 多进程 `eslint` 和 `babel` 任务，速度更快。但是开启进程也是有开销的，要在代码比较多的时候才有效果

### 减少代码体积

- 使用 `tree shaking` 剔除无用代码
- 使用 `@babel/plugin-transform-plugin` 插件对 `babel` 进行处理，让辅助代码从其中引用，而不是每个文件中都生成辅助代码
- 使用 `Image Minimizer` 对图片进行压缩，只有本地图片才需要压缩，在线链接就不需要了

### 优化代码运行性能

- 使用 `code split` 对代码进行分割，从而使单个文件体积更小，加载速度更快。通过`import`动态导入语法进行按需加载
- 使用 `preload/prefetch` 对资源进行提前加载，兼容性比较差
- 使用 `contenthash` 处理文件命名，做好缓存；使用 `runtimeChunk` 只变化更改了的资源，未更改的资源使用缓存
- 使用 `corejs` 进行兼容性处理
- 使用 `PWA` 技术，让代码离线也能访问，兼容性不好

```js
// webpack.prod.js
const path = require("path");
const os = require("os");
// eslint 插件
const ESLintPlugin = require("eslint-webpack-plugin")
// html 模板插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 将 css 提取成单独文件插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 优化和压缩 css 插件
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// js 压缩
const TerserPlugin = require("terser-webpack-plugin");
// 预加载
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
// PWA 插件
const WorkboxPlugin = require("workbox-webpack-plugin");

// cpu 的核数
const threads = os.cpus().length;

// 封装样式 loaders 
const getStyleLoaders = () => [
  // 执行顺序，从后往前
  {
    // 将 css 提取成单独文件
    loader: MiniCssExtractPlugin.loader,
  },
  {
    // 将 css 资源编译成 cjs 的模块到 js 中
    loader: "css-loader",
  },
  {
    // 处理 css 兼容性
    loader: "postcss-loader",
  },
];

module.exports = {
  // 入口
  entry: {
    // 相对路径
    main: "./src/main.js",
  },
  // 出口
  output: {
    // 输出的文件夹 - 绝对路径
    path: path.resolve(__dirname, "../../dist"),
    // 入口文件打包输出的文件名
    filename: "js/[name][contenthash:10].js",
    // 自动清空上次打包内容
    clean: true,
    // 动态导入的模块命名
    // [name] 就是 webpackChunkName
    chunkFilename: "js/[name][contenthash:10].chunk.js",
    // 图片、字体等通过 type: asset 处理的静态资源命名
    assetModuleFilename: "media/[hash:10][ext][query]",
  },
  // loaders
  module: {
    rules: [
      {
        // 每个文件只能被其中一个 loader 配置匹配
        oneOf: [
          // css 文件规则
          {
            // 检测css文件
            test: /\.css$/,
            // 使用 loader 属性只能使用一个 loader
            // loader: "less-loader",
            // 使用哪些loader
            use: [...getStyleLoaders()],
          },
          // less 文件规则
          {
            // 检测less文件
            test: /\.less$/,
            // 使用哪些loader
            use: [
              ...getStyleLoaders(),
              {
                // 将 less 文件编译成 css 文件
                loader: "less-loader",
              },
            ],
          },
          // scss|sass 文件规则
          {
            // 检测scss文件
            test: /\.s[ac]ss$/,
            // 使用哪些loader
            use: [
              ...getStyleLoaders(),
              {
                // 将 scss 文件编译成 css 文件
                loader: "sass-loader",
              },
            ],
          },
          // stylus 文件规则
          {
            // 检测styl文件
            test: /\.styl$/,
            // 使用哪些loader
            use: [
              ...getStyleLoaders(),
              {
                // 将 stylus 文件编译成 css 文件
                loader: "stylus-loader",
              },
            ],
          },
          // 图片文件规则
          {
            // 处理图片文件
            test: /.(png|jpe?g|webp|svg|gif)$/,
            type: "asset", // 静态资源
            parser: {
              dataUrlCondition: {
                // 小于 10kb 转换为 base64
                // 优点：减少请求数量
                // 缺点：会增加体积，会变大 1-2kb
                maxSize: 10 * 1024, // 10kb
              },
            },
            // generator: {
            //   // 打包文件输出的文件名
            //   // hash 值取前十位
            //   filename: "img/[hash:10][ext][query]",
            // },
          },
          // 字体、音频、视频文件规则
          {
            // 处理字体、音频、视频文件
            test: /.(ttf|woff2?|mp3|mp4|avi)$/,
            type: "asset/resource",
            // generator: {
            //   // 打包文件输出的文件名
            //   filename: "media/[hash:10][ext][query]",
            // },
          },
          // babel配置
          {
            test: /.js$/,
            // 排除 node_modules 里面的文件，不做处理
            // exclude: /node_modules/,
            // 需要处理的文件
            // exclude 和 include 只需要写一个，两个都写会报错
            include: path.resolve(__dirname, "../../src"),
            use: [
              {
                // 开启多进程
                loader: "thread-loader",
                options: {
                  works: threads, // 进程数量
                },
              },
              {
                // 处理 js 文件
                loader: "babel-loader",
                options: {
                  // 开启缓存
                  cacheDirectory: path.resolve(
                    __dirname,
                    "../node_modules/.cache/vue-loader"
                  ),
                  // 关闭缓存压缩
                  cacheCompression: false,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  // plugins
  plugins: [
    // eslint 插件
    new ESLintPlugin({
      // 需要检测的文件
      context: path.resolve(__dirname, "../../src"),
      // 需要排除的文件
      exclude: "node_modules", // 默认值
      cache: true, // 开启缓存
      cacheLocation: path.resolve(
        __dirname,
        "../../node_modules/.cache/eslint"
      ), // 缓存位置
      threads, // 开启多进程和进程数量
    }),
    // html 模板插件
    new HtmlWebpackPlugin({
      // 模板文件
      template: path.resolve(__dirname, "../../public/index.html"),
    }),
    // 将 css 提取成单独文件
    new MiniCssExtractPlugin({
      // 指定文件路径和文件名
      filename: "css/[name].css",
      // 动态引入的 css 文件命名
      chunkFilename: "css/[name].chunk.css",
    }),
    // 预加载
    new PreloadWebpackPlugin({
      // 兼容性好，优先级高
      rel: "preload",
      as: "script",
      // 兼容性不好，优先级低，比较符合开发习惯
      // rel: "prefetch",
    }),
    // PWA
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助快速启用 ServiceWorkers
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  optimization: {
    // 压缩的操作
    minimizer: [
      // 优化和压缩 css
      new CssMinimizerPlugin(),
      // 压缩 js
      new TerserPlugin({
        parallel: threads, // 开启多进程和进程数量
      }),
      // 压缩图片 https://webpack.docschina.org/plugins/image-minimizer-webpack-plugin/
      // new ImageMinimizerWebpackPlugin({
      //   minimizer: {
      //     // Lossless optimization with custom option
      //     // Feel free to experiment with options for better result for you
      //     implementation: ImageMinimizerWebpackPlugin.imageminGenerate,
      //     options: {
      //       plugins: [
      //         ["gifsicle", { interlaced: true }],
      //         ["jpegtran", { progressive: true }],
      //         ["optipng", { optimizationLevel: 5 }],
      //         [
      //           "svgo",
      //           {
      //             plugins: [
      //               "preset-default",
      //               "prefixIds",
      //               {
      //                 name: "sortAttrs",
      //                 params: {
      //                   xmlnsOrder: "alphabetical",
      //                 },
      //               },
      //             ],
      //           },
      //         ],
      //       ],
      //     },
      //   },
      // }),
    ],
    // 代码分割
    splitChunks: {
      chunks: "all",
      // 设置缓存组
      // 将 node_modules 里的大模块进行单独打包
      // cacheGroups: {
      //   // react react-dom react-router-dom 一起打包
      //   react: {
      //     test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,
      //     // 包名
      //     name: "chunk-react",
      //     // 打包权重 - 需要高于 node_modules
      //     priority: 40,
      //   },
      //   // antd 单独打包
      //   antd: {
      //     test: /[\\/]node_modules[\\/]antd[\\/]/,
      //     // 包名
      //     name: "chunk-antd",
      //     // 打包权重 - 需要高于 node_modules
      //     priority: 30,
      //   },
      //   // 剩下的 node_modules 模块打包
      //   lib: {
      //     test: /[\\/]node_modules[\\/]/,
      //     // 包名
      //     name: "chunk-lib",
      //     // 打包权重 - 需要高于 node_modules
      //     priority: 20,
      //   },
      // },
    },
    // 记录文件地址
    runtimeChunk: {
      name: (entryPoint) => `runtime-${entryPoint.name}`,
    },
  },
  // 模式
  mode: "production",
  // source map
  // 整个 source map 作为一个单独的文件生成。
  // 它为 bundle 添加了一个引用注释，以便开发工具知道在哪里可以找到它。
  devtool: "source-map", // 有行和列的映射
};

```