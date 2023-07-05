---
title: '基础数据类型-布尔型'
excerpt: '基础数据类型-布尔型'
coverImage: '/assets/blog/go/basicDataType.webp'
date: '2023-07-03 17:37:21'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/go/basicDataType.webp'
type: 'Go'
---

## 基础数据类型-布尔型

布尔类型的值只有两个： `true` 和 `false`

`if` 和 `for` 语句的条件部分都是布尔类型的值，并且比较操作也会产生布尔类型的值

布尔值可以和 `||` 和 `&&` 操作符结合，并且有短路行为

```go
s != "" && s[0] = "a"
```

`&&` 的优先级比 `||` 高

> `&&` 相当于逻辑乘法
> `||` 相当于逻辑加法

```go
if 'a' <= c && c <= 'z' ||
    'A' <= c && c <= 'Z' ||
    '0' <= c && c <= '9' {
    // ...ASCII letter or digit...
}
```

布尔值并不会隐式转换为数字值 0 和 1，反之亦然，必须使用显式的 `if` 语句辅助转换

```go
func btoi(b bool) int {
    if b {
        return 1
    }
    return 0
}
```

数字转布尔值

```go
func itob(i int) bool { return i != 0 }
```