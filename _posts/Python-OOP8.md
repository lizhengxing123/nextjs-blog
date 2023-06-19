---
title: '内置函数'
excerpt: '内置函数'
coverImage: '/assets/blog/python/oop.jpeg'
date: '2023-06-19 15:26:58'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/oop.jpeg'
type: 'Python'
---

## 内置函数

- `enumerate` 枚举

第二个参数可以指定开始索引

```python
l = ['a', 'b', 'c', 'd', 'e']

for index, value in enumerate(l, 23):
  print(f'{index}--{value}', end=" ")

# 23--a 24--b 25--c 26--d 27--e 
```

- `zip` 拉链

将多个可迭代对象一一对应，如果长度不一致，以最短的为主

```python
i1 = ['a', 'b', 'c', 'd', 'e']
i2 = ('f', 'g', 'h', 'i')
i3 = {'j', 'k', 'l'}
i4 = 'hello'
i5 = {'name': 'lzx', 'age': 20}

for i in zip(i1, i2, i3, i4, i5):
  print(i)

"""
('a', 'f', 'j', 'h', 'name')
('b', 'g', 'k', 'e', 'age')
"""
```

- `__import__` 使用字符串导入模块

```python
name = 'time'
time = __import__(name)
print(time.time())  # 1685533046.007796
```

- `globals` 全局名称空间

```python
print(globals)
```

- `locals` 局部名称空间

```python
def f1(a):
  print(locals())

f1(2) # {'a': 2}
```

- `eval` 执行表达式

执行的表达式必须要由返回值

```python
g = {'b': 3}
l = {'b': 4}

res = eval('1+2+b', {}, {})
# NameError: name 'b' is not defined

res = eval('1+2+b', g, {})
print(res)  # 6

res = eval('1+2+b', g, l)
print(res)  # 7
```

- `exec` 执行代码块

```python
g = {'b': 3}
l = {}

exec('a=1+2+b', g, l)
print(l)  # {'a': 6}
```

- `vars`、`dir`

```python
class Human:
    star = 'earth'

    def __init__(self, name, age):
        self.name = name
        self.age = age


obj = Human('李正星', 90)

print(dir(obj))  # [.....'__weakref__', 'age', 'name', 'star']
print(vars(obj))  # {'name': '李正星', 'age': 90}
print(obj.__dict__)  # {'name': '李正星', 'age': 90}
```

- `frozenset` 不可变集合

```python
s = frozenset({1, 2, 3})

print(s, type(s))  
# frozenset({1, 2, 3}) <class 'frozenset'>
```
