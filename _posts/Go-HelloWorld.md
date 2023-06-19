---
title: 'Hello World!'
excerpt: 'Hello World!'
coverImage: '/assets/blog/go/go.webp'
date: '2023-06-15 15:59:36'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/go/go.webp'
type: 'Go'
---

## Hello World!

```go
package main

import "fmt"

func main() {
  fmt.Println("Hello World!")
}
```

`Go` 语言的代码通过包 `(package)` 来组织，相当于其他语言的库或模块。

一个包由位于单个目录下的一个或多个 `.go` 源文件组成，目录定义包的作用。

每个 `.go` 源文件都以一条 `package` 声明语句开始，表明该文件属于哪个包，紧跟着是一系列导入的包，之后是程序语句。

`main` 包比较特殊，它定义了一个独立可执行的程序，而不是一个库。在 `main` 包里面的 `main` 函数也很特殊，它是整个程序执行时的入口。`main` 函数所做的事情就是程序做的，它一般调用其它包里的函数完成很多工作。