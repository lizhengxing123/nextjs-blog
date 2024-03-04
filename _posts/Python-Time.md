---
title: '时间模块'
excerpt: '时间模块'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-12 14:41:12'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

## 时间模块

### time

#### 获取时间戳

```python
print(time.time()) # 1686553202.0593321
```

#### 格式化时间

```python
print(time.strftime('%Y-%m-%d %H-%M-%S %A')) # 2023-06-12 15-05-05 Monday

# 使用 X 代替时分秒
print(time.strftime('%Y-%m-%d %X %A')) # 2023-06-12 15:05:00 Monday

# 使用 x 代替年月日
print(time.strftime('%x %X %A')) # 06/12/23 15:05:00 Monday
```

#### 结构化时间

本地时间

```python
print(time.localtime())

"""
time.struct_time(
  tm_year=2023, 年
  tm_mon=6, 月
  tm_mday=12, 日
  tm_hour=15, 时
  tm_min=7, 分
  tm_sec=28, 秒
  tm_wday=0, 星期，0-6
  tm_yday=163, 一年中的第多少天，1-366
  tm_isdst=0 夏令时生效为1，不生效为0，-1表示未知
)
"""
```

世界标准时间，比本地时间慢 `8` 小时

```python
print(time.gmtime())

"""
time.struct_time(
  tm_year=2023, 年
  tm_mon=6, 月
  tm_mday=12, 日
  tm_hour=7, 时
  tm_min=12, 分
  tm_sec=37, 秒
  tm_wday=0, 星期，0-6
  tm_yday=163, 一年中的第多少天，1-366
  tm_isdst=0 夏令时生效为1，不生效为0，-1表示未知
)
"""
```

### datetime

#### 获取当前时间

```python
res = datetime.datetime.now()

print(res) # 2023-06-12 15:16:14.477618

# 除去毫秒
print(res.replace(microsecond=False)) # 2023-06-12 15:16:14
```

#### 时间加减

提供了周、天、时、分、秒、毫秒，没有提供年、月

```python
res1 = datetime.datetime.now() + datetime.timedelta(days=10)

print(res1) # 2023-06-22 15:25:29.751360

res2 = datetime.datetime.now() - datetime.timedelta(weeks=10)

print(res2) # 2023-06-05 15:26:55.959645
```

### 转换

```python
"""
时间戳 --localtime/gmtime--> 结构化时间 --strftime--> 格式化时间

时间戳 <-------mktime------- 结构化时间 <--strptime-- 格式化时间
"""
```

#### 时间戳转结构化时间

```python
res = 111111111

res1 = time.localtime(res)
res2 = time.gmtime(res)

print(res1)
print(res2)

"""
1973 7 10 8 11 51 1 191 0
1973 7 10 0 11 51 1 191 0
"""
```

#### 结构化时间转格式化时间

```python
res3 = time.strftime('%Y-%m-%d %H:%M:%S', res1)

print(res3) # 1973-07-10 08:11:51
```

#### 格式化时间转结构化时间

```python
res4 = time.strptime(res3, '%Y-%m-%d %H:%M:%S')

print(res4)
"""
1973 7 10 8 11 51 1 191 -1
"""
```

#### 结构化时间转时间戳

```python
res5 = time.mktime(res4)

print(res5) # 111111111.0
```

### 其它

#### 延时

```python
time.sleep(2)
```

#### 格式化时间

不能自定义格式

```python
print(time.asctime())  # Mon Jun 12 15:39:25 2023
print(time.ctime())    # Mon Jun 12 15:39:25 2023
```

#### 获取当前时间

```python
print(datetime.datetime.now())     # 2023-06-12 15:40:12.570689
print(datetime.datetime.utcnow())  # 2023-06-12 07:40:12.570689
```

#### 根据时间戳转换时间

```python
print(datetime.datetime.fromtimestamp(111111111))  # 1973-07-10 08:11:51
```