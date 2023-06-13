---
title: 'os和sys'
excerpt: 'os和sys'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-12 17:30:01'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

### os 模块

```python
import os
```

- 获取当前工作目录

```python
print(os.getcwd()) # /code/python/...
```

- 切换工作目录

```python
os.chdir('/data')

print(os.getcwd()) # /code/python/.../data
```

- 获取指定目录下的所有文件和文件夹

```python
print(os.listdir('data')) # ['a.txt', 'dir',  ...]
```

- 创建文件夹

如果该文件夹已存在会报错 

```python
os.mkdir('data/dir')
```

- 创建多层文件夹

```py
os.makedirs('test/test1/test2')
```

- 删除文件

```py
os.remove('a.txt')
```

- 删除空文件夹

```py
os.remove('test')
```

- 重命名文件/文件夹

```python
os.rename('name', 'newName')
```

- 运行终端命令

```python
os.system('tree')
```

- 获取系统环境变量

```python
os.environ
# environ({'PATH': '/usr/l ..., 'HOME': '/Users/lizhengxing'})
```

- 获取系统环境变量某个值

**区分大小写**

```python
# /Users/lizhengxing

print(os.environ['HOME'])
print(os.environ.get('HOME'))
print(os.getenv('HOME'))
```

- 获取文件/目录信息

```python
os.stat('data')
"""
os.stat_result(
  st_mode=16877, 文件模式，包括文件类型和文件模式位（权限位） 
  st_ino=55868574, 与平台有关
  st_dev=16777221, 文件所在设备的标识符
  st_nlink=21, 硬链接的数量
  st_uid=501, 文件所有者的用户 id
  st_gid=20, 文件所有者的用户组 id
  st_size=672, 文件大小
  st_atime=1686450734, 最近访问时间，时间戳以秒为单位
  st_mtime=1686450720, 最近修改时间，时间戳以秒为单位
  st_ctime=1686450720 与平台有关，windows上指创建时间，时间戳以秒为单位
)
"""
```

- 获取当前系统

`mac/linux --> posix` 、 `windows --> nt` 

```python
os.name
```

- 分割路径

```python
print(os.path.split('/code/python/basic/01-变量.py'))
# ('/code/python/basic', '01-变量.py')
```

- 获取路径的父路径

```python
print(os.path.dirname('/code/python/basic/01-变量.py'))
# /code/python/basic
```

- 拿到最后的一个路径

```python
print(os.path.basename('/code/python/basic/01-变量.py')) 
# 01-变量.py

print(os.path.basename('/code/python/basic/01-变量.py')) 
# basic
```

- 查看路径是否存在

```python
print(os.path.exists('/code/python/basic/01-变量.py')) 
# True
```

- 查看路径是否为绝对路径

```python
print(os.path.isabs('/code/python/basic/01-变量.py')) 
# True
```

- 查看路径是否为文件

```python
print(os.path.isfile('/code/python/basic/01-变量.py')) 
# True
```

- 查看路径是否为目录

```python
print(os.path.isdir('/code/python/basic/01-变量.py')) 
# False
```

- 将多个路径拼接起来

```python
print(os.path.join('/code/python/basic/', 'test', 'a', '01-变量.py')) 
# /code/python/basic/test/a/01-变量.py
```

- 查看路径最后访问时间

```python
print(os.path.getatime('/code/python/basic/01-变量.py')) 
# 1684240672.396499
```

- 查看路径最后修改时间

```python
print(os.path.getmtime('/code/python/basic/01-变量.py')) 
# 1680791992.77032
```

- 查看路径创建时间

```python
print(os.path.getctime('/code/python/basic/01-变量.py')) 
# 1684240671.216911
```

- 查看路径大小

```python
print(os.path.getsize('/code/python/basic/01-变量.py')) 
# 1517
```

### sys 模块

- 获取环境变量路径

```python
print(sys.path)
```

- 获取输入命令的参数

```python
print(sys.argv)
```