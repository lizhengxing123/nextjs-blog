---
title: '浮点型'
excerpt: '浮点型'
coverImage: '/assets/blog/go/basicDataType.webp'
date: '2023-06-29 15:00:42'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/go/basicDataType.webp'
type: 'Go'
---

## 浮点型

有两种精度的浮点数，它们的取值范围可以从很微小到很巨大

- `float32`
  
取值范围是 `math.MaxFloat32`(3.4028234663852886e+38) ~ 1.4e-45，可以提供大约 6 个十进制数的精度

- `float64`

取值范围是 `math.MaxFloat64`(1.7976931348623157e+308) ~ 1.4e-45，可以提供大约 15 个十进制数的精度

应该优先使用 `float64`，因为 `float32` 的累计计算误差很容易扩散，并且 `float32` 能精确表示的正整数并不是很大

> `float32` 的有效 `bit` 位只有 23 个，其他 `bit` 位用于指数和符号，当整数大于 `23bit` 能表达的范围时，
> `float32` 的表示将出现误差

```go
var f float32 = 16777216 // 1 << 23
fmt.Println(f == f+1) // true
```

浮点数的字面值可以直接写小数部分

```go
const e float64 = 2.71828
```

小数点前面和后面的数字都能被省略

```go
var f1 float64 = .89
var f2 float64 = 1.

fmt.Println(f1, f2) // 0.89 1
```

很小或很大的数字最好用科学计数法书写，通过 `e` 或 `E` 来指定指数部分

```go
const Avogadro = 6.02214129e23  // 阿伏伽德罗常数
const Planck   = 6.62606957E-34 // 普朗克常数
```

可以使用 `%g`、`%f`、`%e`(带指数) 指定浮点数打印的宽度和精度

```go
var e float64 = 2.71828

fmt.Printf("%8.3f\n", e) //    2.718
fmt.Printf("%8.3e\n", e) // 2.718e+00
fmt.Printf("%8.3g\n", e) //     2.72
```

`math` 包中提供了大量的常用数学函数，还提供了浮点数标准中定义的特殊值的创建和测试：正无穷、负无穷和`NaN`

```go
var f3 float64
fmt.Println(f3, 1/f3, -1/f3, f3/f3) // 0 +Inf -Inf NaN
```

`math.IsNaN` 可以判断一个数是否为 `NaN`。`math.NaN` 返回 `NaN` 对应的值，`NaN` 与任何数都是不相等的

> 在浮点数中，`NaN`、正负无穷都不是唯一的，每个都要非常多种的 `bit` 模式表示

```go
nan := math.NaN()
fmt.Println(nan == f3/f3, nan > nan, nan < nan) // false false false
```

如果一个函数返回的浮点结果可能失败，最好的做法是用单独的标志报告失败

```go
func compute() (value float64, ok bool) {
  // ...
  if failed {
    return 0, false
  }

  return result, true
}
```