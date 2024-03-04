---
title: '基础'
excerpt: '基础'
coverImage: '/assets/blog/python/logo.png'
date: '2023-02-27 10:04:10'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

## 基础

### 注释

> 代码会告诉你怎么做，注释会告诉你为何如此

- 单行注释

```python
# 这是单行注释
print("Hello World!") # 也可以写在后面
```

- 多行注释

```python
"""
这是第一行注释
这是第二行注释
这是第三行注释
"""
'''
也可以使用三个单引号
创建多行注释
'''
```

### 格式化输出：%

- `%s`

```py
# %s 表示我们可以传任何类型的值，它都会当成字符串类型
print('姓名：%s, 籍贯：%s, 年龄：%d.' % ('李正星', '甘肃', 24))

# 如果只有一个参数，可以不写括号按位置传值
print('姓名：%s' % '李正星')

# 不按位置传，传的是字典，占位符要带 key，多写几次可以重复传入的值
print('姓名：%(name)s，曾用名：%(name)s，国籍：%(country)s' % {'country': 'China', 'name': 'Lzx'})
```

- `%d`

```py
# %d 表示只能传整型，传其他类型会报错
print('年龄：%d' % 24)

# %06d 表示不足6位的数字用0补充
print('%06d' % 15) # 000015
print('%06d' % 123456) # 123456
print('%06d' % 1234567) # 1234567
```

- `%f`

```py
# %f 格式化浮点数
print('%f' % 0.2) # 0.200000

# %.2f 保留两位小数
print('%.2f' % 0.2) # 0.20
```

- `%%`

```py
# %% 表示输出%
print('%.2f%%' % 25) # 25.00%
```

### 字面常量

例如 `1`、`3.14` 这样的数字，或者是 `This is a string` 这样的文本，这些都是字面常量

用这样的称呼是因为它们是字面意义上的值或内容，总是表示它本身而非其他含义，它是一个常量，值不能被改变

### 数字

- 整数：`2`、`300`
- 浮点数：`3.14`、`5.2E-4`

### 字符串

可以使用单引号、双引号和三引号来指定字符串。使用三引号指定的字符串可以换行

```python
s = """这是第一行内容
这是第二行内容
这是第三行内容
"""
```

#### 字符串是不可变的

一旦创造了一串字符串，就不能再改变它，只能替换它。

#### 格式化方法

- 按位置传值

```python
name = '李正星'
age = 18

str1 = '姓名：{0}   年龄：{1}'.format(name, age) # 姓名：李正星   年龄：18

# 数字只是一个可选选项，不传默认是从 0 开始的
str2 = '姓名：{}   年龄：{}'.format(name, age) # 姓名：李正星   年龄：18
```

- 按关键字传值

```python
str3 = '姓名：{name}   年龄：{age}'.format(age=19, name='李星星') # 姓名：李星星   年龄：19
```

- 格式化填充

```python
# 浮点数四舍五入保留三位小数
print('{0:.3f}'.format(1/3)) # 0.333

# 按位置传参，总长度为20，不够的在左右两边填充，^表示字符居中
print('{0:*^20}'.format('开始')) # *********开始*********
# 按关键字传参
print('{text:*^20}'.format(text='开始')) # ---------开始---------

# 总长度为20，不够的在左右两边填充，> 表示字符居右
print('{0:*>20}'.format('开始')) # ******************开始

# 总长度为20，不够的在左右两边填充，< 表示字符居左
print('{0:*<20}'.format('开始')) # 开始******************
```

- 修改打印结尾

通过修改 `end` 来指定其打印结尾

```python
print('a', end='123')
print('b') 
# a123b
```

#### 转义序列

使用 `\` 来进行转义

```python
print('What\'s your name?') # What's your name?
```

使用 `\n` 来进行换行

```python
print('This is the first line\nThis is the second line')
'''
This is the first line
This is the second line
'''
```

在字符串末尾放置 `\` 表示字符串将在下一行继续，不会添加新的一行

```python
print("This is the first sentence. \
This is the second sentence.")
# This is the first sentence. This is the second sentence.
```

#### 原始字符串

在字符串前面增加 `r` 来指定一个原始 `(raw)` 字符串

```python
print(r"Newlines are indicated by \n")
# Newlines are indicated by \n
```

### 变量

变量的值是可以变化的，可以用变量来存储任何东西。变量只是计算机内存中用以存储信息的一部分。需要为其命名，以便访问它们。

### 标识符命名

变量是标识符的一个例子，标识符是为`某些东西`提供的给定名称。命名时，需要遵循以下规则

- 第一个字符必须是大小写字母或 `_`
- 其他字符由大小写字母、`_` 和数字组成
- 区分大小写，也就是说 `username` 和 `userName` 是两个标识符
  
### 数据类型

变量可以将各种形式的值保存为不同的数据类型

### 对象

`python` 将程序中的任何内容统称为对象

### 逻辑行和物理行

物理行：就是在编写程序时所看到的内容

逻辑行：是 `python` 所看到的单个语句

`python` 会假定每一物理行对应一个逻辑行

如果需要一个物理行对应多个逻辑行，可以使用 `;` 隔开多条语句

```python
num = 5;print(num)
```

> 我们应该让**每一物理行对应一个逻辑行**
> 
> 如果代码比较长，我们可以使用 `\` 将其拆分为多个物理行，这被称为显式行连接

```python
with open('data/user.log') \
        as f:
    print(f)
```