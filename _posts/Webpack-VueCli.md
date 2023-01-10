---
title: 'Webpack Vue 基础配置'
excerpt: 'Webpack Vue 基础配置'
coverImage: '/assets/blog/webpack/webpack.png'
date: '2023-01-08 12:09:45'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/webpack/webpack.png'
type: 'Webpack'
---

## Webpack Vue 基础配置

```js
// webpack.config.js
const path = require("path");
// cross-env 定义的环境变量是给打包工具使用的
// DefinePlugin 定义的环境变量是给源代码使用的
const { DefinePlugin } = require("webpack")
// eslint插件
const EslintWebpackPlugin = require("eslint-webpack-plugin");
// html插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 提取 css 成单独文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 压缩 css
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
// 压缩 js
const TerserWebpackPlugin = require("terser-webpack-plugin");
// 压缩图片
const ImageMinimizerWebpackPlugin = require("image-minimizer-webpack-plugin");
// 复制
const CopyPlugin = require("copy-webpack-plugin");
// vue-loader
const { VueLoaderPlugin } = require("vue-loader");
// element-plus 自动导入
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");

// 是否为生产环境
const isProduction = process.env.NODE_ENV === "production"

// css样式文件基础处理的loader配置
const basicCssLoader = [
  isProduction ? MiniCssExtractPlugin.loader : "vue-style-loader",
  "css-loader",
  {
    // 处理兼容性问题
    // 需要配合 browserslist 使用
    loader: "postcss-loader",
    options: {
      postcssOptions: {
        plugins: ["postcss-preset-env"],
      },
    },
  },
];

module.exports = {
  entry: "./src/main.js",
  output: {
    // 路径
    path: isProduction ? path.resolve(__dirname, "../dist") : undefined,
    // 名称
    filename: `static/js/[name]${isProduction ? ".[contenthash:10]" : ""}.js`,
    // 动态导入、node_modules文件打包名称
    chunkFilename: `static/js/[name]${
      isProduction ? ".[contenthash:10]" : ""
    }.chunk.js`,
    // 静态资源名称
    assetModuleFilename: "static/media/[hash:10][ext][query]",
    // 清空上次打包内容
    clean: true,
  },
  module: {
    rules: [
      // 处理css
      {
        test: /\.css$/,
        use: basicCssLoader,
      },
      {
        test: /\.less$/,
        use: [...basicCssLoader, "less-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          ...basicCssLoader,
          {
            loader: "sass-loader",
            options: {
              additionalData: `@use "@/styles/element/index.scss" as *;`,
            },
          },
        ],
      },
      {
        test: /\.styl$/,
        use: [...basicCssLoader, "stylus-loader"],
      },
      // 处理图片
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        type: "asset", // 可以转base64
        parser: {
          // 小于10kb的图片转换为base64格式
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      // 处理其他资源
      {
        test: /\.(woff2?|tif|)$/,
        type: "asset/resource", // 原封不动输出
      },
      // 处理js
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "../src"),
        loader: "babel-loader",
        options: {
          // 开启缓存
          cacheDirectory: true,
          // 关闭缓存压缩
          cacheCompression: false,
        },
      },
      // 处理vue
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          // 开启缓存
          cacheDirectory: path.resolve(
            __dirname,
            "../node_modules/.cache/vue-loader"
          )
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    new EslintWebpackPlugin({
      // 需要处理的文件目录
      context: path.resolve(__dirname, "../src"),
      // 需要排除的文件目录
      exclude: "node_modules",
      // 缓存
      cache: true,
      // 缓存目录
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
    }),
    // 提取 css 成单独文件
    isProduction &&
      new MiniCssExtractPlugin({
        // 文件名称
        filename: "static/css/[name].[contenthash:10].css",
        // chunk文件名称
        chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
      }),
    // 将public下面的文件复制到dist里面
    isProduction &&
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "../public"),
            to: path.resolve(__dirname, "../dist"),
            globOptions: {
              ignore: [
                // 忽略 index.html 文件
                "**/index.html",
              ],
            },
          },
        ],
      }),
    // vue-loader
    new VueLoaderPlugin(),
    // 定义 vue 环境变量
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    // 自动导入
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          // 自定义主题
          importStyle: "sass",
        }),
      ],
    }),
  ].filter(Boolean),
  optimization: {
    // 代码分割 - node_modules和动态导入的代码
    splitChunks: {
      chunks: "all",
      // 将 node_modules 里的大模块进行单独打包
      cacheGroups: {
        // vue vue-router一起打包
        react: {
          test: /[\\/]node_modules[\\/]vue(.*)?[\\/]/,
          // 包名
          name: "chunk-vue",
          // 打包权重 - 需要高于 node_modules
          priority: 40,
        },
        // element 单独打包
        elementPlus: {
          test: /[\\/]node_modules[\\/]element-plus[\\/]/,
          // 包名
          name: "chunk-element",
          // 打包权重 - 需要高于 node_modules
          priority: 30,
        },
        // 剩下的 node_modules 模块打包
        lib: {
          test: /[\\/]node_modules[\\/]/,
          // 包名
          name: "chunk-lib",
          // 打包权重 - 需要高于 node_modules
          priority: 20,
        },
      },
    },
    // 代码分割可能会导致缓存失效，需要配置 runtimeChunk
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
    // 是否需要压缩
    minimize: isProduction,
    // 压缩
    minimizer: [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin(), // 压缩图片
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
  },
  // 命令加上 serve 才会使用这个配置
  devServer: {
    host: "localhost",
    port: 3300,
    open: true,
    // 开启 hmr
    hot: true,
    // 解决 browserRouter 刷新 404 问题
    historyApiFallback: true,
  },
  // 解析模块
  resolve: {
    // 自动补全扩展名
    extensions: [".jsx", ".js", ".json"],
    // 路径别名
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  devtool: isProduction ? "source-map" : "cheap-module-source-map",
  mode: process.env.NODE_ENV,
  performance: false, // 关闭性能分析，提升打包速度
};
```

`.eslintrc.js`

```js
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    // 继承 vue 官方规则
    "plugin:vue/vue3-essential",
    "eslint:recommended"
  ],
  parserOptions: {
    parser: "@babel/eslint-parser"
  },
};
```

`.babelrc.js`

```js
// .babelrc.js
module.exports = {
  presets: [
    "@vue/cli-plugin-babel/preset"
  ],
};
```