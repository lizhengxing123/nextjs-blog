---
title: 'Django模型'
excerpt: 'Django模型'
coverImage: '/assets/blog/django/django.png'
date: '2023-10-25 09:28:51'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/django/django.png'
type: 'Django'
---

## Django模型

### 基础类型

```py
from django.db import models

class UserModel(models.Model):
    # 使用自己创建的主键，就不会自动生成主键id了
    uid = models.AutoField(auto_created=True, primary_key=True)

    # 字符串类型，最大长度30，唯一，并创建索引
    name = models.CharField(max_length=30, unique=True, db_index=True)

    # 整数类型，设置默认值 18
    age = models.IntegerField(default=18)

    # 长文本类型，可以为空，blank=True 表示在后台管理系统中可以为空
    introduce = models.TextField(null=True, blank=True)

    # 浮点数类型
    salary = models.FloatField(default=2345.78)

    # 小数类型，总长度为10，小数点后面有4位
    money = models.DecimalField(max_digits=10, decimal_places=4, default=0)

    # 布尔类型
    is_deleted = models.BooleanField(default=False)

    # 日期类型, auto_now_add 第一次添加的时间，以后不变
    create_time = models.DateTimeField(auto_now_add=True)

    # auto_now 每次修改后自动修改当前日期
    update_time = models.DateTimeField(auto_now=True)

    # 文件
    icon = models.FileField(null=True, blank=True, upload_to='static/uploads')

    # 图片 需要安装 pillow
    avatar = models.ImageField(null=True, blank=True, upload_to='static/uploads')

    # 性别
    # name 指定在数据库中要显示的字段名称
    # verbose_name 指定在后台管理系统中要显示的名字
    choices = ((1, '男'), (2, '女'), (3, '其他'))
    gender = models.IntegerField(choices=choices, default=1, name='sex', verbose_name='性别')

```

### 基础操作

#### 增

```py
def add_person(request):
    try:
        # 方式1
        # p = PersonModel()
        # p.name = '张三'
        # p.age = 33
        # p.save()

        # 方式2
        # p = PersonModel(name='李四', age=44)
        # p.save()

        # 方式3
        # PersonModel.objects.create(name='王五', age=55)

        # 方式4 有返回值
        # res: (<PersonModel: PersonModel object (5)>, False)
        # 如果是第一次创建，就是 True
        # 如果已经创建过，就是 False，但不会报错
        # res = PersonModel.objects.get_or_create(name='赵六', age=66)
        # print(res)

        # 批量添加
        for i in range(0, 10):
            PersonModel.objects.create(name=f'李{i}{i}', age=i)

    except Exception:
        return HttpResponse('增加失败')

    return HttpResponse('增加成功')
```

#### 删

```py
def delete_person(request):
    try:
        # 删除一条数据
        # p = PersonModel.objects.first()
        # p.delete()

        # 删除多条数据
        # 删除年龄 < 5 的数据
        PersonModel.objects.filter(age__lt=5).delete()
    except Exception:
        return HttpResponse('删除失败')

    return HttpResponse('删除成功')
```

#### 改

```py
def update_person(request):
    try:
        # 修改一条数据
        p = PersonModel.objects.first()
        p.age = 666
        # p.save()
        # save 方法默认会更新所有字段
        # 如果只想更新某个字段，减少数据库操作，提升效率，可以使用一下方法
        p.save(update_fields=['age'])

        # 修改多条数据
        # PersonModel.objects.all().update(age=400)
    except Exception:
        return HttpResponse('修改失败')

    return HttpResponse('修改成功')
```

#### 查

- get

```py
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

def get_person(request):
    # get(): 获取单条数据
    try:
        # p = PersonModel.objects.get(id=1)
        # 根据主键获取
        p = PersonModel.objects.get(pk=13)
        # p = PersonModel.objects.get(age=400)
    except ObjectDoesNotExist:
        return HttpResponse('数据不存在！')
    except MultipleObjectsReturned:
        return HttpResponse('有多条数据！')

    return HttpResponse(p)
```

- all

