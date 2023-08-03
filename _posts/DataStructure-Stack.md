---
title: '栈'
excerpt: '栈'
coverImage: '/assets/blog/data-structure/stack.jpeg'
date: '2023-07-27 16:46:22'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/data-structure/stack.jpeg'
type: 'DataStructure'
---

## 栈

### 定义

栈是一种有次序的数据项集合，在栈中，数据项的加入和移除都发生在同一端，就是栈顶（top），另一端是栈底（base）

在栈中，最新加入的数据项最先被移除，这种次序通常称为后进先出（`LIFO`：Last in First out）

### 特性

#### 反转次序

进栈和出栈的次序正好相反

浏览器的 `Back` 后退按钮和 `Word` 的撤销都是相同的特性

### 操作

- `Stack()`：创建空栈，不包含任何数据项
- `push(item)`：将 `item` 加入到栈顶，无返回值
- `pop()`：将栈顶数据项移除，并返回，栈被修改
- `peek()`：获取栈顶数据项，并返回，栈不被修改
- `isEmpty()`：返回栈是否为空
- `size()`：返回栈的大小

### 实现

```python
class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        return self.items.pop()

    def peek(self):
        if self.is_empty():
            return None

        return self.items[len(self.items) - 1]

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)
```

### 应用

#### 简单括号匹配

- 题目链接

[20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/)

