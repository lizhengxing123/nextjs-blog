---
title: '单例模式'
excerpt: '单例模式'
coverImage: '/assets/blog/python/oop.jpeg'
date: '2023-06-19 14:58:03'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/oop.jpeg'
type: 'Python'
---

## 单例模式

### 模块

`python` 中每个文件就是一个单独的模块，也是天然的单例模式

### 类装饰器

```python
def singleton_mode(cls):
  obj = None

  def wrapper(*args, **kwargs):
    nonlocal obj

    if obj is None:
      obj = cls(*args, **kwargs)
    return obj

  return wrapper

@singleton_mode
class Human:

  def __init__(self, name, age):
    self.name = name
    self.age = age

obj1 = Human('lzx', 28)
obj2 = Human('lzx', 99)

"""
其内存地址一模一样

获取的对象是第一次初始化的对象，并不会再变
"""

print(obj1.__dict__) # {'name': 'lzx', 'age': 28}
print(obj2.__dict__) # {'name': 'lzx', 'age': 28}
```

### 类绑定方法

```python
class Human:
  obj = None

  def __init__(self, name, age):
    self.name = name
    self.age = age

  @classmethod
  def get_obj(cls, *args, **kwargs):
    if cls.obj is None:
      cls.obj = cls(*args, **kwargs)
    
    return cls.obj

obj1 = Human.get_obj('lzx', 28)
obj2 = Human.get_obj('lzx', 99)

"""
其内存地址一模一样

获取的对象是第一次初始化的对象，并不会再变
"""

print(obj1.__dict__) # {'name': 'lzx', 'age': 28}
print(obj2.__dict__) # {'name': 'lzx', 'age': 28}
```

### __new__ 方法

```python
class Human:
  obj = None

  def __init__(self, name, age):
    self.name = name
    self.age = age

  def __new__(cls, *args, **kwargs):
    if cls.obj is None:
      cls.obj = cls(*args, **kwargs)
    
    return cls.obj

obj1 = Human('lzx', 28)
obj2 = Human('lzx', 99)

"""
其内存地址一模一样

获取的对象是最后一次初始化的对象，后面的会替换掉前面的
"""

print(obj1.__dict__) # {'name': 'lzx', 'age': 99}
print(obj2.__dict__) # {'name': 'lzx', 'age': 99}
```

### 元类

```python
class MyType(type):
  obj = None

  def __call__(cls, *args, **kwargs):
    if cls.obj is None:
      cls.obj = cls.__new__(cls)

    cls.__init__(cls.obj, *args, **kwargs)
    return cls.obj

class Singleton(metaclass=MyType):
  pass

class Human(Singleton):

  def __init__(self, name, age):
    self.name = name
    self.age = age

obj1 = Human('lzx', 28)
obj2 = Human('lzx', 99)

"""
其内存地址一模一样

获取的对象是最后一次初始化的对象，后面的会替换掉前面的
"""

print(obj1.__dict__) # {'name': 'lzx', 'age': 99}
print(obj2.__dict__) # {'name': 'lzx', 'age': 99}
```