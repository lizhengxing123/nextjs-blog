---
title: '字典类型'
excerpt: '字典类型'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-09 15:42:26'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

### 字典类型

键必须是不可变类型，值可以是任意类型。

使用 `{}` 生成字典，如果有相同的 `key` 后面的会覆盖前面的

```python
d = {'name': 'li', 'age': 43, 'age': 42}

print(d, type(d)) # {'name': 'li', 'age': 42} <class 'dict'>
```

使用 `dict` 类创建字典

```python
d = dict(name='li', age=89)

print(d) # {'name': 'li', 'age': 89}
```

使用 `fromkeys` 创建字典

```python
keys = ['a', 'b', 'c']

d = {}.fromkeys(keys, None)

print(d) # {'a': None, 'b': None, 'c': None}
```

将可迭代对象转换为字典，可迭代对象每个元素必须要有两个值

```python
l = [(1, 2), [3, 4]]

print(dict(l)) # {1: 2, 3: 4}
``` 

#### 内置方法

- 按 `key` 取值

访问不存在的 `key` 会报错 `KeyError`

```python
d = {'name': 'li', 'age': 89}

print(d['age']) # 89
```

- 按 `key` 改值

修改不存在的 `key` 会新增

```python
d = {'name': 'li', 'age': 89}

d['age'] = 99
d['gender'] = 'male'

print(d) # {'name': 'li', 'age': 99, 'gender': 'male'}
```

- 使用 `get` 取值

访问不存在的 `key` 不会报错

```python
d = {'name': 'li', 'age': 89}

print(d.get('age1')) # None
```

- 使用 `del` 删除


```python
d = {'name': 'li', 'age': 89}

del d['age']

print(d) # {'name': 'li'}
```

- 使用 `pop` 删除

返回 `key` 对应的值，改变原字典

```python
d = {'name': 'li', 'age': 89}

item = d.pop('name')

print(item, d) # li {'age': 89}
```

- 使用 `popitem` 删除

返回最后一个 `key value` 组成的元组

```python
d = {'name': 'li', 'age': 89}

item = d.popitem()

print(item, d) # ('age', 89) {'name': 'li'}
```

- 使用 `clear` 清空字典

```python
d = {'name': 'li', 'age': 89}

d.clear()

print(d) # {}
```

- 长度

```python
d = {'name': 'li', 'age': 89}

print(d.__len__()) # 2
print(len(d)) # 2
```

- 成员运算

```python
d = {'name': 'li', 'age': 89}

print('name' in d) # True
print('name' not in d) # False
```

- 获取字典 `key` 列表

```python
d = {'name': 'li', 'age': 89}

print(d.keys()) # dict_keys(['name', 'age'])
```

- 获取字典 `value` 列表

```python
d = {'name': 'li', 'age': 89}

print(d.values()) # dict_values(['li', 89])
```

- 获取字典 `key value` 列表

```python
d = {'name': 'li', 'age': 89}

print(d.items()) # dict_items([('name', 'li'), ('age', 89)])
```

- 浅拷贝

```python
d = {'name': 'li', 'age': 89}

print(d.copy()) # {'name': 'li', 'age': 89}
```

- 更新字典

替换原有的数据，增加新的数据

```python
d = {'name': 'li', 'age': 89}
d2 = {'name': 'lizx', 'gender': 'male'}

d.update(d2)

print(d) # {'name': 'lizx', 'age': 89, 'gender': 'male'}
print(d2) # {'name': 'li', 'age': 89}
```

- 设置默认值

如果字典本身有 `key` 对应的 `value`，就返回 `value`。否则返回默认值

```python
d = {'name': 'li', 'age': 89}

print(d.setdefault('name', 'l')) # li
print(d.setdefault('age', 99)) # 89
print(d.setdefault('gender', 'male')) # male

print(d) # {'name': 'li', 'age': 89, 'gender': 'male'}
```



