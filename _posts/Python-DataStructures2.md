---
title: '列表类型'
excerpt: '列表类型'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-09 10:35:32'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

### 列表类型

列表是一种用于保存一系列有序项目的集合。

使用 `[]` 定义

```python
l = [1, 2, 3, 4]

print(type(l)) # <class 'list'>
```

使用 `list` 类转换，可迭代对象（字符串、字典、元组、列表...）都可以转换为列表

```python
print(list('hello')) # ['h', 'e', 'l', 'l', 'o']

print(list({'name': 'lzx', 'age': 34})) # ['name', 'age']

print(list({1, 2, 3})) # [1, 2, 3]

print(list((1, 2, 3))) # [1, 2, 3]
```

#### 内置方法

- 按索引取值、改值

索引可以使用负数，从 `-1` 开始

```python
nameList = ['李正星', '李天清', '李清梦']

print(nameList[1]) # 李天清
print(nameList[-1]) # 李清梦

print(nameList[1] = '李星星')
print(nameList[1]) # 李星星
```

- 追加元素

改变原列表，没有返回值

```python
nameList = ['李正星', '李天清', '李清梦']

nameList.append('李白')
print(nameList) # ['李正星', '李天清', '李清梦', '李白']
```

- 在列表中插入值

改变原列表，没有返回值。第一个参数是插入的位置，可以使用负数，从 `-1` 开始，第二个参数是插入的值

```python
nameList = ['李正星', '李天清', '李清梦']

nameList.insert(-1, '李白')
print(nameList) # ['李正星', '李天清', '李白', '李清梦']

nameList.insert(1, '李白')
print(nameList) # ['李正星', '李白', '李天清', '李白', '李清梦']
```

- 连接一个可迭代对象

会改变原列表，没有返回值

```python
nameList = ['李正星', '李天清', '李清梦']

nameList.extend('hello')
nameList.extend({'name': 'lzx', 'age': 34})
nameList.extend({1, 2, 3})
nameList.extend((4, 5, 6))

print(nameList)
# ['李正星', '李天清', '李清梦', 'h', 'e', 'l', 'l', 'o', 'name', 'age', 1, 2, 3, 4, 5, 6]
```

- 连接两个列表

使用 `+` 连接两个列表，返回新的列表

```python
l1 = list({1, 2, 3})
l2 = list((4, 5, 6))

l3 = l1 + l2
print(l3, type(l3)) # [1, 2, 3, 4, 5, 6] <class 'list'>
```

- `del`

使用 `del` 删除列表项，会改变原列表

```python
nameList = ['李正星', '李天清', '李清梦']

del nameList[1]

print(nameList) # ['李正星', '李清梦']
```

- `pop`

使用 `pop` 删除列表项，默认删除最后一项。会改变原列表，返回被删除项

```python
nameList = ['李正星', '李天清', '李清梦']

item1 = nameList.pop()

print(item1, nameList) # 李清梦 ['李正星', '李天清']
```

可以传递索引，指定删除项。

```python
nameList = ['李正星', '李天清', '李清梦']

item1 = nameList.pop(1)

print(item1, nameList) # 李天清 ['李正星', '李清梦']
```

- `remove`

使用 `remove` 删除列表项，会改变原列表，没有返回值。

需要传递一个值，这个值必须在列表内，不在列表内会报错 `ValueError: list.remove(x): x not in list`

```python
nameList = ['李正星', '李天清', '李清梦']

item1 = nameList.remove('李正星')

print(item1, nameList) # None ['李天清', '李清梦']
```

- 切片

和字符串类似，顾头不顾尾。浅拷贝，返回新的列表，不会改变原列表。

```python
nameList = ['李正星', '李天清', '李清梦']

print(nameList[0:1])  # ['李正星']

#   也可指定步长
print(nameList[0:3:2])  # ['李正星', '李清梦']

#   还可指定反向步长
print(nameList[2:0:-2])  # ['李清梦']

print(nameList[:]) # ['李正星', '李天清', '李清梦']

print(nameList[::-1]) # ['李清梦', '李天清', '李正星']
```

- 长度

```python
nameList = ['李正星', '李天清', '李清梦']

print(nameList.__len__()) # 3
print(len(nameList)) # 3
```

- 成员运算

```python
nameList = ['李正星', '李天清', '李清梦']

print('李正星' in nameList) # True
print('李正星' not in nameList) # False
```

- 循环

在循环过程中，不能在子代码块里面修改列表

```python
nameList = ['李正星', '李天清', '李清梦']

for name in nameList:
  print(name, end=" ") # 李正星 李天清 李清梦
```

- 统计元素出现的次数

```python
l = list('hello')

print(l.count('l')) # 2
```

- 查看元素的索引

列表中不存在该元素会报错 `ValueError: '李天清1' is not in list`

```python
nameList = ['李正星', '李天清', '李清梦']

print(nameList.index('李天清')) # 1
```

可以指定查找的开始索引和结束索引

```python
nameList = ['李正星', '李天清', '李清梦']

print(nameList.index('李天清', 1, 4)) # 1
```

- 清空列表

```python
nameList = ['李正星', '李天清', '李清梦']

nameList.clear()

print(nameList) # []
```

- 反转列表



```python
nameList = ['李正星', '李天清', '李清梦']

# 不会改变原列表
print(nameList[::-1]) # ['李清梦', '李天清', '李正星']

# 会改变原列表
nameList.reverse()
print(nameList) # ['李清梦', '李天清', '李正星']
```

- 列表排序

会改变原列表，且只能排序同类型，不同类型的排序会报错 `TypeError`

不传参数默认升序

```python
numList = [2, 34, 56, 12, 34, 54, 90, 12, 23]

numList.sort()
print(numList) # [2, 12, 12, 23, 34, 34, 54, 56, 90]
```

使用 `reverse=True` 降序排列

```python
numList = [2, 34, 56, 12, 34, 54, 90, 12, 23]

numList.sort(reverse=True)
print(numList) # [90, 56, 54, 34, 34, 23, 12, 12, 2]
```

字符串会按照 `ASCII` 表来进行排序

```python
strList = ['asd', 'vdc', 'iop', 'los']

strList.sort()
print(strList)  # ['asd', 'iop', 'los', 'vdc']

strList.sort(reverse=True)
print(strList)  # ['vdc', 'los', 'iop', 'asd']
```

#### 队列

先进先出(`FIFO`)的数据结构

```python
queue = []

# 入队
queue.append('1')
queue.append('2')
queue.append('3')
print(queue) # ['1', '2', '3']

# 出队
print(queue.pop(0)) # 1
print(queue.pop(0)) # 2
print(queue.pop(0)) # 3

print(queue) # []
```

#### 栈

后进先出(`LIFO`)的数据结构

```python
stack = []

# 入栈
stack.append('1')
stack.append('2')
stack.append('3')
print(stack) # ['1', '2', '3']

# 出栈
print(stack.pop()) # 3
print(stack.pop()) # 2
print(stack.pop()) # 1

print(stack) # []
````