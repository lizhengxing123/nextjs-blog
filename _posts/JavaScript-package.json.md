---
title: 'package.json 字段详解'
excerpt: 'package.json 字段详解'
coverImage: '/assets/blog/javascript/package.png'
date: '2022-12-05 13:28:42'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/javascript/package.png'
type: 'Javascript'
---

## package.json

[参考文章](https://juejin.cn/post/7023539063424548872)

`package.json` 文件是用来描述项目及项目所依赖的模块信息

### 必须属性

- `name`：项目名称
> 如果要发布到 `npm` 平台，需要注意名称不能以 `. _` 开头，不能包含大写字母，不能与 `npm` 平台上其它包名一样
- `versions`：版本号。比如 `18.2.0`
> 1. 主版本号：涉及重大功能更新才会修改
> 2. 次版本号：新增了新的功能才会修改
> 3. 修订号：修改了一些 `bug` 就会修改
> 4. 先行版本：在版本号后面加 `-` 连接。比如 `16.9.0-rc.0`。有内部版本`alpha`，公测版本`beta`和候选版本`rc`

### 描述信息

- `description`：描述
- `keywords`：关键字
- `author`：作者，字符串或者对象形式，对象可以包含 `name`、`email`和`url`字段
- `contributors`：贡献者，数组，里面可以是字符串也可以是对象
- `homepage`：项目的主页地址
- `repository`：存放仓库地址
- `bugs`：项目提交问题的地址

### 依赖配置

- `dependencies`：项目生产环境所依赖的包
- `devDependencies`：项目开发环境所依赖的包
> 包名后面的版本号有以下几种写法
> 1. 固定版本号，比如 `'react': '18.2.0'`
> 2. 固定主版本号和次版本号，比如 `'react': '~18.2.0'`
> 3. 固定主版本号，比如 `'react': '^18.2.0'`
> 4. 安装最新版本，`'react': 'latest'`
- `peerDependencies`：同伴依赖，不会被自动安装，通常用于表示与另一个包的依赖与兼容性关系
- `optionalDependencies`：依赖是可选的，不会阻塞主功能的使用
- `bundledDependencies`：打包依赖，是一个数组。在发布包的时候，里面的依赖会被一起打包

### 脚本配置

- `scripts`：存放脚本的地方。命令可以结合`pre`和`post`完成前直和后续操作
- `config`：配置命令运行时的参数

### 文件&目录

- `main`：入口文件
- `browser`：在浏览器环境下的入口文件
- `module`：`ESM` 规范的入口文件
- `bin`：指定各个内部命令对应的可执行文件的位置
- `files`：数组，用来描述当把`npm`包作为依赖包安装时需要说明的文件列表，发布时，指定的文件会被推送到`npm`服务器
- `directories`：规范项目的目录

### 发布配置

- `private`：防止意外地将私有库发布到`npm`服务器
- `os`：设置可以在什么操作系统使用
- `cpu`：限制用户的安装环境
- `license`：开源协议

### 第三方配置

- `typings`：指定 `typescript` 的入口文件
- `eslintConfig`：`eslint`配置
- `babel`：`babel`配置
- `unpkg`：开启`cdn`服务
- `gitHooks`：定义一个钩子
- `browserslist`：支持的浏览器版本