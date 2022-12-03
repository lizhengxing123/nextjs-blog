---
title: 'pnpm 和 Monorepo'
excerpt: '学习 pnpm 和 Monorepo'
coverImage: '/assets/blog/node/pnpm&monorepo.webp'
date: '2022-12-03 18:55:48'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/node/pnpm&monorepo.webp'
type: 'Node'
---

## monorepo

[参考文章](https://juejin.cn/post/6944877410827370504)
[Turborepo:超神的新兴 Monorepo 方案](https://juejin.cn/post/7129267782515949575)

### 什么是 Monorepo

`Monorepo` 是将多个项目放在一个仓库里面；传统的 `MultiRepo` 是每个项目对应一个单独的仓库。

![Monorepo&MultiRepo](/assets/blog/node/multi-mono-repo.png)

### Monorepo 结构


在 `packages` 存放多个子项目，并且每个子项目都有自己的 `package.json`

```zsh
├── packages
|   ├── pkg1
|   |   ├── package.json
|   ├── pkg2
|   |   ├── package.json
├── package.json
```

### `Monorepo`的优点

- 工作流的一致性
- 项目基建成本降低
- 团队协作更加方便

### `Monorepo`的缺点

- 体积过大
- 权限开放


`Monorepo` shi

## Linux 软链接和硬链接

### 硬链接 - Hard Link

硬链接指通过索引节点来进行连接。在`Linux`的文件系统中，保存在磁盘分区中的文件不管是什么类型都给它分配一个编号，称为索引节点号`(Inode Index)`。在`Linux`中，多个文件名指向同一索引节点是存在的。一般这种连接就是硬链接。硬链接的作用是允许一个文件拥有多个有效路径名，这样用户就可以建立硬连接到重要文件，以防止“误删”的功能。其原因如上所述，因为对应该目录的索引节点有一个以上的链接。只删除一个链接并不影响索引节点本身和其它的链接，只有当最后一个链接被删除后，文件的数据块及目录的链接才会被释放。也就是说，文件真正删除的条件是与之相关的所有硬链接文件均被删除。

### 软链接

也称为符号链接`Symbolic Link`，软链接文件有类似于`Windows`的快捷方式。它实际上是一个特殊的文件。在符号链接中，文件实际上是一个文本文件，其中包含的有另一文件的位置信息。

### 示例

1. 创建文件

```zsh
// 创建 f1 文件
➜  frontend-1 git:(master) ✗ touch f1
// 创建 f1 的硬链接文件 f2
➜  frontend-1 git:(master) ✗ ln f1 f2
// 创建 f1 的软链接文件 f3
➜  frontend-1 git:(master) ✗ ln -s f1 f3
// 查看文件信息
➜  frontend-1 git:(master) ✗ ls -li

45323731 -rw-r--r--  2 lizhengxing  staff     0 12  3 19:34 f1
45323731 -rw-r--r--  2 lizhengxing  staff     0 12  3 19:34 f2
45323751 lrwxr-xr-x  1 lizhengxing  staff     2 12  3 19:35 f3 -> f1
```

> 由上面可以看出，`f1` 和 `f2` 文件的 `inode` 索引节点相同，与 `f3` 的索引节点不同。

2. 写入文件

```zsh
➜  frontend-1 git:(master) ✗ echo "I am f1 file" >>f1
➜  frontend-1 git:(master) ✗ cat f2
I am f1 file
➜  frontend-1 git:(master) ✗ cat f1
I am f1 file
➜  frontend-1 git:(master) ✗ cat f3
I am f1 file
➜  frontend-1 git:(master) ✗ rm -f f1
➜  frontend-1 git:(master) ✗ cat f2
I am f1 file
➜  frontend-1 git:(master) ✗ cat f3
cat: f3: No such file or directory
```

> 由上面可以看出，删除原始文件后，硬链接 `f2` 文件不受影响，符号链接 `f3` 文件无效

3. 总结

- 删除符号链接 `f3` 文件，对 `f1` `f2` 文件没有影响
- 删除硬链接 `f2` 文件，对 `f1` `f3` 文件也没有影响
- 删除原始文件 `f1`，硬链接 `f2` 文件没有影响，而符号链接 `f3` 文件无效
- 同时删除 `f1` `f2` 文件，整个文件会被真正删除


## pnpm

[参考文章](https://juejin.cn/post/6932046455733485575)
[pnpm官网](https://pnpm.io/zh/motivation)

![pnpm](/assets/blog/node/pnpm.jpeg)

### 什么是 pnpm

`pnpm` 实质上就是一个包管理器，和 `npm/yarn` 没什么区别，使用以下命令安装

```js
npm i -g pnpm
```

### 特性

- 包安装速度快
- 高效利用磁盘空间
  - 不会重复安装同一个包。使用 `pnpm` 只会安装一次，磁盘中也只有一个地方写入，后面再次使用都会直接使用`硬链接`
  - 即使一个包的不同版本，`pnpm` 也会极大程度的复用之前的文件。例如：如果一个包有 100 个文件，新版本增加了一个文件，那么磁盘并不会重新写入 101 个文件，而是只会写入一个新的文件，保留原来 100 个文件的硬链接
- 支持 `Monorepo`
- 安全性高：杜绝非法访问的情况

### 与 Monorepo 一起使用

[参考文章](https://juejin.cn/post/7115058575801581605)

1. 使用如下命令创建 `package.json`：

```js
pnpm init
```

`package.json`内容如下：

```json
{
  "name": "monorepo-demo",
  "version": "1.0.0",
  "description": "monorepo study",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "type": "module",
  "license": "ISC"
}
```

2. 创建 `pnpm-workspace.yaml` 文件，这个文件定义了工作空间的根目录，内容如下：

```yaml
packages:
  - 'packages/ **'
```

3. 在 `packages` 中创建多个项目，并编写每个项目的 `package.json` 文件，指定名称方便以后使用

文件目录如下：

```zsh
monorepo-demo
├── package.json
├── packages
│   ├── components
│   │   ├── index.js
│   │   └── package.json
│   ├── core
│   │   ├── index.js
│   │   └── package.json
│   ├── utils
│   │   ├── index.js
│   │   └── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

每个 `package.json` 文件中的名称分别为：`@packages/components` `@packages/core` `@packages/utils`

4. 安装依赖

如果在根目录下安装依赖的话，这个依赖可以在每个 `packages` 中使用

- 使用 `pnpm install` 安装全部依赖
- 使用 `pnpm add <pkg>` 安装依赖包
  - `-P` 指定 `dependencies`
  - `-D` 指定 `devDependencies`

给 `packages` 中的子项目安装依赖，使用 `--filter`(`-F`) 制定选择器

```js
pnpm --filter <package_selector> <command> 
```

比如给 `packages/components` 子项目安装 `lodash`

```js
pnpm --filter @packages/components add lodash
```
> 可能会出现 `No projects matched the filters ...` 错误。解决方式是将 `pnpm-workspace.yaml` 内容重新手打一遍，复制粘贴的可能有问题。

5. 子项目之间相互引用

在 `packages/components/index.js` 中写入以下内容：

```js
import lodash from 'lodash'

export const randomNum = () => {
    return lodash.random(1.2, 5.2)
}
```

然后执行如下命令：

```js
pnpm --filter @packages/utils add @packages/components@*
// pnpm --filter @packages/utils add @packages/components@\*
```
> 可能会出现 `zsh: no matches found: @packages/components@*` 错误。
> 解决方式是在 `@*` 中间加 `\`，变为 `pnpm --filter @packages/utils add @packages/components@\*`

这个命令表示在 `@packages/utils` 中安装 `@packages/components`，`@*` 表示默认同步最新版本

安装完成之后就会在 `packages/utils/package.json` 中出现如下依赖：

```json
// packages/utils/package.json
{
    "name": "@packages/utils",
    "version": "1.0.0",
    "description": "monorepo study",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "type": "module",
    "license": "ISC",
    "dependencies": {
        "@packages/components": "workspace:*"
    }
}
```

在 `packages/utils/index.js` 中使用

```js
import {randomNum} from '@packages/components'
console.log(randomNum())
```

运行该文件 `node packages/utils/index.js`

```js
➜  frontend-1 git:(master) ✗ node packages/utils/index.js
2.48781786502473
```

### 其他常用命令

- `pnpm update`
- `pnpm remove`
- `pnpm run`