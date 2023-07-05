---
title: '常量'
excerpt: '常量'
coverImage: '/assets/blog/go/basicDataType.webp'
date: '2023-07-05 20:39:35'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/go/basicDataType.webp'
type: 'Go'
---

## 常量

常量表达式的值在编译期计算，而不是在运行期。常量的值不可修改。每种常量的潜在类型都是基础类型：`bool`、`string` 或数字类型

```go
const pi = 3.1415926
```

可以批量声明多个常量，比较适合声明一组相关的常量

```go
const (
    e  = 2.7182818
    pi = 3.1415926
)
```

常量间的所有算术运算、逻辑运算和比较运算的结果都是常量，对常量的类型转换或以下函数调用都是返回常量结果：`len`、`cap`、`real`、`imag`、`complex` 和 `unsafe.Sizeof`。因为它们的值是在编译期就确定的。

常量可以是构成类型的一部分，例如指定数组类型的长度

```go
const IPv4Len = 4

func parseIPv4(s string) IP {
    var p [IPv4Len]byte
    // ...
}
```

如果是批量声明的常量，除了第一个外其他的常量右边的初始化表达式都可以省略，如果省略初始化表达式，则表示使用前面常量的初始化表达式写法，对应的常量类型也是一样

```go
const (
  a = 1
  b
  c = "2"
  d
)

fmt.Printf("%T\t%[1]v\n", a) // int     1
fmt.Printf("%T\t%[1]v\n", b) // int     1
fmt.Printf("%T\t%[1]v\n", c) // string  2
fmt.Printf("%T\t%[1]v\n", d) // string  2
```

### iota 常量生成器

`iota` 常量生成器用于生成一组以相似规则初始化的常量，但是不用每行都写一遍初始化表达式。在一个 `const` 声明语句中，在第一个声明的常量所在行，`iota` 将会被置为 0，然后在每一个有常量声明的行加 1。

定义 `Weekday` 命名类型，然后为一周的每天定义一个常量，从周日 0 开始，相当于其他语言的枚举

```go
type Weekday int

const (
  Sunday    Weekday = iota
  Monday    
  Tuesday   
  Wednesday
  Thursday  
  Friday    
  Saturday  
)

fmt.Println(Sunday, Monday, Saturday) // 0 1 6
```

也可以在复杂的常量表达式中使用 `iota`

```go
type Flags uint

const (
  FlagUp Flags = 1 << iota // 1 << 0 = 1 * 2 ** 0 = 1
  FlagBroadcast            // 1 << 1 = 1 * 2 ** 1 = 2
  FlagLoopback             // 1 << 2 = 1 * 2 ** 2 = 4
  FlagPointToPoint         // 1 << 3 = 1 * 2 ** 3 = 8
  FlagMulticast            // 1 << 4 = 1 * 2 ** 4 = 16
)
```

表示大小

```go
const (
    _ = 1 << (10 * iota)
    KiB // 1024
    MiB // 1048576
    GiB // 1073741824
    TiB // 1099511627776             (exceeds 1 << 32)
)
```

### 无类型常量

有六种无类型常量：无类型的布尔型、无类型的整型、无类型的浮点型、无类型的复数、无类型的字符和无类型的字符串

`math.Pi` 是无类型的浮点数常量，可以直接用于任意需要浮点数或复数的地方

```go
var x float64 = math.Pi
var y complex128 = math.Pi
```

对于常量面值，不同的写法可能对应不同的类型。例如 0 对应无类型的整数，0.0 对应无类型的浮点数，0i 对应无类型的复数，\u0000 对应无类型的字符，true 和 false 对应无类型的布尔型，"abc" 对应无类型的字符串

```go
var f float64 = 212

a := (f - 32) * 5 / 9
fmt.Printf("%T\t%[1]v\n", a) // float64 100

// 整型除法截断，5/9=0
b := 5 / 9 * (f - 32)
fmt.Printf("%T\t%[1]v\n", b) // float64 0

c := 5.0 / 9.0 * (f - 32)
fmt.Printf("%T\t%[1]v\n", c) // float64 100
```

只有常量是无类型的，如果转换合法的话，无类型的常量会被隐式转换为对应类型

```go
var f float64 = 3 + 0i // 无类型复数   -> float64  = 3
f = 2                  // 无类型整数   -> float64  = 2
f = 1e123              // 无类型浮点数 -> float64  = 1e+123
f = 'a'                // 无类型字符   -> float64  = 97
```