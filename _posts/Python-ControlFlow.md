---
title: '控制流'
excerpt: '控制流'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-07 17:13:32'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

## 控制流

在 `python` 中，有三种控制流语句：`if` `for` 和 `while`

### if 语句 

`if` 语句用以检查条件

```python
num = 45
guess = int(input('请输入数字：').strip())

if guess > num:
  print('猜大了')
elif guess < num:
  print('猜小了')
else:
  print('猜对了')
```

### while 语句 

`while` 语句用以在条件为真的情况下重复执行某块语句

```python
num = 45

while True:
  guess = int(input('请输入数字：').strip())

  if guess > num:
    print('猜大了')
  elif guess < num:
    print('猜小了')
  else:
    print('猜对了')
    break
```

当循环正常结束（不使用 `break` 退出循环），就会执行 `else` 里面的代码

```python
num = 45
running = True

while running:
  guess = int(input('请输入数字：').strip())

  if guess > num:
    print('猜大了')
  elif guess < num:
    print('猜小了')
  else:
    running = False
else:
  print('猜对了')
```

### for 循环

`for...in` 在可迭代对象上进行迭代，会遍历可迭代对象的每一项

```python
for i in 'hello':
  print(i) # h e l l o
```

当循环正常结束（不使用 `break` 退出循环），就会执行 `else` 里面的代码


```python
for i in 'hello':
  print(i) # h e l l o
else:
  print('循环正常结束') # 循环正常结束
```

### break 语句

中断循环，`else` 语句不会执行

### continue 语句

跳过本次循环，继续执行下次循环，`else` 语句会执行