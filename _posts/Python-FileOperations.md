---
title: '文件'
excerpt: '文件'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-11 09:16:37'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

## 文件

### 转义字符

- `\`：续行符

```python
print("as\
      as\
      as")
# as      as      as
```

- `\\`：反斜杠

```python
print("\\") # \
```

- `\'`：单引号

```python
print('\'') # '
```

- `\"`：双引号

```python
print("\"") # "
```

- `\a`：响铃

```python
print("\a")
```

- `\b`：退格

```python
print("hello\bworld")  # hellworld
```

- `\000`：空

```python
print("\000")
```

- `\n`：换行符

```python
print("a\nb")
# a
# b
```

- `\t`：横向制表符

```python
print("hello\tworld")  # hello 	world
```

- `\v`：纵向制表符

```python
print("hello\vworld")
```

- `\r`：回车符，只保留 `\r` 后面的内容

```python
print("hello\rworld") # world
print("hello\rwor") # wor
print("he\rworld") # world
```

- `\f`：换页

- `\yyy`：八进制数

```python
print('\127') # W
```

- `\xyy`：十六进制数

```python
print('\x43') # C
```

### 文件操作

#### 打开文件

可以使用绝对路径，也可以使用相对路径，默认模式是 `rt`，默认字符编码时 `encoding='utf-8'`

```python
# 绝对路径
# f = open('/Users/lizhengxing/Desktop/code/python/basic/data/a.txt')

# 相对路径
f = open('data/a.txt', mode='rt', encoding='utf-8')

print(f, type(f))
'''
<_io.TextIOWrapper name='data/a.txt' mode='rt' encoding='utf-8'>
<class '_io.TextIOWrapper'>
'''
```

#### 操作文件

使用 `rt` 模式打开的文件，只能读

```python
res = f.read()

print(res)
```

#### 关闭文件

文件使用完之后要及时关闭，避免浪费系统资源

```python
f.close()
```

### `with` 上下文管理器

在子代码执行完之后，会自动关闭文件

```python
with open("data/a.txt", mode="rt", encoding="utf-8") as f:
  res = f.read()
  print(res)
```

也可以打开多个文件

```python
with open("data/a.txt", mode="rt", encoding="utf-8") as f, \
        open("data/b.txt", mode="rt", encoding="utf-8") as f2:
  res = f.read()
  print(res)

  res2 = f2.read()
  print(res2)
```

### 文件模式

#### 控制文件读写操作的模式

- `r`：只读模式
- `w`：只写模式
- `a`：追加模式
- `+`：`r+`、`w+`、`a+`


#### 控制文件读写内容的模式

- `t`

读写都是以字符串(`unicode`)为单位的，可以指定编码格式 `encoding='utf-8'`，只针对文本文件。

- `b`

`bytes`/二进制模式，主要针对图片或者视频文件


#### `rt` 只读模式

打开不存在的文件会报错 `FileNotFoundError`

```python
with open('c.txt', mode='rt', encoding='utf-8') as f:
  pass
```

连续 `read` 两次，第二次拿不到内容。

这是因为第一次 `read` 的时候文件指针在开头，然后移动到末尾，把整个文件读取出来。

第二次 `read` 的时候，文件指针就在末尾，就什么都读不到了

```python
with open('data/a.txt', mode='rt', encoding='utf-8') as f:
  print('{0:*^40}'.format('第一次读取'))
  res = f.read()
  print(res)  

  print('{0:*^40}'.format('第二次读取'))
  res = f.read()
  print(res)  
```

使用循环读取多行数据

```python
with open('data/user.txt', mode='rt', encoding='utf-8') as f:
  for line in f:
    # 每一行后面都有一个空格
    print(line.split('----'))  # ['1241276517', '123456\n']

    # 使用 strip 可以去除字符串两边的空白字符
    print(line.strip().split('----'))  # ['1241276517', '123456']
```

#### `wt` 只写模式

