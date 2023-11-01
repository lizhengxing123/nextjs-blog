---
title: 'Django入门'
excerpt: 'Django入门'
coverImage: '/assets/blog/django/django.png'
date: '2023-10-18 15:27:57'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/django/django.png'
type: 'Django'
---

## Django入门

### 创建虚拟环境

```shell
# 安装 virtualenv 和 virtualenvwrapper(windows是virtualenvwrapper-win)
pip3 install virtualenv virtualenvwrapper

# 创建新的虚拟环境
# mkvirtualenv <名称>
mkvirtualenv django4env

# 查看虚拟环境
workon

# 删除虚拟环境
rmvirtualenv <名称>

# 进入虚拟环境
# workon <名称>
workon django4env
```

### 安装 Django

```shell
# 指定国内镜像
pip3 install django==4.2.6 -i https://pypi.douban.com/simple

# 查看安装好的 Django
pip3 show django

# 查看依赖包
pip3 freeze

# 查看所有的包
pip3 list
```

### 创建 Django 项目

- 方式一：使用命令创建

```shell
django-admin startproject <项目名>
```

- 方式二：使用 `pycharm` 创建

- 项目的目录结构

```python
"""
- manage.py
    是 Django 用来管理本项目的命令行工具，之后进行站点运行，数据库自动生成等
    都是通过该文件完成

- 项目名/__init__.py
    告诉 python 该目录是一个项目包，暂无内容，后期一些工具的初始化可能会用到

- 项目名/settings.py
    Django 项目的配置文件，默认定义了本项目引用的组件、项目名、数据库、静态
    资源等

- 项目名/urls.py
    维护项目的 URL 路由映射，即定义当客户端访问时由哪个模块进行响应

- 项目名/wsgi.py
    全称为 Python Web Server Gateway Interface，即 Python 服务器网关
    接口，是 Python 应用与 Web 服务器之间的接口，用于 Django 项目在服务器
    上的部署和上线，一般不需要修改

- 项目名/asgi.py
    定义 ASGI 的接口信息，是3.0以后新增的，它实现了异步处理，用于启动异步通
    信服务，比如：实现在线聊天等异步通信功能
"""
```

### 项目启动

```shell
# 默认启动 http://127.0.0.1:8000/
python3 manage.py runserver

# 更改端口 http://127.0.0.1:8001/
python3 manage.py runserver 8001

# 更改ip端口
# 访问方式 http://127.0.0.1:8001/ http://localhost:8001/
python3 manage.py runserver 0:0:0:0 8001
```

### 数据迁移

将模型映射到数据库的过程

```shell
# 生成迁移文件
python3 manage.py makemigrations

# 执行迁移
python3 manage.py migrate
```

### 创建应用

```shell
# 创建名称为App的应用
python3 manage.py startapp App
```
> 创建了应用之后，需要加入到 `settings.py INSTALLED_APPS` 里面

应用目录

```python
"""
- __init__.py
    使App成为一个包

- admin.py
    管理站点模型的声明文件

- apps.py
    应用信息定义文件，其中AppConfig类用于定义应用名等数据

- models.py
    模型层数据类文件

- view.py
    定义URL相应函数，视图函数

- migration包
    用于生成迁移文件

- tests.py
    测试代码文件
"""
```

### 基本视图

- 视图函数

```python
# user/views.py
# request 是默认形参 
def index(request):
    # 1、返回响应
    # return HttpResponse('Hello Django!')

    # 2、渲染模版
    return render(request, 'index.html')
```

- 路由

```python
# 根路由 index 是视图函数
path('index/', index) #  包名项目名/urls.py

# 子路由 
path('user/', include('user.urls')) # 包名项目名/urls.py
path('index/', index, name='index') # user/urls.py
```

### 模型

```python
# user/models.py
# 模型Model 对应 表结构
# 类属性 对应 表字段
# 对象 对应 表的一行数据

# 模型类必须继承 models.Model
class UserModel(models.Model):
    name = models.CharField(max_length=30)  # name varchar(30)
    age = models.IntegerField(default=18)  # age int default 18
    gender = models.CharField(max_length=20)  # gender varchar(20)
    is_deleted = models.BooleanField(default=False)  # is_deleted bool default false


# models表结构一旦改变，就需要重新进行数据迁移
# 生成迁移文件 python3 manage.py makemigrations
# 执行迁移 python3 manage.py migrate
```

视图函数

```python
# user/views.py
def get_users(request):
    # 获取所有用户
    users = UserModel.objects.all()
    return render(request, 'users.html', {'users': users})
```

模板

```html
<!-- user/templates/users.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Users</title>
</head>
<body>
    <h2>所有用户</h2>
    <hr />
    <ul>
        {% for user in users %}
            <li>{{ user.name }}-{{ user.age }}-{{ user.gender }}</li>
        {% endfor %}
    </ul>
</body>
</html>
```

路由

```python
# user/urls.py
path('users/', get_users, name='users'),
```

访问

```shell
http://127.0.0.1:8000/user/users/
```

### Admin 后台管理

在 `admin.py` 中将 `model` 加入后台管理

```python
from user.models import UserModel

# 管理模型
admin.site.register(UserModel)
```

创建超级管理员账号和密码

```shell
python3 manage.py createsuperuser
```

访问地址

```shell
# 包名项目名/urls 必须存在 path('admin/', admin.site.urls)
http://127.0.0.1:8000/admin/
```