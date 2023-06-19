---
title: '封装、继承、多态'
excerpt: '封装、继承、多态'
coverImage: '/assets/blog/python/oop.jpeg'
date: '2023-06-15 16:57:40'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/oop.jpeg'
type: 'Python'
---

## 封装、继承、多态

### 封装

#### 隐藏属性

在属性名前面加上 `__`

> 1. 隐藏的本质，只是改了名字
>
> 2. 对外不对内
>
> 3. 改名操作只会在类定义阶段执行一次，之后增加的 `__` 属性名不会改名

```python
class Test:
  # 隐藏类属性，会改名为 _Test__a
  __a = '__a'

  def __init__(self, name, age):
    # 隐藏对象属性,会改名为 _Test__name
    self.__name = name
    self.age = age

  # 隐藏类方法，会改名为 _Test__f1
  def __f1(self):
    print('__f1')

  def f2(self):
    print(self.__name, self.age, Test.__a)
```

类里面的函数能正常访问隐藏属性，因为类在定义阶段就会运行子代码，所以里面的 `__` 隐藏属性都被重新命名了。

在 `f2` 中访问 `Test.__a` 就会被转换为 `_Test__a`，`self.__name` 就会被转换为 `self._Test__name`

```python
test = Test('lzx', '27')

print(test__dic__)
# {'_Test__name': 'lzx', 'age': '27'}

# print(test.__a) 
# AttributeError: 'Test' object has no attribute '__a'

print(test._Test__a) # __a

# test.__f1()
# AttributeError: 'Test' object has no attribute '__f1'

test._Test__f1() # __f1

test.f2()
# lzx 27 __a
```

之后再设置隐藏属性并不会改名

```python
Test.__b = '__b'
test.__c = '__c'

print(test.__b) # __b
print(test.__c) # __c
```

#### 控制属性

隐藏属性可以更好的控制属性，给属性设置 `getter`、`setter` 和 `deleter`，这样在操作属性的时候，可以写任何操作逻辑

- `property`

需要定义好`getter`、`setter` 和 `deleter`，并按顺序传递

```python
class Test:
  __a = '__a'

  def __init__(self, name, age):
    self.__name = name
    self.age = age

  def __f1(self):
    print('__f1')

  def f2(self):
    print(self.__name, self.age, Test.__a)

  def get_name(self):
    return self.__name + 'xx'

  def set_name(self, new_name):
    if type(new_name) is not str:
      print('请输入字符串')
      return
    self.__name = new_name

  def del_name(self):
    del self.__name

  # name 就是要暴露出去的属性名，传入的顺序必须为查、改、删
  name = property(get_name, set_name, del_name)
```

定义好之后，我们就可以通过 `name` 来进行操作 `__name` 属性

```python
test = Test('lzx', 26)

print(test.__dict__)
# {'_Test__name': 'lzx', 'age': 26}

print(test.name) # lzxxx

# test.name = 12
# 请输入字符串

test.name = '老李'
print(test.name) # 老李xx

del test.name

print(test.__dict__) # {'age': 26}
print(test.name)
# AttributeError: 'Test' object has no attribute '_Test__name'
```

- 装饰器

`@property` 表示查，`@name.setter` 表示改，`@name.deleter` 表示删

```python
class Test:
  __a = '__a'

  def __init__(self, name, age):
    self.__name = name
    self.age = age

  def __f1(self):
    print('__f1')

  def f2(self):
    print(self.__name, self.age, Test.__a)

  @property
  def name(self):
    return self.__name + 'xx'

  @name.setter
  def name(self, new_name):
    if type(new_name) is not str:
      print('请输入字符串')
      return
    self.__name = new_name

  @name.deleter
  def name(self):
    del self.__name
```

### 继承

是创建新类的方式，通过继承创建的类是子类，被继承的类是基类（父类）

```python
class Parent1:
  pass

class Parent2:
  pass

# 单继承
class Child1(Parent1):
  pass

# 多继承
class Child2(Parent1, Parent2):
  pass
```

查看子类继承的基类

```python
print(Child1.__bases__)
# (<class '__main__.Parent1'>,)

print(Child2.__bases__)
# (<class '__main__.Parent1'>, <class '__main__.Parent2'>)
```

#### 特性

继承的特性就是遗传

对于多继承来说：

优点：一个子类可以同时遗传多个父类的属性

缺点：1. 违背了人类的思维习惯（一个儿一个爹）2. 会让代码的可读性变差

如果要使用多继承，应该使用 `Mixins`

#### 派生

子类可以拥有父类的同名属性和方法

子类也可以新增独有的属性和方法

子类还可以扩展父类的方法，子类在定义和父类同名方法时，可以使用 `super` 调用父类方法

- 单继承的属性查找

对象 --> 类 --> 基类 --> ... --> `object` --> 报错

