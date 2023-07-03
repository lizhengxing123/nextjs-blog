---
title: 'fmt'
excerpt: 'fmt'
coverImage: '/assets/blog/go/go.webp'
date: '2023-06-15 16:26:13'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/go/go.webp'
type: 'Go'
---

## fmt

### 格式化参数

- `%d`：十进制整数
- `%x, %o, %b`：十六进制整数，八进制整数，二进制整数
- `%f, %g, %e`：浮点数，3.141593，3.141592653589793，3.141593e+00
- `%t`：布尔值，true，false
- `%c`：字符(`rune`)(unicode码点)
- `%s`：字符串
- `%q`：带双引号或单引号的字符串
- `%v`：变量的自然形式（natural format）
- `%T`：变量的类型
- `%%`：字面上的百分号标志


### Println

根据参数写入标准输出，并在最后添加换行符。

```go
fmt.Println("Hello World!")
```

### Printf

根据格式化参数生成格式化的字符串并写入标准输出，不会换行。

```go
fmt.Printf("%v\n", 12) // 12
```

### Sprintf

根据格式化参数生成格式化的字符串并返回该字符串

```go
s := fmt.Sprintf("%v岁", 12)
fmt.Println(s) // 12岁
```

