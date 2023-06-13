---
title: '猴子补丁'
excerpt: '猴子补丁'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-13 17:09:18'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

## 猴子补丁

使用功能更强的模块替换掉功能弱的模块

### 使用 ujson 替换 json

```python
import json
import ujson


#   替换功能
def monkey_patch_json():
    json.__name__ = 'ujson'
    json.dumps = ujson.dumps
    json.loads = ujson.loads


monkey_patch_json()
```