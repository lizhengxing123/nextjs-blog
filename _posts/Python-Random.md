---
title: 'random 模块'
excerpt: 'random 模块'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-12 16:30:02'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

## random 模块

```python
import random
```

- 随机生成 `[0, 1)` 之间的随机小数

```python
print(random.random()) # 0.6224443009308556
```  

- 根据范围随机生成小数，左闭右开 `[3.2, 8)`

```python
print(random.uniform(3.2, 8)) # 5.133844129571904
```  

- 根据范围随机生成整数，左闭右闭，两边都能取上 `[3, 8]`

```python
print(random.randint(3, 8)) # 8
```  

- 根据范围随机生成整数，左闭右开 `[3, 8)`

```python
print(random.randint(3, 8)) # 3
``` 

- 从一个序列中随机选择一个元素

```python
print(random.choice('hello')) # o
``` 

- 打乱可变类型的顺序

```python
l = [1, 3, 5, 7, 9]

random.shuffle(l)

print(l) # [3, 5, 9, 1, 7]
```

### 案例

随机生成密码，必须包含大写字母、小写字母、数字和特殊符号，4位以上

```python
import random 

def pwd_generator(length=16):
  if(length < 4):
    return ''

  # 密码定义数组存储，方便后面打乱顺序
  pwd = []

  # 每种类型的 unicode 数字范围
  #             小写字母    大写字母     数字     特殊符号
  char_list = [[97, 122], [65, 90], [48, 57], [33, 47]]

  # 每种类型必须要有
  for char_li in char_list:
    # 转换为字符串
    char = chr(random.randint(*char_li))

    pwd.append(char)

  # 剩下的随机生成
  for _ in range(length - len(char_list)):
    # 从 char_list 随机选择一个元素
    random_list = random.choice(char_list)

    # 转换为字符串
    random_char = chr(random.randint(*random_list))

    pwd.append(random_char)

  # 打乱顺序
  random.shuffle(pwd)

  return ''.join(pwd)

print(pwd_generator()) # q1%D4P8VMmYI0k%/

print(pwd_generator(4)) # xR7'
```