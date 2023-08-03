---
title: '数组'
excerpt: '数组'
coverImage: '/assets/blog/go/compositeDataType.png'
date: '2023-07-10 17:16:46'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/go/compositeDataType.png'
type: 'Go'
---

## 数组

数组是一个由固定长度的特定类型元素组成的序列，一个数组可以由零个或多个元素组成。由于数组的长度是固定的，因此很少使用。

和数组对应的类型是 `Slice`（切片），它是可以增加和收缩动态序列，功能也更灵活。

数组的每个元素都可以通过索引下标来访问，范围是 0 ～ 数组长度减一。`len` 函数可以获取数组的长度

```go
var a [3]int
fmt.Println(a[0]) // 0

l := len(a)
fmt.Println(l) // 3

fmt.Println(a[l-1]) // 0

for i, v := range a {
  fmt.Printf("%d - %d\n", i, v)
}
// 0 - 0
// 1 - 0
// 2 - 0
```

默认情况下，数组的每个元素都会被初始化为元素类型对应的零值。