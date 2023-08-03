---
title: '复杂度'
excerpt: '复杂度'
coverImage: '/assets/blog/algorithm/big-o-graph.png'
date: '2023-07-12 21:29:17'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/algorithm/big-o-graph.png'
type: 'UsefulInformation'
---

## 复杂度


### 时间复杂度

时间复杂度是用来评估算法运行效率的一个式子

- O(1)

```python
print("hello world!")
```

- O(n)

```python
for i in range(n):
    print(i)
```

- O(n²)

```python
for i in range(n):
    for j in range(n):
        print(i, j)
```

- O(logn)

```python
while n > 1:
    print(n)
    n = n // 2
```

> 一般来说，时间复杂度高的算法比时间复杂度低的算法慢


#### 常见的时间复杂度

O(1) < O(logn) < O(n) < O(nlogn) < O(n²) < O(n³)

#### 复杂问题的时间复杂度

O(n!)、O(2ⁿ)、O(nⁿ)

#### 快速判断算法复杂度

适用于绝大多数情况

1、确定问题规模 n

2、循环减半过程 -> logn

3、k 层关于 n 的循环 -> nᵏ

复杂情况需要根据算法执行过程判断


### 空间复杂度

空间复杂度是用来评估算法内存占用大小的式子

空间复杂度的表示方式和时间复杂度完全一样

- 算法使用了几个变量 -> O(1)
- 算法使用了长度为 n 的一维列表 -> O(n)
- 算法使用了 m 行 n 列的二维列表 -> O(mn)

> 空间换时间