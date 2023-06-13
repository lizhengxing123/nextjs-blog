---
title: '正则表达式'
excerpt: '正则表达式'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-13 16:56:35'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

## 正则表达式

```python
import re
```

- `flags`

```python
#   flags
#   re.S 让 . 匹配所有字符（. 默认不匹配换行符）
#   re.I 不区分大小写
#   re.M 多行模式
res = re.findall('.+', '123\n456\n789\n', flags=re.S)

print(res)  # ['123\n456\n789\n']
```

- 返回 `match` 对象

```python
res2 = re.search('(\d{3,4})-(\d{7,8})', 'tel:0931-2345678')
print(res2)  # <re.Match object; span=(4, 16), match='0931-2345678'>
print(res2.group())  # 0931-2345678
print(res2.group(1))  # 0931
print(res2.group(2))  # 2345678
print(res2.span())  # (4, 16)
```

- 返回 `match` 迭代器

```python
res3 = re.finditer('(\d{3,4})-(\d{7,8})', 'tel:0931-2345678 tel:0932-8889999')
for i in res3:
    print(i.group(1))  # 0931  0932
    print(i.group(2))  # 2345678  8889999
```

- `sub` 替换

```python
def des(m):
    return f'{m.group(1)}-{m.group(2)[:2]}***{m.group(2)[-2:]}'


res4 = re.sub('(\d{3,4})-(\d{7,8})', des, 'tel:0931-2345678 tel:0932-8889999')

print(res4)  # tel:0931-23***78 tel:0932-88***99
```

- `split` 拆分

```python
res5 = re.split('\W+', 'qw , !aoso, ***sax ^opl')
print(res5)  # ['qw', 'aoso', 'sax', 'opl']
```