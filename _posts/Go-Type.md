---
title: '类型'
excerpt: '类型'
coverImage: '/assets/blog/go/go.webp'
date: '2023-06-21 14:27:12'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/go/go.webp'
type: 'Go'
---

## 类型

变量或表达式的类型定义了对应存储值的属性特征，例如数值在内存中的存储大小（或者是元素的 `bit` 个数），它们在内部是如何表达的，
是否支持一些操作符，以及它们关联的方法集等。

一个类型声明语句创建了一个新的类型名称，和现有类型具有相同的底层结构。新命名的类型提供了一个方法，用来分隔不同概念的类型，这样即使它们底层类型相同也是不兼容的。

```go
type 类型名称 底层类型
```

类型声明语句一般出现在包一级，因此如果创建的类型名字首字母大写的话，在外部包也是可以使用的。

```go
// 包 tempconv 执行摄氏和华氏温度计算。
package tempconv

// 摄氏度
type Celsius float64

// 华氏度
type Fahrenheit float64

const (
	// 绝对零度
	AbsoluteZeroC Celsius = -273.15
	// 结冰点温度
	FreezingC Celsius = 0
	// 沸水温度
	BoilingC Celsius = 100
)

// 华氏度转摄氏度
func FToC(f Fahrenheit) Celsius {
	return Celsius((f - 32) * 5 / 9)
}

// 摄氏度转华氏度
func CToF(c Celsius) Fahrenheit {
	return Fahrenheit(c*9/5 + 32)
}
```

`Celsius` 和 `Fahrenheit` 表示不同的温度单位，它们虽然有着相同的底层类型 `float64`，但是它们时不同的数据类型，因此它们不可以相互比较或者混在一个表达式运算。

需要 `Celsius(t)` 或 `Fahrenheit(t)` 形式的显式转型操作才能将 `float64` 转换为对应类型。

`Celsius(t)` 和 `Fahrenheit(t)` 是类型转换操作，并不是函数调用。类型转换不会改变值本身，只会是它们语义发生改变。

对于每一个类型 `T`，都会有对应的类型转换操作 `T(x)`，用于将 `x` 转换为 `T` 类型。如果 `T` 是指针类型，可能会需要小括号包装 `T`，比如 `(*int)(0)`。只有两个类型的底层类型相同时，才允许这种转型操作，这些转换只改变类型而不影响值本身。

底层数据类型决定了内部结构和表达式，也决定是否可以像底层类型一样对内置运算符的支持。

```go
package main

import (
	"fmt"
	tempconv "gomod/02"
)

func main() {
	fmt.Println(tempconv.BoilingC - tempconv.FreezingC) // "100" °C

	boilingF := tempconv.CToF(tempconv.BoilingC)

	fmt.Println(boilingF - tempconv.CToF(tempconv.FreezingC)) // "180" °F

	//fmt.Println(boilingF-tempconv.FreezingC) // compile error: type mismatch

	var c tempconv.Celsius

	var f tempconv.Fahrenheit

	fmt.Println(c == 0) // true

	fmt.Println(f >= 0) // true

	//fmt.Println(c == f) // compile error: type mismatch

	// 类型相同才可以进行比较
	fmt.Println(f == tempconv.Fahrenheit(c)) // true
}
```

命名类型可以为该类型的值定义新的行为。这些行为表示为一组关联到该类型的函数集合，我们称为类型的方法集。

例如：`Celsius` 类型的参数 `c` 出现在函数名的前面，表示声明的是 `Celsius` 类型一个叫做 `String` 的方法，该方法返回该类型对象 `c` 带着单位 `°C` 的字符串。

```go
func (c Celsius) String() string {
  return fmt.Sprint("%g°C", c)
}
```

许多类型都会定义一个 `String` 方法，当使用 `fmt` 的打印方法时，将会优先使用该类型对应的 `String` 方法返回的结果打印。

```go
var c1 tempconv.Celsius = 36.9

fmt.Println(c1.String()) // 36.9°C
fmt.Println(c1)          // 36.9°C
```