```py
def get_person(request):
    # all(): 获取所有数据
    persons = PersonModel.objects.all()
    # persons 是查询集，可以遍历和过滤
    print(type(persons))  # <class 'django.db.models.query.QuerySet'>
    return HttpResponse(persons)
```

- first

```py
def get_person(request):
    # first(): 获取第一条数据 查询不到就是 None
    p = PersonModel.objects.first()
    return HttpResponse(p)
```

- last

```py
def get_person(request):
    # last(): 获取最后一条数据 查询不到就是 None
    p = PersonModel.objects.last()
    return HttpResponse(p)
```

- exists

```py
def get_person(request):
    persons = PersonModel.objects.filter(age=5)
    # 查询集是否存在数据，返回布尔值
    print(persons.exists())

    return HttpResponse(persons)
```

- count

```py
def get_person(request):
    persons = PersonModel.objects.filter(age=5)
    # 查询集的个数
    print(persons.count())

    return HttpResponse(persons)
```

- values

```py
def get_person(request):
    persons = PersonModel.objects.filter(age=5)
    # 可以使用 list 直接将查询集转换为列表
    print(persons, list(persons))

    # values 转换为字典
    print(persons.values())
    # 获取指定的字段
    print(persons.values('name', 'age'))

    return HttpResponse(persons)
```

- values_list

```py
def get_person(request):
    persons = PersonModel.objects.filter(age=5)
    # values_list 转换为元组，只有值
    print(persons.values_list())
    # 获取指定的字段
    print(persons.values_list('name', 'age'))

    return HttpResponse(persons)
```

- filter

```py
def get_person(request):
    # filter(): 过滤
    # 返回的是查询集 可以继续链式调用

    # 没有条件，默认查询全部
    # persons = PersonModel.objects.filter()

    # 大于等于 age >= 5
    # persons = PersonModel.objects.filter(age__gte=5)

    # 大于 age > 5
    # persons = PersonModel.objects.filter(age__gt=5)

    # 小于等于 age <= 5
    # persons = PersonModel.objects.filter(age__lte=5)

    # 小于 age < 5
    # persons = PersonModel.objects.filter(age__lt=5)

    # 等于 age = 5
    # persons = PersonModel.objects.filter(age=5)

    # in
    # persons = PersonModel.objects.filter(age__in=[1, 2, 3])

    # exclude 取反 not in
    # persons = PersonModel.objects.exclude(age__in=[1, 2, 3])

    # contains 相当于 like， age 包含 0 的，模糊查找
    # persons = PersonModel.objects.filter(age__contains='0')

    # regex 正则，以123开头的
    # persons = PersonModel.objects.filter(age__regex='^[123]')

    # 加 i 的都是忽略大小写
    # persons = PersonModel.objects.filter(name__iregex='^l')
    # persons = PersonModel.objects.filter(name__regex='^l')

    # range 取范围，类似于between and ，两边都包含
    # persons = PersonModel.objects.filter(age__range=[3, 5])

    # startswith 以 ... 开头，忽略大小写
    # persons = PersonModel.objects.filter(name__startswith='l')

    # endswith 以 ... 结尾，忽略大小写
    persons = PersonModel.objects.filter(name__endswith='l')

    return HttpResponse(persons)
```

- 聚合函数

```py
def get_person(request):
    # 聚合函数
    # 最大值  {'age__max': 10}
    # res = PersonModel.objects.aggregate(Max('age'))

    # 最小值  {'age__min': 0}
    # res = PersonModel.objects.aggregate(Min('age'))

    # 求和  {'age__sum': 55}
    # res = PersonModel.objects.aggregate(Sum('age'))

    # 平均值  {'age__avg': 5.0}
    # res = PersonModel.objects.aggregate(Avg('age'))

    # 计数  {'id__count': 11}
    res = PersonModel.objects.aggregate(Count('id'))
    print(res)

    return HttpResponse(res)
```

- 排序

```py
def get_person(request):
    # 排序
    # 默认升序
    # persons = PersonModel.objects.all().order_by('age')

    # 降序加 - 号
    # persons = PersonModel.objects.all().order_by('-age')

    # 使用多个字段排序
    persons = PersonModel.objects.all().order_by('-age', '-id')

    return HttpResponse(persons)
```

