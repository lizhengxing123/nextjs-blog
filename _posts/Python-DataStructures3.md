---
title: '元组类型'
excerpt: '元组类型'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-09 15:05:33'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

### 元组类型

元组用于将多个对象保存到一起，它是不可变的。

在元组里面可以放任意类型的值

```python
t = (1, '2', [3, 4], (6,))

print(t, type(t)) # (1, '2', [3, 4], (6,)) <class 'tuple'>
```

如果元组里面只有一个值，必须要在这个元素后面加个 `,`

```python
t = ('1',)
s = ('1')

print(t, type(t)) # ('1',) <class 'tuple'>
print(s, type(s)) # 1 <class 'str'>
```

不能修改元组里面的不可变类型，但可以修改可变类型的值

```python
t = (1, 3.4, 'qwe', [1, 2, 3], {'name': 'li', 'age': 78}, (1, 2, 3))

# t[1] = 4.5 # TypeError: 'tuple' object does not support item assignment

t[3][1] = 90
t[4]['name'] = '李正星'

print(t)
# (1, 3.4, 'qwe', [1, 90, 3], {'name': '李正星', 'age': 78}, (1, 2, 3))
```

可以将任意可迭代对象转换为元组

```python
print(tuple('李')) # ('李',)

print(tuple([1, 90, 3])) # (1, 90, 3)

print(tuple({'name': '李正星', 'age': 78})) # ('name', 'age')

print(tuple(range(4))) # (0, 1, 2, 3)
```

#### 内置方法

- 索引取值

```python
t = (1, 2, 3)

print(t[2]) # 3
```

- 长度

```python
t = (1, 2, 3)

print(t.__len__()) # 3
print(len(t)) # 3
```

- 查看元素的索引

如果元素没在元组里会报错 `ValueError: tuple.index(x): x not in tuple`

```python
t = (1, 2, 3)

print(t.index(3)) # 2
```

- 查看元素出现的次数

```python
t = (1, 2, 3)

print(t.count(3)) # 1
print(t.count(31)) # 0
```

- 切片

```python
t = (1, 2, 3)

print(t[::-1]) # (3, 2, 1)
print(t[::]) # (1, 2, 3)
```

- 成员运算

```python
t = (1, 2, 3)

print(1 in t) # True
print(1 not in t) # False
```

- 循环

```python
t = (1, 2, 3)

for i in t:
  print(i, end=" ") # 1 2 3
```