```python
class Test1:
    def f1(self):
        print('Test1.f1')

    def __f1(self):  # 定义阶段就会改名为 _Test1__f1
        print('Test1.__f1')

    def f2(self):
        print('Test1.f2')
        self.f1()

    def f3(self):
        print('Test1.f3')
        # 定义阶段就会改名为 _Test1__f1，所以不会找到子类的 __f1，因为子类的 __f1 是 _Test2__f1
        self.__f1()


class Test2(Test1):
    def f1(self):
        print('Test2.f1')

    def __f1(self):  # 定义阶段就会改名为 _Test2__f1
        print('Test2.__f1')
```

通过 `Test2` 实例化对象

```python
test = Test2()
```

访问 `test.f2()`

```python
test.f2()
```

`test.f2()` 查找顺序是：`test.f2 --> Test2.f2 --> Test1.f2`

`self` 指的是当前实例化的对象，也就是 `test`

所以在 `Test1.f2` 中访问 `self.f1` 就是访问 `test.f1`

`test.f1` 查找顺序是：`test.f1 --> Test2.f1`

所以最后输出结果是

```python
Test1.f2
Test2.f1
```

访问 `test.f3()`

```python
test.f3()
```

`test.f3()` 查找顺序是：`test.f3 --> Test2.f3 --> Test1.f3`

由于隐藏属性在定义阶段就会改名，所以在 `Test1.f3` 中访问 `self.__f1` 就相当于访问 `self._Test1__f1`

而 `Test2` 里面的 `__f1` 会改名为 `_Test2__f1`

所以 `self.__f1` 最后会查找到 `Test1` 里面的 `__f1`

输出结果为

```python
Test1.f3
Test1.__f1
```

- 多继承的属性查找

基于类的 `mro` 列表

对于非菱形继承，会查找完一个分支，再去查找另外一个分支，最后查找 `object`

```python
class Parent1:
  pass

class Parent2:
  pass

class Parent3(Parent1):
  pass

class Parent4(Parent1):
  pass

class Parent5(Parent2):
  pass

class Child1(Parent3, Parent4, Parent5):
  pass


print(Child1.mro())
# [
#   <class '__main__.Child1'>,
#   <class '__main__.Parent3'>, 
#   <class '__main__.Parent4'>, 
#   <class '__main__.Parent1'>, 
#   <class '__main__.Parent5'>, 
#   <class '__main__.Parent2'>, 
#   <class 'object'>
# ]
```

对于菱形继承，会查找完一个分支，再去查找另外一个分支，之后再查找共同的父类，最后查找 `object`

```python
class Parent1:
  pass

class Parent2(Parent1):
  pass

class Parent3(Parent1):
  pass

class Child1(Parent2, Parent3):
  pass

print(Child1.mro())
# [
#   <class '__main__.Child1'>,
#   <class '__main__.Parent2'>, 
#   <class '__main__.Parent3'>, 
#   <class '__main__.Parent1'>,
#   <class 'object'>
# ]
```

#### Mixins

只是一种命名规范，和常量类似

```python
class Fowl:  # 家禽类
    pass

class SwimMixin:  # 家禽类额外的功能
    def swimming(self):
        pass

class Chicken(Fowl):  # 鸡
    pass

class Duck(SwimMixin, Fowl):  # 鸭
    # 可以实现游泳功能
    pass

class Goose(SwimMixin, Fowl):  # 鹅
    # 可以实现游泳功能
    pass
```

#### `super`

使用 `super` 重用基类功能

```python
class A:
    def f1(self):
        print('A.f1')
        super().f1()

class B:
    def f1(self):
        print('B.f1')

class C(A, B):
    pass


obj = C()
```

`super()` 找属性基于对象所属类的 `mro` 列表，也就是 `C` 的 `mro` 列表

其会从调用 `super()` 类的下一个类开始找，也就是 `A` 的下一个，在 `mro` 列表里是 `B`


```python
print(C.mro())
# [
#   <class '__main__.C'>, 
#   <class '__main__.A'>, 
#   <class '__main__.B'>, 
#   <class 'object'>
# ]

obj.f1()  
# A.f1 
# B.f1
```

> 因此 `super` 找属性并不是直接去基类找的，也不是从 `mro` 列表的第一个开始找，而是从调用 `super` 类的下一个类开始找


### 多态

允许不同的类具有相同名称的方法

```python
class Car:
    def run(self):
        print('开始跑', end=' ')


class Benz(Car):
    def run(self):
        super().run()
        print('100km/h')


class Bmw(Car):
    def run(self):
        super().run()
        print('120km/h')


car1 = Benz()
car2 = Bmw()

car1.run() # 开始跑 100km/h
car2.run() # 开始跑 120km/h
```

#### 鸭子类型

不需要继承共同的基类，只需要每个类 `像` 就行了，比如都定义 `run` 方法

#### 抽象基类

子类必须实现父类规定的方法

> 抽象基类不能实例化，它只是用来规范子类的

```python
import abc

class Animal(metaclass=abc.ABCMeta):
    @abc.abstractmethod
    def eat(self):
        pass


class Monkey(Animal):
    # 必须得实现抽象基类的方法
    def eat(self):
        pass


# 子类不实现方法会报错
# Can't instantiate abstract class Monkey with abstract method eat
monkey = Monkey()
```