- [解决思路](https://leetcode.cn/problems/valid-parentheses/solutions/9185/valid-parentheses-fu-zhu-zhan-fa-by-jin407891080/)

![流程图](/assets/drawio/Stack-1.png)

- 代码实现

```python
def par_checker(s: str) -> bool:
    # 如果字符串长度是奇数，直接返回 False
    if len(s) % 2:
        return False

    # 声明一个字典保存左右括号的对应关系
    dic = {"(": ")", "[": "]", "{": "}"}

    # 声明一个空栈
    stack = []

    # 循环迭代
    for c in s:
        if c in dic:
            # 左括号
            stack.append(c)
        else:
            # 右括号
            if len(stack) == 0:
                # 栈为空返回 False
                return False

            if dic[stack.pop()] != c:
                # 栈顶元素和右括号不匹配返回 False
                return False

            # 进行下轮循环

    # 循环完毕判断栈是否为空
    return len(stack) == 0
```

#### 十进制转换为二进制

除二取余法

```python
"""
   2 |   3  5          余数
     |_________
   2 |   1  7   ------- 1    低位
     |_________               ^
   2 |      8   ------- 1     |
     |_________               |
   2 |      4   ------- 0     |
     |_________               |
   2 |      2   ------- 0     |
     |_________               |
   2 |      1   ------- 0     |
     |_________               |
            0   ------- 1    高位
"""
# 35 的二进制就是 100011

def divide_by_2(num: int) -> str:
    # 声明一个空栈
    stack = []

    while num > 0:
        # 取余数
        rem = num % 2
        # 入栈，直接转换为字符串
        stack.append(str(rem))
        # 将数字重新赋值
        num //= 2

    # 反转栈
    stack.reverse()

    # 输出
    return "".join(stack)
```

- 十进制转换扩展

```python
def converter(num: int, base: int) -> str:
    # 保存不同进制对应的数字
    digits = "0123456789ABCDE"

    # 声明一个空栈
    stack = []

    while num > 0:
        # 取余数
        rem = num % base
        # 入栈，直接转换为字符串
        stack.append(digits[rem])
        # 将数字重新赋值
        num //= base

    # 反转栈
    stack.reverse()

    # 输出
    return "".join(stack)
```

#### 表达式转换

中缀表达式：操作符介于操作数中间的表达式，如 `A*B`。使用优先级来区分先计算哪个，括号强制提升优先级，最里层的括号优先级最高。

全括号表达式：在所有表达式项两边都加上括号，如`A+B*C-D=((A+(B*C))-D)`。方便计算机处理。

前缀表达式：操作符在操作数的前面，如`+AB`

后缀表达式：操作符在操作数的后面，如`AB+`

- 中缀表达式转换为前缀、后缀表达式

```python
# 中缀表达式      前缀表达式      后缀表达式
# (A+B)*C         *+ABC         AB+C*
#  A+B*C          +A*BC         ABC*+
# A+B*C+D        ++A*BCD       ABC*+D+ 
# (A+B)*(C+D)    *+AB+CD       AB+CD+* 
# A*B+C*D        +*AB*CD       AB*CD*+ 
# A+B+C+D        +++ABCD       AB+C+D+ 
```

> 在前缀、后缀表达式中，操作符的次序完全决定了运算的次序，不再有混淆。
>
> 操作符的次序就是离操作数越近的操作符先执行，越远的越后面执行
> 
> 所以在很多情况下，表达式的计算机表示都避免用复杂的中缀形式

- 转换算法步骤

`A+B*C` 先转换为全括号表达式 `(A+(B*C))`

如果是转换为前缀，就是把操作符提到左括号的位置，然后删除右括号，就变为 `+A*BC`

如果是转换为后缀，就是把操作符提到右括号的位置，然后删除左括号，就变为 `ABC*+`

- 通用的中缀转后缀

从左到右扫描逐个字符，使用栈来保存未处理的操作符。这样的话，栈顶的操作符就是最后存进去的，当遇到新的操作符的时候，需要跟栈顶的操作符来比较一下优先级，再进行处理。

约定：中缀表达式是由空格隔开的一系列单词构成（操作符包括：`/*+-()`，操作数单词是大小写字母和数字）

流程：

```python
"""
1、创建空栈用来保存操作符，创建空表用来保存后缀表达式
2、将中缀表达式使用空格分隔开，转换为单词列表
3、从左到右扫描单词列表：
    3-1、单词是操作数，直接添加到后缀表达式列表末尾
    3-2、单词是左括号，压入栈顶
    3-3、单词是右括号，反复弹出栈顶元素，加入到后缀表达式列表末尾，直到碰到左括号
    3-4、单词是操作符，压入栈顶
        3-4-1、在压入之前，要比较其与栈顶操作符的优先级
        3-4-2、如果栈顶操作符优先级高于或等于它，就要反复弹出栈顶操作符，
               加入到后缀表达式列表末尾，直到优先级低于它
        3-4-2、如果栈顶操作符优先级低于它，压入栈顶
4、扫描结束后，把栈中剩余元素依次弹出，加入到后缀表达式列表末尾
5、把后缀表达式列表转换为字符串
"""
```

- 代码实现

```python
def infix_to_postfix(infix_expr: str) -> str:
    # 操作符优先级字典
    operator_precedence = {
        "(": 1,
        "+": 2,
        "-": 2,
        "*": 3,
        "/": 3,
    }

    # 空栈，用来保存运算符
    stack = []
    # 空列表，用来保存后缀表达式结果
    postfix_list = []
    # 将前缀表达式转换为列表
    token_list = infix_expr.split()

    # 遍历循环前缀表达式列表
    for token in token_list:
        # 是操作数，直接放入后缀表达式列表末尾
        if is_operand(token):
            postfix_list.append(token)
        # 是左括号，压入栈顶
        elif token == '(':
            stack.append(token)
        # 是右括号
        elif token == ')':
            # 反复弹出栈顶元素，加入到后缀表达式列表末尾，直到碰到左括号
            # 两个 pop 也会直接把栈中的 ( 直接去掉
            top_token = stack.pop()
            while top_token != '(':
                postfix_list.append(top_token)
                top_token = stack.pop()
        # 是操作符
        else:
            # 在压入之前，要比较其与栈顶操作符的优先级
            token_precedence = operator_precedence[token]
            # 如果栈顶操作符优先级高于或等于它，就要反复弹出栈顶操作符，
            # 加入到后缀表达式列表末尾，直到优先级低于它
            while len(stack) > 0 and operator_precedence[stack[len(stack) - 1]] >= token_precedence:
                postfix_list.append(stack.pop())
            else:
                # 如果栈顶操作符优先级低于它，压入栈顶
                stack.append(token)
    # 把栈中剩余元素依次弹出，加入到后缀表达式列表末尾
    while len(stack) > 0:
        postfix_list.append(stack.pop())
    # 把后缀表达式列表转换为字符串返回
    return " ".join(postfix_list)


# 是否是操作数
def is_operand(token):
    # 操作数的 unicode 数字范围
    #             小写字母    大写字母     数字
    char_list = [[97, 122], [65, 90], [48, 57]]

    for char in char_list:
        if char[0] <= ord(token) <= char[1]:
            return True

    return False
```

#### 后缀表达式求值问题

还是要对后缀表达式从左到右扫描，暂存操作数，遇到操作符，取出最顶上的两个操作数进行计算。

> 需要注意的是，先弹出来的是右操作数，后弹出来的是左操作数，这对于 `/-` 很重要

做完计算之后需要把结果继续压入栈中，遍历结束后，结果就是栈中的唯一元素

- 代码实现

```python
def postfix_eval(postfix_expr: str) -> int or float:
    # 定义空栈，保存操作数
    stack = []
    # 将字符串变为列表
    token_list = postfix_expr.split()

    # 遍历循环
    for token in token_list:
        # 是操作数，压入栈中
        if token in "0123456789":
            stack.append(token)
        # 是操作符
        else:
            # 取出两个操作数
            right_operand = stack.pop()
            left_operand = stack.pop()
            # 将计算结果压入栈中
            stack.append(eval(f'{left_operand}{token}{right_operand}'))

    # 返回结果
    return stack.pop()
```