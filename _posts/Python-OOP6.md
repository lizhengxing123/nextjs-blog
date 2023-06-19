---
title: '元类'
excerpt: '元类'
coverImage: '/assets/blog/python/oop.jpeg'
date: '2023-06-19 11:08:13'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/oop.jpeg'
type: 'Python'
---

## 元类

用于实例化产生类的类。所有自己定义的类和内置的类，都是由元类 `type` 产生的。

```python
class Test:
  pass

obj = Test()

print(type(obj)) # <class '__main__.Test'>
print(type(Test)) # <class 'type'>
print(type(str)) # <class 'type'>
```

### 元类创建过程分析

#### 类名

```python
class_name = 'Test'
```

#### 父类

默认继承 `object`

```python
class_bases = (object,)
```

#### 执行类子代码，产生名称空间

```python
class_dic = {}

class_body = """
def __init__(self, name, age):
    self.name = name
    self.age = age

# 打印的时候调用
def __str__(self):
    return f'姓名：{self.name}  年龄：{self.age}'
"""

# 使用 exec 执行
# 第二个参数为全局名称空间
# 第三个参数为类名称空间
exec(class_body, {}, class_dic)
```

#### 调用元类，生成类

```python
a = type(class_name, class_bases, class_dic)
print(a)

b = a('理智', 90) # <class '__main__.Test'>
print(b) # 姓名：理智  年龄：90
```

### 自定义元类

必须继承元类 `type`

使用 `raise` 抛出异常

```python
class MyType(type):

  # 元类的 init 接受四个参数
  def __init__(cls, class_name, class_bases, class_dic):
    print('MyType.__init__'.center(50, '*'))

    if '_' in class_name:
      raise NameError("类名不能含有下划线")

    if not class_dic.get('__doc__'):
      raise SyntaxError("定义类必须写文档注释")

  # 元类用来产生新的对象
  def __new__(mcs, *args, **kwargs):
    print('MyType.__new__'.center(50, '*'))

    # mcs 是元类 MyType
    print(mcs, args, kwargs)
    return super().__new__(mcs, *args, **kwargs)

  def __call__(cls, *args, **kwargs):
    print('MyType.__call__'.center(50, '*'))
    obj = cls.__new__(cls)
    cls.__init__(obj, *args, **kwargs)
    return obj
```

#### 根据自定义元类生成类

会调用 `type` 的 `__call__` 方法

- 1.调用 `MyType.__new__` 方法，产生空对象 `Test2`
- 2.调用 `MyType.__init__` 方法，初始化对象 `Test2`
- 3.返回初始化好的的对象 `Test2`

```python
class Test2(metaclass=MyType):
  """
  这是文档注释
  """
  def __init__(self, name, age):
    print('Test2.__init__'.center(50, '*'))
    self.name = name
    self.age = age

  def __new__(cls, *args, **kwargs):
    print('Test2.__new__'.center(50, '*'))

    return super().__new__(cls)

"""
会打印以下信息：

******************MyType.__new__******************
<class '__main__.MyType'> 
(
  'Test2', 
  (), 
  {
    '__module__': '__main__', 
    '__qualname__': 'Test2', 
    '__doc__': '\n  这是文档注释\n  ', 
    '__init__': <function Test2.__init__ at 0x7fa090053a60>, 
    '__new__': <function Test2.__new__ at 0x7fa090080040>
  }
) 
{}
*****************MyType.__init__******************
"""
```

#### 更具类实例化对象

会调用 `MyType` 的 `__call__` 方法

- 1.调用 `Test2.__new__` 方法，产生空对象 `obj`
- 2.调用 `Test2.__init__` 方法，初始化对象 `obj`
- 3.返回初始化好的的对象 `obj`

```python
obj = Test2('lzx', 78)

"""
会打印以下信息：

*****************MyType.__call__******************
******************Test2.__new__*******************
******************Test2.__init__******************
"""

print(obj.__dict__)
# {'name': 'lzx', 'age': 78}
```

### 属性查找

#### 对象查找属性

```python
"""
对象 --> 类 --> 父类 --> ...  --> object  不会去元类里面查找
"""
```

#### 类查找属性

```python
"""
类 --> 父类 --> ...  --> object --> 元类
"""
```

> 只要父类是由自定义元类创建的，那么继承这个父类的子类也是由自定义元类创建的