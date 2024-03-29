---
title: '运算符与表达式'
excerpt: '运算符与表达式'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-07 15:26:45'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

## 运算符与表达式

大多数逻辑行都包含了表达式。一个表达式的简单例子就是 `2+3`。表达式可以拆分为运算符与操作数。

运算符是进行某些操作，并且可以用诸如 `+` 等符号或特殊关键词加以表达的功能。

运算符需要一些数据来进行操作，这些数据就被称为操作数。

### 运算符

- `+`：加
  
两个相同类型的对象相加，不同类型会报错，数字类型（整型和浮点型）可以相加

```python
print(3 + 5) # 8
print(3 + 5.3) # 8.3
print('23' + 'asd') # 23asd
print([1, 2] + [4, 5]) # [1, 2, 4, 5]
```

- `-`：减

从一个数减去另一个数，如果第一个操作数不存在，则假定为 `0`

```python
print(3 - 5) # -2
print(-5.3) # -5.3
```

- `*`：乘

给出两个数的乘积，或者字符串的重复次数

```python
print(3 * 5) # 15
print('#' * 3) # ###
```

- `**`：乘方

返回 `x` 的 `y` 次方

```python
print(3 ** 3) # 3*3*3=27
```

- `/`：除

`x` 除以 `y` 

```python
print(3 / 5) # 0.6
```

- `//`：整除
  
`x` 除以 `y`，并对结果向下取整

```python
print(32 // 5) # 6
```

- `%`：取模
  
`x` 除以 `y`之后，取余数

```python
print(32 % 5) # 2
```

- 比较运算符

`<`、`<=`、`>`、`>=`、`==`、`!=`

```python
print(3 < 5 < 7) # True
print(3 > 5 > 7) # False
print(3 <= 5 < 7) # True
print(3 >= 5 >= 7) # False
print(3 != 5) # True
print('abc' == 'abc') # True
```

- 逻辑运算符

`and`、`or`、`not`

> 需要注意`短路操作`

```python
print(3 > 5 and 'abc' == 'abc') # False
print(3 > 5 or 'abc' == 'abc') # True
print(not 3 > 5) # True
```

- 位运算符

`&`、`|`、`^`、`~`、`<<`、`>>`

> `x << y` 等于数学表达式 `x * (2 ** y)`
> 
> `x >> y` 等于数学表达式 `x / (2 ** y)`，向下取整

```python
# 5 --> 101
# 3 --> 011

# & 按位与，如果两个相应二进位都为1，则为1，否则为0
print(5 & 3) # 001 --> 1

# | 按位或，如果两个相应二进位有一个为1，则为1，否则为0
print(5 | 3) # 111 --> 7

# ^ 按位异或，两个相应二进位不同则为1，相同则为0
print(5 ^ 3) # 110 --> 6

# ~ 按位取反，每一个二进位取反，0 换成 1，1 换成 0，公式 -(x+1)
print(～3) # -(3+1) --> -4
print(～5) # -(5+1) --> -6

# << 左移，向左移动指定的位数
print(3<<5) # 3*(2**5) = 96

# >> 右移，向右移动指定的位数
print(3>>1) # 3/(2**1) = 1
```

#### 数值运算与赋值的快捷操作

`变量 = 变量 运算 表达式` 演变为 `变量 运算= 表达式`

```python
a = 2

a = a + 1
a += 1 

a = a * 1
a *= 1 
```

#### 求值顺序

从低优先级到高优先级

- `lambda`：`lambda` 表达式
- `if - else`：条件表达式
- `or`：布尔或
- `and`：布尔与
- `not`：布尔非
- `in, not in, is, is not, <, <=, >, >=, !=, ==`：比较，包括成员资格测试和身份测试
- `|`：按位或
- `^`：按位异或
- `&`：按位与
- `>>, <<`：左移右移
- `+, -`：加减
- `*, /, //, %`：乘除，整除，取余
- `+x, -x, ~x`：正负，按位取反
- `**`：求幂
- `x[index], x[index:index], x(args..), x.attr`：下标，切片，调用，属性
- `(exp...), [exp...], {key: val}, {exp...}`：元组，列表，字典，集合

#### 改变运算顺序

使用 `()` 改变运算顺序

```python
x = (2 + 3) * 7 
print(x) # 35
```

#### 结合性

运算符通常从左往右结合，相同优先级的运算符从左往右依次求值

```python
# 3 + 4 + 5 ---> (3 + 4) + 5
```

### 表达式

```python
length = 5
breadth = 2

area = length * breadth # 10
Perimeter = 2 * (length + breadth) # 14
```