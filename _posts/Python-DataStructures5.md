---
title: '集合类型'
excerpt: '集合类型'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-10 17:12:13'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

### 集合类型

集合里面的元素必须是不可变对象（数字、字符串、元组），并且里面的顺序是无序的。

可以使用集合进行去重操作和关系运算

#### 定义集合

使用 `{}` 定义集合，会自动去重

```python
s = {1, 2, 3, 3, 3, 4, (13, 42)}
print(s, type(s))  # {1, 2, 3, 4, (13, 42)} <class 'set'>
```

使用 `set` 定义空集合

```python
s1 = set({})
s2 = {}

print(s1, type(s1))  # set() <class 'set'>
print(s2, type(s2))  # {} <class 'dict'>
```

使用 `set` 进行类型转换，可迭代对象都能转换为集合

```python
print(set('hello'))  # {'h', 'l', 'e', 'o'}
print(set([1, 2, 3]))  # {1, 2, 3}
print(set({'hello': '1', 'world': 2}))  # {'world', 'hello'}
```

#### 关系运算

定义两个集合

```python
boy_hobbies = {'看书', '吃饭', '打代码', '练字'}
girl_hobbies = {'打代码', '睡觉', '做饭'}
```

- 取交集：`&`、`intersection`

```python
# {'打代码'}
print(boy_hobbies & girl_hobbies)  
print(boy_hobbies.intersection(girl_hobbies))
```

- 取并集：`|`、`union`

```python
# {'练字', '看书', '睡觉', '吃饭', '打代码', '做饭'}
print(boy_hobbies | girl_hobbies)  
print(boy_hobbies.union(girl_hobbies))
```

- 取差集，取出只存在于前面集合中的元素：`-`、`difference`

```python
# {'练字', '吃饭', '看书'}
print(boy_hobbies - girl_hobbies)  
print(boy_hobbies.difference(girl_hobbies))

# {'睡觉', '做饭'}
print(girl_hobbies - boy_hobbies)  
print(girl_hobbies.difference(boy_hobbies)) 
```

- 对称差集，取出两个集合里面的独有的元素：`^`、`symmetric_difference`

```python
# {'吃饭', '做饭', '看书', '练字', '睡觉'}
print(boy_hobbies ^ girl_hobbies) 
print(boy_hobbies.symmetric_difference(girl_hobbies)) 
```

#### 父子集

定义两个集合

```python
s3 = {1, 2}
s4 = {1, 2, 3}
```

- 判断是否为父集：`>`、`issuperset`

```python
print(s4 > s3)  # True
print(s4.issuperset(s3))  # True
```

- 判断是否为子集：`<`、`issubset`

```python
print(s3 < s4)  # True
print(s3.issubset(s4))  # True
```

#### 其它操作

- 长度：`len`、`__len__`

```python
s = {1, '2', 3, 4, '5'}

print(s.__len__()) # 5
print(len(s)) # 5
```

- 成员运算：`in`、`not in`

```python
s = {1, '2', 3, 4, '5'}

print('2' in s) # True
print('2' not in s) # False
```

- 循环

```python
s = {1, '2', 3, 4, '5'}

for i in s:
  print(i, end=" ") # 1 3 4 5 2 
```

- 更新集合：`update`

```python
s5 = {'a', 'b', 'c'}
s6 = {'a', 'j', 'l'}

s5.update(s6)

print(s5) # {'b', 'j', 'c', 'l', 'a'}
print(s6) # {'j', 'l', 'a'}
```

- 取交集更新集合：`intersection_update`

```python
s5 = {'a', 'b', 'c'}
s6 = {'a', 'j', 'l'}

s5.intersection_update(s6)

print(s5) # {'a'}
print(s6) # {'j', 'l', 'a'}
```

- 取差集更新集合：`difference_update`

```python
s5 = {'a', 'b', 'c'}
s6 = {'a', 'j', 'l'}

s5.difference_update(s6)

print(s5) # {'c', 'b'}
print(s6) # {'j', 'l', 'a'}
```

- 取对称差集更新集合：`symmetric_difference_update`

```python
s5 = {'a', 'b', 'c'}
s6 = {'a', 'j', 'l'}

s5.symmetric_difference_update(s6)

print(s5) # {'c', 'l', 'b', 'j'}
print(s6) # {'j', 'l', 'a'}
```

- 拷贝集合：`copy`

```python
s7 = {1, 2, 3}

s8 = s7.copy()
s7.update({45})

print(s8) # {1, 2, 3}
print(s7) # {1, 2, 3, 45}
```

- 清空集合：`clear`

```python
s7 = {1, 2, 3}

s7.clear()

print(s7) # set()
```

- 删除元素：`pop`

返回被删除的元素，改变集合

```python
s7 = {1, 2, 3}

item = s7.pop()

print(item, s7) # 1 {2, 3}
```

- 删除元素：`remove`

没有返回值，传递不存在的元素会报错 `KeyError`

```python
s7 = {1, 2, 3}

item = s7.remove(2)

print(item, s7) # None {1, 3}
```

- 删除元素：`discard`

没有返回值，传递不存在的元素不会报错

```python
s7 = {1, 2, 3}

item = s7.discard(2)

print(item, s7) # None {1, 3}
```

- 添加元素：`add`

没有返回值，改变集合

```python
s7 = {1, 2, 3}

item = s7.add(24)

print(item, s7) # None {24, 1, 2, 3}
```

- 判断两个集合是否有交集：`isdisjoint`

没交集返回 `True`，有交集返回 `False`

```python
s7 = {1, 2, 3}

res = s7.isdisjoint([12])
res2 = s7.isdisjoint([1, 2])

print(res)  # True
print(res2)  # False
```