---
title: '迭代器'
excerpt: '迭代器'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-12 09:22:56'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

## 迭代器

不依赖于索引的迭代取值方式

### 可迭代对象

可以转换为迭代器的对象，只要内置 `__iter__()` 方法的都是可迭代对象

```python
# 字符串
print('123'.__iter__())  # <str_iterator object at 0x7fd03000cfd0>

# 列表
print([1, 2, 3].__iter__())  # <list_iterator object at 0x7fd03000cfd0>

# 元组
print((1, 2, 3).__iter__())  # <tuple_iterator object at 0x7fd03000cfd0>

# 集合
print({1, 2, 3}.__iter__())  # <set_iterator object at 0x7fd05005f540>

# 字典
print({'a': 1, 'b': 2}.__iter__())  # <dict_keyiterator object at 0x7fd05004c680>

# 文件
with open('data/a.txt', mode='rt', encoding='utf-8') as f:
  print(f.__iter__()) # <_io.TextIOWrapper name='data/a.txt' mode='rt' encoding='utf-8'>
  pass
```

### 迭代器对象

内置 `__iter__()` 和 `__next__()` 方法的对象。

迭代器对象调用 `__next__()` 方法获取下一个值，调用 `__iter__()` 方法获取其本身

```python
# 将可迭代对象转换为迭代器对象
res = {'a': 1, 'b': 2}.__iter__()

print(res.__iter__() is res)  # True

while True:
  try:
    print(res.__next__()) # a b
  except StopIteration:
    break
```

### 生成器

```python
def g():
  yield 1
  yield 2
  yield 3
  yield 4
  yield 5

# 调用生成器函数，返回迭代器对象
i = g()

# 调用 `__iter__()` 方法获取其本身
print(i.__iter__() is i) # True

# 迭代器对象调用 `__next__()` 方法获取下一个值
print(i.__next__()) # 1
print(i.__next__()) # 2
print(i.__next__()) # 3
print(i.__next__()) # 4
print(i.__next__()) # 5

# print(i.__next__()) # 报错 StopIteration
```

> **`Tips`**
>
> `__iter__()` 等同于 `iter()`
> 
> `__next__()` 等同于 `next()`
> 
> `__len__()`  等同于 `len()`


### `yield` 表达式

声明生成器函数

```python
def fn(a):

  while True:
    b = yield 10
    print(a, b)
```

调用产生迭代器对象

```python
g = fn(20)
```

先让走到 `yield` 这里

> 在这之前 `send` 的参数必须为 `None`
>
> 否则会报错 `TypeError: can't send non-None value to a just-started generator`

```python
res = g.send(None)  # 20 None

print(res) # 10

next(g)
```

使用 `send` 传递参数，只能传一个参数，如果需要多个参数，可以使用列表等数据类型

`yield` 左边的值是我们 `send` 传的参数，右边的值是 **返回值**

```python
res = g.send(12)  # 20 12

print(res) # 10

res2 = g.send(122)  # 20 122

print(res2) # 10
```

### 总结

- 生成器是迭代器对象
- 迭代器对象肯定是可迭代对象
- 可迭代对象不一定是迭代器对象
- 只要是可迭代对象，都能被 `for` 循环