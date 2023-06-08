---
title: '函数'
excerpt: '函数'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-08 09:22:02'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

## 函数

函数是指可重复使用的代码片段，它允许你为某个代码块赋予名字，并能通过这一名字在程序任何地方运行这一代码块，不限次数，这就是调用函数。

函数定义，使用关键字 `def`，后面跟函数标识符，再跟一对括号，里面可以存放函数参数，最后以冒号结尾。随后就是锁紧写函数代码块了。

```python
def say_hello(name):
  print(f'{name} say hello!')

say_hello('李正星') # 李正星 say hello!
```

### 函数参数

函数可以获取参数，这些参数与变量类似，这些变量的值在调用函数的时候定义，并在函数运行的时候赋值完成

在函数定义时给定的名称称做**形参**，在调用函数时提供给函数的值称作**实参**


```python
def print_max(a, b):
  if a > b:
    print(a)
  elif a< b:
    print(b)
  else:
    print('a 等于 b')

x = 3
y = 5

# 直接传递字面量
print_max(4, 4) # a 等于 b

# 以参数形式传递变量
print_max(x, y) # 5
```

#### 默认参数

使用赋值运算符 `=` 来为参数指定默认值，其值在函数定义阶段就已被赋值，**默认参数必须放在位置参数之后**

```python
def say_hello(name = '李正星'):
  print(f'{name} say hello!')

say_hello('李飞飞') # 李飞飞 say hello!
say_hello() # 李正星 say hello!
```

#### 关键字参数

对于拥有许多参数的函数而言，如果只希望对某些参数进行指定，那么可以通过命名来给这些参数赋值，就不需要按照位置一个一个给函数传参了。

> 需要注意的是：
>
> 关键字参数必须跟在位置参数之后

```python
def fn(a, b, c = 8):
  print(a, b, c)

fn(1,c=9,b=20) # 1 20 9
```

#### 可变参数

- `*args`：获取所有的位置参数，拿到的是参数元组
- `**kwargs`：获取所有的关键字参数，拿到的是参数字典

```python
def fn(a, *args, **kwargs):
  print(a)
  print(args)
  print(kwargs)

fn(1, 2, '3', '4', c='5', b='6')

# 打印结果
# 1
# (2, '3', '4')
# {'c': '5', 'b': '6'}
```

也可使用 `*` 打散参数，必须是可迭代对象。或者使用 `**` 打散字典

```python
def fn2(*args, **kwargs):
    print(args)
    print(kwargs)


def fn(a, *args, **kwargs):
    print(a)
    # args 是元祖，*args表示打散元祖传递参数
    # kwargs 是字典，*args表示打散字典传递参数
    fn2(*args, **kwargs)


fn(1, 2, '3', '4', c='5', b='6')
# fn 打印 1
# fn2 打印
# (2, '3', '4')
# {'c': '5', 'b': '6'}

fn2(1, 2, 3, 4, 5, 6)
# 打印结果
# (1, 2, 3, 4, 5, 6)
# {}

fn2(*{1, 2, 3, 4, 5, 6})
# 打印结果
# (1, 2, 3, 4, 5, 6)
# {}

fn2(*(1, 2, 3, 4, 5, 6))
# 打印结果
# (1, 2, 3, 4, 5, 6)
# {}

fn2(*'hello')
# 打印结果
# ('h', 'e', 'l', 'l', 'o')
# {}

fn2(*{'name': 'lzx', 'age': 19})
# 打印结果
# ('name', 'age')
# {}

fn2(**{'name': 'lzx', 'age': 19})
# 打印结果
# ()
# {'name': 'lzx', 'age': 19}
```


### 作用域和名称空间

#### 名称空间

- 内置名称空间：保存 `python` 解释器内置的名字
- 全局名称空间
- 局部名称空间

#### 作用域

- 局部作用域：`local`
- 内部作用域：`enclosing`
- 全局作用域：`global`、`built-in`

### 局部变量

当在一个函数的定义中声明变量时，它不会与外界的同名变量产生联系，也就是说这些变量只产生在函数的局部。

所有变量的作用域是它们被定义的块，从定义它们名字的定义点开始

```python
# 全局作用域
x = 20

def fn():
  # 局部作用域
  x = 2
  print('局部作用域 x =', x) # 局部作用域 x = 2

fn()
print('全局作用域 x =', x) # 全局作用域 x = 20
```

### 修改变量作用域

#### `global`

使用 `global` 关键字声明的变量，表示这是全局作用域中的变量

```python
# 全局作用域
x = 20

def fn():
  # 使用 global 关键字声明，x 是全局作用域中的 x
  global x
  x = 2
  print('修改了全局作用域的 x =', x) # 修改了全局作用域的 x = 2

fn()
print('全局作用域 x =', x) # 全局作用域 x = 2
```

#### `nonlocal`  

使用 `nonlocal` 关键字声明的变量，表示这是内部作用域中的变量


```python
# 全局作用域
x = 20

def fn():
  x = 30
  print('内部作用域 x =', x) # 内部作用域 x = 30

  def fn2():
    nonlocal x
    x = 40
    print('修改了内部作用域的 x =', x) # 修改了内部作用域的 x = 40

  fn2()
  print('内部作用域 x =', x) # 内部作用域 x = 40


fn()
print('全局作用域 x =', x) # 全局作用域 x = 20
```

### return 语句

中断函数，并且可以从函数中返回一个值。如果 `return` 后面没有值，或者函数没有 `return` 语句，则函数默认返回 `None`

> 可以使用 `...` 或者 `pass` 来指定没有内容的代码块

```python
def get_max(a, b):
  if a > b:
    return a
  elif a< b:
    return b
  else:
    return a

def fn():
  pass
  # ...

max = get_max(3, 6)
print(max) # 6

print(fn()) # None
```

### DocStrings

文档字符串，能够帮助我们更好的记录程序并让其更加易于理解，并且能够通过 `__doc__` 属性获取它。

```python
def get_max(a, b):
  """打印两个数的最大值 

  这两个数必须是整数

  """
  if a > b:
    return a
  elif a< b:
    return b
  else:
    return a

print(get_max.__doc__)
```