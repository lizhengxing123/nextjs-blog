---
title: '文件和压缩包'
excerpt: '文件和压缩包'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-13 14:53:21'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

## 文件和压缩包

### shutil 模块

```python
import shutil
```

- 拷贝文件状态信息，只拷贝状态信息

```python
shutil.copystat('data/a.txt', 'data/b.txt')
```

- 拷贝文件权限信息，只拷贝权限信息

```python
shutil.copymode('data/a.txt', 'data/b.txt')
```

- 拷贝文件对象

```python
shutil.copyfileobj(open('data/a.txt', mode='r'), open('data/z.txt', mode='w'))
```

- 拷贝文件

```python
shutil.copyfile('data/a.txt', 'data/z.txt')
```

- 拷贝文件和权限

```python
shutil.copy('data/a.txt', 'data/z.txt')
```

- 拷贝文件和状态信息

```python
shutil.copy2('data/a.txt', 'data/z.txt')
```

- 拷贝文件夹

使用 `ignore` 排除不需要拷贝的文件

```python
shutil.copytree('data', 'data2', ignore=shutil.ignore_patterns('*.py', 'user*'))
```

- 移动文件/文件夹

如果移动的路径相同，只是名字不同，相当于重命名

```python
shutil.move('data', 'data2')
```

- 创建压缩包

```python
# 第一个参数：压缩包创建完之后存放的路径
# 第二个参数：压缩的类型
# 第三个参数：需要压缩的文件路径
shutil.make_archive('path', 'zip', root_dir='data')
```

### zipfile 模块

```python
import zipfile
```

- 压缩

```python
zf = zipfile.ZipFile('path.zip', 'w')  # 创建一个压缩包
zf.write('data/a.txt')  # 需要加到压缩包里的文件
zf.write('data/b.txt')  # 需要加到压缩包里的文件
zf.close()  # 关闭压缩包
```

- 解压

```python
zf = zipfile.ZipFile('path.zip', 'r')  # 打开一个压缩包
zf.extractall(path='test')  # 解压包里的所有文件，并指定解压路径
zf.close()  # 关闭压缩包
```

### tarfile 模块

```python
import tarfile
```

- 压缩

```python
tar = tarfile.open('path.tar', 'w')  # 创建一个压缩包
tar.add('data/a.txt', arcname='a.txt')  # 将文件添加到压缩包并命名
tar.add('data/b.txt', arcname='b.txt')  # 将文件添加到压缩包并命名
tar.close()  # 关闭压缩包
```

- 解压

```python
tar = tarfile.open('path.tar', 'r')  # 打开一个压缩包
tar.extractall(path='test')  # 解压包里的所有文件，并指定解压路径
tar.close()  # 关闭压缩包
```