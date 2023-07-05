---
title: '包和文件'
excerpt: '包和文件'
coverImage: '/assets/blog/go/go.webp'
date: '2023-06-25 16:02:23'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/go/go.webp'
type: 'Go'
---

## 包和文件

`Go` 语言中的包和其他语言的库或模块的概念类似，目的都是为了支持模块化、封装、单独编译和代码重用

每个包都对应一个独立的名称空间，因此不同包里面相同名称的标识符是不同的

包还可以让我们通过控制哪些名字是外部可见的来隐藏内部实现信息。一个简单的规则是：名字是大写字母开头的，那么该名字是导出的。

一个包的源代码保存在一个或多个以 `.go` 为文件后缀名的源文件中。

### 导入包

一般来说，一个包的名字和包的导入路径的最后一个字段相同，也可以更改名称，避免名字重复

### 包的初始化

包的初始化首先是解决包级变量的依赖顺序，然后按照包级变量声明出现的顺序依次初始化

```go
var a = b + c // a 第三个初始化, 为 3
var b = f()   // b 第二个初始化, 为 2, 通过调用 f (依赖c)
var c = 1     // c 第一个初始化, 为 1

func f() int { return c + 1 }
```

如果包中含有多个 `.go` 源文件，它们将按照发给编译器的顺序进行初始化，`Go` 语言的构建工具首先会将 `.go` 文件根据文件名排序，然后依次调用编译器编译。

另外，我们可以用一个特殊的 `init` 初始化函数来简化初始化工作。每个文件都可以包含多个 `init` 初始化函数。

`init` 初始化函数除了不能被调用或引用外，其他行为和普通函数类似。在每个文件中的 `init` 初始化函数，在程序开始执行时按照它们声明的顺序被自动调用。

每个包在解决依赖的前提下，以导入声明的顺序初始化，每个包只会被初始化一次。因此，如果一个 `p` 包导入了 `q` 包，那么在 `p` 包初始化的时候可以认为 `q` 包必然已经初始化过了。初始化工作是自下而上进行的，`main` 包最后被初始化。以这种方式，可以确保在 `main` 函数执行之前，所有依赖的包都已经完成初始化工作了。