- 分页器

```py
from django.core.paginator import Paginator

# 分页
def paginate(request, current_page, page_size):
    # 页码 current_page
    # 每页数量 page_size

    # 手动分页
    # persons = PersonModel.objects.all()[(current_page - 1) * page_size: current_page * page_size]
    # return HttpResponse(persons)

    # 分页器
    persons = PersonModel.objects.all()
    paginator = Paginator(persons, page_size)

    # 获取第几页
    data = paginator.page(current_page)
    # 页码范围 range(1, 7)
    print(paginator.page_range)
    
    return HttpResponse(data)
```

### 多表操作

#### mysql 配置

```py
# 1、安装 pymysql：pip3 install pymysql
# 2、修改 settings.py 同目录下的 __init__.py 文件，添加以下代码
# import pymysql
# pymysql.install_as_MySQLdb()

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'db5',  # 数据库名称
        'USER': 'root',  # 用户名
        'PASSWORD': 'lzx622427',  # 密码
        'HOST': '127.0.0.1',  # 主机
        'PORT': '3306'  # 端口
    }
}
```

#### 一对多

- 基础模型

```py
from django.db import models

# 一对多
# 一个用户类型对应多个用户
class UserType(models.Model):
    name = models.CharField(max_length=30)


class Users(models.Model):
    name = models.CharField(max_length=16)
    age = models.IntegerField()

    # 定义外键，关联起来
    # 会自动添加 id 后缀
    # on_delete 参数，每次修改都需要重新迁移
    # 1、models.CASCADE 级联删除，当用户类型删除之后，它关联的用户也会删除
    # user_type = models.ForeignKey(UserType, on_delete=models.CASCADE)

    # 2、models.PROTECT 保护模式，阻止级联删除
    # 如果有关联用户，删除会报 ProtectedError 错误，没有关联用户能正常删除
    # user_type = models.ForeignKey(UserType, on_delete=models.PROTECT)

    # 3、models.SET_NULL 置空模式，null=True 必须存在
    # 当用户类型删除后，将关联用户的 user_type_id 的值置为 null，不删除关联用户
    # user_type = models.ForeignKey(UserType, on_delete=models.SET_NULL, null=True)

    # 4、models.SET_DEFAULT 设为默认值，default 必须设置，类似 SET_NULL
    user_type = models.ForeignKey(UserType, on_delete=models.SET_DEFAULT, default=1)

    # 5、models.SET() 删除的时候重新动态指向一个实体访问对应元素，可传函数
    # 6、models.DO_NOTHING 什么也不做
```

- 增加数据

```py
# 添加用户类型
def add_user_type(request):
    user_types = ['青铜', '白银', '黄金', '白金', '钻石']

    for user_type in user_types:
        UserType.objects.create(name=user_type)

    return HttpResponse('添加成功')


# 添加用户
def add_user(request):
    for i in range(10, 30):
        # 使用 user_type_id 指定具体的主键id
        # Users.objects.create(name=f'李{i}', age=i, user_type_id=i % 5 + 1)

        # 使用 user_type 指定具体的对象
        Users.objects.create(name=f'li{i}', age=i+100, user_type=UserType.objects.get(pk=i % 5 + 1))

    return HttpResponse('添加成功')
```

- 删除数据

```py
# 删除用户类型
def del_user_type(request):
    # 关联的用户也会同步删除
    UserType.objects.filter(id=3).delete()

    return HttpResponse('删除成功')


# 删除用户
def del_user(request):
    Users.objects.filter(id=13).delete()

    return HttpResponse('删除成功')
```

- 修改数据

```py
# 修改用户类型
def update_user_type(request):
    UserType.objects.filter(id=1).update(name='王者')

    return HttpResponse('修改成功')


# 修改用户
def update_user(request):
    Users.objects.filter(id=15).update(age=67, name='llll')

    return HttpResponse('修改成功')
```

- 查询数据

