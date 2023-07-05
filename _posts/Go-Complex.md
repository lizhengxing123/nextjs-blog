---
title: '基础数据类型-复数'
excerpt: '基础数据类型-复数'
coverImage: '/assets/blog/go/basicDataType.webp'
date: '2023-07-03 17:11:31'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/go/basicDataType.webp'
type: 'Go'
---

## 基础数据类型-复数

有两种精度的复数类型：`complex64` 和 `complex128`，分别对应 `float32` 和 `float64` 两种浮点数精度。

内置的 `complex` 函数用于构建复数，内建的 `real` 和 `imag` 函数分别返回复数的实部和虚部

```go
var x complex128 = complex(1, 2) 
var y complex128 = complex(3, 4) 

fmt.Println(x, y)        // (1+2i) (3+4i)
fmt.Println(x * y)       // (-5+10i)
fmt.Println(real(x * y)) // -5
fmt.Println(imag(x * y)) // 10
```

如果一个浮点数面值或十进制整数面值后面跟个 `i`，它将构成一个复数的虚部，实部是 0

```go
fmt.Println(2.34i) // (0+2.34i)
fmt.Println(2i)    // (0+2i)
```

在常量算数规则下，一个复数常量可以加到另一个普通数值常量（整数或浮点数、实部或虚部）

```go
fmt.Println(2i + 3i) // (0+5i)
fmt.Println(2 + 3i)  // (2+3i)
fmt.Println(2i + 3)  // (3+2i)
fmt.Println(2 + 3)   // 5
```

复数也可以使用 `==` 和 `!=` 进行相等比较。只有两个复数的实部和虚部都相等的时候它们才是相等的

```go
var a complex128 = 2 + 3i
var b complex128 = 3 + 2i

fmt.Println(a == b, a != b) // false true
```

`math/cmplx` 包提供了复数的许多处理函数

```go
// 求复数的平方根
fmt.Println(cmplx.Sqrt(-1)) // (0+1i)
fmt.Println(cmplx.Sqrt(1))  // (1+0i)
```