打开不存在的文件会创建这个文件，打开已存在的文件会清空这个文件，文件指针都在开头位置。

使用 `read` 会报错 `io.UnsupportedOperation: not readable`

```python
with open('data/c.txt', mode='wt', encoding='utf-8') as f:
  f.write('西风吹老洞庭波，\n')
  f.write('一夜湘君白发多。\n')
```

#### `at` 追加写模式

打开不存在的文件会创建这个文件，文件指针在开头位置。

打开已存在的文件，文件指针会移动到末尾位置。

使用 `read` 会报错 `io.UnsupportedOperation: not readable`

```python
with open('data/c.txt', mode='at', encoding='utf-8') as f:
  f.write('醉后不知天在水，\n')
  f.write('满船清梦压星河。\n')
```

#### `r+t` 读写模式

以读为主

打开不存在的文件会报错 `FileNotFoundError`

```python
with open('data/d1.txt', mode='r+t', encoding='utf-8') as f:
  # 文件指针在开头，如果文件存在内容，前三个字符会被覆盖为 123
  f.write('123')

  # 读取文件，文件指针移动到末尾
  f.read()
  
  # 会在文件最后增加 456
  f.write('456')
```

#### `w+t` 读写模式

以写为主。

打开不存在的文件会创建这个文件，打开已存在的文件会清空这个文件，文件指针都在开头位置。

```python
with open('data/e.txt', mode='w+t', encoding='utf-8') as f:
  f.write('123\n')
  f.write('456\n')

  res = f.read()

  # 由于之前使用 write 写入文件，会使文件指针在末尾，所以读取不到内容
  print(res)
```

#### `a+t` 读写模式

以追加写为主。

打开不存在的文件会创建这个文件，文件指针在开头位置。

打开已存在的文件，文件指针会移动到末尾位置。

```python
with open('data/e.txt', mode='a+t', encoding='utf-8') as f:
  res = f.read()

  # 打开已存在的文件，会使文件指针在末尾，所以读取不到内容
  print(res)
```

#### `xt` 只写模式

打开不存在的文件会创建这个文件，文件指针在开头位置

打开已存在的文件会报错 `FileExistsError`

```python
with open('data/c.txt', mode='xt', encoding='utf-8') as f:
  f.write('333')
```

#### `rb` 只读模式

可以读取任意类型的文件，最后转换为二进制（`bytes`）

```python
with open('data/1.png', mode='rb') as f, \
        open('data/c.txt', mode='rb') as f2:
  res = f.read()
  print(res, type(res))  # b'\x89PNG\r\n\x1a....  <class 'bytes'>

  res2 = f2.read()
  print(res2, type(res2))  # b'\xe9\x86\x89....  <class 'bytes'>
  print(res2.decode(encoding='utf-8'))
```

#### `wb` 只写模式

```python
with open('data/f.txt', mode='wb') as f:
  f.write('喔唷'.encode('utf-8'))
```

#### 简易拷贝功能

```python
old_path = input('请输入原文件路径：').strip()
new_path = input('请输入新文件路径：').strip()

with open(fr'{old_path}', mode='rb') as f1, \
        open(fr'{new_path}', mode='wb') as f2:
  while 1:
    # 指定每次读 1024 个字节
    res = f1.read(1024)

    if not res:
        break
    
    f2.write(res)
```

#### 读取一行和多行

- `readline`：读取一行
- `readlines`：读取多行

```python
with open('data/c.txt', mode='rt', encoding='utf-8') as f:
# readline
while True:
    res = f.readline()
    if not res:
        break
    print(res)

# readlines
res = f.readlines()
print(res)
```

#### `writelines` 写入多行

- `t` 模式

```python
with open('data/g.txt', mode='wt', encoding='utf-8') as f:
    f.writelines(['1\n', 'w\n', '2\n'])
```

- `b` 模式

使用 `b` 将数字和英文编码

