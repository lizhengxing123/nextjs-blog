---
title: '内置方法'
excerpt: '内置方法'
coverImage: '/assets/blog/python/oop.jpeg'
date: '2023-06-19 10:59:40'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/oop.jpeg'
type: 'Python'
---

## 内置方法

满足某种条件的时候自动执行

### __str__

打印的时候执行

```python
class Person:

  def __init__(self, name, age):
    self.name = name
    self.age = age

  def __str__(self):
    return f'姓名：{self.name}  年龄：{self.age}'

obj = Person('李正星', 20)
print(obj) # 姓名：李正星  年龄：20
```

### __del__

在删除对象的时候先执行

> 如果对象引用了操作系统的资源，可以在对象删除之前告诉操作系统，回收操作系统资源。
>
> **因为删除对象只是回收应用程序资源**

```python
class Person:

  def __init__(self, name, age):
    pass

  def __del__(self):
    print('删除对象')
    print('回收操作系统资源')
```