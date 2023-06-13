---
title: '序列化和反序列化'
excerpt: '序列化和反序列化'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-13 15:15:50'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

## 序列化和反序列化

### json 模块

全平台使用

```python
import json
```

#### 序列化

```python
dic = {
  'name': '李正星',
  'age': 18,
  'salary': 9.8,
  'married': False,
  't': (1, 2),
  # 's': {3, 4},
  'hobbies': ['吃饭', '喝酒', '烫头']
}
```

- `dumps`

> **Tips**
>
> 1. 存在集合会报错（`TypeError: Object of type set is not JSON serializable`），因为其他平台可能没有集合这个数据类型
>
> 2. 元组会被转化为列表

```python
json_res = json.dumps(dic)

print(json_res)

"""
{"name": "\u674e\u6b63\u661f", "age": 18, "salary": 9.8, "married": false, "t": [1, 2], "hobbies": ["\u5403\u996d", "\u559d\u9152", "\u70eb\u5934"]}
"""

# 使用 ensure_ascii=False 阻止将汉字转换成 unicode
json_res2 = json.dumps(dic, ensure_ascii=False)

print(json_res2)
"""
{"name": "李正星", "age": 18, "salary": 9.8, "married": false, "t": [1, 2], "hobbies": ["吃饭", "喝酒", "烫头"]}
"""
```

- `dump`

将数据序列化存入文件中

```python
with open('data/test1.json', mode='wt', encoding='utf-8') as f:
  json.dump(dic, f, ensure_ascii=False)
```

#### 反序列化

- `loads`

`unicode` 也会转化为汉字

```python
dic2 = json.loads(json_res)

print(dic2)
"""
{'name': '李正星', 'age': 18, 'salary': 9.8, 'married': False, 't': [1, 2], 'hobbies': ['吃饭', '喝酒', '烫头']}
"""
```

- `load`

```python
with open('data/test1.json', mode='rt', encoding='utf-8') as f:
    print(json.load(f))

# bytes 类型也能转换
with open('data/test1.json', mode='rb') as f:
    print(json.load(f))

"""
{'name': '李正星', 'age': 18, 'salary': 9.8, 'married': False, 't': [1, 2], 'hobbies': ['吃饭', '喝酒', '烫头']}
"""
```

### pickle 模块

只针对 `python`

```python
import pickle
```

#### 序列化

```python
dic = {
  'name': '李正星',
  'age': 18,
  'salary': 9.8,
  'married': False,
  't': (1, 2),
  's': {3, 4},
  'hobbies': ['吃饭', '喝酒', '烫头']
}
```

- `dumps`

```python
# protocol=0 防止保存到文件里乱码
pickle_res = pickle.dumps(dic, protocol=0)

print(pickle_res)

"""
b'(dp0\nVname...
"""
```

- `dump`

```python
with open('data/test2.json', mode='wb') as f:
  pickle.dump(dic, f, protocol=0)
```

#### 反序列化

- `loads`

```python
dic2 = pickle.loads(pickle_res)

print(dic2)
"""
{'name': '李正星', 'age': 18, 'salary': 9.8, 'married': False, 't': (1, 2), 's': {3, 4}, 'hobbies': ['吃饭', '喝酒', '烫头']}
"""
```

- `load`

```python
with open('data/test2.json', mode='rb') as f:
  print(pickle.load(f))

"""
{'name': '李正星', 'age': 18, 'salary': 9.8, 'married': False, 't': (1, 2), 's': {3, 4}, 'hobbies': ['吃饭', '喝酒', '烫头']}
"""
```