---
title: '反射机制'
excerpt: '反射机制'
coverImage: '/assets/blog/python/oop.jpeg'
date: '2023-06-19 10:32:34'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/oop.jpeg'
type: 'Python'
---

## 反射机制

- `hasattr`
- `getattr`

```python
def get_age(obj):
  if hasattr(obj, 'age'):
    return getattr(obj, 'age')
  else:
    print('没有 age')
```

可以给 `getattr` 设置默认值

```python
print(getattr(18, 'age', None))  # None
```

获取 `age`

```python
class Person:

  def __init__(self, name, age):
    self.name = name
    self.age = age

obj = Person('lzx', 36)
print(get_age(obj)) # 36
```

- `setattr`

```python
setattr(obj, 'gender', 1)

print(obj.__dict__)
# {'name': 'lzx', 'age': 36, 'gender': 1}
```

- `delattr`

```python
delattr(obj, 'gender')

print(obj.__dict__)
# {'name': 'lzx', 'age': 36}
```