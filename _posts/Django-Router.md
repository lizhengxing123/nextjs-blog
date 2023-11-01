---
title: 'Django路由'
excerpt: 'Django路由'
coverImage: '/assets/blog/django/django.png'
date: '2023-10-23 16:17:55'
author:
  name: 李正星
  picture: '/assets/blog/authors/zx.jpeg'
ogImage:
  url: '/assets/blog/django/django.png'
type: 'Django'
---

## Django路由

### 路由定义

```python
# 1、根路由
path('index/', index)

# 2、子路由
path('url/', include('App.urls'))

# 3、子路由，带命名空间
path('url/', include(('App.urls', 'App'), namespace='App'))
```

### 路由跳转

```python
# 1、直接写 url 路由
<a href="/user/userlist/">方式1：url路由</a>

# 2、反向解析
#   userlist 是 path 里面定义的 name 名称
<a href="{% url 'userlist' %}">方式2：反向解析</a>

# 3、命名空间反向解析
#   App 是命名空间中的 namespace 值
#   userlist 是 path 里面定义的 name 名称
<a href="{% url 'App:userlist' %}">方式3：命名空间反向解析</a>
```

### 路由传参

```python
# 定义路由 
# <int:uid> 整数
# <str:uid> 字符串
path('userdetail/<int:uid>', user_detail, name='userdetail')

# 视图函数拿到参数
#   uid 必须要和定义的路由里面的参数相同
def user_detail(request, uid):
    print('uid: ', uid)
    user = UserModel.objects.get(pk=uid)
    return render(request, 'user_detail.html', {'user': user})

# 路由跳转
# 反向解析+传参
<a href="{% url 'App:userdetail' user.id %}">{{ user.name }}</a>
```

### 重定向

```python
# 定义路由
path('myredirect/', my_redirect)


# 视图函数
def my_redirect(request):
    # 跳转外部地址
    # return redirect('https://www.baidu.com')

    # 跳转内部视图
    # return redirect('/user/userlist/')

    # 反向解析+传参
    # 如果有命名空间必须要加上 namespace 名称
    # return redirect(reverse('App:userdetail', args=(1,)))
    return redirect(reverse('App:userdetail', kwargs={'uid': 2}))
```
