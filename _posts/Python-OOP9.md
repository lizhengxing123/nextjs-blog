---
title: '异常处理'
excerpt: '异常处理'
coverImage: '/assets/blog/python/oop.jpeg'
date: '2023-06-20 14:31:47'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/oop.jpeg'
type: 'Python'
---

## 异常处理

```python
"""
try:
    子代码块
    子代码块
    子代码块
    子代码块
except 异常类型1 as e:
    子代码块
except 异常类型2 as e:
    子代码块
except 异常类型3 as e:
    子代码块
except Exception as e: # 匹配所有异常，相当于 except:
    子代码块
else: # 会在没有异常的时候执行，不和和 try 单独使用，必须搭配 except
    子代码块
finally: # 不管有没有异常都会执行
    子代码块
"""
```