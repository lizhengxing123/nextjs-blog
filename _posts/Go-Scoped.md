---
title: '作用域'
excerpt: '作用域'
coverImage: '/assets/blog/go/go.webp'
date: '2023-06-26 15:39:16'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/go/go.webp'
type: 'Go'
---

## 作用域

一个声明语句将程序中的实体和一个名字关联，比如一个函数或一个变量。声明语句的作用域是指源代码中可以有效使用这个名字的范围。

作用域和生命周期需要区分开来。声明语句的作用域对应的是一个源代码的文本区域，它是一个编译时的属性。而变量的生命周期指的是程序运行时变量存在的有效时间段，在此时间区域内，它可以被程序的其他部分引用，是一个运行时的概念。

- 全局作用域：内置的类型、函数和常量，如 `int`、`len`、`true` 等，可以在整个程序中直接使用
- 包级作用域：函数外部声明的名字，可以在同一个包的任何源代码中都可以访问
- 源文件级作用域：对于当前文件导入的包，只能在当前文件中访问，当前包的其他源文件无法访问当前文件导入的包
- 局部作用域：只能在函数内部访问
- 函数级作用域：控制流标号，就是 `break`、`continue` 和 `goto` 语句后面跟的那种标号

一个程序可能包含多个重名的声明，只要它们在不同的词法域就没问题。编译器查找一个声明是从最内层的词法域向全局作用域查找。

```go
func f() {}

var g = "g"

func main() {
    f := "f"

    // 在局部作用域查找到声明的 f
    // 就不会去包级作用域查找了
    fmt.Println(f) // "f"

    // 局部作用域没找到
    // 查找到包级作用域的 g
    fmt.Println(g) // "g"

    // 查找不到 h
    // 编译错误
    fmt.Println(h)
}
```

在函数中词法域可以深度嵌套，因此内部的一个声明可能会屏蔽外部的声明。

另外还有一些隐式的词法域，比如 `for` 循环有两个词法域：一个是显式的循环体部分词法域，另外一个是隐式的循环初始化部分词法域

```go
func main() {
    // 显式的函数体词法域
    x := "hello"

    // 隐式的循环初始化词法域
    for _, x := range x {

        // 显式的循环体词法域
        x := x + 'A' - 'a'
        fmt.Printf("%c", x)
    }
}
```

和 `for` 循环类似，`if-else` 和 `switch` 语句也会在条件部分创建隐式词法域，还有显式的执行体词法域

```go
if x := f(); x == 0 {
  fmt.Println(x)
} else if y := g(x); x == y {
  fmt.Println(x, y)
} else {
  fmt.Println(x, y)
}

// 编译错误 x y 未定义
// fmt.Println(x, y)
```

在包级别，声明的顺序并不会影响作用域范围，因此一个先声明的可以引用它自身或者是引用一个后面声明的变量，这样可以让我们定义一些相互嵌套或递归的类型或函数。

> 如果一个变量或常量递归引用了自身，则会产生编译错误

要特别注意短变量声明语句的作用域范围

```go
var cwd string

func init() {
    // 编译错误: unused: cwd
    // 这样并不会更新包级的 cwd
    // 而是在局部作用域声明了个 cwd
    cwd, err := os.Getwd() 

    if err != nil {
        log.Fatalf("os.Getwd failed: %v", err)
    }
}
```

正确方式应该是：

```go
var cwd string

func init() {
  // 声明 err 局部变量
	var err error

  // 更新包级变量 cwd
  // 和局部变量 err
	cwd, err = os.Getwd()
  
	if err != nil {
		log.Fatalf("os.Getwd failed: %v", err)
	}
}
```