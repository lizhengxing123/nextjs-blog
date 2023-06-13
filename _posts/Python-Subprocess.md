---
title: 'subprocess 模块'
excerpt: 'subprocess 模块'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-13 16:13:36'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

## subprocess 模块

```python
import subprocess
```

### 执行终端命令

```python
"""
shell=True 表示使用终端来执行
subprocess.PIPE 每次都会创建一个新的管道，每个管道都是独立的
stdout=subprocess.PIPE 命令执行成功之后，将结果丢到管道里
stderr=subprocess.PIPE 命令执行错误之后，将结果丢到管道里
"""
obj = subprocess.Popen('tree', shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# 获取成功数据
res = obj.stdout.read()

# 是 bytes，需要转换
print(res.decode('utf-8'))

# 获取错误数据，如果有的话
err = obj.stderr.read()

# 是 bytes，需要转换
print(err.decode('utf-8'))
```