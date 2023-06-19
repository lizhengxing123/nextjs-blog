---
title: '绑定方法和非绑定方法'
excerpt: '绑定方法和非绑定方法'
coverImage: '/assets/blog/python/oop.jpeg'
date: '2023-06-19 09:56:00'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/oop.jpeg'
type: 'Python'
---

## 绑定方法和非绑定方法

```python
class Mysql:

  def __init__(self, ip, port):
    self.ip = ip
    self.port = port

  # 给对象绑定的方法
  def f1(self):
    print(self.ip, self.port)

  # 绑定给类的方法，调用时会自动将类传进来
  @classmethod
  def instance_from_conf(cls):
    return cls('127.0.0.1', '3306')

  # 非绑定方法，静态方法，对象和类都能使用
  @staticmethod
  def f2(self):
    print(self.__dict__)
```

- 使用 `@classmethod` 给类绑定方法，类和对象调用时会自动将类传进来
- 使用 `@staticmethod` 绑定静态方法，类和对象调用时都需要传参
- 类调用普通方法需要传参

```python
obj1 = Mysql.instance_from_conf()
obj2 = Mysql('127.0.0.1', 3307)

print(obj1.__dict__)  # {'ip': '127.0.0.1', 'port': 3306}
print(obj2.__dict__)  # {'ip': '127.0.0.1', 'port': 3307}

# 类方法对象和类都能调用，返回值相同
# <__main__.Mysql object at 0x7f95c0056d60>
print(obj2.instance_from_conf())
print(Mysql.instance_from_conf())
print(obj1.instance_from_conf())
```