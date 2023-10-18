---
title: 'Golang入门'
excerpt: 'Golang入门'
coverImage: '/assets/blog/go/basicDataType.webp'
date: '2023-08-30 17:09:39'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/go/basicDataType.webp'
type: 'Go'
---

## Golang入门

### 搭建开发环境

[视频教程](https://www.bilibili.com/video/BV1ME411Y71o?p=12&vd_source=97e4871747b6e43793eaa0ddb1bb5191)

### Hello World

```go
// 包名，在 go 中，每个文件都必须归属于一个包
package main

// 导入其他包，就可以使用包中的函数
import "fmt"

// main 主函数，是程序的入口
func main() {
	// 调用 Println 函数，输出 Hello World!
	fmt.Println("Hello World!")
}
```

### 执行流

#### 先编译再执行

- 1、使用 `go build main.go`，编译生成 `main` 可执行文件

> 可以使用 `-o` 指定编译生成的可执行文件名称
>
> `go build -o hello main.go`
>
> 需要注意在 `Windows` 系统中需要以 `.exe` 结尾

- 2、输入 `main`，运行可执行文件，产生结果

#### 编译加运行

- 使用 `go run main.go`，编译运行直接产生结果

#### 区别

- 如果使用【先编译再执行】的方式，我们可以把编译之后的可执行文件拷贝到没有 `go` 开发环境的机器上，其依然可以运行
- 如果使用【编译加运行】的方式，那么如果想在其他机器上也运行的话，就需要安装 `go` 开发环境，否则无法执行
- 编译之后的可执行文件体积会变大很多，这是因为编译器会将程序运行依赖的库文件都包含在可执行文件中，以便其能在没有 `go` 开发环境的机器上也能运行