使用 `bytes` 或者 `encode` 将中文编码
```python
with open('data/i.txt', mode='wb') as f:
  l = [
      b'1\n',
      b'w\n',
      b'2\n',
      '人\n'.encode(encoding='utf-8'),
      bytes('类\n', encoding='utf-8')
  ]

  f.writelines(l)
```

### 其他知识点

```python
with open('data/i.txt', mode='wt', encoding='utf-8') as f:
    # f.write('b')

    # 立马将数据写到硬盘中
    # f.flush()

    # 判断文件是否可读
    print(f.readable())  # False

    # 判断文件是否可写
    print(f.writable())  # True

    # 判断文件是否已经关闭
    print(f.closed)  # False

    # 获取文件编码方式，如果是 b 模式则没有该属性
    print(f.encoding)  # utf-8

    # 获取文件名称
    print(f.name)  # data/i.txt
```

### 文件指针

文件指针每次移动的单位都是字节。

只有 `t` 模式下的 `read(n)` 中这个 `n` 代表字符个数。

使用 `seek` 控制文件指针移动

使用 `tell` 获取文件指针位置

```python
"""
使用 f.seek 控制文件指针移动
f.seek(移动的字节数, 参照位置)

假设文件内容为 lzx李正星 共12个字节，使用 rb 模式打开

1、模式 0，参照位置为文件开头
f.seek(5, 0) # 文件指针在第 5 个字节位置
f.seek(2, 0) # 文件指针在第 2 个字节位置

2、模式 1，参照位置为当前位置，假设当前位置为 0
f.seek(5, 1) # 文件指针在第 5 个字节位置
f.seek(2, 1) # 文件指针在第 7 个字节位置

3、模式 2，参照位置为文件末尾
f.seek(-5, 2) # 文件指针在第 7 个字节位置
f.seek(-3, 2) # 文件指针在第 9 个字节位置
"""

# 模式 0
with open('data/i.txt', mode='rb') as f:
  f.seek(5, 0)
  print(f.tell())  # 5

  f.seek(2, 0)
  print(f.tell())  # 2

  res = f.read() # 从第2个字符读到末尾
  s = res.decode(encoding='utf-8')  

  print(s) # x李正星

# 模式 1
with open('data/i.txt', mode='rb') as f:
  f.seek(5, 1)
  print(f.tell())  # 5

  f.seek(2, 1)
  print(f.tell())  # 7

  res = f.read() # 从第7个字符读到末尾
  s = res.decode(encoding='utf-8')  
  
  print(s) # 不是完整的字符，会报错 UnicodeDecodeError

# 模式 2
with open('data/i.txt', mode='rb') as f:
  f.seek(-5, 2)
  print(f.tell())  # 7

  f.seek(-3, 2)
  print(f.tell())  # 9

  res = f.read() # 从第9个字符读到末尾
  s = res.decode(encoding='utf-8')  
  
  print(s) # 星
```

### 修改文件

- 直接把文件读入内存，在内存中改了之后再写入，对内存占用大

```python
with open('data/a.txt', mode='rt', encoding='utf-8') as f:
  res = f.read()
  new_res = res.replace('好', '不好')

with open('data/a.txt', mode='wt', encoding='utf-8') as f:
  f.write(new_res)
```

- 创建新的文件，修改之后替换原文件

```python
import os

with open('data/c.txt', mode='rt', encoding='utf-8') as f, \
      open('data/.c.txt.swap', mode='wt', encoding='utf-8') as f1:
  for line in f:
    res = line.replace('圈圈', '全全')
    f1.write(res)

os.remove('data/c.txt')
os.rename('data/.c.txt.swap', 'data/c.txt')
```

### 监控文件数据变化

```python

import time

with open('data/user.log', mode='rb') as f:
  # 将文件指针移动到末尾
  f.seek(0, 2)

  # 监控文件是否有新增数据
  while True:
    res = f.readline()

    if res:
        print(res.decode('utf-8'), end='')
        
    # 延时 0.2s
    time.sleep(0.2)
```