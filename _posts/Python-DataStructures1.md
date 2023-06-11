---
title: '数字和字符串类型'
excerpt: '数字和字符串类型'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-08 15:12:26'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

### 数字类型

#### 整型 int

使用字面量定义

```python
num1 = 34
```

使用 `int` 类转换，如果是字符串，必须是 **纯数字字符串，且不能包含小数点，或者是二进制类型数字**

```python
num2 = int(38) # 38

num3 = int('3') # 3

num4 = int(b'56') # 56
```

进制转换

```python
# 十进制转二进制
print(bin(18)) # 0b10010

# 十进制转八进制
print(oct(18)) # 0o22

# 十进制转十六进制
print(hex(18)) # 0x12

# 二进制转十进制
print(int('10010', 2)) # 18

# 八进制转十进制
print(int('22', 8)) # 18

# 十六进制转十进制
print(int('12', 16)) # 18
```

#### 浮点型 float

使用字面量定义

```python
num1 = 3.14
```

使用 `float` 类转换，如果是字符串，必须是 **纯数字字符串，可以包含小数点，或者是二进制类型数字**

```python
num2 = float(3.8) # 3.8

num3 = float('3') # 3.0
num4 = float('3.14') # 3.14

num5 = float(b'56') # 56.0
num6 = float(b'5.6') # 5.6
```

### 字符串类型

使用 `str` 类可以将 **任何类型** 转换为字符串

```python
s1 = str([1, 2])
print(s1, type(s1)) # [1, 2] <class 'str'>

s2 = str(None)
print(s2, type(s2)) # None <class 'str'>
```

#### 内置方法

- 索引取值

正向从 `0` 开始，反向从 `-1` 开始，超出范围回报错 `IndexError: string index out of range`

> 其是不可变类型，**不能使用索引修改值**

```python
s = 'hello'

print(s[0]) # h
print(s[-5]) # h
```

- 切片

将字符串的某一部分 **复制** 下来，**不改变** 原有字符串。

`:` 左边为开始索引，默认为 `0`，右边为结束索引，默认为字符串长度。也可以指定负数，从 `-1` 开始

```python
info = 'you can you up,no can no bb!'

print(info[0:3]) # you
print(info[:10]) # you can yo
print(info[4:]) # can you up,no can no bb!

print(info[4:-5]) # can you up,no can n

print(info[:]) # you can you up,no can no bb!

# 还可以指定步长
print(info[0:8:2]) # yucn

# 指定反向
print(info[0:8:2])
```

也可以指定步长，步长如果为负数，必须左边大右边小

```python
print(info[0:8:2]) # yucn

print(info[10:4:-2]) # uyn

# 倒置字符串
print(info[::-1]) # !bb on nac on,pu uoy nac uoy
```

- 去除空格

去除字符串两边的空格

```python
print(' l zx '.strip()) # l zx
```

传参指定两边需要去除的字符

```python
print('0899l zx09873209'.strip('098')) # l zx098732
```

`lstrip` 去除左边

```python
print(' l zx '.lstrip())) # l zx 
print('0899l zx09873209'.lstrip('098')) # l zx09873209
```

`rstrip` 去除右边

```python
print(' l zx '.rstrip())) #  l zx 
print('0899l zx09873209'.rstrip('098')) # 0899l zx098732
```

- 拆分

使用特定的字符将字符串分割开来，返回一个列表

不传参数默认按照空格分割

```python
print('l zx'.split()) # ['l', 'zx']
print('l zx'.split('z')) # ['l ', 'x']
print('l zx'.split('w')) # ['l zx']
```

传递第二个参数指定分割次数

```python
print('l zx zw'.split('z', 1)) # ['l ', 'x zw']
```

使用 `rsplit` 从右往左拆分

```python
print('l zx zw'.rsplit('z')) # ['l ', 'x ', 'w']
print('l zx zw'.rsplit('z', 1)) # ['l zx ', 'w']
```

- 长度

```python
print('hello'.__len__) # 5
print(len('hello')) # 5
```

- 循环

```python
s = 'hello'

for i in s:
  print(i, end=' ') # h e l l o 
```

- 成员运算

判断子串是否在字符串内

```python
print('he' in 'hello') # True
print('hl' not in 'hello') # True
```

- 格式化填充

`format`

```python
name = '李正星'
age =34

# 我叫李正星，今年34岁

print('我叫{}，今年{}岁'.format(name, age))

print('我叫{0}，今年{1}岁'.format(name, age))

print('我叫{1}，今年{0}岁'.format(age, name))

print('我叫{name}，今年{age}岁'.format(age=age, name=name))

# 总长度为20，不够的在左右两边填充，^表示字符居中
print('{0:*^20}'.format('开始')) # *********开始*********

# 总长度为20，不够的在左右两边填充，> 表示字符居右
print('{0:*>20}'.format('开始')) # ******************开始

# 总长度为20，不够的在左右两边填充，< 表示字符居左
print('{0:*<20}'.format('开始')) # 开始******************
```

`f`

```python
# 我叫李正星，今年34岁
print(f'我叫{name}，今年{age}岁')
```

`center`

```python
# 总长度为20，不够的在左右两边填充 *
print('banana'.center(20, '*')) # *******banana*******
```

- 大小写转换

```python
print('AbCd'.lower())  # abcd
print('AbCd'.upper())  # ABCD
```

- 判断以...开头/结尾

```python
print('AbCd'.startswith('ab'))  # False
print('AbCd'.startswith('Ab'))  # True
print('AbCd'.endswith('cd'))  # False
print('AbCd'.endswith('Cd'))  # True
```

- 将列表转换为字符串

只能连接全是字符串的列表

```python
print('-'.join(['1', '2', '3']))  # 1-2-3
```

- 替换

第一个参数是要被替换的字符串，第二个参数是替换成哪个字符串，第三个参数是替换次数，不传默认全部替换
```python
print('l zx zw'.replace('z', 'mmm'))  # l mmmx mmmw
print('l zx zw'.replace('z', 'mmm', 1))  # l mmmx zw
```

- 判断字符串是否由纯数字组成

```python
print('12'.isdigit())  # True
print('1.2'.isdigit())  # False
```

- 将字符串的第一个字符转换为大写

```python
print('as'.capitalize())  # As
```
