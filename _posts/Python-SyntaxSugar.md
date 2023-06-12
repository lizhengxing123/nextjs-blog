---
title: '生成式和三元表达式'
excerpt: '生成式和三元表达式'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-12 10:15:35'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

### 三元表达式 

函数形式

```python
def fn(a, b):
    if a > b:
        return a
    else:
        return b

res = fn(20, 30)

print(res) # 30
```

三元表达式形式

```python
a = 20
b = 30

res = a if a > b else b

print(res) # 30
```

三元表达式嵌套

```python
a = 20
b = 30

res = 'a > b' if a > b else 'a < b' if a < b else 'a = b'

print(res) # a < b
```

### 列表生成式

#### 基本使用

`[exp for iter_var in iterable]`

```python
res = [i*2 for i in range(10)]

print(res) # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
```

#### 带过滤条件

`[exp for iter_var in iterable if _exp]`

```python
res = [i*2 for i in range(10) if i%2] # [2, 6, 10, 14, 18]
```

#### 嵌套循环

`[exp for iter_var_A in iterable_A for iter_var_B in iterable_B]`

```python
# 生成九九乘法表
res =  [f"{j} x {i} = {i*j}" for i in range(1, 10) for j in range(i, 10)]
```

### 其他生成式

#### 集合生成式

`{exp for iter_var in iterable}`

```python
res = {i*2 for i in range(10)}

print(res) # {0, 2, 4, 6, 8, 10, 12, 14, 16, 18}
```

#### 字典生成式

`{key: value for iter_var in iterable}`

```python
res = {i*2: i for i in range(5)}

print(res) # {0: 0, 2: 1, 4: 2, 6: 3, 8: 4}
```

### 生成器表达式

`(exp for iter_var in iterable)`

```python
res = (i*3 for i in range(3, 8))

print(res) # <generator object <genexpr> at 0x7fef400949e0>

print(next(res)) # 9
print(next(res)) # 12
print(next(res)) # 15
print(next(res)) # 18
print(next(res)) # 21
# print(next(res)) # StopIteration
```

统计文件字数

```python
with open('data/user.log', mode='rt', encoding='utf-8') as f:
    # sum 接收可迭代对象做参数
    size = sum(len(line) for line in f)
    print(size)
```