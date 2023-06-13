---
title: 'hash 模块'
excerpt: 'hash 模块'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-13 16:17:26'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

## hash 模块

是一类算法，经过运算后，返回一串哈希值，内容稍有变化，哈希值也会发生变化

相同的内容，返回的哈希值是一样的

```python
import hashlib
```

有 `md5`、`sha256`、`sha512` 等哈希算法

```python
# 必须编码
h1 = hashlib.sha256('123'.encode('utf-8'))

# 可以 update 多次
h1.update('li'.encode('utf-8'))
h1.update('zx'.encode('utf-8'))

# 获取哈希值
print(h1.hexdigest())
# 6a4494fb4774c00f8fd1517cb41b887f632756b6a8998f0ac532d42ba06b1490
```

内容相同，算法一致，获取到的哈希值也相同

```python
h2 = hashlib.sha256('123lizx'.encode('utf-8'))

print(h2.hexdigest())
# 6a4494fb4774c00f8fd1517cb41b887f632756b6a8998f0ac532d42ba06b1490
```

### 文件完整性校验

如果是大文件，可以每次在十分之一处取100个字节，进行哈希运算

```python
import os
import hashlib

h3 = hashlib.sha512()

file_size = os.path.getsize('data/user.log')

with open('data/user.log', mode='rb') as f:
  # 计算十分之一的大小
  one_tenth = file_size // 10

  for i in range(10):
    # 移动文件指针，相较于开头位置
    f.seek(i * one_tenth, 0)

    # 读取 100 个字节
    res = f.read(100)

    # 更新哈希
    h3.update(res)

  # 得到计算之后的哈希
  print(h3.hexdigest())

"""
31527b74dd24bbd81504620a8ad57cc2f3fb53e7e7ccd289db5791467fc0fb94a83c2ac924ce1b0afe25fd5919c9522418ca03e7c6965ababe9fd60e217ae071
"""
```

### 密码加盐

在密码上加一些东西

```python
import hashlib

h4 = hashlib.sha256()

pwd = 'lizhengxing'

# 截取
h4.update(pwd[:4].encode('utf-8'))

# 加盐
h4.update('哗啦啦'.encode('utf-8'))

# 截取
h4.update(pwd[4:].encode('utf-8'))

# 加盐
h4.update('的流'.encode('utf-8'))

print(h4.hexdigest())
# a95f02f1ef5ef076d47ec6f3a3241cdce38eb7e7e0308cec353e843b43cbbe1d
```