```py
# 查询用户
def get_user(request):
    # 反向查询：根据用户类型去查询用户
    # utype = UserType.objects.get(id=5)
    # print(utype.name, utype.id)

    # user_set 自动生成的属性，使用它可以查询到所有关联的user
    # print(utype.users_set)  # App.User.None
    # print(utype.users_set.all())  # 获取所有的查询集

    # filter
    # users = Users.objects.filter(user_type_id=1)
    # users = Users.objects.filter(user_type__name='王者')
    # print(users)

    # related_name
    # 需要在 models 中增加
    # user_type = models.ForeignKey(UserType, on_delete=models.PROTECT, related_name='related_users')
    utype = UserType.objects.get(id=5)
    print(utype.related_users.all())

    return HttpResponse('查询成功')


# 查询用户类型
def get_user_type(request):
    # 正向查询：根据用户去查询用户类型
    user = Users.objects.get(id=19)

    # 可以直接获取关联的 user_type
    print(user.name, user.age, user.user_type, user.user_type_id)
    print(user.user_type.name, user.user_type.id)

    return HttpResponse('查询成功')
```

#### 多对多

- 基础模型

```py
# 电影 -- 一部电影可以被多个用户收藏
class Movie(models.Model):
    name = models.CharField(max_length=30)
    duration = models.IntegerField(default=90)


# 用户 -- 一个用户可以收藏多部电影
class User(models.Model):
    name = models.CharField(max_length=16)
    age = models.IntegerField(default=18)

    # 多对多关系
    movies = models.ManyToManyField(Movie)
```

- 增加数据

```py
def add(request):
    # 增加电影数据
    # for i in range(1, 7):
    #     Movie.objects.create(name=f'指环王{i}', duration=100 + i)

    # 增加用户数据
    # for i in range(1, 11):
    #     User.objects.create(name=f'李{i}', age=10 + i)

    # 增加中间表数据
    # 让 李1 收藏 指环王1
    user = User.objects.get(name='李1')
    user1 = User.objects.get(name='李2')
    movie = Movie.objects.get(name='指环王1')

    # 添加收藏
    user.movies.add(movie)  # 用户收藏电影
    movie.user_set.add(user1)  # user1收藏movie

    return HttpResponse('添加成功')
```

- 删除数据

```py
# 删除数据
def delete(request):
    # 删除用户
    # User.objects.get(id=8).delete()

    # 删除电影
    # Movie.objects.get(id=6).delete()

    # 删除中间表 -- 相关联用户和电影会同步删除
    user = User.objects.get(name='李1')
    user.movies.filter(name='指环王4').delete()  # 从用户删除

    movie = Movie.objects.get(name='指环王1')
    movie.user_set.filter(name='李2').delete()  # 从电影删除

    return HttpResponse('删除成功')
```

- 查询数据

```py
# 查询数据
def get_user_movie(request):
    # 获取用户收藏的电影
    # user = User.objects.get(id=1)
    # print(user.movies)  # Many2Many.Movie.None
    # print(user.movies.all())  # 收藏电影的查询集

    # 获取电影的收藏用户
    movie = Movie.objects.get(id=1)
    print(movie.user_set)  # Many2Many.User.None
    print(movie.user_set.all())  # 电影收藏用户的查询集

    return HttpResponse('查询成功')
```

#### 一对一

- 基础模型

```py
# 身份证
class IDCard(models.Model):
    idcard_num = models.CharField(max_length=18, unique=True)
    address = models.CharField(max_length=200)


# 人员
class Person(models.Model):
    name = models.CharField(max_length=16)
    age = models.IntegerField(default=18)
    gender = models.BooleanField(default=True)

    # 一对一
    idcard = models.OneToOneField(IDCard, on_delete=models.PROTECT)
```

- 查询数据

```py
# 查询数据
def get_data(request):
    # 查询用户的身份证
    person = Person.objects.get(id=1)
    print(person.idcard)  # 是一个对象 IDCard object (1)
    print(person.idcard.idcard_num, person.idcard.address)

    # 查询身份证对应的用户
    idcard = IDCard.objects.get(pk=2)
    print(idcard.person)  # 是一个对象 Person object (2)
    print(idcard.person.name, idcard.person.gender)

    return HttpResponse('查询成功')
```

> 增删改和一对多关系类似