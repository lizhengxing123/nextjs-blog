---
title: 'configparser 模块'
excerpt: 'configparser 模块'
coverImage: '/assets/blog/python/logo.png'
date: '2023-06-13 16:01:02'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/python/logo.png'
type: 'Python'
---

## configparser 模块

```python
import configparser
```

### 配置文件

```ini
# data/test.ini
# 这是注释
; 这也是注释

[default]
delay = 45
salary = 3.9
compression = true
compression_level = true
language_code = en-us
time_zone = UTC


[db]
db_type = mysql
database_name = catalogue_data
user = root
password = 123456
host = 127.0.0.1
port = 3306
charset = utf8
```

### 配置操作

- 读取文件

```python
config = configparser.ConfigParser()
config.read('data/test.ini', encoding='utf8')
```

- `sections`

```python
print(config.sections())  
# ['default', 'db']
```

- `options`

```python
print(config.sections('db'))  
# ['db_type', 'database_name', 'user', 'password', 'host', 'port', 'charset']
```

- `items`

```python
print(config.items('db'))  
# [('db_type', 'mysql'), ('database_name', 'catalogue_data'), ('user', 'root'), 
# ('password', '123456'), ('host', '127.0.0.1'), ('port', '3306'), ('charset', 'utf8')]
```

- `get`

```python
print(config.get('db', 'database_name'))  
# catalogue_data
```

- `getint`

```python
delay = config.get('default', 'delay')
print(delay, type(delay))  # 45 <class 'str'>

delay_int = config.getint('default', 'delay')
print(delay_int, type(delay_int))  # 45 <class 'int'>
```

- `getfloat`

```python
salary = config.get('default', 'salary')
print(salary, type(salary))  # 3.9 <class 'str'>

salary_float = config.getfloat('default', 'salary')
print(salary_float, type(salary_float))  # 3.9 <class 'float'>
```

- `getboolean`

```python
compression = config.get('default', 'compression')
print(compression, type(compression))  # true <class 'str'>

compression_bool = config.getboolean('default', 'compression')
print(compression_bool, type(compression_bool))  # True <class 'bool'>
```